import prisma from "../utils/prisma.js";
import productClient from "../utils/productClient.js";

const toStockItems = (cartItems) =>
  cartItems.map((item) => ({
    variantId: item.variantId,
    quantity: item.quantity,
  }));

const FREE_SHIPPING_THRESHOLD = 500000;
const SHIPPING_FEE = 30000;

export const validatePromo = async (code, subtotal) => {
  if (!code) return null;

  const promo = await prisma.promotion.findFirst({
    where: {
      code: { equals: code, mode: "insensitive" },
      isActive: true,
    },
  });

  if (!promo) throw new Error("Mã giảm giá không hợp lệ hoặc đã hết hạn");
  if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) {
    throw new Error("Mã giảm giá đã hết hạn");
  }
  if (promo.minOrderValue && subtotal < promo.minOrderValue) {
    throw new Error(
      `Đơn hàng tối thiểu ${promo.minOrderValue.toLocaleString("vi-VN")}đ để dùng mã này`
    );
  }

  let discountAmount = 0;
  if (promo.discountType === "percent") {
    discountAmount = subtotal * (promo.discountValue / 100);
  } else {
    discountAmount = promo.discountValue;
  }
  discountAmount = Math.min(discountAmount, subtotal);

  return { promo, discountAmount };
};

const resolveCheckoutItems = async (userId, body) => {
  const buyNow = body.buyNow;
  if (buyNow?.variantId != null) {
    const variantId = Number(buyNow.variantId);
    const quantity = Math.max(1, Number(buyNow.quantity) || 1);
    if (!Number.isFinite(variantId) || variantId <= 0) {
      throw new Error("Sản phẩm không hợp lệ");
    }
    return {
      checkoutItems: [{ variantId, quantity }],
      clearFullCart: false,
    };
  }

  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: true },
  });

  if (!cart || cart.items.length === 0) {
    throw new Error("Giỏ hàng trống");
  }

  return {
    cart,
    checkoutItems: cart.items.map((item) => ({
      variantId: item.variantId,
      quantity: item.quantity,
    })),
    clearFullCart: true,
  };
};

export const checkout = async (userId, body = {}) => {
  const { shippingName, shippingPhone, shippingAddress, paymentMethod, promoCode } = body;

  const resolved = await resolveCheckoutItems(userId, body);
  const { checkoutItems, clearFullCart, cart } = resolved;

  let subtotal = 0;
  const orderItemsData = [];
  const stockItems = toStockItems(checkoutItems);

  for (const item of checkoutItems) {
    const response = await productClient.get(`/products/variants/${item.variantId}`);
    const variant = response.data;

    if (variant.stock < item.quantity) {
      throw new Error(
        `Không đủ tồn kho: ${variant.product.name} (size ${variant.size}) chỉ còn ${variant.stock}`
      );
    }

    const price = variant.product.price;
    subtotal += price * item.quantity;
    orderItemsData.push({ variantId: item.variantId, quantity: item.quantity, price });
  }

  // Tính phí ship
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;

  // Kiểm tra promo
  let discountAmount = 0;
  let appliedPromoCode = null;
  if (promoCode) {
    const promoResult = await validatePromo(promoCode, subtotal);
    if (promoResult) {
      discountAmount = promoResult.discountAmount;
      appliedPromoCode = promoResult.promo.code;
    }
  }

  const totalAmount = subtotal + shippingFee - discountAmount;

  await productClient.post("/products/variants/stock/decrement", { items: stockItems });

  try {
    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount,
        shippingFee,
        discountAmount,
        status: "pending",
        paymentMethod: paymentMethod || "cod",
        paymentStatus: paymentMethod === "cod" ? "pending" : "pending",
        promoCode: appliedPromoCode,
        shippingName: shippingName || null,
        shippingPhone: shippingPhone || null,
        shippingAddress: shippingAddress || null,
        items: { create: orderItemsData },
      },
      include: { items: true },
    });

    if (clearFullCart && cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }

    return order;
  } catch (error) {
    await productClient
      .post("/products/variants/stock/restore", { items: stockItems })
      .catch(() => {});
    throw error;
  }
};

export const getMyOrders = async (userId) => {
  return prisma.order.findMany({
    where: { userId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
};

export const updateOrderStatus = async (orderId, status) => {
  return prisma.order.update({
    where: { id: Number(orderId) },
    data: { status },
  });
};
