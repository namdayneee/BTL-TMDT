import express from "express";
import cors from "cors";

import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import promotionRoutes from "./routes/promotion.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Order Service Running" });
});

app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);
app.use("/admin", adminRoutes);
app.use("/promotions", promotionRoutes);

import { errorHandler }
from "./middleware/error.middleware.js";

app.use(errorHandler);

export default app;