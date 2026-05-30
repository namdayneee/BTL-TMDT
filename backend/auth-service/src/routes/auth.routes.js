import express from "express";

import {
  register,
  login,
  getMe,
} from "../controllers/auth.controller.js";

import {
  myProfile,
  updateProfile,
} from "../controllers/profile.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";

import { validate }
from "../middleware/validate.middleware.js";

import {
  registerSchema,
  loginSchema,
} from "../validators/auth.validator.js";

import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.post("/register", validate(registerSchema), register);

router.post("/login", validate(loginSchema),  asyncHandler(login));

router.get("/me", authenticate, getMe);

router.get("/profile", authenticate, myProfile);

router.patch("/profile", authenticate, updateProfile);

router.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

export default router;