import prisma from "../utils/prisma.js";

import productClient from "../utils/productClient.js";

const toStockItems = (cartItems) =>
  cartItems.map((item) => ({
    variantId: item.variantId,
    quantity: item.quantity,
  }));

export const checkout = async (userId) => {
  const cart = await prisma.cart.findUnique({
    where: {
      userId,
    },

    include: {
      items: true,
    },
  });

  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  let totalAmount = 0;
  const orderItemsData = [];
  const stockItems = toStockItems(cart.items);

  for (const item of cart.items) {
    const response = await productClient.get(
      `/products/variants/${item.variantId}`
    );

    const variant = response.data;

    if (variant.stock < item.quantity) {
      throw new Error(
        `Không đủ tồn kho: ${variant.product.name} (size ${variant.size}) chỉ còn ${variant.stock}`
      );
    }

    const price = variant.product.price;

    totalAmount += price * item.quantity;

    orderItemsData.push({
      variantId: item.variantId,
      quantity: item.quantity,
      price,
    });
  }

  await productClient.post("/products/variants/stock/decrement", {
    items: stockItems,
  });

  try {
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
  } catch (error) {
    await productClient
      .post("/products/variants/stock/restore", {
        items: stockItems,
      })
      .catch(() => {});

    throw error;
  }
};

export const getMyOrders = async (userId) => {
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

export const updateOrderStatus = async (orderId, status) => {
  return prisma.order.update({
    where: {
      id: Number(orderId),
    },

    data: {
      status,
    },
  });
};
