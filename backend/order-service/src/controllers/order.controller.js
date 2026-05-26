import * as orderService from "../services/order.service.js";
import prisma from "../utils/prisma.js";

export const checkout = async (
  req,
  res
) => {
  try {
    const order =
      await orderService.checkout(
        req.user.id
      );

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getMyOrders = async (
  req,
  res
) => {
  try {
    const orders =
      await orderService.getMyOrders(
        req.user.id
      );

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const checkPurchased = async (
  req,
  res
) => {
  try {
    const userId = req.user.id;

    const variantId = Number(
      req.params.variantId
    );

    const purchased =
      await prisma.orderItem.findFirst({
        where: {
          variantId,

          order: {
            userId,
          },
        },
      });

    res.json({
      purchased: !!purchased,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};