import prisma from "../utils/prisma.js";

export const createReview = async (userId, data) => {
  const orderId = data.orderId ? Number(data.orderId) : null;

  if (orderId) {
    const existing = await prisma.review.findUnique({
      where: { orderId },
    });
    if (existing) {
      throw new Error("Đơn hàng này đã được đánh giá");
    }
  }

  return prisma.review.create({
    data: {
      userId,
      productId: Number(data.productId),
      orderId,
      rating: Number(data.rating),
      content: data.content,
      height: data.height ? Number(data.height) : null,
      weight: data.weight ? Number(data.weight) : null,
      fitFeeling: data.fitFeeling || null,
      purchasedSize: data.purchasedSize || null,
    },
  });
};

export const updateReview = async (userId, reviewId, data) => {
  const review = await prisma.review.findUnique({
    where: { id: Number(reviewId) },
  });

  if (!review || review.userId !== userId) {
    throw new Error("Không tìm thấy đánh giá");
  }

  return prisma.review.update({
    where: { id: review.id },
    data: {
      rating: Number(data.rating),
      content: data.content,
      height: data.height ? Number(data.height) : null,
      weight: data.weight ? Number(data.weight) : null,
      fitFeeling: data.fitFeeling || null,
      purchasedSize: data.purchasedSize || null,
    },
  });
};

export const getProductReviews = async (productId) => {
  return prisma.review.findMany({
    where: { productId: Number(productId) },
    orderBy: { createdAt: "desc" },
  });
};

export const getMyReviews = async (userId) => {
  return prisma.review.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

export const getReviewByOrder = async (userId, orderId) => {
  return prisma.review.findFirst({
    where: {
      userId,
      orderId: Number(orderId),
    },
  });
};
