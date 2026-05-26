import prisma from "../utils/prisma.js";

import productClient from "../utils/productClient.js";

export const checkout = async (
  userId
) => {
  const cart = await prisma.cart.findUnique({
    where: {
      userId,
    },

    include: {
      items: true,
    },
  });

  if (
    !cart ||
    cart.items.length === 0
  ) {
    throw new Error("Cart is empty");
  }

  let totalAmount = 0;

  const orderItemsData = [];

  for (const item of cart.items) {
    const response =
      await productClient.get(
        `/products/variants/${item.variantId}`
      );

    const variant = response.data;

    const price =
      variant.product.price;

    totalAmount +=
      price * item.quantity;

    orderItemsData.push({
      variantId: item.variantId,

      quantity: item.quantity,

      price,
    });
  }

  const order = await prisma.order.create({
    data: {
      userId,

      totalAmount,

      status: "pending",

      items: {
        create: orderItemsData,
      },
    },

    include: {
      items: true,
    },
  });

  await prisma.cartItem.deleteMany({
    where: {
      cartId: cart.id,
    },
  });

  return order;
};

export const getMyOrders = async (
  userId
) => {
  return prisma.order.findMany({
    where: {
      userId,
    },

    include: {
      items: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};