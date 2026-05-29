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
