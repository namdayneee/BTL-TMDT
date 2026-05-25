import express from "express";

import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";

import { authorize } from "../middleware/role.middleware.js";

const router = express.Router();

router.get("/", getProducts);

router.get("/:id", getProduct);

router.post(
  "/",
  authenticate,
  authorize("admin"),
  createProduct
);

router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  updateProduct
);

router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  deleteProduct
);

export default router;