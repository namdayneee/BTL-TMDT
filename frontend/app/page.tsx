'use client';

import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import Header from './components/Header';
import { ShoppingCart, Ruler } from 'lucide-react';

const products = [
  {
    id: 'vt-99281',
    name: 'VAULT CORE HOODIE',
    desc: 'Oversized / Xám Heather',
    price: '2.450.000₫',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdjpCtAejqwMxDhMsLXXtQYkJ-uzC5wOl2qtY99po8x7hezcwrTMp1N1uSGCF7X9H_eYklLJKoandiTZpW47G3xpp1g-oFeEZesmpfcK-r07rYv4vhzoSgKz9Pu4N_Fn0T0QXe-q2wHlYyU_c_qxCugapGA55e1qug-yB7-qfnLIbCImI8JI_VH1IOQLIFw94kclaRKohdI43OXfaZ0kiZ-KzzCcH53I-jEx3zdvGTpHzMdW4X5cm7Q1FHhJnpgve-UYcgobkXNeMb',
    badges: ['MỚI', 'THÀNH VIÊN']
  },
  {
    id: 'vt-98422',
    name: 'CHROME SIGNATURE TEE',
    desc: 'Boxy Fit / Trắng Xương',
    price: '1.250.000₫',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhPQmyf7IshNddW1HDbPtW8dEuFZLOpAwLI1x7n6ZP1eMAcUadR_u0TWJ4U1WpNlTCBh1-QeDadPywVrltPq2K-a6hAp9F4_jCsH1haaHFWJjbwXC-h_dk8nDdW8YzJ-kHIqDSeNy1XXiLOwv5TD6j55_OJrXMvphUfCnflQ3bMEEflbErOpUMq0dBl0NlK4TH7Tz-zGhlTLTanyuUhK_dTS8WGcuoGKweW2HM1qKuzxxlmjZwXB9QHFnpu81B2vV_5GtG0gegpQLU',
    badges: ['MỚI']
  }
];

