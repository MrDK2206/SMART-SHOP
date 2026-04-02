import { z } from "zod";

const shippingAddressSchema = z.object({
  fullName: z.string().trim().min(2).max(80),
  phone: z.string().trim().min(6).max(20),
  addressLine1: z.string().trim().min(5).max(120),
  addressLine2: z.string().trim().max(120).optional().or(z.literal("")),
  city: z.string().trim().min(2).max(60),
  postalCode: z.string().trim().min(3).max(12),
  country: z.string().trim().min(2).max(60)
});

export const previewOrderSchema = z.object({
  body: z.object({
    couponCode: z.string().trim().max(30).optional().or(z.literal("")),
    shippingMethod: z.enum(["standard", "express"]).default("standard")
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

export const createCodOrderSchema = z.object({
  body: z.object({
    shippingAddress: shippingAddressSchema,
    shippingMethod: z.enum(["standard", "express"]),
    couponCode: z.string().trim().max(30).optional().or(z.literal("")),
    paymentMethod: z.literal("cod")
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

export const createRazorpayOrderSchema = z.object({
  body: z.object({
    shippingAddress: shippingAddressSchema,
    shippingMethod: z.enum(["standard", "express"]),
    couponCode: z.string().trim().max(30).optional().or(z.literal(""))
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

export const verifyPaymentSchema = z.object({
  body: z.object({
    orderId: z.string().min(12),
    razorpayOrderId: z.string().min(1),
    razorpayPaymentId: z.string().min(1),
    razorpaySignature: z.string().min(1)
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

export const updateOrderStatusSchema = z.object({
  body: z.object({
    status: z.enum([
      "Awaiting Payment",
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled"
    ]),
    isPaid: z.boolean().optional(),
    isDelivered: z.boolean().optional()
  }),
  params: z.object({
    id: z.string().min(12)
  }),
  query: z.object({}).optional()
});
