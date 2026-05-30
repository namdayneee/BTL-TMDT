import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Auth Service Running",
  });
});

app.use("/auth", authRoutes);

import { errorHandler }
from "./middleware/error.middleware.js";

app.use(errorHandler);

export default app;