'use client';

import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag } from 'lucide-react';

const cartItems = [
  {
    id: 1,
    name: 'Vault Core Hoodie',
    price: 1050000,
    specs: 'SIZE: L | MÀU: PHANTOM',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEWc7_cSuhsmCHxCpdpwsyPOrnTcO12k4WWyuKAZGYJ-M7gNDnjtXIPWpLf5jxrxoN17iVhwdYxC2XVo1WwQICa7uWwCzGUFmZrefHPKMynPtsqdZtnzbwj7mM1n8r3GNsgfxp98fh3t-GOOXZQwjWwyoS5iCxSo_LOTsLevrhWV4_Im3mcqFk3YvEUEEDl2MdIAs3Qr4yQeBqGhJB_NEe7ZJ6cb6Y0jr4TKUXFUP9eh8SqeMS2z1MSvJvoO98RlOEyEOSl3slHxNA',
    qty: 1,
  },
  {
    id: 2,
    name: 'Chrome Signature Tee',
    price: 650000,
    specs: 'SIZE: M | MÀU: TRẮNG XƯƠNG',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhPQmyf7IshNddW1HDbPtW8dEuFZLOpAwLI1x7n6ZP1eMAcUadR_u0TWJ4U1WpNlTCBh1-QeDadPywVrltPq2K-a6hAp9F4_jCsH1haaHFWJjbwXC-h_dk8nDdW8YzJ-kHIqDSeNy1XXiLOwv5TD6j55_OJrXMvphUfCnflQ3bMEEflbErOpUMq0dBl0NlK4TH7Tz-zGhlTLTanyuUhK_dTS8WGcuoGKweW2HM1qKuzxxlmjZwXB9QHFnpu81B2vV_5GtG0gegpQLU',
    qty: 2,
  },
];

function formatVND(n: number) {
  return n.toLocaleString('vi-VN') + ' ₫';
}

export default function Cart() {
  const router = useRouter();

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const memberDiscount = 50000;
  const total = subtotal - memberDiscount;

  return (
    <div className="min-h-screen bg-background pb-40 lg:pb-16">
      <Header title="GIỎ HÀNG" />

      <main className="pt-24 px-5 md:px-8 lg:px-12 max-w-3xl mx-auto">

        {/* Title row */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="font-display text-5xl uppercase tracking-tight leading-none text-on-surface">Giỏ hàng</h2>
            <p className="font-tech text-[10px] text-secondary font-bold tracking-widest uppercase mt-1">
              {cartItems.length} SẢN PHẨM
            </p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="font-tech text-[10px] text-on-surface-variant hover:text-secondary transition-colors uppercase tracking-widest"
          >
            + Tiếp tục mua sắm
          </button>
        </div>

        {/* Cart items */}
        <section className="space-y-4 mb-10">
          {cartItems.map((item) => (
            <div key={item.id} className="bg-white border border-outline-variant/20 rounded-2xl p-4 flex gap-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-24 h-28 bg-surface-container rounded-xl overflow-hidden shrink-0">
                <img className="w-full h-full object-cover" src={item.img} alt={item.name} />
              </div>
              <div className="flex flex-col justify-between grow py-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-tech text-sm font-bold uppercase text-on-surface">{item.name}</h3>
                    <p className="font-tech text-[10px] text-on-surface-variant uppercase mt-1 opacity-60">{item.specs}</p>
                  </div>
                  <button className="text-on-surface-variant hover:text-tertiary transition-colors p-1">
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-tech text-sm font-bold text-on-surface">{formatVND(item.price * item.qty)}</span>
                  <div className="flex items-center gap-3 bg-surface-container px-3 py-1.5 rounded-full border border-outline-variant/20">
                    <button className="hover:text-secondary transition-colors"><Minus size={13} /></button>
                    <span className="font-tech text-xs font-bold w-5 text-center">{String(item.qty).padStart(2, '0')}</span>
                    <button className="hover:text-secondary transition-colors"><Plus size={13} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Divider */}
        <div className="border-t border-outline-variant/20 mb-8" />

        {/* Price summary */}
        <section className="mb-10 space-y-4">
          <div className="flex justify-between font-tech text-xs">
            <span className="text-on-surface-variant uppercase tracking-widest">Tạm tính ({cartItems.length} sản phẩm)</span>
            <span className="font-bold">{formatVND(subtotal)}</span>
          </div>
          <div className="flex justify-between font-tech text-xs">
            <span className="text-on-surface-variant uppercase tracking-widest">Giảm giá thành viên</span>
            <span className="font-bold text-secondary">- {formatVND(memberDiscount)}</span>
          </div>
          <div className="flex justify-between font-tech text-xs">
            <span className="text-on-surface-variant uppercase tracking-widest">Phí vận chuyển</span>
            <span className="font-bold text-secondary text-[10px]">MIỄN PHÍ (MEMBER)</span>
          </div>
          <div className="pt-5 mt-2 border-t border-outline-variant/20 flex justify-between items-baseline">
            <span className="font-display text-3xl uppercase text-on-surface">Tổng cộng</span>
            <span className="font-display text-3xl text-secondary">{formatVND(total)}</span>
          </div>
        </section>

        {/* Checkout CTA — visible inside content on desktop */}
        <div className="hidden lg:block">
          <button
            onClick={() => router.push('/checkout')}
            className="w-full h-16 bg-secondary text-white rounded-full flex items-center justify-center gap-4 shadow-xl shadow-secondary/20 active:scale-[0.98] transition-all holographic-sweep group font-tech text-xs font-bold uppercase tracking-[0.2em]"
          >
            <ShoppingBag size={18} />
            TIẾN HÀNH THANH TOÁN
            <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
          </button>
          <p className="text-center font-tech text-[10px] text-on-surface-variant/40 mt-4 uppercase tracking-widest">
            Bảo mật 256-bit · Thanh toán an toàn
          </p>
        </div>
      </main>

      {/* Mobile: fixed CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 px-5 pb-6 pt-4 bg-white/95 backdrop-blur-xl border-t border-outline-variant/10 z-50">
        <div className="flex justify-between items-center mb-3 font-tech text-xs">
          <span className="text-on-surface-variant uppercase tracking-widest">Tổng cộng</span>
          <span className="font-bold text-secondary text-base">{formatVND(total)}</span>
        </div>
        <button
          onClick={() => router.push('/checkout')}
          className="w-full h-14 bg-secondary text-white rounded-full flex items-center justify-center gap-3 shadow-xl shadow-secondary/20 active:scale-[0.98] transition-all group font-tech text-xs font-bold uppercase tracking-[0.2em]"
        >
          TIẾN HÀNH THANH TOÁN
          <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
        </button>
      </div>
    </div>
  );
}
