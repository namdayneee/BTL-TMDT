import { apiFetch } from './api-client';
import type { ApiProduct, ApiVariant } from './types';

const PRODUCTS_LIST_PATH = process.env.NEXT_PUBLIC_PRODUCTS_LIST_PATH;
const PRODUCT_DETAIL_PATH = process.env.NEXT_PUBLIC_PRODUCT_DETAIL_PATH;
const PRODUCT_VARIANT_PATH = process.env.NEXT_PUBLIC_PRODUCT_VARIANT_PATH;

export async function fetchProducts(): Promise<ApiProduct[]> {
  if (!PRODUCTS_LIST_PATH) {
    throw new Error('NEXT_PUBLIC_PRODUCTS_LIST_PATH chưa được cấu hình trong .env');
  }
  return apiFetch<ApiProduct[]>(PRODUCTS_LIST_PATH);
}

export async function fetchProductById(id: string | number): Promise<ApiProduct | null> {
  if (!PRODUCT_DETAIL_PATH) {
    throw new Error('NEXT_PUBLIC_PRODUCT_DETAIL_PATH chưa được cấu hình trong .env');
  }
  const product = await apiFetch<ApiProduct | null>(`${PRODUCT_DETAIL_PATH}/${id}`);
  return product;
}

export async function fetchVariantById(variantId: number): Promise<ApiVariant> {
  if (!PRODUCT_VARIANT_PATH) {
    throw new Error('NEXT_PUBLIC_PRODUCT_VARIANT_PATH chưa được cấu hình trong .env');
  }
  return apiFetch<ApiVariant>(`${PRODUCT_VARIANT_PATH}/${variantId}`);
}
