import { z } from "zod";

const imageSourceSchema = z.string().refine(
  (value) => value.startsWith("data:image/") || /^https?:\/\//.test(value),
  "Image must be a valid URL or uploaded image data"
);

export const getProductsSchema = z.object({
  query: z.object({
    keyword: z.string().optional(),
    category: z.string().optional(),
    sort: z.enum(["newest", "price-asc", "price-desc", "name-asc"]).optional()
  }),
  body: z.object({}).optional(),
  params: z.object({}).optional()
});

export const productIdSchema = z.object({
  params: z.object({
    id: z.string().min(12)
  }),
  body: z.object({}).optional(),
  query: z.object({}).optional()
});

export const saveProductSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(120),
    brand: z.string().trim().min(2).max(80),
    category: z.string().trim().max(60).optional().or(z.literal("")),
    categorySlug: z.string().trim().max(80).optional().or(z.literal("")),
    description: z.string().trim().min(10).max(2000),
    image: imageSourceSchema,
    price: z.number().min(0),
    countInStock: z.number().int().min(0),
    featured: z.boolean().optional()
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});
