import express from "express";

import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getVariantById,
  decrementStockBatch,
  restoreStockBatch,
} from "../controllers/product.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";

import { authorize } from "../middleware/role.middleware.js";

import { validate } from "../middleware/validate.middleware.js";

import {
  createProductSchema,
} from "../validators/product.validator.js";

const router = express.Router();

router.get("/", getProducts);

router.post(
  "/variants/stock/decrement",
  decrementStockBatch
);

router.post(
  "/variants/stock/restore",
  restoreStockBatch
);

router.get(
  "/variants/:id",
  getVariantById
);

router.get("/:id", getProduct);

router.post(
  "/",
  authenticate,
  authorize("admin"),
  validate(createProductSchema),
  createProduct
);

router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  validate(createProductSchema),
  updateProduct
);

router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  deleteProduct
);

export default router;