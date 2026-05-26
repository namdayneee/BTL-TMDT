import express from "express";

import {
  checkout,
  getMyOrders,
  checkPurchased,
} from "../controllers/order.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post(
  "/checkout",
  authenticate,
  checkout
);

router.get(
  "/my-orders",
  authenticate,
  getMyOrders
);

router.get(
  "/check-purchased/:variantId",
  authenticate,
  checkPurchased
);

export default router;