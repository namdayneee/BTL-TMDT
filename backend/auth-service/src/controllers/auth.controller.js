import prisma from "../utils/prisma.js";

import {
  registerUser,
  loginUser,
} from "../services/auth.service.js";

import {
  registerSchema,
  loginSchema,
} from "../validators/auth.validator.js";

export const register = async (req, res) => {
  try {
    const validatedData = registerSchema.parse(req.body);

    const user = await registerUser(
      validatedData.email,
      validatedData.password
    );

    res.status(201).json({
      message: "Register successful",
      user,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const validatedData = loginSchema.parse(req.body);

    const result = await loginUser(
      validatedData.email,
      validatedData.password
    );

    res.json({
      message: "Login successful",
      ...result,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};