import express from "express";
import cors from "cors";

import orderRoutes from "./routes/order.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Order Service Running",
  });
});

app.use("/orders", orderRoutes);

export default app;