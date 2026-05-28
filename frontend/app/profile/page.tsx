'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import { Rocket, ShieldCheck, Trophy, Ruler } from 'lucide-react';
import {
  clearToken,
  displayNameFromEmail,
  fetchMe,
  getStoredToken,
  roleBadgeLabel,
  type AuthUser,
} from '../lib/auth-client';
import { fetchMyOrders } from '../lib/order-api';
import { fetchVariantById } from '../lib/product-api';
import { getOrderStatusDisplay } from '../lib/order-utils';
import type { ApiOrder } from '../lib/types';

type OrderPreview = {
  id: string;
  name: string;
  img: string;
  statusLabel: string;
  statusBg: string;
  statusText: string;
};

async function buildOrderPreview(order: ApiOrder | undefined): Promise<OrderPreview | null> {
  if (!order) return null;

  const firstItem = order.items[0];
  let name = 'Sản phẩm Vault';
  let img = '/images/products/pro1.png';

  if (firstItem) {
    try {
      const variant = await fetchVariantById(firstItem.variantId);
      name = variant.product.name;
      img = variant.product.thumbnail || img;
    } catch {
      name = `Sản phẩm #${firstItem.variantId}`;
    }
  }

  const statusDisplay = getOrderStatusDisplay(order.status);

  return {
    id: `VT-${order.id}`,
    name,
    img,
    statusLabel: statusDisplay.label,
    statusBg: statusDisplay.statusBg,
    statusText: statusDisplay.statusText,
  };
}

