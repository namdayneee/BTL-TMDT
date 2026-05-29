import { apiFetch } from './api-client';
import type { ApiReview } from './types';

const REVIEWS_PATH = process.env.NEXT_PUBLIC_REVIEWS_PATH;

export type CreateReviewPayload = {
  productId: number;
  rating: number;
  content: string;
  height?: number;
  weight?: number;
  fitFeeling?: string;
  purchasedSize?: string;
};

export async function createReview(payload: CreateReviewPayload): Promise<ApiReview> {
  if (!REVIEWS_PATH) {
    throw new Error('NEXT_PUBLIC_REVIEWS_PATH chưa được cấu hình trong .env');
  }
  return apiFetch<ApiReview>(REVIEWS_PATH, {
    method: 'POST',
    auth: true,
    body: JSON.stringify(payload),
  });
}

export async function fetchProductReviews(productId: number): Promise<ApiReview[]> {
  if (!REVIEWS_PATH) {
    throw new Error('NEXT_PUBLIC_REVIEWS_PATH chưa được cấu hình trong .env');
  }
  return apiFetch<ApiReview[]>(`${REVIEWS_PATH}/${productId}`);
}
