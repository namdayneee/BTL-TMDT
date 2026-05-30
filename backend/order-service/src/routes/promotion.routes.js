import express from "express";
import {
  validatePromoCode,
  createPromotion,
  getAllPromotions,
  togglePromotion,
} from "../controllers/promotion.controller.js";
import { authenticate, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public: validate mã giảm giá
router.post("/validate", authenticate, validatePromoCode);

// Admin
router.get("/", authenticate, authorize("admin"), getAllPromotions);
router.post("/", authenticate, authorize("admin"), createPromotion);
router.patch("/:id/toggle", authenticate, authorize("admin"), togglePromotion);

export default router;
