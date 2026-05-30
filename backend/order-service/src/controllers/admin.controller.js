import prisma from "../utils/prisma.js";

import productClient from "../utils/productClient.js";

export const getDashboardStats = async (req, res) => {
  try {
    const orders = await prisma.order.findMany();

    const deliveredOrders = orders.filter((o) => o.status === "delivered");
    const cancelledOrders = orders.filter((o) => o.status === "cancelled");

    const totalRevenue = deliveredOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalOrders = orders.length;

    // Doanh thu theo tháng (12 tháng gần nhất)
    const now = new Date();
    const monthlyRevenue = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = `${d.getMonth() + 1}/${d.getFullYear()}`;
      const monthOrders = deliveredOrders.filter((o) => {
        const od = new Date(o.createdAt);
        return od.getMonth() === d.getMonth() && od.getFullYear() === d.getFullYear();
      });
      monthlyRevenue.push({ month: label, revenue: monthOrders.reduce((s, o) => s + o.totalAmount, 0) });
    }

    // Thống kê theo trạng thái
    const statusCount = {};
    for (const o of orders) {
      statusCount[o.status] = (statusCount[o.status] || 0) + 1;
    }

    // Tỉ lệ hủy
    const cancelRate = totalOrders > 0 ? Math.round((cancelledOrders.length / totalOrders) * 100) : 0;

    const response = await productClient.get("/products");
    const products = response.data;

    let lowStockProducts = 0;
    products.forEach((product) => {
      product.variants.forEach((variant) => {
        if (variant.stock < 5) lowStockProducts++;
      });
    });

    res.json({
      totalRevenue,
      totalOrders,
      lowStockProducts,
      cancelRate,
      statusCount,
      monthlyRevenue,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
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