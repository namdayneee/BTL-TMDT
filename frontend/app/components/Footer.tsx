'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Globe, Wifi, Hexagon, ArrowRight } from 'lucide-react';

const footerCols = [
  {
    title: 'Khám phá',
    links: [
      { label: 'Bộ sưu tập', path: '/product' },
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
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-on-surface text-white pt-8 pb-5 px-5 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-6">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h2
              className="font-display text-3xl md:text-4xl tracking-[0.25em] mb-2 cursor-pointer hover:opacity-80 transition-opacity bg-linear-to-r from-accent-pink via-accent-yellow to-accent-cyan bg-clip-text text-transparent"
              onClick={() => router.push('/')}
            >
              VAULT
            </h2>
            <p className="font-body text-xs text-surface-dim opacity-60 max-w-52 mb-3">
              Hệ sinh thái cho những người tiên phong mới.
            </p>
            <div className="flex gap-2.5">
              {socialIcons.map(({ Icon, label }) => (
                <button
                  key={label}
                  aria-label={label}
                  className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:text-accent-yellow hover:border-accent-yellow hover:shadow-[0_0_12px_rgba(255,200,0,0.4)] transition-all"
                >
                  <Icon size={14} />
                </button>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-start gap-10">
            {footerCols.map((col) => (
              <div key={col.title}>
                <p className="font-tech text-[9px] tracking-[0.15em] uppercase mb-2 opacity-40">
                  {col.title}
                </p>
                <ul className="space-y-1.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <button
                        onClick={() => router.push(link.path)}
                        className="font-body text-xs opacity-60 hover:opacity-100 transition-opacity text-left"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="w-full max-w-xs mx-auto md:mx-0">
            <h4 className="font-tech text-[10px] mb-2 tracking-[0.15em] uppercase text-center md:text-left opacity-80">
              Tín Hiệu Vault
            </h4>
            <div className="relative">
              <input
                className="w-full bg-white/5 border-b border-white/20 py-2.5 px-0 font-tech text-[10px] text-white focus:outline-none focus:border-accent-cyan transition-colors placeholder:text-white/20"
                placeholder="NHẬP EMAIL"
                type="email"
              />
              <button
                className="absolute right-0 bottom-2 text-accent-cyan hover:text-accent-yellow transition-colors"
                aria-label="Đăng ký nhận tin"
              >
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-2 text-[9px] font-tech text-surface-dim opacity-40 uppercase">
          <span>© 2026 VAULT ECOSYSTEM</span>
          <div className="hidden md:flex gap-6">
            <span className="cursor-pointer hover:opacity-70 transition-opacity">Chính sách bảo mật</span>
            <span className="cursor-pointer hover:opacity-70 transition-opacity">Điều khoản sử dụng</span>
          </div>
          <span>SÀI GÒN / TOÀN CẦU</span>
        </div>
      </div>
    </footer>
  );
}
