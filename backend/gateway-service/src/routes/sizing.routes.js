import express from "express";

import { createProxyMiddleware } from "http-proxy-middleware";

const router = express.Router();

router.use(
  createProxyMiddleware({
    target: "http://localhost:3002",

    changeOrigin: true,

    pathRewrite: (path) => {
      return `/sizing${path}`;
    },

    proxyTimeout: 5000,
  })
);

export default router;