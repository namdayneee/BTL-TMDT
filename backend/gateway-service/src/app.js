import express from "express";
import cors from "cors";
import morgan from "morgan";

import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import sizingRoutes from "./routes/sizing.routes.js";

import { loggerMiddleware } from "./middleware/logger.middleware.js";

const app = express();

app.use(cors());

//app.use(express.json());

app.use(morgan("dev"));

app.use(loggerMiddleware);

app.get("/", (req, res) => {
  res.json({
    message: "VAULT API Gateway Running",
  });
});

app.use("/api/auth", authRoutes);

app.use("/api/products", productRoutes);

app.use("/api/cart", cartRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/reviews", reviewRoutes);

app.use("/api/sizing", sizingRoutes);

export default app;