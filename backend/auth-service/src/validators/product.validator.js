import { z } from "zod";

export const createProductSchema =
  z.object({
    name: z.string().min(2),

    description:
      z.string(),

    price: z.number().positive(),

    thumbnail:
      z.string().optional(),
  });