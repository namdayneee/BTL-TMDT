'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import {
  MapPin, CreditCard, ArrowRight, ChevronDown,
  ShieldCheck, Truck, Tag, CheckCircle, AlertCircle,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { checkoutOrder } from '../lib/order-api';
import { validatePromoCode } from '../lib/promotion-api';
import { fetchMyProfile } from '../lib/profile-api';
import { getStoredToken } from '../lib/auth-client';
import { formatVND } from '../lib/utils';
import AddressSelector, { type AddressSelection } from '../components/AddressSelector';

const SHIPPING_FEE = 30000;
const FREE_SHIPPING_THRESHOLD = 500000;

type PaymentMethodOption = {
  id: string;
  label: string;
  sub?: string;
  color: string;
  implemented: boolean;
  icon?: ReactNode;
};

const paymentMethods: PaymentMethodOption[] = [
  { id: 'cod', label: 'Tiền mặt (COD)', sub: '₫', color: 'bg-emerald-600', implemented: true },
  { id: 'momo', label: 'Ví MoMo', sub: 'Mo', color: 'bg-pink-500', implemented: false },
  { id: 'vnpay', label: 'VNPAY', sub: 'VN', color: 'bg-blue-600', implemented: false },
  { id: 'zalopay', label: 'ZaloPay', sub: 'ZP', color: 'bg-sky-500', implemented: false },
  {
    id: 'bank',
    label: 'Chuyển khoản',
    color: 'bg-slate-600',
    implemented: false,
    icon: <CreditCard size={20} />,
  },
];

