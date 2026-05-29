import express from "express";
import cors from "cors";
import morgan from "morgan";

import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import sizingRoutes from "./routes/sizing.routes.js";
import promotionRoutes from "./routes/promotion.routes.js";

import { loggerMiddleware } from "./middleware/logger.middleware.js";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();

app.use(cors());

// app.use(express.json());

app.use(morgan("dev"));

app.use(loggerMiddleware);

app.get("/", (req, res) => {
  res.json({
    message: "VAULT API Gateway Running",
  });
});

// app.use(
//   "/api/admin",
//   (req, res, next) => {
//     console.log("=== HIT ADMIN PROXY ==="); // thêm dòng này
//     next();
//   },

//   createProxyMiddleware({
//     target: "http://localhost:3003",
//     changeOrigin: true,
//     pathRewrite: {
//       "^/api/admin": "/admin",
//     },
//     on: {
//       proxyReq: (proxyReq, req) => {
//         console.log("Original:", req.originalUrl);
//         console.log("Proxy path:", proxyReq.path);
//       },
//       error: (err, req, res) => {
//         console.log("=== PROXY ERROR ===", err.message);
//         res.status(502).json({ error: err.message });
//       },
//     },
//     onProxyReq: (proxyReq, req) => {
//   console.log("Original:", req.originalUrl);
//   console.log("Proxy path:", proxyReq.path); // <-- xem dòng này in ra gì
// },

//     onProxyReq: (proxyReq, req) => {
//       console.log(
//         "Original:",
//         req.originalUrl
//       );

//       console.log(
//         "Proxy path:",
//         proxyReq.path
//       );
//     },
//   })
// );

app.use(
  "/api/admin",
  (req, res, next) => {
    //console.log("=== HIT ADMIN PROXY ===");
    req.url = "/admin" + req.url;
    //console.log("Rewritten URL:", req.url);
    next();
  },
  createProxyMiddleware({
    target: "http://localhost:3003",
    changeOrigin: true,
    on: {
      // proxyReq: (proxyReq, req) => {
      //   console.log("Original:", req.originalUrl);
      //   console.log("Proxy path:", proxyReq.path);
      // },
      error: (err, req, res) => {
        console.log("=== PROXY ERROR ===", err.message);
        res.status(502).json({ error: err.message });
      },
    },
  })
);

app.use("/api/auth", authRoutes);

app.use("/api/products", productRoutes);

app.use("/api/cart", cartRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/reviews", reviewRoutes);

app.use("/api/sizing", sizingRoutes);

app.use("/api/promotions", promotionRoutes);

export default app;

// import express from "express";

// import cors from "cors";

// import morgan from "morgan";

// import {
//   createProxyMiddleware,
// } from "http-proxy-middleware";

// const app = express();

// app.use(cors());

// app.use(morgan("dev"));

// app.get("/", (req, res) => {
//   res.json({
//     message:
//       "VAULT Gateway Running",
//   });
// });

// app.use(
//   "/api/auth",

//   createProxyMiddleware({
//     target: "http://localhost:3001",

//     changeOrigin: true,
//   })
// );

// app.use(
//   "/api/products",

//   createProxyMiddleware({
//     target: "http://localhost:3002",

//     changeOrigin: true,
//   })
// );

// app.use(
//   "/api/orders",

//   createProxyMiddleware({
//     target: "http://localhost:3003",

//     changeOrigin: true,
//   })
// );

// app.use(
//   "/api/admin",

//   createProxyMiddleware({
//     target: "http://localhost:3003",

//     changeOrigin: true,
//   })
// );

// export default app;