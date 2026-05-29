import prisma from "../utils/prisma.js";
import { validatePromo } from "../services/order.service.js";

export const validatePromoCode = async (req, res) => {
  try {
    const { code, subtotal } = req.body;
    if (!code) return res.status(400).json({ message: "code là bắt buộc" });

    const result = await validatePromo(code, Number(subtotal) || 0);
    res.json({
      code: result.promo.code,
      discountType: result.promo.discountType,
      discountValue: result.promo.discountValue,
      discountAmount: result.discountAmount,
      message: `Áp dụng thành công! Giảm ${result.discountAmount.toLocaleString("vi-VN")}đ`,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const createPromotion = async (req, res) => {
  try {
    const promo = await prisma.promotion.create({ data: req.body });
    res.status(201).json(promo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllPromotions = async (req, res) => {
  try {
    const promos = await prisma.promotion.findMany({ orderBy: { createdAt: "desc" } });
    res.json(promos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const togglePromotion = async (req, res) => {
  try {
    const promo = await prisma.promotion.findUnique({ where: { id: Number(req.params.id) } });
    if (!promo) return res.status(404).json({ message: "Không tìm thấy" });
    const updated = await prisma.promotion.update({
      where: { id: promo.id },
      data: { isActive: !promo.isActive },
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
