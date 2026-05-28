'use client';

import Header from '../components/Header';
import { Star, Camera, Plus, X, ArrowRight } from 'lucide-react';

const sliders = [
  { label: 'ĐỘ RỘNG (WIDTH)', current: 'TRUE TO SIZE', opts: ['Chật', 'Chuẩn', 'Rộng'] },
  { label: 'ĐỘ DÀI (LENGTH)', current: 'HƠI NGẮN', opts: ['Ngắn', 'Chuẩn', 'Dài'] },
  { label: 'TAY ÁO (SLEEVES)', current: 'MẶC ĐỊNH', opts: ['Ngắn', 'Chuẩn', 'Rất Dài'] }
];

export default function Review() {
  return (
    <div className="min-h-screen bg-background">
      <Header title="ĐÁNH GIÁ SẢN PHẨM" />

      <main className="pt-24 pb-20 px-5 md:px-8 lg:px-12 max-w-4xl mx-auto">

        {/* Product Brief */}
        <section className="flex gap-6 items-center mb-10">
          <div className="w-28 h-36 md:w-32 md:h-40 bg-surface-container-highest overflow-hidden rounded-2xl border border-outline-variant/20 shrink-0 shadow-sm">
            <img
              alt="Product"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDin2zTulZXy04_L7GcjBQdi-Odn2ndTAp-4WF8QpMZ1ebAeJrNjUr6kSHzRlxJT-GEzLvQpH7Yyj6DPC49Q0zCnQu8swRa40ecFL7NnLHjkvKeb-VjNw5v0VVw5Cby_mCjdtyCXtUBAX9EqeQmq3uyC1Mc-9n1C38UZzXdqDaOgiRwaxzoG9RaqdycGKJqr8bX3irs1MMnJuWYiSUdHlm5hmblRYuypmSj4oKwCrDcsLa_5YtrH5aw0tO6jQiYwXAq1x_GoyRCk8mJ"
            />
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="font-display text-3xl md:text-4xl tracking-tighter uppercase leading-none text-on-surface">NEO-TOKYO TECH SHELL V1</h2>
            <div className="mt-1">
              <span className="font-tech text-[10px] font-bold bg-surface-container px-3 py-1 rounded-full text-on-surface-variant uppercase tracking-widest">SIZE ĐÃ MUA: L</span>
            </div>
          </div>
        </section>

        <div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-start">

          {/* ── LEFT: Rating + Commentary + Photos ── */}
          <div className="space-y-10">

            {/* Rating Stars */}
            <section className="text-center py-10 glass-card rounded-3xl border border-outline-variant/10 shadow-sm">
              <h3 className="font-tech text-[10px] font-bold mb-8 uppercase tracking-[0.4em] text-on-surface-variant opacity-60">TRẢI NGHIỆM CỦA BẠN</h3>
              <div className="flex justify-center gap-5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={36}
                    className={s <= 4 ? 'text-secondary fill-secondary cursor-pointer' : 'text-outline-variant cursor-pointer'}
                  />
                ))}
              </div>
            </section>

            {/* Detailed Commentary */}
            <section className="space-y-4">
              <h3 className="font-tech text-[10px] font-bold uppercase tracking-[0.4em] text-on-surface-variant opacity-60 pl-1">NHẬN XÉT CHI TIẾT</h3>
              <textarea
                className="w-full h-44 bg-surface-container-low border border-outline-variant/20 rounded-2xl p-6 focus:border-secondary transition-all font-body text-sm resize-none outline-none"
                placeholder="Chia sẻ cảm nhận của bạn về chất liệu và form dáng..."
              ></textarea>
            </section>

            {/* Photos */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 px-1 text-on-surface">
                <Camera size={20} className="text-secondary" />
                <h3 className="font-tech text-[10px] font-bold uppercase tracking-widest">ẢNH TRÊN NGƯỜI (FIT PIC)</h3>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                <label className="w-28 h-28 shrink-0 border-2 border-dashed border-outline-variant/40 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-surface-container transition-all group">
                  <Plus size={24} className="text-on-surface-variant opacity-40 group-hover:scale-110 transition-transform" />
                  <span className="font-tech text-[8px] font-bold mt-2 tracking-widest opacity-40">THÊM ẢNH</span>
                  <input className="hidden" type="file" />
                </label>
                <div className="w-28 h-28 shrink-0 rounded-2xl overflow-hidden border border-outline-variant/20 relative group shadow-sm">
                  <img
                    alt="Fit pic"
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCiEtgMy6aGyk9UWGtROAr5wTCF6rHJU-kZSofLBlRVYnVjah1kGBhipQvSNIxH_8ddimfTTMWfvSbuNlLc062WLScgxl-jpG4Ah_YA6_JnrzG6N_rTbNwnxlz06NEAG4hSNQ3jCUQ9_I_kogBzdNrUeX_rylByyBemG3BSXEBWCExedKCUu6-DYBByQ81grX2di764fCS_KV1nl-55nkw5-jirUwb1kMi9Twd5BIycX5gOymartRQn6X5LxDEs5sLOAQ1yro9OPHDW"
                  />
                  <button className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 transition-transform active:scale-90">
                    <X size={12} />
                  </button>
                </div>
              </div>
            </section>
          </div>

          {/* ── RIGHT: Sizing Engine Data ── */}
          <div>
            <section className="space-y-10">
              <div className="border-l-4 border-secondary pl-5 py-1">
                <h3 className="font-display text-3xl md:text-4xl leading-none uppercase text-on-surface">VAULT SIZING ENGINE DATA</h3>
                <p className="font-tech text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.2em] mt-2 opacity-60">GIÚP CỘNG ĐỒNG TÌM SIZE CHUẨN</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="font-tech text-[10px] font-bold uppercase text-on-surface-variant opacity-50 tracking-widest pl-1">BẠN CAO BAO NHIÊU? (CM)</label>
                  <input
                    className="w-full bg-surface-container-low border-b-2 border-outline-variant/30 focus:border-secondary transition-colors px-4 py-4 font-tech text-md outline-none"
                    placeholder="175"
                    type="number"
                  />
                </div>
                <div className="space-y-3">
                  <label className="font-tech text-[10px] font-bold uppercase text-on-surface-variant opacity-50 tracking-widest pl-1">CÂN NẶNG? (KG)</label>
                  <input
                    className="w-full bg-surface-container-low border-b-2 border-outline-variant/30 focus:border-secondary transition-colors px-4 py-4 font-tech text-md outline-none"
                    placeholder="70"
                    type="number"
                  />
                </div>
              </div>

              <div className="space-y-12 pt-4">
                {sliders.map(slider => (
                  <div key={slider.label} className="space-y-5">
                    <div className="flex justify-between items-center">
                      <label className="font-tech text-[11px] font-bold uppercase tracking-widest text-on-surface">{slider.label}</label>
                      <span className="font-tech text-[10px] font-bold text-secondary uppercase tracking-widest">{slider.current}</span>
                    </div>
                    <input
                      type="range"
                      className="w-full h-1.5 bg-outline-variant/30 rounded-full appearance-none cursor-pointer accent-secondary"
                    />
                    <div className="flex justify-between font-tech text-[9px] text-on-surface-variant/50 uppercase tracking-tighter">
                      {slider.opts.map(o => <span key={o}>{o}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Submit — full width */}
        <div className="mt-14 relative overflow-hidden">
          <button className="w-full py-6 chrome-effect rounded-2xl font-display text-4xl text-secondary tracking-widest active:scale-[0.98] transition-all uppercase shadow-xl shadow-secondary/5 group">
            <div className="relative z-10 flex items-center justify-center gap-4">
              GỬI ĐÁNH GIÁ
              <ArrowRight size={28} className="group-hover:translate-x-3 transition-transform" />
            </div>
            <div className="absolute inset-0 holographic-sweep opacity-30"></div>
          </button>
        </div>
        <p className="text-center font-tech text-[9px] text-on-surface-variant/40 mt-10 uppercase tracking-[0.4em]">VAULT VERIFIED FEEDBACK SYSTEM © 2026</p>
      </main>
    </div>
  );
}
