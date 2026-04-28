import { z } from "zod";

export const productSchema = z.object({
  name: z.string().nullable(),
  price: z.string().nullable(),
  weight: z.string().nullable(),
  age_range: z.string().nullable(),
  confidence: z.number(),
  note: z.string().optional()
});