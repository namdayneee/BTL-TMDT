import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const router = express.Router();

router.use(
  createProxyMiddleware({
    target: "http://localhost:3001",

    changeOrigin: true,

    pathRewrite: {
      "^/": "/auth/",
    },

    proxyTimeout: 5000,

    onProxyReq: (proxyReq, req, res) => {
      console.log("Proxying:", req.method, req.originalUrl);
    },
  })
);

export default router;