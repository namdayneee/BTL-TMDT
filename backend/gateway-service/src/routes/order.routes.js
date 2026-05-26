import express from "express";

import { createProxyMiddleware } from "http-proxy-middleware";

const router = express.Router();

router.use(
  createProxyMiddleware({
    target: "http://localhost:3003",

    changeOrigin: true,

    pathRewrite: (path) => {
      return `/orders${path}`;
    },
  })
);

export default router;