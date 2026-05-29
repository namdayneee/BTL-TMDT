import { apiFetch } from './api-client';
import type { SizingRecommendation } from './types';

const SIZING_RECOMMEND_PATH = process.env.NEXT_PUBLIC_SIZING_RECOMMEND_PATH;

export async function recommendSize(params: {
  height: number;
  weight: number;
  fitPreference?: string;
  productId?: number | string;
}): Promise<SizingRecommendation> {
  if (!SIZING_RECOMMEND_PATH) {
    throw new Error('NEXT_PUBLIC_SIZING_RECOMMEND_PATH chưa được cấu hình trong .env');
  }
  return apiFetch<SizingRecommendation>(SIZING_RECOMMEND_PATH, {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
