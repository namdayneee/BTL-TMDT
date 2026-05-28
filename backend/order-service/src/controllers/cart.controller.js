import * as cartService from "../services/cart.service.js";

export const addToCart = async (req, res) => {
  try {
    const { variantId, quantity } = req.body;

    const item = await cartService.addToCart(
      req.user.id,
      variantId,
      quantity
    );

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getCart = async (req, res) => {
  try {
    const cart = await cartService.getCart(req.user.id);

    res.json(cart);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    await cartService.removeCartItem(req.params.itemId);

    res.json({
      message: "Item removed",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;

    const item = await cartService.updateCartItemQuantity(
      req.params.itemId,
      Number(quantity)
    );

    res.json(item);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};