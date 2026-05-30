'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Header from '../../../components/Header';
import ProductReviewsSection from '../../../components/ProductReviewsSection';
import { fetchProductById } from '../../../lib/product-api';
import { fetchProductReviews } from '../../../lib/review-api';
import type { ApiReview } from '../../../lib/types';

export default function ProductReviewsPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [productName, setProductName] = useState('');
  const [reviews, setReviews] = useState<ApiReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [product, productReviews] = await Promise.all([
          fetchProductById(productId),
          fetchProductReviews(Number(productId)),
        ]);
        if (!product) {
          setError('Không tìm thấy sản phẩm');
          return;
        }
        setProductName(product.name);
        setReviews(product.reviews?.length ? product.reviews : productReviews);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Không tải được đánh giá');
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [productId]);

  return (
    <div className="min-h-screen bg-background pb-12">
      <Header />

      <main className="pt-24 max-w-2xl mx-auto px-5 md:px-8">
        <button
          type="button"
          onClick={() => router.push(`/product/${productId}`)}
          className="flex items-center gap-2 font-tech text-[10px] uppercase tracking-widest text-on-surface-variant hover:text-secondary transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Quay lại sản phẩm
        </button>

        {loading ? (
          <p className="font-tech text-sm text-on-surface-variant">Đang tải đánh giá...</p>
        ) : error ? (
          <div className="text-center py-12">
            <p className="font-body text-sm text-on-surface-variant mb-4">{error}</p>
            <button
              type="button"
              onClick={() => router.push(`/product/${productId}`)}
              className="font-tech text-xs text-secondary uppercase tracking-widest border-b border-secondary"
            >
              Về trang sản phẩm
            </button>
          </div>
        ) : (
          <>
            <h1 className="font-display text-2xl md:text-3xl uppercase text-on-surface tracking-tight mb-1">
              Đánh giá
            </h1>
            {productName && (
              <p className="font-tech text-xs text-on-surface-variant uppercase tracking-widest mb-8">
                {productName}
              </p>
            )}
            <ProductReviewsSection reviews={reviews} />
          </>
        )}
      </main>
    </div>
  );
}
