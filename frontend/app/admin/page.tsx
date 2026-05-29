'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DollarSign, Package, ShoppingCart, AlertTriangle, ArrowRight } from 'lucide-react';
import AdminPageTitle from '../components/admin/AdminPageTitle';
import { fetchAdminStats, type AdminStats } from '../lib/admin-api';
import { formatVND } from '../lib/utils';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAdminStats()
      .then(setStats)
      .catch((e) => setError(e instanceof Error ? e.message : 'Không tải được thống kê'))
      .finally(() => setLoading(false));
  }, []);

  const cards = stats
    ? [
        {
          label: 'Doanh thu',
          value: formatVND(stats.totalRevenue),
          icon: DollarSign,
          href: '/admin/orders',
        },
        {
          label: 'Tổng đơn hàng',
          value: String(stats.totalOrders),
          icon: ShoppingCart,
          href: '/admin/orders',
        },
        {
          label: 'Sản phẩm sắp hết',
          value: String(stats.lowStockProducts),
          icon: AlertTriangle,
          href: '/admin/products',
        },
      ]
    : [];

  return (
    <div className="space-y-8">
      <AdminPageTitle title="Tổng quan" />

      {loading && (
        <p className="font-tech text-sm text-on-surface-variant">Đang tải dữ liệu...</p>
      )}

      {error && (
        <div className="rounded-2xl bg-tertiary-container border border-tertiary/20 px-4 py-3 text-sm text-tertiary font-body">
          {error}
        </div>
      )}

      {!loading && !error && stats && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            {cards.map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.label}
                  href={card.href}
                  className="glass-card rounded-3xl border border-outline-variant/20 p-6 hover:shadow-xl transition-shadow group"
                >
                  <div className="flex items-start justify-between">
                    <div className="w-11 h-11 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                      <Icon size={22} />
                    </div>
                    <ArrowRight
                      size={16}
                      className="text-outline-variant group-hover:text-secondary transition-colors"
                    />
                  </div>
                  <p className="font-tech text-[10px] text-on-surface-variant uppercase tracking-widest mt-5">
                    {card.label}
                  </p>
                  <p className="font-display text-4xl text-on-surface mt-1">{card.value}</p>
                </Link>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <Link
              href="/admin/orders"
              className="glass-card rounded-3xl border border-outline-variant/20 p-6 flex items-center justify-between hover:border-secondary/40 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-white">
                  <ShoppingCart size={24} />
                </div>
                <p className="font-tech text-sm font-bold text-on-surface uppercase tracking-wider">
                  Quản lý đơn hàng
                </p>
              </div>
              <ArrowRight
                size={18}
                className="text-outline-variant group-hover:text-secondary transition-colors"
              />
            </Link>

            <Link
              href="/admin/products"
              className="glass-card rounded-3xl border border-outline-variant/20 p-6 flex items-center justify-between hover:border-secondary/40 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-white">
                  <Package size={24} />
                </div>
                <p className="font-tech text-sm font-bold text-on-surface uppercase tracking-wider">
                  Quản lý sản phẩm
                </p>
              </div>
              <ArrowRight
                size={18}
                className="text-outline-variant group-hover:text-secondary transition-colors"
              />
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
