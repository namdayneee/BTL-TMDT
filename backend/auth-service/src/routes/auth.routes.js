import express from "express";

import {
  register,
  login,
  getMe,
  getUsers,
} from "../controllers/auth.controller.js";

import {
  myProfile,
  updateProfile,
  adminUpdateUserProfile,
} from "../controllers/profile.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/me", authenticate, getMe);

router.get("/users", authenticate, authorize("admin"), getUsers);

router.patch(
  "/users/:userId/profile",
  authenticate,
  authorize("admin"),
  adminUpdateUserProfile
);

router.get("/profile", authenticate, myProfile);

router.patch("/profile", authenticate, updateProfile);

router.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

export default router;