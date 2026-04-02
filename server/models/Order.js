import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 }
  },
  { _id: false }
);

const shippingSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String, default: "" },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    orderItems: [orderItemSchema],
    shippingAddress: shippingSchema,
    paymentMethod: {
      type: String,
      required: true,
      enum: ["cod", "razorpay"]
    },
    shippingMethod: {
      type: String,
      required: true,
      enum: ["standard", "express"]
    },
    shippingLabel: {
      type: String,
      required: true
    },
    coupon: {
      code: String,
      description: String,
      type: String,
      value: Number,
      discountPrice: Number,
      appliedAt: Date
    },
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    discountPrice: { type: Number, required: true, default: 0 },
    taxPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: [
        "Awaiting Payment",
        "Pending",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled"
      ],
      default: "Pending"
    },
    isPaid: { type: Boolean, default: false },
    paidAt: Date,
    isDelivered: { type: Boolean, default: false },
    deliveredAt: Date,
    lastStatusUpdatedAt: {
      type: Date,
      default: Date.now
    },
    paymentResult: {
      razorpayOrderId: String,
      razorpayPaymentId: String,
      razorpaySignature: String
    }
  },
  {
    timestamps: true
  }
);

export const Order = mongoose.model("Order", orderSchema);
