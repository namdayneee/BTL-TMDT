import express from "express";

import {
  getDashboardStats,
  getAllOrders,
  getProductsDashboard,
} from "../controllers/admin.controller.js";

import {
  authenticate,
  authorize,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(
  authenticate,
  authorize("admin")
);

router.get(
  "/stats",
  getDashboardStats
);

router.get(
  "/orders",
  getAllOrders
);

router.get(
  "/products",
  getProductsDashboard
);

export default router;