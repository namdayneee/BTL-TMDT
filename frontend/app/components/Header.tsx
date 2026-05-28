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
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/30 shadow-sm h-16">
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
          </button>
        </div>
      </div>
    </header>
  );
}
