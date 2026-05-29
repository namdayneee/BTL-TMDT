'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Header from '../components/Header';
import { BadgeCheck, Truck, Trophy } from 'lucide-react';
import { fetchOrderById } from '../lib/order-api';
import type { ApiOrder } from '../lib/types';
import { formatVND } from '../lib/utils';

function OrderSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<ApiOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      const stored = sessionStorage.getItem('lastOrder');
      if (stored) {
        try {
          setOrder(JSON.parse(stored) as ApiOrder);
          setLoading(false);
          return;
        } catch {
          sessionStorage.removeItem('lastOrder');
        }
      }

      const orderId = searchParams.get('orderId');
      if (orderId) {
        try {
          const fetched = await fetchOrderById(orderId);
          if (fetched) {
            setOrder(fetched);
            sessionStorage.setItem('lastOrder', JSON.stringify(fetched));
          }
        } catch {
          setOrder(null);
        }
      }

      setLoading(false);
    };

    void loadOrder();
  }, [searchParams]);

  const orderId = order?.id;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="font-tech text-sm text-on-surface-variant">Đang tải thông tin đơn hàng...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16 px-5 md:px-8 max-w-2xl mx-auto">
        <div className="flex flex-col items-center text-center">
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-secondary/10 rounded-full blur-2xl scale-150" />
              <BadgeCheck
                size={120}
                className="relative text-secondary drop-shadow-[0_0_20px_rgba(0,36,192,0.35)]"
                strokeWidth={1}
              />
            </div>
          </div>

          <h1 className="font-display text-4xl md:text-5xl mb-3 tracking-tight uppercase text-on-surface">
            ĐẶT HÀNG THÀNH CÔNG
          </h1>
          <p className="font-tech text-sm font-bold text-secondary mb-8 max-w-sm">
            Các món đồ của bạn đang được chuẩn bị.
          </p>

          <div className="grid grid-cols-2 gap-3 w-full mb-8">
            <div className="glass-card p-4 rounded-2xl flex flex-col items-start gap-2 text-left">
              <span className="font-tech text-[10px] uppercase tracking-widest text-on-surface-variant opacity-60">
                Mã đơn hàng
              </span>
              <span className="font-tech text-sm font-bold text-on-surface">
                {orderId ? `#VAULT-${orderId}` : '—'}
              </span>
            </div>
            <div className="glass-card p-4 rounded-2xl flex flex-col items-start gap-2 text-left">
              <span className="font-tech text-[10px] uppercase tracking-widest text-on-surface-variant opacity-60">
                Dự kiến giao
              </span>
              <span className="font-tech text-sm font-bold text-on-surface">3-5 NGÀY</span>
            </div>
            <div className="glass-card p-4 rounded-2xl flex flex-col items-start gap-2 text-left">
              <span className="font-tech text-[10px] uppercase tracking-widest text-on-surface-variant opacity-60">
                Tổng thanh toán
              </span>
              <span className="font-tech text-sm font-bold text-on-surface">
                {order ? formatVND(order.totalAmount) : '—'}
              </span>
            </div>
            <div className="glass-card p-4 rounded-2xl flex flex-col items-start gap-2 text-left border-l-4 border-secondary">
              <span className="font-tech text-[10px] uppercase tracking-widest text-on-surface-variant opacity-60">
                Trạng thái
              </span>
              <span className="font-tech text-sm font-bold text-secondary uppercase">
                {order?.status === 'pending' ? 'Chờ xử lý' : order?.status ?? 'Chờ xử lý'}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button
              type="button"
              onClick={() => router.push('/orders')}
              className="flex-1 h-14 bg-secondary text-white font-tech text-xs font-bold tracking-[0.15em] rounded-2xl shadow-lg shadow-secondary/20 hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Truck size={18} />
              THEO DÕI ĐƠN HÀNG
            </button>
            <button
              type="button"
              onClick={() => router.push('/')}
              className="flex-1 h-14 border border-outline-variant/30 text-on-surface font-tech text-xs font-bold tracking-[0.15em] rounded-2xl hover:bg-surface-container-low transition-all active:scale-95"
            >
              TIẾP TỤC MUA SẮM
            </button>
          </div>

          {!order && (
            <p className="mt-6 font-body text-sm text-on-surface-variant">
              Đơn hàng đã được tạo. Xem chi tiết tại trang Đơn hàng.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

export default function OrderSuccess() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <p className="font-tech text-sm text-on-surface-variant">Đang tải...</p>
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}
