import express from "express";

import {
  addToCart,
  getCart,
  removeCartItem,
} from "../controllers/cart.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", authenticate, getCart);

router.post("/", authenticate, addToCart);

router.delete("/:itemId", authenticate, removeCartItem);

export default router;