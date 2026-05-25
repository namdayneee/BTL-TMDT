import prisma from "../utils/prisma.js";

export const createProduct = async (data) => {
  return prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      thumbnail: data.thumbnail,

      variants: {
        create: data.variants,
      },
    },

    include: {
      variants: true,
    },
  });
};

export const getAllProducts = async () => {
  return prisma.product.findMany({
    include: {
      variants: true,
      reviews: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getProductById = async (id) => {
  return prisma.product.findUnique({
    where: {
      id: Number(id),
    },

    include: {
      variants: true,
      reviews: true,
    },
  });
};

export const updateProduct = async (
  id,
  data
) => {
  return prisma.product.update({
    where: {
      id: Number(id),
    },

    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      thumbnail: data.thumbnail,
    },
  });
};

export const deleteProduct = async (id) => {
  return prisma.product.delete({
    where: {
      id: Number(id),
    },
  });
};