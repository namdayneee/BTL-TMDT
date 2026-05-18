'use client';

import Header from '../../components/Header';
import { Truck, Check, MapPin, Package, Copy, MessageCircle, AlertCircle } from 'lucide-react';

export default function OrderDetail() {
  return (
    <div className="min-h-screen bg-background">
      <Header title="Chi tiết đơn hàng" showBack />
      
      <main className="max-w-4xl mx-auto px-5 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-12 flex justify-between items-end mb-4 px-2">
            <h2 className="font-display text-4xl tracking-widest text-on-surface">#VT-99281</h2>
            <div className="glass-card px-4 py-1.5 rounded-full flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              <span className="font-tech text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">ĐANG GIAO</span>
            </div>
          </div>

          <section className="lg:col-span-8 space-y-6">
            {/* Map Visual */}
            <div className="relative h-[400px] rounded-3xl overflow-hidden glass-card group shadow-2xl">
              <img 
                className="w-full h-full object-cover grayscale brightness-110" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHSNROoYJP0GlCJ41xOYipjLQQqWGh_qVZnF8dqFsfLXZv5wEGmAFtosGcJA_NlUrZusAMYN2ifTOm1HDCAhaoRX4WioOIrlHJ_IZE1dODQJ9oiHGP8N35HCrMhyNYg5kRoFSXULAbWj_4RG5NTxwiwTXwDrpOnG0wZg-bHEyljs_lomiXwVjLmntcuK67H-auoqFQ9Z-YnWC0QSF4ChQygTnD0GMyJ-mN4jvtzZnC7aSXgtNmf3RVl7TCeHP16vX63pQtJM0DE39m" 
                alt="Delivery Map"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface/40 via-transparent to-transparent"></div>
              {/* Floating Holographic Sweep */}
              <div className="absolute inset-0 holographic-sweep opacity-30 pointer-events-none"></div>
            </div>

            {/* Tracking Steps */}
            <div className="glass-card p-8 rounded-3xl relative overflow-hidden">
              <div className="relative space-y-10">
                {/* Connecting Line */}
                <div className="absolute left-[13px] top-2 bottom-5 w-[2px] bg-outline-variant/30"></div>
                <div className="absolute left-[13px] top-2 h-[70%] w-[2px] bg-secondary"></div>

                {/* Step: Future */}
                <div className="flex gap-6 relative">
                  <div className="z-10 w-7 h-7 rounded-full bg-surface-container border-2 border-outline-variant flex items-center justify-center"></div>
                  <div className="flex-1 pb-4">
                    <h4 className="font-tech text-sm font-bold text-on-surface-variant opacity-60 uppercase tracking-tight">Dự kiến giao hàng</h4>
                    <p className="font-body text-xs text-on-surface-variant/60">Thứ Năm, 24 Tháng 10</p>
                  </div>
                </div>

                {/* Step: Current */}
                <div className="flex gap-6 relative">
                  <div className="z-10 w-7 h-7 rounded-full bg-secondary flex items-center justify-center shadow-lg shadow-secondary/30">
                    <Truck size={14} className="text-white fill-current" />
                  </div>
                  <div className="flex-1 pb-4">
                    <h4 className="font-tech text-sm font-bold text-secondary uppercase tracking-tight">Đang vận chuyển</h4>
                    <p className="font-body text-sm text-on-surface font-medium">Shipper đang trên đường tới địa chỉ của bạn</p>
                    <p className="font-tech text-[10px] font-bold text-secondary mt-1 uppercase tracking-widest">10:45 AM, 23/10</p>
                  </div>
                </div>

                {/* Step: Past */}
                <div className="flex gap-6 relative">
                  <div className="z-10 w-7 h-7 rounded-full bg-secondary flex items-center justify-center">
                    <Check size={14} className="text-white" />
                  </div>
                  <div className="flex-1 pb-4">
                    <h4 className="font-tech text-sm font-bold text-on-surface uppercase tracking-tight">Rời kho trung chuyển</h4>
                    <p className="font-tech text-[10px] font-bold text-on-surface-variant mt-1 opacity-60 uppercase tracking-widest">08:30 AM, 23/10</p>
                  </div>
                </div>

                {/* Step: Past */}
                <div className="flex gap-6 relative">
                  <div className="z-10 w-7 h-7 rounded-full bg-secondary flex items-center justify-center">
                    <Check size={14} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-tech text-sm font-bold text-on-surface uppercase tracking-tight">Đơn hàng đã xác nhận</h4>
                    <p className="font-tech text-[10px] font-bold text-on-surface-variant mt-1 opacity-60 uppercase tracking-widest">09:15 PM, 22/10</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Sidebar Info */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Product Card */}
            <div className="glass-card overflow-hidden rounded-3xl border border-outline-variant/30">
              <div className="h-64 relative group overflow-hidden">
                <img 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHiDtTb-tTLtCH3MrFLinkKsebAKaJgBDmHJrB7C0lWXsazb7rVFbLSPa80Om9nUjGQGMHsl159ObLa4AaTYX1v8lTnvqCNc8yig5r69lvBpEcSyIume91YMuQi1NDi3SSZVS0ZP_FgEpxuoCw0IpxQeb8Wj38G5-HYdjZRwkgi_u6WEjTyUHaTO5Y7Rtob2ub8FZxUB7JVO1u0p4PnfR8AIajhoTudGJGcZ_e-6TTvAXHhHfEE6pu1l1LHXhMe8PIsyya5buWGtoE" 
                  alt="Product" 
                />
                <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/60 to-transparent">
                  <p className="font-tech text-[9px] text-white/70 uppercase tracking-[0.3em] font-bold">STREETWEAR ARCHIVE</p>
                  <h3 className="font-tech text-md font-bold text-white uppercase mt-1">Neo-Tokyo Tech Shell V1</h3>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-center font-tech text-xs uppercase tracking-widest opacity-70">
                  <span>Size: L</span>
                  <span>Color: Onyx Black</span>
                </div>
                <div className="flex justify-between items-center pt-5 border-t border-outline-variant/20">
                  <span className="font-tech text-xs font-bold uppercase opacity-80">Tổng cộng</span>
                  <span className="font-display text-4xl text-secondary">4.250.000₫</span>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="glass-card p-6 rounded-3xl space-y-4">
              <div className="flex items-center gap-2 text-on-surface-variant">
                <MapPin size={18} className="fill-secondary text-secondary" />
                <h4 className="font-tech text-[10px] font-bold uppercase tracking-widest">Địa chỉ nhận hàng</h4>
              </div>
              <div>
                <p className="font-tech text-sm font-bold uppercase text-on-surface">Nguyễn Văn A</p>
                <p className="font-body text-xs text-on-surface-variant opacity-70 mt-1 leading-relaxed">
                  Số 123, Đường Láng, Phường Láng Thượng,<br/>
                  Quận Đống Đa, Hà Nội, Việt Nam
                </p>
                <p className="font-tech text-[10px] text-secondary mt-3 font-bold uppercase tracking-widest cursor-pointer">(+84) 90 123 4567</p>
              </div>
            </div>

            {/* Carrier */}
            <div className="glass-card p-6 rounded-3xl space-y-4">
              <div className="flex items-center gap-2 text-on-surface-variant">
                <Package size={18} className="fill-secondary text-secondary" />
                <h4 className="font-tech text-[10px] font-bold uppercase tracking-widest">Thông tin vận chuyển</h4>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-tech text-sm font-bold uppercase text-on-surface">VAULT Express Premium</p>
                  <p className="font-tech text-[10px] text-on-surface-variant opacity-60 mt-1 uppercase tracking-widest">Mã vận đơn: <span className="text-secondary select-all">VEX-9921-8812</span></p>
                </div>
                <button className="p-2.5 bg-secondary-container/10 rounded-xl hover:bg-secondary-container/20 transition-colors text-secondary">
                  <Copy size={16} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 pt-4">
              <button className="w-full bg-secondary text-white h-14 rounded-2xl font-tech text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:opacity-95 shadow-xl shadow-secondary/10 transition-all active:scale-95">
                <MessageCircle size={18} />
                Liên hệ hỗ trợ
              </button>
              <button className="w-full border border-outline-variant text-on-surface h-14 rounded-2xl font-tech text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-surface-container transition-all active:scale-95">
                <AlertCircle size={18} />
                Khiếu nại
              </button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
