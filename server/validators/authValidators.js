import { z } from "zod";

const optionalAddressField = (max) =>
  z.string().trim().max(max).optional().or(z.literal(""));

export const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(80),
    email: z.string().email(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100),
    mobileNumber: z.string().trim().min(10).max(15),
    billingAddress: z.string().trim().min(5).max(200),
    pincode: z.string().trim().min(4).max(10),
    panNumber: z.string().trim().length(10),
    gstNumber: z.string().trim().max(15).optional().or(z.literal("")),
    privacyPolicyAccepted: z.literal(true)
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1)
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(80).optional(),
    email: z.string().email().optional(),
    mobileNumber: z.string().trim().min(10).max(15).optional(),
    billingAddress: z.string().trim().min(5).max(200).optional(),
    pincode: z.string().trim().min(4).max(10).optional(),
    gstNumber: z.string().trim().max(15).optional().or(z.literal("")),
    shippingAddress: z
      .object({
        fullName: optionalAddressField(80),
        phone: optionalAddressField(20),
        addressLine1: optionalAddressField(120),
        addressLine2: optionalAddressField(120),
        city: optionalAddressField(60),
        postalCode: optionalAddressField(12),
        country: optionalAddressField(60)
      })
      .partial()
      .optional()
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email(),
    mobileNumber: z.string().trim().min(10).max(15),
    panNumber: z.string().trim().length(10)
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});
