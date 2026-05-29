import { apiFetch } from './api-client';
import type { ApiOrder } from './types';

const ORDERS_CHECKOUT_PATH = process.env.NEXT_PUBLIC_ORDERS_CHECKOUT_PATH;
const ORDERS_MY_ORDERS_PATH = process.env.NEXT_PUBLIC_ORDERS_MY_ORDERS_PATH;

export async function checkoutOrder(): Promise<ApiOrder> {
  if (!ORDERS_CHECKOUT_PATH) {
    throw new Error('NEXT_PUBLIC_ORDERS_CHECKOUT_PATH chưa được cấu hình trong .env');
  }
  return apiFetch<ApiOrder>(ORDERS_CHECKOUT_PATH, {
    method: 'POST',
    auth: true,
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
