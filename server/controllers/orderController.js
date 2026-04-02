import asyncHandler from "express-async-handler";
import { Order } from "../models/Order.js";
import { Product } from "../models/Product.js";
import { User } from "../models/User.js";
import { calculatePricing } from "../services/pricingService.js";
import {
  getRazorpayClient,
  verifyRazorpaySignature
} from "../services/paymentService.js";

async function getUserCart(userId) {
  return User.findById(userId).populate(
    "cart.product",
    "name image price countInStock"
  );
}

async function ensurePurchasableItems(cart) {
  if (!cart.length) {
    const error = new Error("Cart is empty");
    error.statusCode = 400;
    throw error;
  }

  for (const item of cart) {
    if (!item.product || item.product.countInStock < item.quantity) {
      const error = new Error(
        `Insufficient stock for ${item.product?.name || "an item"}`
      );
      error.statusCode = 400;
      throw error;
    }
  }
}

async function decrementStock(orderItems) {
  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (!product || product.countInStock < item.quantity) {
      const error = new Error(`Insufficient stock for ${item.name}`);
      error.statusCode = 400;
      throw error;
    }
    product.countInStock -= item.quantity;
    await product.save();
  }
}

function orderAccessAllowed(order, user) {
  return user.isAdmin || order.user._id.toString() === user._id.toString();
}

export const previewOrder = asyncHandler(async (req, res) => {
  const { couponCode, shippingMethod } = req.validated.body;
  const user = await getUserCart(req.user._id);
  await ensurePurchasableItems(user.cart);

  const pricing = await calculatePricing({
    items: user.cart,
    couponCode,
    shippingMethod
  });

  res.json(pricing);
});

export const createCodOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, shippingMethod, couponCode } = req.validated.body;
  const user = await getUserCart(req.user._id);
  await ensurePurchasableItems(user.cart);

  const pricing = await calculatePricing({
    items: user.cart,
    couponCode,
    shippingMethod
  });

  const order = await Order.create({
    user: req.user._id,
    orderItems: pricing.orderItems,
    shippingAddress,
    paymentMethod: "cod",
    shippingMethod,
    shippingLabel: pricing.shippingLabel,
    coupon: pricing.coupon ? { ...pricing.coupon, appliedAt: new Date() } : undefined,
    itemsPrice: pricing.itemsPrice,
    shippingPrice: pricing.shippingPrice,
    discountPrice: pricing.discountPrice,
    taxPrice: pricing.taxPrice,
    totalPrice: pricing.totalPrice,
    status: "Pending"
  });

  await decrementStock(pricing.orderItems);
  user.cart = [];
  user.shippingAddress = shippingAddress;
  await user.save();

  res.status(201).json(order);
});

export const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, shippingMethod, couponCode } = req.validated.body;
  const user = await getUserCart(req.user._id);
  await ensurePurchasableItems(user.cart);

  const pricing = await calculatePricing({
    items: user.cart,
    couponCode,
    shippingMethod
  });

  const razorpayClient = getRazorpayClient();
  const razorpayOrder = await razorpayClient.orders.create({
    amount: Math.round(pricing.totalPrice * 100),
    currency: process.env.RAZORPAY_CURRENCY || "INR",
    receipt: `receipt_${Date.now()}`
  });

  const order = await Order.create({
    user: req.user._id,
    orderItems: pricing.orderItems,
    shippingAddress,
    paymentMethod: "razorpay",
    shippingMethod,
    shippingLabel: pricing.shippingLabel,
    coupon: pricing.coupon ? { ...pricing.coupon, appliedAt: new Date() } : undefined,
    itemsPrice: pricing.itemsPrice,
    shippingPrice: pricing.shippingPrice,
    discountPrice: pricing.discountPrice,
    taxPrice: pricing.taxPrice,
    totalPrice: pricing.totalPrice,
    status: "Awaiting Payment",
    paymentResult: {
      razorpayOrderId: razorpayOrder.id
    }
  });

  user.shippingAddress = shippingAddress;
  await user.save();

  res.status(201).json({
    orderId: order._id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    razorpayOrderId: razorpayOrder.id,
    razorpayKeyId: process.env.RAZORPAY_KEY_ID,
    totalPrice: pricing.totalPrice
  });
});

export const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } =
    req.validated.body;

  const order = await Order.findById(orderId).populate("user");
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  if (!orderAccessAllowed(order, req.user)) {
    res.status(403);
    throw new Error("Not authorized");
  }
  if (order.isPaid) {
    res.json(order);
    return;
  }
  if (order.paymentResult?.razorpayOrderId !== razorpayOrderId) {
    res.status(400);
    throw new Error("Razorpay order mismatch");
  }

  const isValid = verifyRazorpaySignature({
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature
  });

  if (!isValid) {
    res.status(400);
    throw new Error("Payment signature verification failed");
  }

  await decrementStock(order.orderItems);

  order.isPaid = true;
  order.paidAt = new Date();
  order.status = "Processing";
  order.lastStatusUpdatedAt = new Date();
  order.paymentResult = {
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature
  };
  await order.save();

  const user = await User.findById(req.user._id);
  user.cart = [];
  await user.save();

  res.json(order);
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email")
    .populate("orderItems.product", "name slug");

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (!orderAccessAllowed(order, req.user)) {
    res.status(403);
    throw new Error("Not authorized to view this order");
  }

  res.json(order);
});

export const getOrders = asyncHandler(async (_req, res) => {
  const orders = await Order.find({})
    .populate("user", "name email")
    .sort({ createdAt: -1 });
  res.json(orders);
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, isPaid, isDelivered } = req.validated.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  order.status = status;
  order.isPaid = isPaid ?? order.isPaid;
  order.isDelivered = isDelivered ?? order.isDelivered;
  order.lastStatusUpdatedAt = new Date();

  if (order.isPaid && !order.paidAt) {
    order.paidAt = new Date();
  }

  if (order.isDelivered && !order.deliveredAt) {
    order.deliveredAt = new Date();
  }

  const updatedOrder = await order.save();
  res.json(updatedOrder);
});
