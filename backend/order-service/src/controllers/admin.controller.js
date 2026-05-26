import prisma from "../utils/prisma.js";

import productClient from "../utils/productClient.js";

export const getDashboardStats =
  async (req, res) => {
    try {
      const orders =
        await prisma.order.findMany();

      const totalRevenue =
        orders.reduce(
          (sum, order) =>
            sum + order.totalAmount,
          0
        );

      const totalOrders =
        orders.length;

      const response =
        await productClient.get(
          "/products"
        );

      const products =
        response.data;

      let lowStockProducts = 0;

      products.forEach((product) => {
        product.variants.forEach(
          (variant) => {
            if (variant.stock < 5) {
              lowStockProducts++;
            }
          }
        );
      });

      res.json({
        totalRevenue,
        totalOrders,
        lowStockProducts,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

export const getAllOrders =
  async (req, res) => {
    try {
      const orders =
        await prisma.order.findMany({
          include: {
            items: true,
          },

          orderBy: {
            createdAt: "desc",
          },
        });

      res.json(orders);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

export const getProductsDashboard =
  async (req, res) => {
    try {
      const response =
        await productClient.get(
          "/products"
        );

      res.json(response.data);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };