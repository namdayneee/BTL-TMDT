import { apiFetch } from './api-client';
import type { ApiReview } from './types';

const REVIEWS_PATH = process.env.NEXT_PUBLIC_REVIEWS_PATH;

export type ReviewPayload = {
  productId: number;
  orderId?: number;
  rating: number;
  content: string;
  height?: number;
  weight?: number;
  fitFeeling?: string;
  purchasedSize?: string;
};

export type CreateReviewPayload = ReviewPayload;

export type UpdateReviewPayload = Omit<ReviewPayload, 'productId' | 'orderId'>;

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

export async function updateReview(
  reviewId: number,
  payload: UpdateReviewPayload
): Promise<ApiReview> {
  if (!REVIEWS_PATH) {
    throw new Error('NEXT_PUBLIC_REVIEWS_PATH chưa được cấu hình trong .env');
  }
  return apiFetch<ApiReview>(`${REVIEWS_PATH}/${reviewId}`, {
    method: 'PUT',
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

export async function fetchMyReviews(): Promise<ApiReview[]> {
  if (!REVIEWS_PATH) {
    throw new Error('NEXT_PUBLIC_REVIEWS_PATH chưa được cấu hình trong .env');
  }
  return apiFetch<ApiReview[]>(`${REVIEWS_PATH}/my`, { auth: true });
}

export async function fetchReviewByOrder(orderId: number): Promise<ApiReview | null> {
  if (!REVIEWS_PATH) {
    throw new Error('NEXT_PUBLIC_REVIEWS_PATH chưa được cấu hình trong .env');
  }
  try {
    return await apiFetch<ApiReview>(`${REVIEWS_PATH}/order/${orderId}`, { auth: true });
  } catch (err) {
    if (err instanceof Error && err.message.includes('Chưa có đánh giá')) {
      return null;
    }
    throw err;
  }
}
