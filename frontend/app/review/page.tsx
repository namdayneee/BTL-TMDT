'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Header from '../components/Header';
import { Star, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { fetchMyOrders, fetchOrderById } from '../lib/order-api';
import { fetchProductById } from '../lib/product-api';
import { fetchVariantById } from '../lib/product-api';
import { fetchMyProfile } from '../lib/profile-api';
import {
  createReview,
  fetchReviewByOrder,
  updateReview,
} from '../lib/review-api';
import { getStoredToken } from '../lib/auth-client';
import { normalizeOrderStatus } from '../lib/order-utils';
import type { ApiOrder, ApiReview } from '../lib/types';

const FIT_FEELING_OPTIONS = [
  { value: 'tight', label: 'Chật', desc: 'Bó hơn mong đợi' },
  { value: 'true_to_size', label: 'Chuẩn size', desc: 'Đúng như kỳ vọng' },
  { value: 'loose', label: 'Rộng', desc: 'Rộng hơn mong đợi' },
];

function ReviewPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderIdParam = searchParams.get('orderId');
  const productIdParam = searchParams.get('productId');
  const variantIdParam = searchParams.get('variantId');

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [fitFeeling, setFitFeeling] = useState('true_to_size');
  const [purchasedSize, setPurchasedSize] = useState('');
  const [resolvedProductId, setResolvedProductId] = useState<number | null>(
    productIdParam ? Number(productIdParam) : null
  );
  const [productName, setProductName] = useState('Sản phẩm Vault');
  const [productImg, setProductImg] = useState('/images/products/pro1.png');
  const [existingReviewId, setExistingReviewId] = useState<number | null>(null);
  const [resolvedOrderId, setResolvedOrderId] = useState<number | null>(
    orderIdParam ? Number(orderIdParam) : null
  );
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [doneMessage, setDoneMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  const applyReviewToForm = (review: ApiReview) => {
    setExistingReviewId(review.id);
    setRating(review.rating);
    setContent(review.content);
    if (review.height != null) setHeight(String(review.height));
    if (review.weight != null) setWeight(String(review.weight));
    if (review.fitFeeling) setFitFeeling(review.fitFeeling);
    if (review.purchasedSize) setPurchasedSize(review.purchasedSize);
  };

  const loadProductContext = useCallback(
    async (variantId: number, order?: ApiOrder | null) => {
      const variant = await fetchVariantById(variantId);
      setProductName(variant.product.name);
      if (variant.product.thumbnail) setProductImg(variant.product.thumbnail);
      setPurchasedSize(variant.size);
      setResolvedProductId(variant.productId);

      if (order && normalizeOrderStatus(order.status) !== 'delivered') {
        throw new Error('Chỉ có thể đánh giá sau khi đơn hàng đã giao thành công');
      }
    },
    []
  );

  const resolveFromDeliveredOrder = useCallback(async (orders: ApiOrder[]) => {
    const delivered = orders.find((o) => normalizeOrderStatus(o.status) === 'delivered');
    if (!delivered?.items[0]) {
      throw new Error('Bạn chưa có đơn hàng đã giao để đánh giá');
    }
    await loadProductContext(delivered.items[0].variantId, delivered);
  }, [loadProductContext]);

  useEffect(() => {
    if (!getStoredToken()) {
      const q = searchParams.toString();
      router.push(q ? `/login?redirect=/review?${q}` : '/login?redirect=/review');
      return;
    }
    setAuthChecked(true);

    const init = async () => {
      setLoading(true);
      setError('');
      try {
        await fetchMyProfile().then((p) => {
          if (p.height) setHeight(String(p.height));
          if (p.weight) setWeight(String(p.weight));
        });

        if (orderIdParam) {
          const orderId = Number(orderIdParam);
          setResolvedOrderId(orderId);
          const order = await fetchOrderById(orderIdParam);
          if (!order) throw new Error('Không tìm thấy đơn hàng');
          if (normalizeOrderStatus(order.status) !== 'delivered') {
            throw new Error('Chỉ có thể đánh giá sau khi đơn hàng đã giao thành công');
          }
          const item = order.items[0];
          if (!item) throw new Error('Đơn hàng không có sản phẩm');
          const vid = variantIdParam ? Number(variantIdParam) : item.variantId;
          await loadProductContext(vid, order);
          const existing = await fetchReviewByOrder(orderId);
          if (existing) applyReviewToForm(existing);
        } else if (variantIdParam) {
          await loadProductContext(Number(variantIdParam));
        } else if (productIdParam) {
          setResolvedProductId(Number(productIdParam));
          const p = await fetchProductById(productIdParam);
          if (p) {
            setProductName(p.name);
            if (p.thumbnail) setProductImg(p.thumbnail);
          }
        } else {
          await resolveFromDeliveredOrder(await fetchMyOrders());
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Không tải được thông tin đánh giá');
      } finally {
        setLoading(false);
      }
    };

    void init();
  }, [
    orderIdParam,
    productIdParam,
    variantIdParam,
    router,
    searchParams,
    loadProductContext,
    resolveFromDeliveredOrder,
  ]);

  const handleSubmit = async () => {
    if (!content.trim()) {
      setError('Vui lòng nhập nội dung đánh giá');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      let productId = resolvedProductId;

      if (!productId && variantIdParam) {
        const v = await fetchVariantById(Number(variantIdParam));
        productId = v.productId;
      }

      if (!productId) throw new Error('Không xác định được sản phẩm');

      const payload = {
        rating,
        content: content.trim(),
        height: height ? Number(height) : undefined,
        weight: weight ? Number(weight) : undefined,
        fitFeeling,
        purchasedSize: purchasedSize || undefined,
      };

      if (existingReviewId) {
        await updateReview(existingReviewId, payload);
        setDoneMessage('Đánh giá của bạn đã được cập nhật.');
      } else {
        await createReview({
          productId,
          orderId: resolvedOrderId ?? undefined,
          ...payload,
        });
        setDoneMessage('Cảm ơn bạn! Đánh giá đã được lưu cho đơn hàng này.');
      }
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gửi đánh giá thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  if (!authChecked) return null;

  if (done) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-5">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-secondary/10 flex items-center justify-center">
            <CheckCircle size={32} className="text-secondary" />
          </div>
          <h2 className="font-display text-3xl uppercase text-on-surface">Cảm ơn bạn!</h2>
          <p className="font-body text-sm text-on-surface-variant">
            {doneMessage || 'Đánh giá của bạn giúp cộng đồng Vault chọn size chính xác hơn.'}
          </p>
          <button
            onClick={() => router.push('/orders')}
            className="mt-4 vault-btn-primary px-8 py-3 rounded-full font-tech text-xs uppercase tracking-widest"
          >
            Xem đơn hàng
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin text-secondary" size={32} />
      </div>
    );
  }

  if (error && !resolvedProductId && !variantIdParam && !productIdParam) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="ĐÁNH GIÁ SẢN PHẨM" />
        <main className="pt-24 pb-20 px-5 text-center max-w-lg mx-auto">
          <p className="font-tech text-sm text-on-surface-variant">{error}</p>
          <button
            onClick={() => router.push('/orders')}
            className="mt-6 vault-btn-primary px-8 py-3 rounded-full font-tech text-xs uppercase tracking-widest"
          >
            Về đơn hàng
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header title={existingReviewId ? 'ĐÁNH GIÁ ĐÃ GỬI' : 'ĐÁNH GIÁ SẢN PHẨM'} />

      <main className="pt-24 pb-20 px-5 md:px-8 lg:px-12 max-w-4xl mx-auto">
        {existingReviewId && (
          <div className="mb-6 p-4 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center gap-3">
            <CheckCircle size={20} className="text-secondary shrink-0" />
            <p className="font-tech text-[10px] text-secondary uppercase tracking-widest">
              Bạn đã đánh giá đơn này — có thể chỉnh sửa và lưu lại bên dưới
            </p>
          </div>
        )}

        <section className="flex gap-6 items-center mb-10">
          <div className="w-28 h-36 md:w-32 md:h-40 bg-surface-container-highest overflow-hidden rounded-2xl border border-outline-variant/20 shrink-0 shadow-sm">
            <img alt="Product" className="w-full h-full object-cover" src={productImg} />
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="font-display text-3xl md:text-4xl tracking-tighter uppercase leading-none text-on-surface">
              {productName}
            </h2>
            {purchasedSize && (
              <div className="mt-1">
                <span className="font-tech text-[10px] font-bold bg-surface-container px-3 py-1 rounded-full text-on-surface-variant uppercase tracking-widest">
                  SIZE ĐÃ MUA: {purchasedSize}
                </span>
              </div>
            )}
          </div>
        </section>

        <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-start">
          <div className="space-y-10">
            <section className="text-center py-10 glass-card rounded-3xl border border-outline-variant/10 shadow-sm">
              <h3 className="font-tech text-[10px] font-bold mb-8 uppercase tracking-[0.4em] text-on-surface-variant opacity-60">
                TRẢI NGHIỆM CỦA BẠN
              </h3>
              <div className="flex justify-center gap-5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onMouseEnter={() => setHoverRating(s)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(s)}
                  >
                    <Star
                      size={36}
                      className={
                        s <= (hoverRating || rating)
                          ? 'text-secondary fill-secondary cursor-pointer'
                          : 'text-outline-variant cursor-pointer'
                      }
                    />
                  </button>
                ))}
              </div>
              <p className="font-tech text-[10px] text-on-surface-variant mt-4 uppercase tracking-widest">
                {rating === 5
                  ? 'Xuất sắc'
                  : rating === 4
                    ? 'Tốt'
                    : rating === 3
                      ? 'Bình thường'
                      : rating === 2
                        ? 'Kém'
                        : 'Rất kém'}
              </p>
            </section>

            <section className="space-y-4">
              <h3 className="font-tech text-[10px] font-bold uppercase tracking-[0.4em] text-on-surface-variant opacity-60 pl-1">
                NHẬN XÉT CHI TIẾT
              </h3>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-44 bg-surface-container-low border border-outline-variant/20 rounded-2xl p-6 focus:border-secondary transition-all font-body text-sm resize-none outline-none"
                placeholder="Chia sẻ cảm nhận của bạn về chất liệu và form dáng..."
              />
            </section>
          </div>

          <div>
            <section className="space-y-8">
              <div className="border-l-4 border-secondary pl-5 py-1">
                <h3 className="font-display text-3xl md:text-4xl leading-none uppercase text-on-surface">
                  VAULT SIZING ENGINE DATA
                </h3>
                <p className="font-tech text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em] mt-2 opacity-60">
                  GIÚP CỘNG ĐỒNG TÌM SIZE CHUẨN
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="font-tech text-[10px] font-bold uppercase text-on-surface-variant opacity-50 tracking-widest">
                    BẠN CAO BAO NHIÊU? (CM)
                  </label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full bg-surface-container-low border-b-2 border-outline-variant/30 focus:border-secondary transition-colors px-4 py-4 font-tech text-md outline-none"
                    placeholder="175"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-tech text-[10px] font-bold uppercase text-on-surface-variant opacity-50 tracking-widest">
                    CÂN NẶNG? (KG)
                  </label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full bg-surface-container-low border-b-2 border-outline-variant/30 focus:border-secondary transition-colors px-4 py-4 font-tech text-md outline-none"
                    placeholder="70"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="font-tech text-[10px] font-bold uppercase text-on-surface-variant opacity-50 tracking-widest">
                  ĐỘ VỪA VẶN THỰC TẾ
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {FIT_FEELING_OPTIONS.map((f) => (
                    <button
                      key={f.value}
                      type="button"
                      onClick={() => setFitFeeling(f.value)}
                      className={`p-3 rounded-xl border-2 transition-all text-center ${
                        fitFeeling === f.value
                          ? 'border-secondary bg-secondary/5'
                          : 'border-outline-variant/20 hover:border-secondary/40'
                      }`}
                    >
                      <p
                        className={`font-tech text-[10px] font-bold uppercase ${
                          fitFeeling === f.value ? 'text-secondary' : 'text-on-surface'
                        }`}
                      >
                        {f.label}
                      </p>
                      <p className="font-body text-[9px] text-on-surface-variant mt-0.5">{f.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-tech text-[10px] font-bold uppercase text-on-surface-variant opacity-50 tracking-widest">
                  SIZE BẠN ĐÃ MUA
                </label>
                <input
                  value={purchasedSize}
                  onChange={(e) => setPurchasedSize(e.target.value.toUpperCase())}
                  className="w-full bg-surface-container-low border-b-2 border-outline-variant/30 focus:border-secondary transition-colors px-4 py-4 font-tech text-md outline-none uppercase"
                  placeholder="M"
                />
              </div>
            </section>
          </div>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="font-tech text-[10px] text-red-600 uppercase tracking-widest">{error}</p>
          </div>
        )}

        <div className="mt-14">
          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={submitting || !resolvedProductId}
            className="w-full py-6 chrome-effect rounded-2xl font-display text-4xl text-secondary tracking-widest active:scale-[0.98] transition-all uppercase shadow-xl shadow-secondary/5 group disabled:opacity-50 flex items-center justify-center gap-4"
          >
            {submitting ? (
              <Loader2 size={28} className="animate-spin" />
            ) : (
              <>
                {existingReviewId ? 'CẬP NHẬT ĐÁNH GIÁ' : 'GỬI ĐÁNH GIÁ'}
                <ArrowRight size={28} className="group-hover:translate-x-3 transition-transform" />
              </>
            )}
          </button>
        </div>
        <p className="text-center font-tech text-[9px] text-on-surface-variant/40 mt-10 uppercase tracking-[0.4em]">
          VAULT VERIFIED FEEDBACK SYSTEM © 2026
        </p>
      </main>
    </div>
  );
}

export default function ReviewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <p className="font-tech text-sm text-on-surface-variant">Đang tải...</p>
        </div>
      }
    >
      <ReviewPageContent />
    </Suspense>
  );
}
