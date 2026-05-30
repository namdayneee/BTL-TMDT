import express from "express";

import {
  createReview,
  getReviews,
  getMyReviews,
  getReviewByOrder,
  updateReview,
} from "../controllers/review.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/my", authenticate, getMyReviews);
router.get("/order/:orderId", authenticate, getReviewByOrder);
router.put("/:id", authenticate, updateReview);
router.get("/:productId", getReviews);
router.post("/", authenticate, createReview);

export default router;
