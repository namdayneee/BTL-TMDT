import { z } from "zod";

export const registerSchema =
  z.object({
    email: z.email(),

    password: z
      .string()
      .min(6),

    fullName: z
      .string()
      .min(2),

    role: z
      .enum([
        "customer",
        "admin",
      ])
      .optional(),
  });

export const loginSchema =
  z.object({
    email: z.email(),

    password: z.string(),
  });