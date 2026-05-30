import { apiFetch } from './api-client';
import type { PromoValidation } from './types';

const VALIDATE_PATH = process.env.NEXT_PUBLIC_PROMOTIONS_VALIDATE_PATH;

export async function validatePromoCode(code: string, subtotal: number): Promise<PromoValidation> {
  if (!VALIDATE_PATH) {
    throw new Error('NEXT_PUBLIC_PROMOTIONS_VALIDATE_PATH chưa được cấu hình trong .env');
  }
  return apiFetch<PromoValidation>(VALIDATE_PATH, {
    method: 'POST',
    auth: true,
    body: JSON.stringify({ code, subtotal }),
  });
}
