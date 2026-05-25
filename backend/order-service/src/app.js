import express from "express";
import cors from "cors";

import cartRoutes from "./routes/cart.routes.js";

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Order Service Running",
  });
});

app.use("/cart", cartRoutes);

export default app;