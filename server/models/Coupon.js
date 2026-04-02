import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true
    },
    value: {
      type: Number,
      required: true,
      min: 0
    },
    minOrderAmount: {
      type: Number,
      default: 0
    },
    maxDiscount: Number,
    isActive: {
      type: Boolean,
      default: true
    },
    expiresAt: Date
  },
  {
    timestamps: true
  }
);

export const Coupon = mongoose.model("Coupon", couponSchema);
