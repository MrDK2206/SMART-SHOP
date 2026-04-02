import asyncHandler from "express-async-handler";
import { User } from "../models/User.js";
import { Product } from "../models/Product.js";

async function populateCart(userId) {
  return User.findById(userId)
    .select("cart")
    .populate("cart.product", "name image price countInStock category");
}

export const getCart = asyncHandler(async (req, res) => {
  const user = await populateCart(req.user._id);
  res.json(user.cart);
});

export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.validated.body;
  const amount = Number(quantity || 1);

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  if (product.countInStock <= 0) {
    res.status(400);
    throw new Error("Product is out of stock");
  }

  const user = await User.findById(req.user._id);
  const existing = user.cart.find(
    (item) => item.product.toString() === productId
  );

  if (existing) {
    existing.quantity = Math.min(existing.quantity + amount, product.countInStock);
  } else {
    user.cart.push({
      product: productId,
      quantity: Math.min(amount, product.countInStock)
    });
  }

  await user.save();
  const populatedUser = await populateCart(req.user._id);
  res.json(populatedUser.cart);
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.validated.body;
  const user = await User.findById(req.user._id);
  const item = user.cart.find(
    (cartItem) => cartItem.product.toString() === req.params.productId
  );

  if (!item) {
    res.status(404);
    throw new Error("Cart item not found");
  }

  const product = await Product.findById(req.params.productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  item.quantity = Math.min(Number(quantity), product.countInStock);

  if (item.quantity <= 0) {
    user.cart = user.cart.filter(
      (cartItem) => cartItem.product.toString() !== req.params.productId
    );
  }

  await user.save();
  const populatedUser = await populateCart(req.user._id);
  res.json(populatedUser.cart);
});

export const removeCartItem = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.cart = user.cart.filter(
    (cartItem) => cartItem.product.toString() !== req.params.productId
  );
  await user.save();

  const populatedUser = await populateCart(req.user._id);
  res.json(populatedUser.cart);
});
