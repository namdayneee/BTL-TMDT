'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '../../components/Header';
import DeliveryMapPanel from '../../components/DeliveryMapPanel';
import {
  Truck,
  Check,
  MapPin,
  Package,
  Copy,
  MessageCircle,
  AlertCircle,
  Loader2,
  Star,
} from 'lucide-react';
import { clearToken, fetchCurrentUser, getStoredToken, type AuthUser } from '../../lib/auth-client';
import { fetchOrderById } from '../../lib/order-api';
import { fetchVariantById } from '../../lib/product-api';
import {
  joinOrderRoom,
  joinUserOrdersRoom,
  subscribeOrderStatusUpdates,
} from '../../lib/order-socket';
import {
  buildTrackingSteps,
  formatOrderDate,
  getOrderStatusDisplay,
  getTrackingProgressPercent,
  normalizeOrderStatus,
} from '../../lib/order-utils';
import { formatVND } from '../../lib/utils';
import type { ApiOrder, ApiVariant } from '../../lib/types';

type ProductSummary = {
  name: string;
  img: string;
  size: string;
  lineTotal: number;
};

export default function OrderDetail() {
  const router = useRouter();
  const params = useParams();
  const orderIdParam = params.id as string;

  const [authState, setAuthState] = useState<'checking' | 'authenticated' | 'unauthenticated'>('checking');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [order, setOrder] = useState<ApiOrder | null>(null);
  const [product, setProduct] = useState<ProductSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

  const loadOrder = useCallback(async () => {
    const data = await fetchOrderById(orderIdParam);
    if (!data) {
      setNotFound(true);
      setOrder(null);
      setProduct(null);
      return;
    }

    const normalized: ApiOrder = {
      ...data,
      status: normalizeOrderStatus(data.status),
    };
    setNotFound(false);
    setOrder(normalized);

    const firstItem = normalized.items[0];
    if (!firstItem) {
      setProduct(null);
      return;
    }

    try {
      const variant: ApiVariant = await fetchVariantById(firstItem.variantId);
      setProduct({
        name: variant.product.name,
        img: variant.product.thumbnail || '/images/products/pro1.png',
        size: variant.size,
        lineTotal: firstItem.price * firstItem.quantity,
      });
    } catch {
      setProduct({
        name: `Sản phẩm #${firstItem.variantId}`,
        img: '/images/products/pro1.png',
        size: '—',
        lineTotal: firstItem.price * firstItem.quantity,
      });
    }
  }, [orderIdParam]);

  useEffect(() => {
    const init = async () => {
      const token = getStoredToken();
      if (!token) {
        setAuthState('unauthenticated');
        setLoading(false);
        return;
      }

      try {
        const currentUser = await fetchCurrentUser(token);
        setUser(currentUser);
        setAuthState('authenticated');
        await loadOrder();
      } catch {
        clearToken();
        setAuthState('unauthenticated');
      } finally {
        setLoading(false);
      }
    };

    void init();
  }, [loadOrder]);

  useEffect(() => {
    if (!user || !order) return;

    joinUserOrdersRoom(user.id);
    joinOrderRoom(order.id);

    return subscribeOrderStatusUpdates(({ orderId, status }) => {
      if (orderId !== order.id) return;
      setOrder((prev) =>
        prev ? { ...prev, status: normalizeOrderStatus(status) } : prev
      );
    });
  }, [user, order?.id]);

  const handleCopyTracking = async () => {
    if (!order) return;
    const code = `VEX-${order.id}`;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  if (authState === 'checking' || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin text-secondary" size={32} />
      </div>
    );
  }

  if (authState === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-background">
        <Header title="Chi tiết đơn hàng" />
        <main className="pt-24 pb-16 px-5 flex items-center justify-center">
          <button
            onClick={() => router.push(`/login?redirect=/order/${orderIdParam}`)}
            className="vault-btn-primary px-8 py-3 rounded-full font-tech text-xs uppercase tracking-widest"
          >
            Đăng nhập để xem đơn hàng
          </button>
        </main>
      </div>
    );
  }

  if (notFound || !order) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="Chi tiết đơn hàng" />
        <main className="pt-24 pb-16 px-5 text-center">
          <p className="font-tech text-sm text-on-surface-variant">Không tìm thấy đơn hàng.</p>
          <button
            onClick={() => router.push('/orders')}
            className="mt-6 vault-btn-primary px-8 py-3 rounded-full font-tech text-xs uppercase tracking-widest"
          >
            Về danh sách đơn
          </button>
        </main>
      </div>
    );
  }

  const statusDisplay = getOrderStatusDisplay(order.status);
  const trackingSteps = buildTrackingSteps(order);
  const progressPercent = getTrackingProgressPercent(order.status);
  const trackingCode = `VEX-${order.id}`;
  const firstVariantId = order.items[0]?.variantId;
  const canReview = order.status === 'delivered' && firstVariantId;

  return (
    <div className="min-h-screen bg-background">
      <Header title="Chi tiết đơn hàng" />

      <main className="pt-24 pb-16 px-5 md:px-8 lg:px-12 max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-8 gap-4 flex-wrap">
          <h2 className="font-display text-4xl md:text-5xl tracking-widest text-on-surface">
            #VT-{order.id}
          </h2>
          <div
            className={`glass-card px-4 py-1.5 rounded-full flex items-center gap-2 ${statusDisplay.statusBg}`}
          >
            {order.status === 'shipping' && (
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            )}
            <span
              className={`font-tech text-[10px] font-bold uppercase tracking-[0.2em] ${statusDisplay.statusText}`}
            >
              {statusDisplay.label}
            </span>
          </div>
        </div>

        <p className="font-body text-xs text-on-surface-variant mb-6 -mt-4">
          Đặt ngày {formatOrderDate(order.createdAt)}
          {order.promoCode ? ` · Mã KM: ${order.promoCode}` : ''}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <section className="lg:col-span-8 space-y-6">
            <DeliveryMapPanel
              status={order.status}
              trackingCode={trackingCode}
              recipientName={order.shippingName}
              address={order.shippingAddress}
            />

            <div className="glass-card p-8 rounded-3xl relative overflow-hidden">
              <div className="relative space-y-10">
                <div className="absolute left-3.25 top-2 bottom-5 w-0.5 bg-outline-variant/30" />
                <div
                  className="absolute left-3.25 top-2 w-0.5 bg-secondary transition-all duration-500"
                  style={{ height: `${progressPercent}%`, maxHeight: 'calc(100% - 1.25rem)' }}
                />

                {trackingSteps.map((step) => (
                  <div key={step.id} className="flex gap-6 relative">
                    <div
                      className={`z-10 w-7 h-7 rounded-full flex items-center justify-center ${
                        step.active
                          ? 'bg-secondary shadow-lg shadow-secondary/30'
                          : step.completed
                            ? 'bg-secondary'
                            : 'bg-surface-container border-2 border-outline-variant'
                      }`}
                    >
                      {step.icon === 'truck' ? (
                        <Truck size={14} className="text-white fill-current" />
                      ) : step.completed ? (
                        <Check size={14} className="text-white" />
                      ) : null}
                    </div>
                    <div className="flex-1 pb-4">
                      <h4
                        className={`font-tech text-sm font-bold uppercase tracking-tight ${
                          step.active
                            ? 'text-secondary'
                            : step.completed
                              ? 'text-on-surface'
                              : 'text-on-surface-variant opacity-60'
                        }`}
                      >
                        {step.title}
                      </h4>
                      {step.description && (
                        <p className="font-body text-sm text-on-surface font-medium">{step.description}</p>
                      )}
                      {step.time && (
                        <p className="font-tech text-[10px] font-bold text-on-surface-variant mt-1 opacity-60 uppercase tracking-widest">
                          {step.time}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside className="lg:col-span-4 space-y-6">
            <div className="glass-card overflow-hidden rounded-3xl border border-outline-variant/30">
              <div className="h-56 md:h-64 relative group overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src={product?.img || '/images/products/pro1.png'}
                  alt={product?.name || 'Product'}
                />
                <div className="absolute bottom-0 left-0 right-0 p-5 bg-linear-to-t from-black/60 to-transparent">
                  <p className="font-tech text-[9px] text-white/70 uppercase tracking-[0.3em] font-bold">
                    VAULT ORDER
                  </p>
                  <h3 className="font-tech text-md font-bold text-white uppercase mt-1">
                    {product?.name || 'Sản phẩm Vault'}
                  </h3>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-center font-tech text-xs uppercase tracking-widest opacity-70">
                  <span>Size: {product?.size || '—'}</span>
                  <span>Số lượng: {order.items[0]?.quantity ?? 1}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between font-tech text-xs uppercase tracking-widest opacity-70">
                    <span>Giảm giá</span>
                    <span className="text-emerald-600">-{formatVND(order.discountAmount)}</span>
                  </div>
                )}
                {order.shippingFee > 0 && (
                  <div className="flex justify-between font-tech text-xs uppercase tracking-widest opacity-70">
                    <span>Phí ship</span>
                    <span>{formatVND(order.shippingFee)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-5 border-t border-outline-variant/20">
                  <span className="font-tech text-xs font-bold uppercase opacity-80">Tổng cộng</span>
                  <span className="font-display text-4xl text-secondary">{formatVND(order.totalAmount)}</span>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 rounded-3xl space-y-4">
              <div className="flex items-center gap-2 text-on-surface-variant">
                <MapPin size={18} className="fill-secondary text-secondary" />
                <h4 className="font-tech text-[10px] font-bold uppercase tracking-widest">Địa chỉ nhận hàng</h4>
              </div>
              <div>
                <p className="font-tech text-sm font-bold uppercase text-on-surface">
                  {order.shippingName || '—'}
                </p>
                <p className="font-body text-xs text-on-surface-variant opacity-70 mt-1 leading-relaxed whitespace-pre-line">
                  {order.shippingAddress || 'Chưa có địa chỉ'}
                </p>
                {order.shippingPhone && (
                  <p className="font-tech text-[10px] text-secondary mt-3 font-bold uppercase tracking-widest">
                    {order.shippingPhone}
                  </p>
                )}
              </div>
            </div>

            <div className="glass-card p-6 rounded-3xl space-y-4">
              <div className="flex items-center gap-2 text-on-surface-variant">
                <Package size={18} className="fill-secondary text-secondary" />
                <h4 className="font-tech text-[10px] font-bold uppercase tracking-widest">Thông tin vận chuyển</h4>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-tech text-sm font-bold uppercase text-on-surface">VAULT Express Premium</p>
                  <p className="font-tech text-[10px] text-on-surface-variant opacity-60 mt-1 uppercase tracking-widest">
                    Mã vận đơn:{' '}
                    <span className="text-secondary select-all">{trackingCode}</span>
                  </p>
                  {copied && (
                    <p className="font-tech text-[9px] text-emerald-600 mt-1 uppercase">Đã sao chép</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => void handleCopyTracking()}
                  className="p-2.5 bg-secondary-container/10 rounded-xl hover:bg-secondary-container/20 transition-colors text-secondary"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {canReview && (
                <button
                  type="button"
                  onClick={() =>
                    router.push(`/review?orderId=${order.id}&variantId=${firstVariantId}`)
                  }
                  className="w-full vault-btn-primary h-14 rounded-2xl font-tech text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-95"
                >
                  <Star size={18} />
                  Đánh giá sản phẩm
                </button>
              )}
              <button
                type="button"
                onClick={() => router.push('/orders')}
                className="w-full border border-outline-variant text-on-surface h-14 rounded-2xl font-tech text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-surface-container transition-all active:scale-95"
              >
                <MessageCircle size={18} />
                Về danh sách đơn
              </button>
              <button
                type="button"
                className="w-full border border-outline-variant text-on-surface h-14 rounded-2xl font-tech text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-surface-container transition-all active:scale-95 opacity-60 cursor-not-allowed"
                disabled
              >
                <AlertCircle size={18} />
                Khiếu nại (sắp có)
              </button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
