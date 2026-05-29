'use client';

import { useEffect, useState } from 'react';
import { DollarSign, Package, ShoppingCart, AlertTriangle } from 'lucide-react';
import AdminStatCard from '../components/admin/AdminStatCard';
import AdminQuickLink from '../components/admin/AdminQuickLink';
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

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 p-6 md:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-56 h-56 bg-secondary/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-40 h-40 bg-accent-cyan/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative">
          <p className="font-tech text-[10px] text-secondary uppercase tracking-[0.3em] font-bold mb-2">
            Hôm nay
          </p>
          <h3 className="font-display text-3xl md:text-4xl uppercase tracking-tight">
            Bảng điều khiển Vault
          </h3>
          <p className="font-body text-sm text-slate-300 mt-2 max-w-md">
            Theo dõi doanh thu, đơn hàng và tồn kho — mọi thứ trong một nơi.
          </p>
        </div>
      </div>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="admin-card admin-card-static h-36 animate-pulse bg-slate-100"
            />
          ))}
        </div>
      )}

      {error && <div className="admin-alert-error font-body">{error}</div>}

      {!loading && !error && stats && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            <AdminStatCard
              label="Doanh thu"
              value={formatVND(stats.totalRevenue)}
              icon={DollarSign}
              href="/admin/orders"
              accent="cyan"
            />
            <AdminStatCard
              label="Tổng đơn hàng"
              value={String(stats.totalOrders)}
              icon={ShoppingCart}
              href="/admin/orders"
              accent="slate"
            />
            <AdminStatCard
              label="Sản phẩm sắp hết"
              value={String(stats.lowStockProducts)}
              icon={AlertTriangle}
              href="/admin/products"
              accent="amber"
            />
          </div>

          <div>
            <p className="font-tech text-[10px] text-slate-500 uppercase tracking-widest mb-4">
              Truy cập nhanh
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <AdminQuickLink
                href="/admin/orders"
                label="Quản lý đơn hàng"
                description="Xem, cập nhật trạng thái giao hàng"
                icon={ShoppingCart}
              />
              <AdminQuickLink
                href="/admin/products"
                label="Quản lý sản phẩm"
                description="Thêm, sửa sản phẩm và tồn kho"
                icon={Package}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