export default function Checkout() {
  const router = useRouter();
  const { items, subtotal, refreshCart } = useCart();
  const [selectedPayment, setSelectedPayment] = useState('cod');
  const [promoCode, setPromoCode] = useState('');
  const [promoResult, setPromoResult] = useState<{ discountAmount: number; message: string } | null>(null);
  const [promoError, setPromoError] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [cartChecked, setCartChecked] = useState(false);

  // Shipping form
  const [shippingName, setShippingName] = useState('');
  const [shippingPhone, setShippingPhone] = useState('');
  const [addressSelection, setAddressSelection] = useState<AddressSelection>({
    provinceCode: '',
    wardCode: '',
    street: '',
    provinceName: '',
    wardName: '',
    fullAddress: '',
  });
  const [addressError, setAddressError] = useState('');

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      router.push('/login?redirect=/checkout');
      return;
    }
    // Load profile để điền sẵn
    void fetchMyProfile().then((p) => {
      if (p.fullName) setShippingName(p.fullName);
      if (p.phone) setShippingPhone(p.phone);
      if (p.address) {
        setAddressSelection((prev) => ({
          ...prev,
          street: p.address ?? '',
          fullAddress: p.address ?? '',
        }));
      }
    }).catch(() => {});
    void refreshCart().finally(() => setCartChecked(true));
  }, [router, refreshCart]);

  useEffect(() => {
    if (!cartChecked || placing) return;
    if (items.length === 0 && getStoredToken()) {
      router.push('/cart');
    }
  }, [items.length, cartChecked, placing, router]);

  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const discountAmount = promoResult?.discountAmount ?? 0;
  const total = subtotal + shippingFee - discountAmount;

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    setPromoLoading(true);
    setPromoError('');
    setPromoResult(null);
    try {
      const result = await validatePromoCode(promoCode.trim(), subtotal);
      setPromoResult({ discountAmount: result.discountAmount, message: result.message });
    } catch (err) {
      setPromoError(err instanceof Error ? err.message : 'Mã không hợp lệ');
    } finally {
      setPromoLoading(false);
    }
  };

  const validateAddress = (): boolean => {
    if (!shippingName.trim()) {
      setAddressError('Vui lòng nhập họ tên người nhận');
      return false;
    }
    if (!shippingPhone.trim()) {
      setAddressError('Vui lòng nhập số điện thoại');
      return false;
    }
    if (!addressSelection.provinceCode || !addressSelection.wardCode) {
      setAddressError('Vui lòng chọn Tỉnh/Thành phố và Phường/Xã');
      return false;
    }
    if (!addressSelection.street.trim()) {
      setAddressError('Vui lòng nhập số nhà, tên đường');
      return false;
    }
    setAddressError('');
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateAddress()) return;
    setPlacing(true);
    try {
      const order = await checkoutOrder({
        shippingName: shippingName.trim(),
        shippingPhone: shippingPhone.trim(),
        shippingAddress: addressSelection.fullAddress,
        paymentMethod: selectedPayment,
        promoCode: promoResult ? promoCode : undefined,
      });
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

          {/* ── LEFT ── */}
          <div className="lg:col-span-2 space-y-8">

            {/* Shipping Address */}
            <section className="bg-white rounded-2xl border border-outline-variant/20 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-outline-variant/10 flex items-center gap-2">
                <MapPin size={16} className="text-secondary" />
                <h3 className="font-tech text-xs font-bold uppercase tracking-widest">Địa chỉ giao hàng</h3>
              </div>
              <div className="px-6 py-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-tech text-[10px] text-on-surface-variant uppercase tracking-widest block mb-1">Họ và tên</label>
                    <input
                      value={shippingName}
                      onChange={(e) => setShippingName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 font-body text-sm outline-none focus:border-secondary transition-all"
                    />
                  </div>
                  <div>
                    <label className="font-tech text-[10px] text-on-surface-variant uppercase tracking-widest block mb-1">Số điện thoại</label>
                    <input
                      value={shippingPhone}
                      onChange={(e) => setShippingPhone(e.target.value)}
                      placeholder="0901 234 567"
                      className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 font-body text-sm outline-none focus:border-secondary transition-all"
                    />
                  </div>
                </div>
                <AddressSelector
                  value={addressSelection}
                  onChange={(next) => {
                    setAddressSelection(next);
                    if (addressError) setAddressError('');
                  }}
                  disabled={placing}
                />
                {addressError && (
                  <div className="flex items-center gap-2 text-red-500">
                    <AlertCircle size={14} />
                    <span className="font-tech text-[10px] uppercase tracking-widest">{addressError}</span>
                  </div>
                )}
              </div>
            </section>

            {/* Shipping Method */}
            <section className="bg-white rounded-2xl border border-outline-variant/20 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-outline-variant/10 flex items-center gap-2">
                <Truck size={16} className="text-secondary" />
                <h3 className="font-tech text-xs font-bold uppercase tracking-widest">Phương thức vận chuyển</h3>
              </div>
              <div className="px-6 py-5">
                <div className="flex items-center justify-between p-4 rounded-xl border-2 border-secondary bg-secondary/3">
                  <div>
                    <p className="font-tech text-xs font-bold text-on-surface uppercase">VAULT Express Standard</p>
                    <p className="font-body text-xs text-on-surface-variant mt-0.5">Dự kiến: 3-5 ngày làm việc</p>
                  </div>
                  <span className="font-tech text-xs font-bold text-secondary">
                    {shippingFee === 0 ? 'MIỄN PHÍ' : formatVND(shippingFee)}
                  </span>
                </div>
                {subtotal > 0 && subtotal < FREE_SHIPPING_THRESHOLD && (
                  <p className="font-tech text-[10px] text-on-surface-variant mt-3 text-center">
                    Mua thêm <span className="text-secondary font-bold">{formatVND(FREE_SHIPPING_THRESHOLD - subtotal)}</span> để được miễn phí vận chuyển
                  </p>
                )}
              </div>
            </section>

            {/* Payment Methods */}
            <section className="bg-white rounded-2xl border border-outline-variant/20 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-outline-variant/10">
                <div className="flex items-center gap-2">
                  <CreditCard size={16} className="text-secondary" />
                  <h3 className="font-tech text-xs font-bold uppercase tracking-widest">Phương thức thanh toán</h3>
                </div>
                <p className="font-body text-[11px] text-on-surface-variant mt-2 pl-6">
                  Hiện chỉ hỗ trợ <span className="font-medium text-on-surface">COD</span>. Các cổng khác đang ở chế độ demo.
                </p>
              </div>
              <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                {paymentMethods.map((p) => {
                  const isSelected = selectedPayment === p.id;
                  const isMock = !p.implemented;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      disabled={isMock || placing}
                      onClick={() => {
                        if (p.implemented) setSelectedPayment(p.id);
                      }}
                      className={`relative p-4 rounded-xl flex flex-col items-center gap-2.5 transition-all border-2 ${
                        isMock
                          ? 'border-outline-variant/15 opacity-50 cursor-not-allowed'
                          : isSelected
                            ? 'border-secondary bg-secondary/5 shadow-sm'
                            : 'border-outline-variant/20 hover:border-secondary/40'
                      }`}
                    >
                      {isMock && (
                        <span className="absolute top-2 right-2 font-tech text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                          Demo
                        </span>
                      )}
                      {p.implemented && isSelected && (
                        <span className="absolute top-2 right-2 font-tech text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-secondary/15 text-secondary">
                          Mặc định
                        </span>
                      )}
                      <div
                        className={`w-9 h-9 rounded-full ${p.color} flex items-center justify-center text-white ${isMock ? 'grayscale' : ''}`}
                      >
                        {p.icon ?? <span className="font-bold text-[11px]">{p.sub}</span>}
                      </div>
                      <span
                        className={`font-tech text-[10px] font-bold uppercase tracking-widest text-center ${
                          isSelected && !isMock ? 'text-secondary' : 'text-on-surface-variant'
                        }`}
                      >
                        {p.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Promo code */}
            <section className="bg-white rounded-2xl border border-outline-variant/20 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-outline-variant/10 flex items-center gap-2">
                <Tag size={16} className="text-secondary" />
                <h3 className="font-tech text-xs font-bold uppercase tracking-widest">Mã khuyến mãi</h3>
              </div>
              <div className="px-6 py-5 space-y-3">
                <div className="flex gap-3">
                  <input
                    value={promoCode}
                    onChange={(e) => { setPromoCode(e.target.value.toUpperCase()); setPromoResult(null); setPromoError(''); }}
                    placeholder="NHẬP MÃ GIẢM GIÁ"
                    disabled={!!promoResult}
                    className="flex-1 bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 font-tech text-xs uppercase tracking-widest outline-none focus:border-secondary transition-all placeholder:opacity-30 disabled:opacity-50"
                  />
                  {promoResult ? (
                    <button
                      onClick={() => { setPromoResult(null); setPromoCode(''); }}
                      className="px-5 py-3 rounded-xl font-tech text-[10px] font-bold uppercase tracking-widest border border-outline-variant/30 text-on-surface-variant hover:border-red-400 hover:text-red-500 transition-all"
                    >
                      Xóa
                    </button>
                  ) : (
                    <button
                      onClick={() => void handleApplyPromo()}
                      disabled={promoLoading || !promoCode.trim()}
                      className="chrome-effect px-5 py-3 rounded-xl font-tech text-[10px] font-bold uppercase tracking-widest hover:shadow-md transition-all active:scale-95 disabled:opacity-50"
                    >
                      {promoLoading ? '...' : 'Áp dụng'}
                    </button>
                  )}
                </div>
                {promoResult && (
                  <div className="flex items-center gap-2 text-secondary">
                    <CheckCircle size={14} />
                    <span className="font-tech text-[10px] uppercase tracking-widest">{promoResult.message}</span>
                  </div>
                )}
                {promoError && (
                  <div className="flex items-center gap-2 text-red-500">
                    <AlertCircle size={14} />
                    <span className="font-tech text-[10px] uppercase tracking-widest">{promoError}</span>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* ── RIGHT: Order Summary (sticky on desktop) ── */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 space-y-4">

              {/* Items mini list */}
              <div className="bg-white rounded-2xl border border-outline-variant/20 shadow-sm overflow-hidden">
                <div className="w-full px-6 py-4 flex items-center justify-between border-b border-outline-variant/10">
                  <h3 className="font-tech text-xs font-bold uppercase tracking-widest">{items.length} sản phẩm</h3>
                  <ChevronDown size={16} className="text-on-surface-variant" />
                </div>
                <div className="divide-y divide-outline-variant/10">
                  {items.map(item => (
                    <div key={item.id} className="px-6 py-4 flex items-center gap-3">
                      <div className="w-12 h-14 bg-surface-container rounded-xl overflow-hidden shrink-0 relative">
                        <img className="w-full h-full object-cover" src={item.img} alt={item.name} />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-secondary text-white rounded-full text-[9px] font-bold flex items-center justify-center">{item.quantity}</span>
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
                  <span className={`font-bold ${shippingFee === 0 ? 'text-secondary text-[10px]' : ''}`}>
                    {shippingFee === 0 ? 'MIỄN PHÍ' : formatVND(shippingFee)}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between font-tech text-xs">
                    <span className="text-on-surface-variant uppercase tracking-widest">Giảm giá ({promoCode})</span>
                    <span className="font-bold text-secondary">- {formatVND(discountAmount)}</span>
                  </div>
                )}
                <div className="pt-4 border-t border-outline-variant/20 flex justify-between items-baseline">
                  <span className="font-display text-2xl uppercase text-on-surface">Tổng cộng</span>
                  <span className="font-display text-2xl text-secondary">{formatVND(Math.max(total, 0))}</span>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={() => void handlePlaceOrder()}
                disabled={placing || items.length === 0}
                className="w-full h-14 vault-btn-primary rounded-full flex items-center justify-center gap-3 active:scale-[0.98] transition-all holographic-sweep group font-tech text-xs font-bold uppercase tracking-[0.15em] disabled:opacity-50"
              >
                {placing ? 'ĐANG XỬ LÝ...' : `ĐẶT HÀNG · ${formatVND(Math.max(total, 0))}`}
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
          <span className="font-bold text-secondary text-base">{formatVND(Math.max(total, 0))}</span>
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
