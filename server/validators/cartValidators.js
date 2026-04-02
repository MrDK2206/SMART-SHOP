import { z } from "zod";

export const addToCartSchema = z.object({
  body: z.object({
    productId: z.string().min(12),
    quantity: z.number().int().min(1).max(20).optional()
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

export const updateCartSchema = z.object({
  body: z.object({
    quantity: z.number().int().min(0).max(20)
  }),
  params: z.object({
    productId: z.string().min(12)
  }),
  query: z.object({}).optional()
});
