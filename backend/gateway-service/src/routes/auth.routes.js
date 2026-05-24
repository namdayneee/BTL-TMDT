import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const router = express.Router();

console.log(process.env.AUTH_SERVICE_URL);

router.use(
  "/",
  createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL,
    changeOrigin: true,
  })
);

export default router;