export default function Profile() {
  const router = useRouter();
  const [authState, setAuthState] = useState<'checking' | 'authenticated' | 'unauthenticated'>('checking');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [latestOrder, setLatestOrder] = useState<OrderPreview | null>(null);

  useEffect(() => {
    const validateAccess = async () => {
      const token = getStoredToken();

      if (!token) {
        setAuthState('unauthenticated');
        return;
      }

      try {
        const currentUser = await fetchMe();
        setUser(currentUser);
        setAuthState('authenticated');

        try {
          const orders = await fetchMyOrders();
          const preview = await buildOrderPreview(orders[0]);
          setLatestOrder(preview);
        } catch {
          setLatestOrder(null);
        }
      } catch {
        clearToken();
        setAuthState('unauthenticated');
      }
    };

    void validateAccess();
  }, [router]);

  if (authState === 'checking') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="font-tech text-sm text-on-surface-variant">Đang kiểm tra đăng nhập...</p>
      </div>
    );
  }

  if (authState === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-20 px-5 md:px-8 lg:px-12 max-w-6xl mx-auto flex items-center justify-center">
          <button
            onClick={() => router.push('/login?redirect=/profile')}
            className="chrome-effect px-6 py-3 rounded-xl font-tech text-[10px] font-bold text-on-surface uppercase tracking-widest active:scale-95 transition-all"
          >
            Bạn chưa có tài khoản
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <Header />

      <main className="pt-24 pb-20 px-5 md:px-8 lg:px-12 max-w-6xl mx-auto">

        {/* User Profile — centered header above columns */}
        <section className="flex flex-col items-center text-center mb-10 lg:mb-12">
          <div className="relative group">
            <div className="absolute -inset-1.5 bg-linear-to-r from-secondary via-secondary-fixed-dim to-secondary rounded-full blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
            <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-white/50 bg-surface-container shadow-2xl">
              <img
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmiLKaoeRW1ox6EnnCOTdjN0fFEqtyEEaOr_Va4PBzLbH0IQ_I44F6a7bIAgUfoNdkw6OoVEjqWnfqaNWR0gVkSiZyqC0xeu_nhtA4fdeGgIlMjz1iQg-bzKdPEVSimKK-y4MPIhWPRL0xc3dDJSLsjG08medXE7dj4b5--51ixTEUQkpQAOFRZsWNeXJcUoX09K5hhkPywfxVs-6mmVdfDt3Q4kznmBTt2abiOncwm1NwkZPjjG9uhYKV8Y0O6PihrCiQkjEA_vCI"
                alt="Profile"
              />
            </div>
            <div className="absolute -bottom-1 right-2 bg-secondary text-white rounded-full p-1.5 border-2 border-surface flex items-center justify-center">
              <ShieldCheck size={14} className="fill-current" />
            </div>
          </div>
          <h1 className="mt-6 font-display text-4xl md:text-5xl uppercase tracking-widest text-on-surface">
            {user ? displayNameFromEmail(user.email) : '—'}
          </h1>
          <p className="mt-2 font-body text-sm text-on-surface-variant">{user?.email}</p>
          <div className="mt-2 text-secondary bg-secondary/10 px-4 py-1.5 rounded-full border border-secondary/20 font-tech text-[10px] font-bold uppercase tracking-widest">
            {user ? roleBadgeLabel(user.role) : 'THÀNH VIÊN HẠNG BLACK'}
          </div>
        </section>

        {/* Two-column layout on desktop */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-10 lg:items-start space-y-8 lg:space-y-0">

          {/* ── LEFT COLUMN ── */}
          <div className="space-y-8">

            {/* Exclusive Drops */}
            <section className="relative overflow-hidden rounded-3xl bg-secondary/5 border border-secondary/20 p-8 shadow-sm">
              <div className="absolute top-0 right-0 p-6 opacity-5">
                <Rocket size={80} className="text-secondary" />
              </div>
              <div className="relative z-10">
                <p className="font-tech text-[10px] text-secondary uppercase mb-2 tracking-[0.3em] font-bold">Truy Cập Độc Quyền</p>
                <h3 className="font-tech text-lg font-bold mb-6 tracking-tight text-on-surface">MỞ BÁN SS.24 SAU 02:14:55</h3>
                <button className="w-full py-4 bg-secondary text-white font-tech text-[10px] font-bold uppercase tracking-[0.3em] active:scale-95 transition-all rounded-xl shadow-lg shadow-secondary/20">
                  Thông Báo Cho Tôi
                </button>
              </div>
            </section>

            {/* Tier Progress */}
            <section className="space-y-4">
              <div className="flex justify-between items-end px-2">
                <h2 className="font-tech text-[10px] font-bold uppercase tracking-widest opacity-60">Tiến Trình Thứ Hạng</h2>
                <span className="font-tech text-[10px] font-bold text-secondary uppercase tracking-widest">MỞ KHOÁ ELITE TẠI 5000 XP</span>
              </div>
              <div className="glass-card rounded-3xl p-8 shadow-sm border border-outline-variant/10">
                <div className="flex justify-between mb-10">
                  {['CORE', 'SILVER', 'BLACK', 'ELITE'].map((tier, i) => (
                    <div key={tier} className={`flex flex-col items-center ${i > 2 ? 'opacity-30' : i === 2 ? '' : 'opacity-50'}`}>
                      <span className={`font-tech text-[9px] mb-2 tracking-widest font-bold ${i === 2 ? 'text-secondary' : ''}`}>{tier}</span>
                      <div className={`w-2.5 h-2.5 rounded-full ${i <= 2 ? (i === 2 ? 'bg-secondary ring-4 ring-secondary/20' : 'bg-on-surface') : 'bg-outline-variant'}`}></div>
                    </div>
                  ))}
                </div>
                <div className="relative w-full h-1 bg-on-surface/5 rounded-full overflow-hidden">
                  <div className="absolute top-0 left-0 h-full w-2/3 bg-secondary"></div>
                </div>
                <p className="mt-5 font-body text-xs text-on-surface-variant text-center italic opacity-70">
                  &quot;Chỉ còn 1,250 XP để đạt hạng ELITE.&quot;
                </p>
              </div>
            </section>

            {/* Sizing Profile */}
            <section className="space-y-4">
              <h2 className="font-tech text-[10px] font-bold uppercase tracking-widest opacity-60 px-2">HỒ SƠ KÍCH CỠ VAULT</h2>
              <div className="bg-surface-container-highest/20 rounded-3xl p-8 border border-outline-variant/20 flex flex-col gap-6">
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-secondary shrink-0 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-secondary/20">
                    <Ruler size={24} />
                  </div>
                  <div>
                    <p className="font-tech text-[10px] opacity-60 tracking-[0.2em] font-bold uppercase mb-1">DÁNG PHÙ HỢP NHẤT</p>
                    <p className="font-tech text-md font-bold text-on-surface uppercase mb-2">Oversized</p>
                    <p className="font-body text-[11px] leading-relaxed text-on-surface-variant opacity-70">
                      Dựa trên 50.000+ phản hồi khách hàng. Thuật toán của chúng tôi đề xuất size dựa trên số đo thực tế.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6 border-t border-outline-variant/10 pt-6">
                  <div>
                    <p className="font-tech text-[9px] opacity-50 uppercase tracking-widest font-bold mb-1">Chiều cao</p>
                    <p className="font-tech text-sm font-bold uppercase">180 CM</p>
                  </div>
                  <div>
                    <p className="font-tech text-[9px] opacity-50 uppercase tracking-widest font-bold mb-1">Cân nặng</p>
                    <p className="font-tech text-sm font-bold uppercase">75 KG</p>
                  </div>
                </div>
                <button className="w-full py-3.5 border border-secondary text-secondary font-tech text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-secondary hover:text-white transition-all active:scale-[0.98]">
                  CẬP NHẬT SỐ ĐO & PHẢN HỒI
                </button>
              </div>
            </section>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="space-y-8">

            {/* Wallet */}
            <section className="space-y-4">
              <h2 className="font-tech text-[10px] font-bold uppercase tracking-widest opacity-60 px-2">Số Dư Ví</h2>
              <div className="glass-card rounded-3xl p-10 relative overflow-hidden group">
                <div className="absolute -right-12 -bottom-12 opacity-5 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                  <Trophy size={200} />
                </div>
                <div className="relative z-10 flex flex-col items-center">
                  <span className="font-tech text-[10px] text-on-surface-variant uppercase tracking-widest mb-3 font-bold opacity-60">TỔNG ĐIỂM HIỆN CÓ</span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-7xl chrome-effect tracking-tighter">2,500</span>
                    <span className="font-display text-2xl text-secondary">VP</span>
                  </div>
                  <p className="mt-5 font-body text-[11px] text-on-surface-variant text-center max-w-50 leading-relaxed opacity-70">
                    Đổi điểm lấy các sản phẩm lưu trữ và phụ kiện độc quyền.
                  </p>
                  <button className="mt-8 px-10 py-4 rounded-full bg-secondary text-white font-tech text-[10px] font-bold uppercase tracking-widest hover:shadow-xl shadow-secondary/20 transition-all active:scale-95">
                    Đổi Ngay
                  </button>
                </div>
              </div>
            </section>

            {/* Order History Preview */}
            <section className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <h2 className="font-tech text-[10px] font-bold uppercase tracking-widest opacity-60">Đơn hàng của bạn</h2>
                <button
                  onClick={() => router.push('/orders')}
                  className="font-tech text-[10px] font-bold text-secondary underline tracking-widest"
                >
                  XEM TẤT CẢ
                </button>
              </div>
              <div className="space-y-3">
                {latestOrder ? (
                  <button
                    type="button"
                    onClick={() => router.push(`/order/${latestOrder.id.replace('VT-', '')}`)}
                    className="w-full bg-surface-container-low/50 p-4 rounded-2xl flex justify-between items-center border border-outline-variant/10 hover:border-secondary/30 transition-colors text-left"
                  >
                    <div className="flex gap-4 items-center">
                      <div className="w-12 h-14 bg-surface-container rounded-xl overflow-hidden">
                        <img
                          className="w-full h-full object-cover"
                          src={latestOrder.img}
                          alt={latestOrder.name}
                        />
                      </div>
                      <div>
                        <p className="font-tech text-[10px] font-bold uppercase">{latestOrder.name}</p>
                        <p className="font-tech text-[9px] text-on-surface-variant opacity-60">
                          #{latestOrder.id}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-[8px] font-bold tracking-widest px-2.5 py-1 rounded-full uppercase ${latestOrder.statusBg} ${latestOrder.statusText}`}
                    >
                      {latestOrder.statusLabel}
                    </span>
                  </button>
                ) : (
                  <p className="font-body text-sm text-on-surface-variant text-center py-6 opacity-70">
                    Chưa có đơn hàng nào.
                  </p>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
