'use client';

import { useRouter } from 'next/navigation';
import { Globe, Wifi, Hexagon, ArrowRight } from 'lucide-react';

const footerCols = [
  {
    title: 'Khám phá',
    links: [
      { label: 'Bộ sưu tập', path: '/product/vt-99281' },
      { label: 'Sizing Engine', path: '/review' },
      { label: 'Vault Culture', path: '/profile' },
      { label: 'Lookbook', path: '/' },
    ],
  },
  {
    title: 'Tài khoản',
    links: [
      { label: 'Đăng nhập', path: '/login' },
      { label: 'Hồ sơ', path: '/profile' },
      { label: 'Đơn hàng', path: '/orders' },
      { label: 'CLB Vault', path: '/profile' },
    ],
  },
];

const socialIcons = [
  { Icon: Globe, label: 'Website' },
  { Icon: Wifi, label: 'Social' },
  { Icon: Hexagon, label: 'Token' },
];

export default function Footer() {
  const router = useRouter();

  return (
    <footer className="bg-on-surface text-white pt-20 pb-12 px-5 md:px-10 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-12 mb-16">

          {/* Brand + tagline + social */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h2
              className="font-display text-6xl md:text-7xl tracking-[0.4em] mb-6 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => router.push('/')}
            >
              VAULT
            </h2>
            <p className="font-body text-sm text-surface-dim opacity-60 max-w-60 md:max-w-xs mb-8">
              Hệ sinh thái cho những người tiên phong mới.
            </p>

            {/* Social icons */}
            <div className="flex gap-4">
              {socialIcons.map(({ Icon, label }) => (
                <button
                  key={label}
                  aria-label={label}
                  className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:text-white hover:border-secondary transition-all duration-200"
                >
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </div>

          {/* Nav columns — desktop only */}
          <div className="hidden md:flex items-start gap-16">
            {footerCols.map(col => (
              <div key={col.title}>
                <p className="font-tech text-[10px] tracking-[0.2em] uppercase mb-4 opacity-40">
                  {col.title}
                </p>
                <ul className="space-y-3">
                  {col.links.map(link => (
                    <li key={link.label}>
                      <button
                        onClick={() => router.push(link.path)}
                        className="font-body text-sm opacity-60 hover:opacity-100 transition-opacity text-left"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter */}
          <div className="w-full max-w-xs mx-auto md:mx-0">
            <h4 className="font-tech text-xs mb-4 tracking-[0.2em] uppercase text-center md:text-left">
              Tín Hiệu Vault
            </h4>
            <div className="relative">
              <input
                className="w-full bg-white/5 border-b-2 border-white/20 py-4 px-0 font-tech text-xs text-white focus:outline-none focus:border-secondary transition-colors placeholder:text-white/20"
                placeholder="NHẬP EMAIL CỦA BẠN"
                type="email"
              />
              <button
                className="absolute right-0 bottom-3.5 text-secondary hover:opacity-80 transition-opacity"
                aria-label="Đăng ký nhận tin"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-tech text-surface-dim opacity-40 uppercase">
          <span>© 2026 VAULT ECOSYSTEM</span>
          <div className="hidden md:flex gap-8">
            <span className="cursor-pointer hover:opacity-70 transition-opacity">Chính sách bảo mật</span>
            <span className="cursor-pointer hover:opacity-70 transition-opacity">Điều khoản sử dụng</span>
          </div>
          <span>SÀI GÒN / TOÀN CẦU</span>
        </div>
      </div>
    </footer>
  );
}
