'use client';

import { useEffect, useState } from 'react';
import { Menu, ShoppingBag, ArrowLeft, User } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { clearToken, fetchCurrentUser, getStoredToken } from '../lib/auth-client';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
}

const navLinks = [
  { label: 'Trang chủ', path: '/' },
  { label: 'Sản phẩm', path: '/product' },
  { label: 'Đơn hàng', path: '/orders' },
  { label: 'Hồ sơ', path: '/profile' },
];

export default function Header({ title, showBack }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [showAuthSelect, setShowAuthSelect] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const validateAuth = async () => {
      const token = getStoredToken();
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        await fetchCurrentUser(token);
        setIsAuthenticated(true);
      } catch {
        clearToken();
        setIsAuthenticated(false);
      }
    };

    void validateAuth();
  }, [pathname]);

  const handleAuthAction = (action: 'login' | 'orders' | 'profile' | 'logout') => {
    if (action === 'login') {
      router.push('/login');
    }

    if (action === 'orders') {
      router.push('/orders');
    }

    if (action === 'profile') {
      router.push('/profile');
    }

    if (action === 'logout') {
      clearToken();
      setIsAuthenticated(false);
      router.push('/');
    }

    setShowAuthSelect(false);
  };

  return (
    <>
      {/* ── 1. THANH HEADER CỐ ĐỊNH ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-zinc-200 shadow-sm h-16">
        <div className="h-full max-w-7xl mx-auto px-5 md:px-8 lg:px-12 flex items-center relative">

        {/* ── MOBILE LEFT ── */}
        <div className="flex md:hidden items-center gap-3 shrink-0">
          {showBack ? (
            <button
              onClick={() => router.back()}
              className="text-on-surface hover:opacity-80 active:scale-95 transition-all duration-200"
            >
              <ArrowLeft size={24} />
            </button>
          ) : (
            <button
              onClick={() => setShowAuthSelect((prev) => !prev)}
              className="text-on-surface active:scale-95 transition-transform duration-200"
            >
              <Menu size={24} />
            </button>
          )}
          {title && (
            <h1 className="font-tech text-sm font-semibold tracking-tight uppercase text-on-surface truncate max-w-45">
              {title}
            </h1>
          )}
        </div>

        {/* ── MOBILE CENTER LOGO ── */}
        {!title && (
          <div
            onClick={() => router.push('/')}
            className="md:hidden absolute left-1/2 -translate-x-1/2 font-display text-4xl tracking-[0.2em] text-on-surface uppercase drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] cursor-pointer select-none"
          >
            VAULT
          </div>
        )}

        {/* ── DESKTOP LEFT: logo (+ back + title) ── */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {showBack && (
            <button
              onClick={() => router.back()}
              className="text-on-surface hover:opacity-80 active:scale-95 transition-all duration-200"
            >
              <ArrowLeft size={24} />
            </button>
          )}
          <div
            onClick={() => router.push('/')}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity select-none"
          >
            <img src="/images/logo.png" alt="VAULT" className="w-8 h-8 object-contain" />
            <span className="font-display text-3xl lg:text-[2rem] tracking-[0.2em] text-on-surface uppercase">VAULT</span>
          </div>
          {title && (
            <>
              <span className="text-outline-variant font-tech text-lg mx-1">/</span>
              <h1 className="font-tech text-sm font-semibold tracking-wider uppercase text-on-surface-variant">
                {title}
              </h1>
            </>
          )}
        </div>

        {/* ── DESKTOP CENTER NAV (only on main pages without title) ── */}
        {!title && (
          <nav className="hidden md:flex items-center gap-5 lg:gap-9 absolute left-1/2 -translate-x-1/2">
            {navLinks.map(link => (
              <button
                key={link.path}
                onClick={() => router.push(link.path)}
                className={`font-tech text-[11px] uppercase tracking-widest transition-colors duration-150 ${
                  pathname === link.path
                    ? 'text-secondary font-bold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>
        )}

        {/* ── RIGHT: profile + cart ── */}
        <div className="ml-auto flex items-center gap-3 md:gap-4 relative">
          <button
            onClick={() => setShowAuthSelect((prev) => !prev)}
            className="text-on-surface hover:opacity-80 active:scale-95 transition-all duration-200"
          >
            <User size={22} />
          </button>
          {showAuthSelect && (
            <div
              className="absolute top-10 right-10 z-50 bg-white border border-gray-300 rounded-lg p-2 shadow-md"
              onMouseLeave={() => setShowAuthSelect(false)}
            >
              {!isAuthenticated ? (
                <button
                  onClick={() => handleAuthAction('login')}
                  className="px-4 py-2 text-sm font-medium text-black hover:bg-gray-100 rounded-md whitespace-nowrap"
                >
                  Đăng nhập
                </button>
              ) : (
                <button
                  onClick={() => handleAuthAction('logout')}
                  className="px-4 py-2 text-sm font-medium text-black hover:bg-gray-100 rounded-md whitespace-nowrap"
                >
                  Đăng xuất
                </button>
              )}
            </div>
          )}
          <button
            onClick={() => router.push('/cart')}
            className="text-on-surface relative active:scale-95 transition-transform duration-200"
          >
            <ShoppingBag size={24} />
            {pathname !== '/cart' && pathname !== '/checkout' && (
              <span className="absolute -top-1 -right-1 bg-secondary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                2
              </span>
            )}
          </div>

          {/* MOBILE CENTER LOGO */}
          {!title && (
            <div
              onClick={() => { router.push('/'); setIsOpen(false); }}
              className="md:hidden absolute left-1/2 -translate-x-1/2 font-display text-4xl tracking-[0.2em] text-zinc-900 uppercase cursor-pointer select-none z-10"
            >
              VAULT
            </div>
          )}

          {/* DESKTOP LEFT */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {showBack && (
              <button
                onClick={() => router.back()}
                className="text-zinc-900 hover:opacity-80 active:scale-95 transition-all duration-200"
              >
                <ArrowLeft size={24} />
              </button>
            )}
            <div
              onClick={() => router.push('/')}
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity select-none"
            >
              <img src="/images/logo.png" alt="VAULT" className="w-8 h-8 object-contain" />
              <span className="font-display text-3xl lg:text-[2rem] tracking-[0.2em] text-zinc-900 uppercase">VAULT</span>
            </div>
            {title && (
              <>
                <span className="text-zinc-300 font-tech text-lg mx-1">/</span>
                <h1 className="font-tech text-sm font-semibold tracking-wider uppercase text-zinc-500">
                  {title}
                </h1>
              </>
            )}
          </div>

          {/* DESKTOP CENTER NAV */}
          {!title && (
            <nav className="hidden md:flex items-center gap-5 lg:gap-9 absolute left-1/2 -translate-x-1/2">
              {navLinks.map(link => (
                <button
                  key={link.path}
                  onClick={() => router.push(link.path)}
                  className={`font-tech text-[11px] uppercase tracking-widest transition-colors duration-150 ${
                    pathname === link.path
                      ? 'text-zinc-900 font-bold'
                      : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          )}

          {/* RIGHT: profile + cart */}
          <div className="ml-auto flex items-center gap-3 md:gap-4 z-50">
            <button
              onClick={() => router.push('/profile')}
              className="hidden md:block text-zinc-900 hover:opacity-80 active:scale-95 transition-all duration-200"
            >
              <User size={22} />
            </button>
            <button
              onClick={() => router.push('/cart')}
              className="text-zinc-900 relative active:scale-95 transition-transform duration-200"
            >
              <ShoppingBag size={24} />
              {pathname !== '/cart' && pathname !== '/checkout' && (
                <span className="absolute -top-1 -right-1 bg-zinc-900 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  2
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── 2. MENU MOBILE ĐỘC LẬP (Nằm ngoài Header để không bị lỗi chiều cao) ── */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-white pt-20 pb-6 px-6 flex flex-col justify-between universal-mobile-menu">
          {/* inset-0 ép phủ toàn bộ màn hình 100%, pt-20 để đẩy nội dung xuống dưới thanh header h-16 */}
          
          <nav className="flex flex-col gap-3 w-full">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => {
                    router.push(link.path);
                    setIsOpen(false);
                  }}
                  className={`font-tech text-sm text-left uppercase tracking-widest py-4 px-5 rounded-xl transition-all duration-200 block w-full ${
                    isActive
                      ? 'bg-zinc-900 text-amber-400 font-bold shadow-md' 
                      : 'bg-zinc-50 text-zinc-700 hover:bg-zinc-100 active:bg-zinc-200 border border-zinc-200/80' 
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span>{link.label}</span>
                    <span className={`text-xs ${isActive ? 'text-amber-400' : 'text-zinc-400'}`}>
                      ➔
                    </span>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Chân menu cố định dưới đáy màn hình */}
          <div className="border-t border-zinc-200 pt-4 flex items-center justify-between text-[11px] text-zinc-400">
            <span>© 2026 VAULT STUDIO</span>
            <button 
              onClick={() => { router.push('/profile'); setIsOpen(false); }}
              className="flex items-center gap-1.5 text-zinc-500 font-medium active:text-zinc-900"
            >
              <User size={14} /> Hồ sơ của tôi
            </button>
          </div>
        </div>
      )}
    </>
  );
}