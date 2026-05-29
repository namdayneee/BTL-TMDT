import express from "express";

import { createProxyMiddleware } from "http-proxy-middleware";

const router = express.Router();

const ORDER_SERVICE = "http://localhost:3003";

/** PATCH status: proxy thủ công để phát socket realtime từ gateway */
router.patch(
  "/:id/status",
  express.json(),
  async (req, res) => {
    try {
      const response = await fetch(
        `${ORDER_SERVICE}/orders/${req.params.id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            ...(req.headers.authorization
              ? { Authorization: req.headers.authorization }
              : {}),
          },
          body: JSON.stringify(req.body),
        }
      );

      const data = await response.json();

      if (response.ok && global.io) {
        const payload = {
          orderId: data.id,
          status: data.status,
          userId: data.userId,
        };

        global.io.to(`order-${data.id}`).emit("order-status-updated", payload);
        global.io.to(`user-${data.userId}`).emit("order-status-updated", payload);
        global.io.to("admin-orders").emit("order-status-updated", payload);
      }

      res.status(response.status).json(data);
    } catch (error) {
      res.status(502).json({
        message: error.message || "Order service unavailable",
      });
    }
  }
);

router.use(
  createProxyMiddleware({
    target: ORDER_SERVICE,
    changeOrigin: true,
    pathRewrite: (path) => `/orders${path}`,
  })
);

export default router;
