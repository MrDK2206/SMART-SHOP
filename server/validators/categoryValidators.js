import { z } from "zod";

const imageSourceSchema = z.string().refine(
  (value) => value.startsWith("data:image/") || /^https?:\/\//.test(value),
  "Banner image must be a valid URL or uploaded image data"
);

export const saveCategorySchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(80),
    description: z.string().trim().max(300).optional().or(z.literal("")),
    bannerImage: imageSourceSchema,
    headline: z.string().trim().max(120).optional().or(z.literal("")),
    isActive: z.boolean().optional().default(true),
    sortOrder: z.number().int().min(0).max(1000).optional().default(0)
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

export const categoryIdSchema = z.object({
  params: z.object({
    id: z.string().min(12)
  }),
  body: z.object({}).optional(),
  query: z.object({}).optional()
});
