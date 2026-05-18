'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import { ShoppingCart, CheckCircle, Ruler, Info, QrCode } from 'lucide-react';

export default function ProductDetail() {
  const [size, setSize] = useState('XL');
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background pb-32">
      <Header showBack />

      {/* Gallery Section */}
      <section className="pt-16 relative w-full aspect-[3/4] overflow-hidden bg-surface-container-low">
        <div className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth h-full no-scrollbar">
          <div className="flex-none w-full h-full snap-start relative">
            <img 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxkuxSdrjwJRrbpdPgF1GlZOqmEevAVb3meHHXKtO2SfeNS92IjIuqJTbuBzArqB3Ugurh6YuO2uWpQhyhxl7BsaxgF8KsaSmVnVqAZHX8XB0-P-CAGKfb67Q6MM0-X5zolBqxjJfas1AF0-GNeyogtg-DPcTlWxBN6ltlNFQtgXVXqTkJY_as7v4e80Fn4JPRIJDXBx9MHFCqrhAr_OeMo9_UdCD3cyjIuzOvzZIuTZaR6hq4UESqq1MTSw1lJJirJAW4K-ybdj_S" 
              alt="Product"
            />
          </div>
        </div>
        <div className="absolute top-4 right-4 glass-card px-3 py-1.5 rounded-full flex items-center space-x-2">
          <CheckCircle size={16} className="text-secondary" />
          <span className="font-tech text-[10px] uppercase tracking-widest text-secondary font-bold">Chính hãng</span>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
          <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-outline-variant/30"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-outline-variant/30"></div>
        </div>
      </section>

      {/* Info Section */}
      <section className="px-5 mt-8">
        <div className="flex justify-between items-start mb-4">
          <h1 className="font-display text-4xl leading-none text-on-surface uppercase tracking-tight max-w-[70%]">
            ÁO HOODIE VAULT CORE - COTTON CAO CẤP
          </h1>
          <span className="font-tech text-secondary bg-secondary-fixed-dim/30 px-2 py-1 rounded text-[10px] font-bold uppercase">CÒN HÀNG</span>
        </div>

        <div className="flex items-baseline space-x-3 mb-6">
          <span className="text-on-surface font-display text-3xl">1.250.000 VND</span>
        </div>

        <div className="p-4 glass-card rounded-xl border-secondary/20 bg-secondary/5 flex items-center justify-between mb-8">
          <div>
            <p className="font-tech text-[10px] text-secondary uppercase tracking-[0.2em] mb-1 font-bold">Giá thành viên</p>
            <p className="font-display text-2xl text-secondary">1.050.000 VND</p>
          </div>
          <button className="bg-secondary text-white px-5 py-2.5 rounded-full font-tech text-[10px] uppercase tracking-widest font-bold active:scale-95 transition-all">
            THAM GIA NGAY
          </button>
        </div>

        {/* Configurations */}
        <div className="space-y-8">
          <div>
            <h3 className="font-tech text-[10px] text-on-surface-variant uppercase mb-4 tracking-widest">Màu sắc: Phantom</h3>
            <div className="flex space-x-3">
              {['#2a2a2a', '#0033fe', '#f5f5f1'].map((c, i) => (
                <button key={c} className={`w-8 h-8 rounded-full border-2 ${i === 0 ? 'border-secondary' : 'border-outline-variant'} p-0.5`}>
                  <div className="w-full h-full rounded-full" style={{ backgroundColor: c }}></div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-tech text-[10px] text-on-surface-variant uppercase tracking-widest">Kích cỡ</h3>
              <button className="font-tech text-[10px] text-secondary uppercase font-bold">Bảng size</button>
            </div>
            <div className="flex flex-wrap gap-3">
              {['S', 'M', 'L', 'XL', 'XXL'].map(s => (
                <button 
                  key={s}
                  onClick={() => setSize(s)}
                  className={`min-w-[60px] h-12 border ${size === s ? 'border-2 border-secondary bg-secondary/5 text-secondary font-bold' : 'border-outline-variant'} rounded-xl font-tech text-xs transition-all`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sizing Widget */}
      <section className="px-5 mt-10">
        <div className="glass-card p-6 rounded-3xl relative overflow-hidden">
          <div className="flex items-center space-x-4 mb-6">
            <div className="chrome-effect w-10 h-10 rounded-xl flex items-center justify-center">
              <Ruler className="text-secondary" size={20} />
            </div>
            <div>
              <h3 className="font-tech text-md font-bold text-on-surface uppercase tracking-tight">VAULT SIZING ENGINE 2026</h3>
              <p className="font-body text-[11px] leading-relaxed text-on-surface-variant mt-1">
                Phân tích dữ liệu thực tế từ 50.000+ khách hàng để đề xuất size tối ưu.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="space-y-1.5">
              <label className="font-tech text-[10px] text-on-surface-variant uppercase px-1 tracking-widest">Chiều cao (cm)</label>
              <input 
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 font-tech text-sm outline-none focus:border-secondary transition-all" 
                placeholder="180" 
                type="number"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-tech text-[10px] text-on-surface-variant uppercase px-1 tracking-widest">Cân nặng (kg)</label>
              <input 
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 font-tech text-sm outline-none focus:border-secondary transition-all" 
                placeholder="75" 
                type="number"
              />
            </div>
          </div>

          <div className="bg-secondary p-4 rounded-2xl flex items-center justify-between holographic-sweep shadow-xl shadow-secondary/20">
            <div>
              <p className="font-tech text-[10px] text-white/70 uppercase tracking-widest">Size gợi ý</p>
              <p className="font-display text-3xl text-white tracking-widest">XL</p>
            </div>
            <div className="text-right">
              <p className="font-tech text-[10px] text-white/70 uppercase tracking-widest">Độ chính xác</p>
              <p className="font-tech text-sm font-bold text-white">95%</p>
            </div>
          </div>
        </div>
      </section>

      {/* Fabric Specs */}
      <section className="px-5 mt-12">
        <h3 className="font-display text-2xl uppercase mb-6 flex items-center gap-2">
          Thông số vải <Info size={18} className="text-on-surface-variant" />
        </h3>
        <div className="border-t border-outline-variant/20 pt-8 grid grid-cols-2 gap-x-6 gap-y-8">
          {[
            { l: 'Định lượng vải', v: '450 GSM' },
            { l: 'Chất liệu', v: '100% Cotton' },
            { l: 'Kiểu dáng', v: 'Oversized' },
            { l: 'Chi tiết', v: 'Vai trễ (Dropped Shoulders)' }
          ].map(item => (
            <div key={item.l}>
              <span className="font-tech text-[10px] text-on-surface-variant uppercase mb-1 tracking-widest block">{item.l}</span>
              <span className="font-tech text-sm font-bold text-on-surface uppercase">{item.v}</span>
            </div>
          ))}
        </div>
      </section>

      {/* NFC Authenticity */}
      <section className="px-5 mt-16">
        <div className="p-6 chrome-effect rounded-3xl border border-white/60 flex items-center justify-between shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-white/50 p-2 rounded-xl flex items-center justify-center">
              <QrCode size={32} className="text-on-surface opacity-30" />
            </div>
            <div>
              <h4 className="font-tech font-bold text-sm text-on-surface uppercase tracking-tight">Xác nhận chính hãng</h4>
              <p className="font-tech text-[10px] text-on-surface-variant uppercase tracking-widest">NFC Blockchain Secured</p>
            </div>
          </div>
          <button className="bg-secondary/10 p-3 rounded-full">
            <Info size={20} className="text-secondary" />
          </button>
        </div>
      </section>

      {/* Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-background/80 backdrop-blur-xl z-50">
        <button 
          onClick={() => router.push('/cart')}
          className="w-full h-16 bg-secondary text-white rounded-full flex items-center justify-center space-x-4 shadow-2xl shadow-secondary/30 active:scale-[0.98] transition-all holographic-sweep"
        >
          <ShoppingCart size={20} />
          <span className="font-tech text-xs font-bold uppercase tracking-[0.2em]">THÊM VÀO GIỎ HÀNG — 1.250k</span>
        </button>
      </div>
    </div>
  );
}
