'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Ruler,
  Store,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import {
  clearToken,
  displayNameFromEmail,
  fetchMe,
  roleBadgeLabel,
  type AuthUser,
} from '../../lib/auth-client';

const navItems = [
  { href: '/admin', label: 'Tổng quan', icon: LayoutDashboard, exact: true },
  { href: '/admin/orders', label: 'Đơn hàng', icon: ShoppingCart },
  { href: '/admin/products', label: 'Sản phẩm', icon: Package },
  { href: '/admin/sizing', label: 'Sizing', icon: Ruler },
];

const pageTitles: Record<string, string> = {
  '/admin': 'Tổng quan',
  '/admin/orders': 'Đơn hàng',
  '/admin/products': 'Sản phẩm',
  '/admin/sizing': 'Sizing',
};

function userInitials(email: string) {
  const part = email.split('@')[0] || 'A';
  return part.slice(0, 2).toUpperCase();
}

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchMe()
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  const handleLogout = () => {
    clearToken();
    router.push('/login');
  };

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const headerTitle = pageTitles[pathname] ?? 'Quản trị';

  const sidebar = (
    <aside className="flex flex-col h-full bg-linear-to-b from-slate-900 via-slate-900 to-slate-950 text-white border-r border-white/5">
      <div className="p-5 border-b border-white/10">
        <Link
          href="/admin"
          className="flex items-center gap-3 group"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center p-1.5 shrink-0 group-hover:border-secondary/50 transition-colors">
            <img src="/images/logo.png" alt="" className="w-full h-full object-contain brightness-110" />
          </div>
          <div>
            <span className="font-display text-3xl tracking-[0.15em] uppercase block leading-none text-white group-hover:text-secondary transition-colors">
              VAULT
            </span>
            <span className="font-tech text-[9px] text-secondary uppercase tracking-widest font-bold">
              Quản trị
            </span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        <p className="font-tech text-[9px] text-slate-500 uppercase tracking-widest px-4 py-2">
          Menu
        </p>
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-tech text-[11px] uppercase tracking-widest transition-all ${
                active
                  ? 'bg-linear-to-r from-secondary to-accent-cyan text-white shadow-lg shadow-secondary/30 font-bold'
                  : 'text-slate-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon size={18} strokeWidth={active ? 2.25 : 1.75} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/10 space-y-1">
        <Link
          href="/"
          onClick={() => setSidebarOpen(false)}
          className="flex items-center gap-3 px-4 py-3 rounded-xl font-tech text-[11px] uppercase tracking-widest text-slate-400 hover:bg-white/10 hover:text-white transition-all"
        >
          <Store size={18} />
          Về cửa hàng
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-tech text-[11px] uppercase tracking-widest text-red-400 hover:bg-red-500/15 hover:text-red-300 transition-all"
        >
          <LogOut size={18} />
          Đăng xuất
        </button>
      </div>

      {user && (
        <div className="p-4 border-t border-white/10 bg-white/5 mx-3 mb-3 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-secondary to-accent-cyan flex items-center justify-center font-tech text-xs font-bold text-white shrink-0 shadow-lg shadow-secondary/30">
              {userInitials(user.email)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-tech text-[9px] text-secondary uppercase tracking-widest font-bold">
                {roleBadgeLabel(user.role)}
              </p>
              <p className="font-body text-sm text-white truncate font-medium">
                {displayNameFromEmail(user.email)}
              </p>
              <p className="font-body text-[11px] text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );

  return (
    <div className="min-h-screen flex bg-slate-100">
      <div className="hidden lg:block w-64 shrink-0 fixed inset-y-0 left-0 z-30 shadow-xl">
        {sidebar}
      </div>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
            aria-hidden
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl">{sidebar}</div>
        </div>
      )}

      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen admin-main-bg">
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 px-4 md:px-8 lg:px-12 h-16 flex items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-4 min-w-0">
            <button
              type="button"
              className="lg:hidden p-2 text-slate-700 active:scale-95 transition-transform rounded-lg hover:bg-slate-100"
              onClick={() => setSidebarOpen((o) => !o)}
              aria-label="Menu"
            >
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <div className="min-w-0">
              <p className="font-tech text-[9px] text-secondary uppercase tracking-widest font-bold">
                Bảng điều khiển
              </p>
              <h1 className="font-tech text-sm font-bold uppercase tracking-wider text-slate-800 truncate">
                {headerTitle}
              </h1>
            </div>
          </div>
          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 text-slate-600 font-tech text-[10px] uppercase tracking-widest hover:border-secondary hover:text-secondary transition-colors shrink-0"
          >
            <Store size={14} />
            Cửa hàng
          </Link>
        </header>

        <main className="flex-1 px-5 md:px-8 lg:px-12 py-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
