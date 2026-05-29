import prisma from "../utils/prisma.js";

export const createReview = async (userId, data) => {
  return prisma.review.create({
    data: {
      userId,
      productId: data.productId,
      rating: data.rating,
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
