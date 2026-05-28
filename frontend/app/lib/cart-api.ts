import { apiFetch } from './api-client';
import type { ApiCart, ApiCartItem } from './types';

const CART_PATH = process.env.NEXT_PUBLIC_CART_PATH;

export async function fetchCart(): Promise<ApiCart> {
  if (!CART_PATH) {
    throw new Error('NEXT_PUBLIC_CART_PATH chưa được cấu hình trong .env');
  }
  return apiFetch<ApiCart>(CART_PATH, { auth: true });
}

export async function addToCartApi(
  variantId: number,
  quantity = 1
): Promise<ApiCartItem> {
  if (!CART_PATH) {
    throw new Error('NEXT_PUBLIC_CART_PATH chưa được cấu hình trong .env');
  }
  return apiFetch<ApiCartItem>(CART_PATH, {
    method: 'POST',
    auth: true,
    body: JSON.stringify({ variantId, quantity }),
  });
}

export async function updateCartItemApi(
  itemId: number,
  quantity: number
): Promise<ApiCartItem | { message: string }> {
  if (!CART_PATH) {
    throw new Error('NEXT_PUBLIC_CART_PATH chưa được cấu hình trong .env');
  }
  return apiFetch(`${CART_PATH}/${itemId}`, {
    method: 'PATCH',
    auth: true,
    body: JSON.stringify({ quantity }),
  });
}

export async function removeCartItemApi(itemId: number): Promise<void> {
  if (!CART_PATH) {
    throw new Error('NEXT_PUBLIC_CART_PATH chưa được cấu hình trong .env');
  }
  await apiFetch(`${CART_PATH}/${itemId}`, {
    method: 'DELETE',
    auth: true,
  });
}
