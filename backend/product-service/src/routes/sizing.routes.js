import express from "express";

import {
  recommendSize,
  createSizingRule,
  getAllSizingRules,
} from "../controllers/sizing.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = express.Router();

router.post("/recommend", recommendSize);

router.get("/rules", getAllSizingRules);

router.post(
  "/rules",
  authenticate,
  authorize("admin"),
  createSizingRule
);

export default router;