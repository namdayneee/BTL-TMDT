'use client';

import { useEffect, useState } from 'react';
import { Menu, ShoppingBag, ArrowLeft, User, X } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { clearToken, fetchCurrentUser, getStoredToken, isAdminRole } from '../lib/auth-client';
import { useCart } from '../context/CartContext';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
}

const baseNavLinks = [
  { label: 'Trang chủ', path: '/' },
  { label: 'Sản phẩm', path: '/product' },
  { label: 'Đơn hàng', path: '/orders' },
  { label: 'Hồ sơ', path: '/profile' },
];

export default function Header({ title, showBack }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { itemCount, refreshCart } = useCart();
  const [showAuthSelect, setShowAuthSelect] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // State quản lý trạng thái đóng/mở menu mobile

  useEffect(() => {
    const validateAuth = async () => {
      const token = getStoredToken();
      if (!token) {
        setIsAuthenticated(false);
        setIsAdmin(false);
        return;
      }

      try {
        const user = await fetchCurrentUser(token);
        setIsAuthenticated(true);
        setIsAdmin(isAdminRole(user.role));
        await refreshCart();
      } catch {
        clearToken();
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    };

    void validateAuth();
  }, [pathname, refreshCart]);

  const navLinks = isAdmin
    ? [...baseNavLinks, { label: 'Admin', path: '/admin' }]
    : baseNavLinks;

  const handleAuthAction = (action: 'login' | 'logout') => {
    if (action === 'login') {
      router.push('/login');
    } else {
      clearToken();
      setIsAuthenticated(false);
      setIsAdmin(false);
      void refreshCart();
      router.push('/');
    }
    setShowAuthSelect(false);
  };

  return (
    <>
      {/* ── 1. THANH HEADER CỐ ĐỊNH (Sử dụng mã màu zinc chuẩn) ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-zinc-200 shadow-sm h-16">
        <div className="h-full max-w-7xl mx-auto px-5 md:px-8 lg:px-12 flex items-center relative">

          {/* ── MOBILE LEFT: Hiển thị đồng thời cả nút quay lại và menu 3 gạch ── */}
          <div className="flex md:hidden items-center gap-2 shrink-0 z-50">
            {showBack && (
              <button
                onClick={() => router.back()}
                className="text-zinc-900 hover:opacity-80 active:scale-95 transition-all duration-200 p-1 mr-1"
              >
                <ArrowLeft size={24} />
              </button>
            )}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-zinc-900 active:scale-95 transition-transform duration-200 p-1"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            {title && (
              <h1 className="font-tech text-sm font-semibold tracking-tight uppercase text-zinc-900 truncate max-w-36 ml-1">
                {title}
              </h1>
            )}
          </div>

          {/* ── MOBILE CENTER LOGO ── */}
          {!title && (
            <div
              onClick={() => { router.push('/'); setIsOpen(false); }}
              className="md:hidden absolute left-1/2 -translate-x-1/2 font-display text-4xl tracking-[0.2em] text-zinc-900 uppercase cursor-pointer select-none z-10"
            >
              VAULT
            </div>
          )}

          {/* ── DESKTOP LEFT: logo (+ back + title) ── */}
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

          {/* ── DESKTOP CENTER NAV ── */}
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

          {/* ── RIGHT: Profile (Đăng nhập/Đăng xuất) + Cart ── */}
          <div className="ml-auto flex items-center gap-3 md:gap-4 z-50">
            <button
              onClick={() => setShowAuthSelect(!showAuthSelect)}
              className="text-zinc-900 hover:opacity-80 active:scale-95 transition-all duration-200"
            >
              <User size={22} />
            </button>
            {showAuthSelect && (
              <div
                className="absolute top-12 right-10 z-50 bg-white border border-zinc-200 rounded-xl p-2 shadow-lg min-w-[120px]"
                onMouseLeave={() => setShowAuthSelect(false)}
              >
                {!isAuthenticated ? (
                  <button
                    onClick={() => handleAuthAction('login')}
                    className="w-full text-left px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 rounded-lg whitespace-nowrap"
                  >
                    Đăng nhập
                  </button>
                ) : (
                  <button
                    onClick={() => handleAuthAction('logout')}
                    className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg whitespace-nowrap"
                  >
                    Đăng xuất
                  </button>
                )}
              </div>
            )}
            <button
              onClick={() => router.push('/cart')}
              className="text-zinc-900 relative active:scale-95 transition-transform duration-200"
            >
              <ShoppingBag size={24} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-zinc-900 text-white text-[10px] min-w-4 h-4 px-0.5 rounded-full flex items-center justify-center font-bold">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ── 2. MENU MOBILE ĐỘC LẬP (Sửa lỗi xuyên thấu, đè chữ hoàn toàn) ── */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-white pt-20 pb-6 px-6 flex flex-col justify-between">
          
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

          {/* Phần chân menu cố định bên dưới cùng */}
          <div className="border-t border-zinc-200 pt-4 flex items-center justify-between text-[11px] text-zinc-400">
            <span>© 2026 VAULT STUDIO</span>
            {!isAuthenticated ? (
              <button 
                onClick={() => { handleAuthAction('login'); setIsOpen(false); }}
                className="text-zinc-600 font-medium active:text-zinc-900"
              >
                Đăng nhập
              </button>
            ) : (
              <button 
                onClick={() => { router.push('/profile'); setIsOpen(false); }}
                className="flex items-center gap-1.5 text-zinc-600 font-medium active:text-zinc-900"
              >
                <User size={14} /> Hồ sơ của tôi
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}