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
  '/admin': 'Quản trị',
  '/admin/orders': 'Đơn hàng',
  '/admin/products': 'Sản phẩm',
  '/admin/sizing': 'Sizing',
};

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
    <aside className="flex flex-col h-full bg-surface border-r border-outline-variant/30 shadow-sm">
      <div className="p-5 border-b border-outline-variant/20">
        <Link
          href="/admin"
          className="flex items-center gap-2.5 group"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="w-9 h-9 rounded-lg bg-white border border-outline-variant/20 flex items-center justify-center p-1.5 shrink-0">
            <img src="/images/logo.png" alt="" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="font-display text-3xl tracking-[0.15em] text-on-surface uppercase block leading-none group-hover:text-secondary transition-colors">
              VAULT
            </span>
            <span className="font-tech text-[9px] text-secondary uppercase tracking-widest font-bold">
              Quản trị
            </span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-tech text-[11px] uppercase tracking-widest transition-all ${
                active
                  ? 'bg-secondary text-white shadow-lg shadow-secondary/20 font-bold'
                  : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-outline-variant/20 space-y-1">
        <Link
          href="/"
          onClick={() => setSidebarOpen(false)}
          className="flex items-center gap-3 px-4 py-3 rounded-2xl font-tech text-[11px] uppercase tracking-widest text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-all"
        >
          <Store size={18} />
          Về cửa hàng
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-tech text-[11px] uppercase tracking-widest text-tertiary hover:bg-tertiary-container transition-all"
        >
          <LogOut size={18} />
          Đăng xuất
        </button>
      </div>

      {user && (
        <div className="p-4 border-t border-outline-variant/20 bg-surface-container-low/50">
          <p className="font-tech text-[10px] text-on-surface-variant uppercase tracking-widest">
            {roleBadgeLabel(user.role)}
          </p>
          <p className="font-body text-sm text-on-surface truncate mt-1 font-medium">
            {displayNameFromEmail(user.email)}
          </p>
          <p className="font-body text-xs text-on-surface-variant truncate">{user.email}</p>
        </div>
      )}
    </aside>
  );

  return (
    <div className="min-h-screen bg-background flex">
      <div className="hidden lg:block w-64 shrink-0 fixed inset-y-0 left-0 z-30">{sidebar}</div>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
            aria-hidden
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl">{sidebar}</div>
        </div>
      )}

      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-20 bg-surface/95 backdrop-blur-md border-b border-outline-variant/30 px-4 md:px-8 lg:px-12 h-16 flex items-center gap-4">
          <button
            type="button"
            className="lg:hidden p-2 text-on-surface active:scale-95 transition-transform"
            onClick={() => setSidebarOpen((o) => !o)}
            aria-label="Menu"
          >
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <h1 className="font-tech text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">
            {headerTitle}
          </h1>
        </header>

        <main className="flex-1 px-5 md:px-8 lg:px-12 py-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
