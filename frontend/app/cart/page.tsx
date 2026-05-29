'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getStoredToken } from '../lib/auth-client';
import { formatVND } from '../lib/utils';

export default function Cart() {
  const router = useRouter();
  const { items, loading, subtotal, updateQuantity, removeItem, refreshCart } = useCart();
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      router.push('/login?redirect=/cart');
      return;
    }
    setAuthReady(true);
    void refreshCart();
  }, [router, refreshCart]);

  const total = subtotal;

  if (!authReady) {
    return (
      <div className="min-h-screen bg-background pb-40 lg:pb-16">
        <Header title="GIỎ HÀNG" />
        <main className="pt-24 px-5 md:px-8 lg:px-12 max-w-3xl mx-auto">
          <p className="text-center font-tech text-sm text-on-surface-variant py-16">Đang tải...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-40 lg:pb-16">
      <Header title="GIỎ HÀNG" />

      <main className="pt-24 px-5 md:px-8 lg:px-12 max-w-3xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="font-display text-5xl uppercase tracking-tight leading-none text-on-surface">Giỏ hàng</h2>
            <p className="font-tech text-[10px] text-secondary font-bold tracking-widest uppercase mt-1">
              {items.length} SẢN PHẨM
            </p>
          </div>
          <button
            onClick={() => router.push('/product')}
            className="font-tech text-[10px] text-on-surface-variant hover:text-secondary transition-colors uppercase tracking-widest"
          >
            + Tiếp tục mua sắm
          </button>
        </div>

        {loading && (
          <p className="text-center font-tech text-sm text-on-surface-variant py-16">Đang tải giỏ hàng...</p>
        )}

        {!loading && items.length === 0 && (
          <div className="text-center py-20">
            <p className="font-display text-2xl uppercase text-on-surface-variant mb-6">Giỏ hàng trống</p>
            <button
              onClick={() => router.push('/product')}
              className="font-tech text-xs text-secondary uppercase tracking-widest border-b border-secondary"
            >
              Khám phá sản phẩm
            </button>
          </div>
        )}

        <section className="space-y-4 mb-10">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-outline-variant/20 rounded-2xl p-4 flex gap-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-24 h-28 bg-surface-container rounded-xl overflow-hidden shrink-0">
                <img className="w-full h-full object-cover" src={item.img} alt={item.name} />
              </div>
              <div className="flex flex-col justify-between grow py-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-tech text-sm font-bold uppercase text-on-surface">{item.name}</h3>
                    <p className="font-tech text-[10px] text-on-surface-variant uppercase mt-1 opacity-60">
                      SIZE: {item.size}
                    </p>
                  </div>
                  <button
                    onClick={() => void removeItem(item.id)}
                    className="text-on-surface-variant hover:text-tertiary transition-colors p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-tech text-sm font-bold text-on-surface">
                    {formatVND(item.price * item.quantity)}
                  </span>
                  <div className="flex items-center gap-3 bg-surface-container px-3 py-1.5 rounded-full border border-outline-variant/20">
                    <button
                      onClick={() => void updateQuantity(item.id, item.quantity - 1)}
                      className="hover:text-secondary transition-colors"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="font-tech text-xs font-bold w-5 text-center">
                      {String(item.quantity).padStart(2, '0')}
                    </span>
                    <button
                      onClick={() => void updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="hover:text-secondary transition-colors disabled:opacity-40"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>

        {items.length > 0 && (
          <>
            <div className="border-t border-outline-variant/20 mb-8" />

            <section className="mb-10 space-y-4">
              <div className="flex justify-between font-tech text-xs">
                <span className="text-on-surface-variant uppercase tracking-widest">
                  Tạm tính ({items.length} sản phẩm)
                </span>
                <span className="font-bold">{formatVND(subtotal)}</span>
              </div>
              <div className="flex justify-between font-tech text-xs">
                <span className="text-on-surface-variant uppercase tracking-widest">Phí vận chuyển</span>
                <span className="font-bold text-secondary text-[10px]">MIỄN PHÍ</span>
              </div>
              <div className="pt-5 mt-2 border-t border-outline-variant/20 flex justify-between items-baseline">
                <span className="font-display text-3xl uppercase text-on-surface">Tổng cộng</span>
                <span className="font-display text-3xl text-secondary">{formatVND(total)}</span>
              </div>
            </section>

            <div className="hidden lg:block">
              <button
                onClick={() => router.push('/checkout')}
                className="w-full h-16 vault-btn-primary rounded-full flex items-center justify-center gap-4 active:scale-[0.98] transition-all holographic-sweep group font-tech text-xs font-bold uppercase tracking-[0.2em]"
              >
                <ShoppingBag size={18} />
                TIẾN HÀNH THANH TOÁN
                <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </>
        )}
      </main>

      {items.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 px-5 pb-6 pt-4 bg-white/95 backdrop-blur-xl border-t border-outline-variant/10 z-50">
          <div className="flex justify-between items-center mb-3 font-tech text-xs">
            <span className="text-on-surface-variant uppercase tracking-widest">Tổng cộng</span>
            <span className="font-bold text-secondary text-base">{formatVND(total)}</span>
          </div>
          <button
            onClick={() => router.push('/checkout')}
            className="w-full h-14 vault-btn-primary rounded-full flex items-center justify-center gap-3 active:scale-[0.98] transition-all group font-tech text-xs font-bold uppercase tracking-[0.2em]"
          >
            TIẾN HÀNH THANH TOÁN
            <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
}
