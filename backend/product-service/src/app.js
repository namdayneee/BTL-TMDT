import express from "express";

import cors from "cors";

import productRoutes from "./routes/product.routes.js";

import reviewRoutes from "./routes/review.routes.js";

import sizingRoutes from "./routes/sizing.routes.js";

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Product Service Running",
  });
});

app.use("/products", productRoutes);

app.use("/reviews", reviewRoutes);

app.use("/sizing", sizingRoutes);

import { errorHandler }
from "./middleware/error.middleware.js";

app.use(errorHandler);

export default app;