'use client';

import Link from 'next/link';
import { Star } from 'lucide-react';
import type { ApiReview } from '../lib/types';

const FIT_LABELS: Record<string, string> = {
  tight: 'Chật',
  true_to_size: 'Chuẩn size',
  loose: 'Rộng',
  snug: 'Ôm sát',
  regular: 'Vừa vặn',
};

export function getReviewSummary(reviews: ApiReview[]) {
  if (!reviews.length) return null;
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  return { avg, count: reviews.length };
}

function StarRow({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} trên 5 sao`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          className={s <= rating ? 'text-secondary fill-secondary' : 'text-outline-variant/40'}
        />
      ))}
    </div>
  );
}

function formatReviewDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('vi-VN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

export function ProductRatingBadge({
  productId,
  reviews,
}: {
  productId: string;
  reviews: ApiReview[];
}) {
  const summary = getReviewSummary(reviews);
  if (!summary) return null;

  const rounded = Math.round(summary.avg * 10) / 10;

  return (
    <Link
      href={`/product/${productId}/reviews`}
      className="inline-flex items-center gap-2 group"
      aria-label={`${rounded} sao, ${summary.count} đánh giá — xem chi tiết`}
    >
      <StarRow rating={Math.round(summary.avg)} size={18} />
      <span className="font-tech text-sm font-bold text-on-surface group-hover:text-secondary transition-colors">
        {rounded}
      </span>
    </Link>
  );
}

export default function ProductReviewsSection({ reviews }: { reviews: ApiReview[] }) {
  const summary = getReviewSummary(reviews);

  return (
    <section id="product-reviews" className="mb-8 scroll-mt-28">
      <h3 className="font-display text-xl uppercase mb-4 flex items-center gap-2">
        Đánh giá khách hàng
        <Star size={16} className="text-secondary fill-secondary" />
      </h3>

      {!summary ? (
        <div className="glass-card rounded-2xl p-6 text-center border border-outline-variant/10">
          <p className="font-body text-sm text-on-surface-variant">
            Chưa có đánh giá nào. Hãy mua sản phẩm và chia sẻ trải nghiệm sau khi nhận hàng.
          </p>
        </div>
      ) : (
        <>
          <div className="glass-card rounded-2xl p-5 mb-5 border border-outline-variant/10 flex flex-wrap items-center gap-6">
            <div className="text-center min-w-18">
              <p className="font-display text-4xl text-secondary leading-none">
                {Math.round(summary.avg * 10) / 10}
              </p>
              <p className="font-tech text-[9px] text-on-surface-variant uppercase tracking-widest mt-1">
                / 5
              </p>
            </div>
            <div>
              <StarRow rating={Math.round(summary.avg)} size={18} />
              <p className="font-tech text-[10px] text-on-surface-variant uppercase tracking-widest mt-2">
                {summary.count} đánh giá từ khách đã mua
              </p>
            </div>
          </div>

          <ul className="space-y-4">
            {reviews.map((review) => (
              <li
                key={review.id}
                className="glass-card rounded-2xl p-5 border border-outline-variant/10"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <StarRow rating={review.rating} />
                    <p className="font-tech text-[10px] text-on-surface-variant uppercase tracking-widest mt-1.5">
                      Khách Vault · {formatReviewDate(review.createdAt)}
                    </p>
                  </div>
                  {review.purchasedSize && (
                    <span className="font-tech text-[10px] font-bold bg-secondary/10 text-secondary px-3 py-1 rounded-full uppercase tracking-widest">
                      Size đã mua: {review.purchasedSize}
                    </span>
                  )}
                </div>

                {review.content.trim() && (
                  <p className="font-body text-sm text-on-surface leading-relaxed">{review.content}</p>
                )}

                {(review.fitFeeling || review.height || review.weight) && (
                  <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-outline-variant/15">
                    {review.fitFeeling && (
                      <span className="font-tech text-[9px] uppercase tracking-wider text-on-surface-variant bg-surface-container-low px-2.5 py-1 rounded-full">
                        Cảm giác: {FIT_LABELS[review.fitFeeling] ?? review.fitFeeling}
                      </span>
                    )}
                    {review.height != null && review.weight != null && (
                      <span className="font-tech text-[9px] uppercase tracking-wider text-on-surface-variant bg-surface-container-low px-2.5 py-1 rounded-full">
                        {review.height}cm · {review.weight}kg
                      </span>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
