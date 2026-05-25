import prisma from "../utils/prisma.js";

export const createReview = async (
  userId,
  data
) => {
  return prisma.review.create({
    data: {
      userId,

      productId: data.productId,

      rating: data.rating,

      content: data.content,
    },
  });
};

export const getProductReviews = async (
  productId
) => {
  return prisma.review.findMany({
    where: {
      productId: Number(productId),
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};