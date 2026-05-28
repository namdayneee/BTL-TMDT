import prisma from "../utils/prisma.js";

export const getOrCreateCart = async (
  userId
) => {
  let cart = await prisma.cart.findUnique({
    where: {
      userId,
    },

    include: {
      items: true,
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        userId,
      },

      include: {
        items: true,
      },
    });
  }

  return cart;
};

export const addToCart = async (
  userId,
  variantId,
  quantity
) => {
  const cart =
    await getOrCreateCart(userId);

  const existingItem =
    await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        variantId,
      },
    });

  if (existingItem) {
    return prisma.cartItem.update({
      where: {
        id: existingItem.id,
      },

      data: {
        quantity:
          existingItem.quantity +
          quantity,
      },
    });
  }

  return prisma.cartItem.create({
    data: {
      cartId: cart.id,
      variantId,
      quantity,
    },
  });
};

export const getCart = async (userId) => {
  return prisma.cart.findUnique({
    where: {
      userId,
    },

    include: {
      items: true,
    },
  });
};

export const removeCartItem = async (
  itemId
) => {
  return prisma.cartItem.delete({
    where: {
      id: Number(itemId),
    },
  });
};

export const updateCartItemQuantity = async (
  itemId,
  quantity
) => {
  if (quantity <= 0) {
    return prisma.cartItem.delete({
      where: {
        id: Number(itemId),
      },
    });
  }

  return prisma.cartItem.update({
    where: {
      id: Number(itemId),
    },
    data: {
      quantity,
    },
  });
};