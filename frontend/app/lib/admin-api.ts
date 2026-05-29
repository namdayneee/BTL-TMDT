import { apiFetch } from './api-client';
import type { ApiOrder, ApiProduct } from './types';

const ADMIN_STATS_PATH = process.env.NEXT_PUBLIC_ADMIN_STATS_PATH;
const ADMIN_ORDERS_PATH = process.env.NEXT_PUBLIC_ADMIN_ORDERS_PATH;
const ADMIN_PRODUCTS_PATH = process.env.NEXT_PUBLIC_ADMIN_PRODUCTS_PATH;
const ORDER_STATUS_PATH = process.env.NEXT_PUBLIC_ORDER_STATUS_PATH;
const PRODUCTS_LIST_PATH = process.env.NEXT_PUBLIC_PRODUCTS_LIST_PATH;
const PRODUCT_DETAIL_PATH = process.env.NEXT_PUBLIC_PRODUCT_DETAIL_PATH;
const SIZING_RULES_PATH = process.env.NEXT_PUBLIC_SIZING_RULES_PATH;

export type AdminStats = {
  totalRevenue: number;
  totalOrders: number;
  lowStockProducts: number;
};

export type CreateProductInput = {
  name: string;
  description: string;
  price: number;
  thumbnail?: string;
  variants: { size: string; stock: number }[];
};

export type UpdateProductInput = {
  name: string;
  description: string;
  price: number;
  thumbnail?: string;
};

export type SizingRuleInput = {
  minHeight: number;
  maxHeight: number;
  minWeight: number;
  maxWeight: number;
  size: string;
};

function assertPath(path: string | undefined, name: string): asserts path is string {
  if (!path) {
    throw new Error(`${name} chưa được cấu hình trong .env`);
  }
}

export async function fetchAdminStats(): Promise<AdminStats> {
  assertPath(ADMIN_STATS_PATH, 'NEXT_PUBLIC_ADMIN_STATS_PATH');
  return apiFetch<AdminStats>(ADMIN_STATS_PATH, { auth: true });
}

export async function fetchAdminOrders(): Promise<ApiOrder[]> {
  assertPath(ADMIN_ORDERS_PATH, 'NEXT_PUBLIC_ADMIN_ORDERS_PATH');
  return apiFetch<ApiOrder[]>(ADMIN_ORDERS_PATH, { auth: true });
}

export async function fetchAdminProducts(): Promise<ApiProduct[]> {
  assertPath(ADMIN_PRODUCTS_PATH, 'NEXT_PUBLIC_ADMIN_PRODUCTS_PATH');
  return apiFetch<ApiProduct[]>(ADMIN_PRODUCTS_PATH, { auth: true });
}

export async function updateOrderStatus(
  orderId: number,
  status: ApiOrder['status']
): Promise<ApiOrder> {
  assertPath(ORDER_STATUS_PATH, 'NEXT_PUBLIC_ORDER_STATUS_PATH');
  return apiFetch<ApiOrder>(`${ORDER_STATUS_PATH}/${orderId}/status`, {
    method: 'PATCH',
    auth: true,
    body: JSON.stringify({ status }),
  });
}

export async function createProduct(data: CreateProductInput): Promise<ApiProduct> {
  assertPath(PRODUCTS_LIST_PATH, 'NEXT_PUBLIC_PRODUCTS_LIST_PATH');
  return apiFetch<ApiProduct>(PRODUCTS_LIST_PATH, {
    method: 'POST',
    auth: true,
    body: JSON.stringify(data),
  });
}

export async function updateProduct(
  id: number,
  data: UpdateProductInput
): Promise<ApiProduct> {
  assertPath(PRODUCT_DETAIL_PATH, 'NEXT_PUBLIC_PRODUCT_DETAIL_PATH');
  return apiFetch<ApiProduct>(`${PRODUCT_DETAIL_PATH}/${id}`, {
    method: 'PUT',
    auth: true,
    body: JSON.stringify(data),
  });
}

export async function deleteProduct(id: number): Promise<{ message: string }> {
  assertPath(PRODUCT_DETAIL_PATH, 'NEXT_PUBLIC_PRODUCT_DETAIL_PATH');
  return apiFetch<{ message: string }>(`${PRODUCT_DETAIL_PATH}/${id}`, {
    method: 'DELETE',
    auth: true,
  });
}

export async function createSizingRule(data: SizingRuleInput): Promise<unknown> {
  assertPath(SIZING_RULES_PATH, 'NEXT_PUBLIC_SIZING_RULES_PATH');
  return apiFetch(SIZING_RULES_PATH, {
    method: 'POST',
    auth: true,
    body: JSON.stringify(data),
  });
}

export const ORDER_STATUS_OPTIONS: { value: ApiOrder['status']; label: string }[] = [
  { value: 'pending', label: 'Chờ xử lý' },
  { value: 'confirmed', label: 'Đã xác nhận' },
  { value: 'shipping', label: 'Đang giao' },
  { value: 'delivered', label: 'Đã giao' },
  { value: 'cancelled', label: 'Đã hủy' },
];
