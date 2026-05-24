import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "Auth Routes Working",
  });
});

export default router;