function ProductCard({ p, onClick }: { p: typeof products[0]; onClick: () => void }) {
  return (
    <motion.div
      whileHover={{ scale: 0.98 }}
      onClick={onClick}
      className="cursor-pointer shrink-0 min-w-75 md:min-w-0 snap-center md:snap-align-none"
    >
      <div className="relative aspect-3/4 bg-surface-container-high overflow-hidden rounded-xl group">
        <img
          src={p.img}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          alt={p.name}
        />
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {p.badges.map(b => (
            <span
              key={b}
              className={`${b === 'MỚI' ? 'bg-secondary text-white' : 'glass-card'} text-[10px] font-bold px-3 py-1 rounded-full uppercase`}
            >
              {b}
            </span>
          ))}
        </div>
        <button className="absolute bottom-4 right-4 bg-white/90 p-3 rounded-full shadow-lg active:scale-90 transition-transform">
          <ShoppingCart size={20} className="text-secondary" />
        </button>
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h4 className="font-tech text-base lg:text-lg font-bold text-on-surface uppercase">{p.name}</h4>
          <p className="font-body text-sm text-on-surface-variant">{p.desc}</p>
        </div>
        <p className="font-tech text-sm font-bold text-secondary">{p.price}</p>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative h-screen w-full flex flex-col justify-end pb-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            alt="Hero"
            className="w-full h-full object-cover grayscale-[0.2] object-center"
            src="https://lh3.googleusercontent.com/aida/ADBb0uh4gQhIaenemME7zCTQcW_FuAY6iNcm9KjxyBl_sKPbMhW1Y1mE1PLCWbXmmqpHRG8YcsUMupXKnrdEP6Fi8_sbUQRPVWDbjUc_tNzlJpJ5jTy2e5diSgDaohGfAqC1Zb0OQLWfQYgLwpoTEYr3INvGC9Gzh0I-6JQt4Wnizu8iIKX3T_wK0Y9h3fP4q0Mw-GPP20VZq2fGp5PMEgQjxKwZheSfSbfNl9Fi_aOwN9TdoOCYuk0Is68S2mdq"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 px-5 md:px-10 lg:px-16 max-w-7xl w-full mx-auto"
        >
          <div className="flex flex-wrap gap-2 mb-6">
            {['Cotton 250 GSM', 'Size Thông Minh', 'Số Lượng Có Hạn'].map(tag => (
              <span
                key={tag}
                className="glass-card px-4 py-1.5 rounded-full font-tech text-[10px] text-white uppercase tracking-widest bg-white/20"
              >
                {tag}
              </span>
            ))}
          </div>
          <h2 className="font-display text-[64px] md:text-[88px] lg:text-[110px] xl:text-[128px] leading-[0.9] text-white mb-4 uppercase">
            Định Hình<br />Bản Sắc
          </h2>
          <p className="font-body text-lg text-white/70 max-w-70 md:max-w-md mb-10 leading-snug">
            Thời trang đường phố dành cho những tâm hồn khác biệt. Được thiết kế từ trung tâm của Vault.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/product/vt-99281')}
              className="bg-secondary text-white px-8 py-4 rounded-lg font-tech text-xs uppercase tracking-widest shadow-xl flex-1 md:flex-none md:min-w-45 hover:opacity-90 active:scale-95 transition-all"
            >
              Sắm Ngay
            </button>
            <button
              onClick={() => router.push('/profile')}
              className="bg-white/15 backdrop-blur-md text-white border border-white/30 px-8 py-4 rounded-lg font-tech text-xs uppercase tracking-widest flex-1 md:flex-none md:min-w-45 active:scale-95 transition-all hover:bg-white/25"
            >
              Văn Hóa
            </button>
          </div>
        </motion.div>
      </section>

      {/* New Collection */}
      <section className="py-16 overflow-hidden">
        <div className="px-5 md:px-10 lg:px-16 max-w-7xl mx-auto flex justify-between items-end mb-8">
          <div>
            <h3 className="font-display text-4xl md:text-5xl text-on-surface mb-2 uppercase">BỘ SƯU TẬP MỚI</h3>
            <div className="h-1 w-12 bg-secondary"></div>
          </div>
          <p className="font-tech text-[10px] text-on-surface-variant mb-1 cursor-pointer hover:text-secondary transition-colors">XEM TẤT CẢ (12)</p>
        </div>

        {/* Mobile: horizontal scroll */}
        <div className="md:hidden flex overflow-x-auto gap-5 px-5 pb-8 no-scrollbar snap-x snap-mandatory">
          {products.map(p => (
            <ProductCard key={p.id} p={p} onClick={() => router.push(`/product/${p.id}`)} />
          ))}
        </div>

        {/* Desktop: grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-10 lg:px-16 max-w-7xl mx-auto pb-8">
          {products.map(p => (
            <ProductCard key={p.id} p={p} onClick={() => router.push(`/product/${p.id}`)} />
          ))}
        </div>
      </section>

      {/* Sizing Section */}
      <section className="py-16 px-5 md:px-10 lg:px-16 bg-background">
        <div className="max-w-2xl mx-auto glass-card p-8 md:p-12 rounded-3xl border border-secondary/10 flex flex-col items-center text-center holographic-sweep">
          <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-6">
            <Ruler size={32} className="text-secondary" />
          </div>
          <h3 className="font-display text-4xl md:text-5xl text-on-surface mb-4 uppercase">VAULT SIZING ENGINE 2026</h3>
          <p className="font-body text-sm text-on-surface-variant mb-8 max-w-xs md:max-w-sm">
            Hệ thống gợi ý kích cỡ dựa trên phản hồi thực tế. Thuật toán của chúng tôi so sánh chi tiết thông số để tìm ra độ vừa vặn hoàn hảo nhất.
          </p>
          <div className="w-full max-w-sm aspect-2/1 bg-surface-container rounded-2xl flex items-center justify-center relative overflow-hidden mb-8">
            <div className="absolute inset-0 flex items-center justify-around opacity-20">
              {[1, 2, 3].map(i => <div key={i} className="h-24 w-0.5 bg-secondary"></div>)}
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="font-tech text-[10px] text-secondary uppercase tracking-widest">Đang Phân Tích Thông Số...</span>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce [animation-delay:-0.5s]"></div>
              </div>
            </div>
          </div>
          <button
            onClick={() => router.push('/review')}
            className="chrome-effect w-full max-w-sm py-4 rounded-xl font-tech text-xs text-on-surface uppercase tracking-widest font-bold hover:shadow-lg transition-shadow"
          >
            Tìm Size Của Bạn
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-on-surface text-white pt-20 pb-12 px-5 md:px-10 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-12 md:gap-0">
            {/* Brand */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <h2 className="font-display text-6xl md:text-7xl tracking-[0.4em] mb-6">VAULT</h2>
              <p className="font-body text-sm text-surface-dim opacity-60 max-w-60 md:max-w-xs">
                Hệ sinh thái cho những người tiên phong mới.
              </p>
            </div>

            {/* Links */}
            <div className="hidden md:flex items-start gap-16">
              {[
                { title: 'Khám phá', links: ['Bộ sưu tập', 'Sizing Engine', 'Vault Culture'] },
                { title: 'Tài khoản', links: ['Đăng nhập', 'Hồ sơ', 'Đơn hàng'] },
              ].map(col => (
                <div key={col.title}>
                  <p className="font-tech text-[10px] tracking-[0.2em] uppercase mb-4 opacity-40">{col.title}</p>
                  <ul className="space-y-3">
                    {col.links.map(l => (
                      <li key={l}>
                        <a className="font-body text-sm opacity-60 hover:opacity-100 transition-opacity cursor-pointer">{l}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Newsletter */}
            <div className="w-full max-w-xs mx-auto md:mx-0">
              <h4 className="font-tech text-xs mb-4 tracking-[0.2em] uppercase text-center md:text-left">Tín Hiệu Vault</h4>
              <div className="relative">
                <input
                  className="w-full bg-white/5 border-b-2 border-white/20 py-4 px-0 font-tech text-xs focus:outline-none focus:border-secondary transition-colors placeholder:text-white/20"
                  placeholder="NHẬP EMAIL CỦA BẠN"
                  type="email"
                />
              </div>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-tech text-surface-dim opacity-40 uppercase">
            <span>© 2026 VAULT ECOSYSTEM</span>
            <div className="hidden md:flex gap-8">
              <span>Chính sách bảo mật</span>
              <span>Điều khoản sử dụng</span>
            </div>
            <span>SÀI GÒN / TOÀN CẦU</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
