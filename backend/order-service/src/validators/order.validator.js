import { z } from "zod";

export const checkoutSchema =
  z.object({
    paymentMethod:
      z.string(),
  });