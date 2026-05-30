import prisma from "../utils/prisma.js";
import { getProfile, upsertProfile } from "../services/profile.service.js";

export const myProfile = async (req, res) => {
  try {
    const profile = await getProfile(req.user.id);
    res.json(profile || {});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const profile = await upsertProfile(req.user.id, req.body);
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const adminUpdateUserProfile = async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    if (!userId) {
      return res.status(400).json({ message: "userId không hợp lệ" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    const profile = await upsertProfile(userId, req.body);
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
