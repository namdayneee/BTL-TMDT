import prisma from "../utils/prisma.js";

export const recommendSize = async (
  height,
  weight
) => {
  return prisma.sizingRule.findFirst({
    where: {
      minHeight: {
        lte: height,
      },

      maxHeight: {
        gte: height,
      },

      minWeight: {
        lte: weight,
      },

      maxWeight: {
        gte: weight,
      },
    },
  });
};

export const createSizingRule = async (
  data
) => {
  return prisma.sizingRule.create({
    data,
  });
};