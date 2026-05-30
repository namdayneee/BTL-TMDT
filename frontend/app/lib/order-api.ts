import { apiFetch } from './api-client';
import type { ApiOrder } from './types';

const ORDERS_CHECKOUT_PATH = process.env.NEXT_PUBLIC_ORDERS_CHECKOUT_PATH;
const ORDERS_MY_ORDERS_PATH = process.env.NEXT_PUBLIC_ORDERS_MY_ORDERS_PATH;

export type CheckoutPayload = {
  shippingName?: string;
  shippingPhone?: string;
  shippingAddress?: string;
  paymentMethod?: string;
  promoCode?: string;
  /** Chỉ thanh toán một biến thể — không gộp với giỏ hàng */
  buyNow?: { variantId: number; quantity?: number };
};

export async function checkoutOrder(payload: CheckoutPayload = {}): Promise<ApiOrder> {
  if (!ORDERS_CHECKOUT_PATH) {
    throw new Error('NEXT_PUBLIC_ORDERS_CHECKOUT_PATH chưa được cấu hình trong .env');
  }
  return apiFetch<ApiOrder>(ORDERS_CHECKOUT_PATH, {
    method: 'POST',
    auth: true,
    body: JSON.stringify(payload),
  });
}

export async function fetchMyOrders(): Promise<ApiOrder[]> {
  if (!ORDERS_MY_ORDERS_PATH) {
    throw new Error('NEXT_PUBLIC_ORDERS_MY_ORDERS_PATH chưa được cấu hình trong .env');
  }
  return apiFetch<ApiOrder[]>(ORDERS_MY_ORDERS_PATH, { auth: true });
}

export async function fetchOrderById(orderId: string | number): Promise<ApiOrder | null> {
  const orders = await fetchMyOrders();
  return orders.find((o) => o.id === Number(orderId)) ?? null;
}

export async function checkVariantPurchased(variantId: number): Promise<boolean> {
  const data = await apiFetch<{ purchased: boolean }>(
    `/api/orders/check-purchased/${variantId}`,
    { auth: true }
  );
  return data.purchased;
}
