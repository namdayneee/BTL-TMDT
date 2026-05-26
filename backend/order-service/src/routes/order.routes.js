import express from "express";

import {
  checkout,
  getMyOrders,
  checkPurchased,
  updateStatus,
} from "../controllers/order.controller.js";

import { 
  authenticate,
  authorize,
 } from "../middleware/auth.middleware.js";

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

router.patch(
  "/:id/status",

  authenticate,

  authorize("admin"),

  updateStatus
);

export default router;