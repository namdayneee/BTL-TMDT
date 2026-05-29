'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import {
  MapPin, Stars, CreditCard, ArrowRight, ChevronDown,
  ShieldCheck, Truck, Tag,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { checkoutOrder } from '../lib/order-api';
import { getStoredToken } from '../lib/auth-client';
import { formatVND } from '../lib/utils';

const paymentMethods = [
  { id: 'momo', label: 'Ví MoMo', sub: 'Mo', color: 'bg-pink-500' },
  { id: 'vnpay', label: 'VNPAY', sub: 'VN', color: 'bg-blue-600' },
  { id: 'zalopay', label: 'ZaloPay', sub: 'ZP', color: 'bg-sky-500' },
  { id: 'bank', label: 'Chuyển khoản', icon: <CreditCard size={20} />, color: 'bg-slate-600' },
  { id: 'cod', label: 'Tiền mặt (COD)', sub: '₫', color: 'bg-emerald-600' },
];

export default function Checkout() {
  const router = useRouter();
  const { items, subtotal, refreshCart } = useCart();
  const [selectedPayment, setSelectedPayment] = useState('momo');
  const [promoCode, setPromoCode] = useState('');
  const [placing, setPlacing] = useState(false);
  const [cartChecked, setCartChecked] = useState(false);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      router.push('/login?redirect=/checkout');
      return;
    }
    void refreshCart().finally(() => setCartChecked(true));
  }, [router, refreshCart]);

  useEffect(() => {
    if (!cartChecked || placing) return;
    if (items.length === 0 && getStoredToken()) {
      router.push('/cart');
    }
  }, [items.length, cartChecked, placing, router]);

  const shipping = 0;
  const total = subtotal + shipping;

  const handlePlaceOrder = async () => {
    setPlacing(true);
    try {
      const order = await checkoutOrder();
      sessionStorage.setItem('lastOrder', JSON.stringify(order));
      router.replace(`/order-success?orderId=${order.id}`);
      void refreshCart();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Đặt hàng thất bại');
      setPlacing(false);
    }
  };

  if (!getStoredToken()) return null;

  return (
    <div className="min-h-screen bg-background pb-32 lg:pb-16">
      <Header title="THANH TOÁN" />

      <main className="pt-24 px-5 md:px-8 lg:px-12 max-w-7xl mx-auto">

        {/* Step indicator */}
        <div className="flex items-center gap-3 mb-10 font-tech text-[10px] uppercase tracking-widest">
          <button onClick={() => router.push('/cart')} className="text-on-surface-variant hover:text-secondary transition-colors flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full border border-outline-variant flex items-center justify-center text-[9px] font-bold">1</span>
            Giỏ hàng
          </button>
          <div className="flex-1 h-px bg-outline-variant/30 max-w-12" />
          <span className="text-secondary font-bold flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-secondary text-white flex items-center justify-center text-[9px] font-bold">2</span>
            Thanh toán
          </span>
          <div className="flex-1 h-px bg-outline-variant/30 max-w-12" />
          <span className="text-on-surface-variant/40 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full border border-outline-variant/30 flex items-center justify-center text-[9px] font-bold">3</span>
            Xác nhận
          </span>
        </div>

        <div className="lg:grid lg:grid-cols-3 lg:gap-10 lg:items-start">

          {/* ── LEFT: Shipping + Payment ── */}
          <div className="lg:col-span-2 space-y-8">

            {/* Shipping Address */}
            <section className="bg-white rounded-2xl border border-outline-variant/20 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-outline-variant/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-secondary" />
                  <h3 className="font-tech text-xs font-bold uppercase tracking-widest">Địa chỉ giao hàng</h3>
                </div>
                <button className="font-tech text-[10px] text-secondary font-bold hover:underline uppercase">Thay đổi</button>
              </div>
              <div className="px-6 py-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-tech text-sm font-bold text-on-surface uppercase">Nguyễn Văn A · (+84) 90 123 4567</p>
                    <p className="font-body text-sm text-on-surface-variant mt-1 leading-relaxed">
                      Tầng 12, Lotte Center Hà Nội, 54 Liễu Giai,<br />
                      Phường Cống Vị, Quận Ba Đình, Hà Nội.
                    </p>
                  </div>
                  <span className="font-tech text-[9px] font-bold px-2.5 py-1 rounded-full bg-secondary/10 text-secondary border border-secondary/20 uppercase ml-4 shrink-0">Mặc định</span>
                </div>
              </div>
            </section>

            {/* Shipping Method */}
            <section className="bg-white rounded-2xl border border-outline-variant/20 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-outline-variant/10 flex items-center gap-2">
                <Truck size={16} className="text-secondary" />
                <h3 className="font-tech text-xs font-bold uppercase tracking-widest">Phương thức vận chuyển</h3>
              </div>
              <div className="p-4 space-y-3">
                {[
                  { id: 'standard', label: 'VAULT Express Standard', eta: '3-5 ngày', price: 'MIỄN PHÍ', badge: 'MEMBER' },
                  { id: 'express', label: 'VAULT Express Premium', eta: '1-2 ngày', price: '35.000 ₫' },
                ].map((opt, i) => (
                  <label key={opt.id} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${i === 0 ? 'border-secondary bg-secondary/3' : 'border-outline-variant/20 hover:border-secondary/40'}`}>
                    <input type="radio" name="shipping" defaultChecked={i === 0} className="accent-secondary" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-tech text-xs font-bold text-on-surface uppercase">{opt.label}</p>
                        {opt.badge && (
                          <span className="font-tech text-[8px] font-bold px-2 py-0.5 rounded-full bg-secondary text-white uppercase">{opt.badge}</span>
                        )}
                      </div>
                      <p className="font-body text-xs text-on-surface-variant mt-0.5">Dự kiến: {opt.eta}</p>
                    </div>
                    <span className={`font-tech text-xs font-bold ${i === 0 ? 'text-secondary' : 'text-on-surface'}`}>{opt.price}</span>
                  </label>
                ))}
              </div>
            </section>

            {/* Membership Perks */}
            <section className="bg-white rounded-2xl border border-secondary/15 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-outline-variant/10 flex items-center gap-2">
                <Stars size={16} className="text-secondary" />
                <h3 className="font-tech text-xs font-bold uppercase tracking-widest">Ưu đãi thành viên</h3>
              </div>
              <div className="px-6 py-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="chrome-effect w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                    <Stars size={18} className="text-secondary" />
                  </div>
                  <div>
                    <p className="font-tech text-[10px] text-on-surface-variant uppercase tracking-widest mb-0.5">Thành viên Black · 2,500 VP</p>
                    <p className="font-tech text-sm font-bold text-on-surface">Đã dùng 500 điểm = - 50.000 ₫</p>
                  </div>
                </div>
                <button className="font-tech text-[10px] text-secondary hover:underline font-bold uppercase">Đổi thêm</button>
              </div>
            </section>

            {/* Payment Methods */}
            <section className="bg-white rounded-2xl border border-outline-variant/20 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-outline-variant/10 flex items-center gap-2">
                <CreditCard size={16} className="text-secondary" />
                <h3 className="font-tech text-xs font-bold uppercase tracking-widest">Phương thức thanh toán</h3>
              </div>
              <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                {paymentMethods.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPayment(p.id)}
                    className={`p-4 rounded-xl flex flex-col items-center gap-2.5 transition-all border-2 ${selectedPayment === p.id ? 'border-secondary bg-secondary/5 shadow-sm' : 'border-outline-variant/20 hover:border-secondary/40'}`}
                  >
                    <div className={`w-9 h-9 rounded-full ${p.color} flex items-center justify-center text-white`}>
                      {p.icon ?? <span className="font-bold text-[11px]">{p.sub}</span>}
                    </div>
                    <span className={`font-tech text-[10px] font-bold uppercase tracking-widest text-center ${selectedPayment === p.id ? 'text-secondary' : 'text-on-surface-variant'}`}>
                      {p.label}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {/* Promo code */}
            <section className="bg-white rounded-2xl border border-outline-variant/20 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-outline-variant/10 flex items-center gap-2">
                <Tag size={16} className="text-secondary" />
                <h3 className="font-tech text-xs font-bold uppercase tracking-widest">Mã khuyến mãi</h3>
              </div>
              <div className="px-6 py-5 flex gap-3">
                <input
                  value={promoCode}
                  onChange={e => setPromoCode(e.target.value)}
                  placeholder="NHẬP MÃ GIẢM GIÁ"
                  className="flex-1 bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 font-tech text-xs uppercase tracking-widest outline-none focus:border-secondary transition-all placeholder:opacity-30"
                />
                <button className="chrome-effect px-5 py-3 rounded-xl font-tech text-[10px] font-bold uppercase tracking-widest hover:shadow-md transition-all active:scale-95">
                  Áp dụng
                </button>
              </div>
            </section>
          </div>

          {/* ── RIGHT: Order Summary (sticky on desktop) ── */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 space-y-4">

              {/* Items mini list */}
              <div className="bg-white rounded-2xl border border-outline-variant/20 shadow-sm overflow-hidden">
                <button className="w-full px-6 py-4 flex items-center justify-between border-b border-outline-variant/10">
                  <h3 className="font-tech text-xs font-bold uppercase tracking-widest">{items.length} sản phẩm</h3>
                  <ChevronDown size={16} className="text-on-surface-variant" />
                </button>
                <div className="divide-y divide-outline-variant/10">
                  {items.map(item => (
                    <div key={item.id} className="px-6 py-4 flex items-center gap-3">
                      <div className="w-12 h-14 bg-surface-container rounded-xl overflow-hidden shrink-0 relative">
                        <img className="w-full h-full object-cover" src={item.img} alt={item.name} />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-secondary text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-tech text-[11px] font-bold uppercase text-on-surface truncate">{item.name}</p>
                        <p className="font-tech text-[9px] text-on-surface-variant/60 uppercase mt-0.5">{item.size}</p>
                      </div>
                      <p className="font-tech text-xs font-bold text-on-surface shrink-0">{formatVND(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price breakdown */}
              <div className="bg-white rounded-2xl border border-outline-variant/20 shadow-sm p-6 space-y-4">
                <div className="flex justify-between font-tech text-xs">
                  <span className="text-on-surface-variant uppercase tracking-widest">Tạm tính</span>
                  <span className="font-bold">{formatVND(subtotal)}</span>
                </div>
                <div className="flex justify-between font-tech text-xs">
                  <span className="text-on-surface-variant uppercase tracking-widest">Vận chuyển</span>
                  <span className="font-bold text-secondary text-[10px]">MIỄN PHÍ</span>
                </div>
                <div className="pt-4 border-t border-outline-variant/20 flex justify-between items-baseline">
                  <span className="font-display text-2xl uppercase text-on-surface">Tổng cộng</span>
                  <span className="font-display text-2xl text-secondary">{formatVND(total)}</span>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={() => void handlePlaceOrder()}
                disabled={placing || items.length === 0}
                className="w-full h-14 vault-btn-primary rounded-full flex items-center justify-center gap-3 active:scale-[0.98] transition-all holographic-sweep group font-tech text-xs font-bold uppercase tracking-[0.15em] disabled:opacity-50"
              >
                {placing ? 'ĐANG XỬ LÝ...' : `ĐẶT HÀNG · ${formatVND(total)}`}
                <ArrowRight size={17} className="group-hover:translate-x-2 transition-transform" />
              </button>

              <div className="flex items-center justify-center gap-2 opacity-40">
                <ShieldCheck size={14} />
                <span className="font-tech text-[9px] tracking-widest uppercase">Mã hóa SSL 256-bit</span>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Mobile: fixed CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 px-5 pb-6 pt-4 bg-white/95 backdrop-blur-xl border-t border-outline-variant/10 z-50">
        <div className="flex justify-between items-center mb-3 font-tech text-xs">
          <span className="text-on-surface-variant uppercase tracking-widest">Tổng cộng</span>
          <span className="font-bold text-secondary text-base">{formatVND(total)}</span>
        </div>
        <button
          onClick={() => void handlePlaceOrder()}
          disabled={placing || items.length === 0}
          className="w-full h-14 vault-btn-primary rounded-full flex items-center justify-center gap-3 active:scale-[0.98] transition-all group font-tech text-xs font-bold uppercase tracking-[0.15em] disabled:opacity-50"
        >
          {placing ? 'ĐANG XỬ LÝ...' : 'ĐẶT HÀNG NGAY'}
          <ArrowRight size={17} className="group-hover:translate-x-2 transition-transform" />
        </button>
      </div>
    </div>
  );
}
