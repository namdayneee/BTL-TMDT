import * as productService from "../services/product.service.js";
import prisma from "../utils/prisma.js";

export const createProduct = async (req, res) => {
  try {
    const product =
      await productService.createProduct(req.body);

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    
    const products =
      await productService.getAllProducts();
    
    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getProduct = async (req, res) => {
  try {
    const product =
      await productService.getProductById(
        req.params.id
      );

    res.json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product =
      await productService.updateProduct(
        req.params.id,
        req.body
      );

    res.json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await productService.deleteProduct(
      req.params.id
    );

    res.json({
      message: "Product deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const decrementStockBatch = async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "items array is required",
      });
    }

    const updated = await productService.decrementStockBatch(items);

    res.json({
      message: "Stock updated",
      variants: updated,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const restoreStockBatch = async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "items array is required",
      });
    }

    const updated = await productService.restoreStockBatch(items);

    res.json({
      message: "Stock restored",
      variants: updated,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getVariantById = async (
  req,
  res
) => {
  try {
    const variant =
      await prisma.productVariant.findUnique({
        where: {
          id: Number(req.params.id),
        },

        include: {
          product: true,
        },
      });

    if (!variant) {
      return res.status(404).json({
        message: "Variant not found",
      });
    }

    res.json(variant);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};