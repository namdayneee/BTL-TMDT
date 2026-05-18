'use client';

import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import { Trash2, MapPin, Stars, CreditCard, ArrowRight, Minus, Plus } from 'lucide-react';

export default function Cart() {
  const router = useRouter();

  const cartItems = [
    {
      id: 1,
      name: 'Vault Core Hoodie',
      price: '1.050.000 VND',
      specs: 'SIZE: L | MÀU: PHANTOM',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEWc7_cSuhsmCHxCpdpwsyPOrnTcO12k4WWyuKAZGYJ-M7gNDnjtXIPWpLf5jxrxoN17iVhwdYxC2XVo1WwQICa7uWwCzGUFmZrefHPKMynPtsqdZtnzbwj7mM1n8r3GNsgfxp98fh3t-GOOXZQwjWwyoS5iCxSo_LOTsLevrhWV4_Im3mcqFk3YvEUEEDl2MdIAs3Qr4yQeBqGhJB_NEe7ZJ6cb6Y0jr4TKUXFUP9eh8SqeMS2z1MSvJvoO98RlOEyEOSl3slHxNA'
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-40">
      <Header title="GIỎ HÀNG CỦA BẠN" showBack />
      
      <main className="pt-24 px-5 max-w-lg mx-auto">
        <section className="mb-10">
          <div className="flex justify-between items-end mb-6">
            <h2 className="font-display text-4xl uppercase tracking-tight leading-none text-on-surface">Giỏ hàng</h2>
            <span className="font-tech text-[10px] text-secondary font-bold tracking-widest uppercase">01 SẢN PHẨM</span>
          </div>

          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="glass-card p-4 rounded-3xl flex gap-5 border border-outline-variant/30">
                <div className="w-24 h-28 bg-surface-container rounded-2xl overflow-hidden flex-shrink-0">
                  <img className="w-full h-full object-cover" src={item.img} alt={item.name} />
                </div>
                <div className="flex flex-col justify-between flex-grow py-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-tech text-md font-bold uppercase text-on-surface">{item.name}</h3>
                      <p className="font-tech text-[10px] text-on-surface-variant uppercase mt-1 opacity-70">{item.specs}</p>
                    </div>
                    <button className="text-on-surface-variant hover:text-tertiary transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-tech text-sm font-bold text-on-surface">{item.price}</span>
                    <div className="flex items-center gap-3 bg-surface-container px-3 py-1.5 rounded-full border border-outline-variant/20">
                      <button><Minus size={14} /></button>
                      <span className="font-tech text-xs font-bold w-4 text-center">01</span>
                      <button><Plus size={14} /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Shipping Address */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <MapPin size={18} className="text-on-surface-variant" />
            <h3 className="font-tech text-[10px] uppercase tracking-widest font-bold">Địa chỉ giao hàng</h3>
          </div>
          <div className="glass-card p-5 rounded-3xl border-l-[6px] border-secondary">
            <div className="flex justify-between items-start mb-2">
              <span className="font-tech text-sm font-bold text-on-surface">Hà Nội, Việt Nam (Mặc định)</span>
              <button className="font-tech text-[10px] text-secondary font-bold hover:underline uppercase">Chỉnh sửa</button>
            </div>
            <p className="font-body text-xs text-on-surface-variant leading-relaxed">
              Tầng 12, Lotte Center Hà Nội, 54 Liễu Giai, Phường Cống Vị, Quận Ba Đình, Hà Nội.
            </p>
          </div>
        </section>

        {/* Membership Perks */}
        <section className="mb-10">
          <div className="glass-card p-5 rounded-3xl border border-secondary/20 bg-gradient-to-br from-surface to-secondary-fixed-dim/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="chrome-effect w-10 h-10 rounded-full flex items-center justify-center">
                  <Stars size={20} className="text-secondary" />
                </div>
                <div>
                  <p className="font-tech text-[10px] text-on-surface-variant uppercase tracking-widest mb-1">Thành viên thân thiết</p>
                  <p className="font-tech text-xs font-bold text-on-surface">Đã áp dụng 500 điểm</p>
                </div>
              </div>
              <span className="font-tech text-sm font-bold text-secondary">-50.000 VND</span>
            </div>
          </div>
        </section>

        {/* Payment Methods */}
        <section className="mb-10">
          <h3 className="font-tech text-[10px] uppercase tracking-widest mb-4 font-bold text-on-surface-variant">Phương thức thanh toán</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'apple', label: 'Apple Pay', icon: <CreditCard /> },
              { id: 'momo', label: 'Ví MoMo', sub: 'Momo' },
              { id: 'vnpay', label: 'VNPAY', sub: 'QR' },
              { id: 'bank', label: 'Chuyển khoản', sub: 'ATM' }
            ].map((p, i) => (
              <button key={p.id} className={`glass-card p-5 rounded-2xl flex flex-col items-center gap-3 transition-all active:scale-95 border-2 ${i === 0 ? 'border-secondary bg-secondary/5' : 'border-transparent'}`}>
                {p.icon ? p.icon : <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-[10px] font-bold">{p.sub}</div>}
                <span className={`font-tech text-[10px] uppercase tracking-widest font-bold ${i === 0 ? 'text-secondary' : ''}`}>{p.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Summary */}
        <section className="mb-12 glass-card p-6 rounded-3xl border border-outline-variant/20">
          <h3 className="font-tech text-[10px] uppercase tracking-widest mb-6 pb-4 border-b border-outline-variant/20 font-bold opacity-60">Tóm tắt đơn hàng</h3>
          <div className="space-y-4">
            <div className="flex justify-between font-tech text-xs">
              <span className="text-on-surface-variant uppercase tracking-widest">Tạm tính</span>
              <span className="font-bold">1.100.000 VND</span>
            </div>
            <div className="flex justify-between items-center font-tech text-xs">
              <span className="text-on-surface-variant uppercase tracking-widest">Phí vận chuyển</span>
              <span className="text-secondary font-bold text-[10px]">MIỄN PHÍ (MEMBER)</span>
            </div>
            <div className="flex justify-between font-tech text-xs text-secondary">
              <span className="uppercase tracking-widest">Giảm giá</span>
              <span className="font-bold">-50.000 VND</span>
            </div>
            <div className="pt-6 mt-4 border-t border-outline-variant/30 flex justify-between items-baseline">
              <span className="font-display text-3xl uppercase text-on-surface">Tổng cộng</span>
              <span className="text-2xl font-display text-secondary tracking-tighter font-bold">1.050.000 VND</span>
            </div>
          </div>
        </section>
      </main>

      {/* Checkout Button */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-background via-background to-transparent pt-12 z-50">
        <button 
          onClick={() => router.push('/order-success')}
          className="w-full h-16 bg-secondary text-white rounded-full flex items-center justify-center gap-4 shadow-2xl shadow-secondary/20 active:scale-[0.98] transition-all holographic-sweep group"
        >
          <span className="font-tech text-xs font-bold uppercase tracking-[0.2em]">THANH TOÁN AN TOÀN — 1.050k</span>
          <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
        </button>
      </div>
    </div>
  );
}
