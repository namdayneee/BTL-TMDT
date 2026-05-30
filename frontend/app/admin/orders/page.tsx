'use client';

import { useCallback, useEffect, useState } from 'react';
import AdminPageTitle from '../../components/admin/AdminPageTitle';
import {
  fetchAdminOrders,
  ORDER_STATUS_OPTIONS,
  updateOrderStatus,
} from '../../lib/admin-api';
import {
  joinAdminOrdersRoom,
  subscribeOrderStatusUpdates,
} from '../../lib/order-socket';
import { formatOrderDate, getOrderStatusDisplay, normalizeOrderStatus } from '../../lib/order-utils';
import { formatVND } from '../../lib/utils';
import type { ApiOrder } from '../../lib/types';
import type { OrderStatus } from '../../lib/order-utils';

function applyStatus(orders: ApiOrder[], orderId: number, status: string): ApiOrder[] {
  const normalized = normalizeOrderStatus(status);
  return orders.map((o) => (o.id === orderId ? { ...o, status: normalized } : o));
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAdminOrders();
      setOrders(
        data.map((o) => ({
          ...o,
          status: normalizeOrderStatus(o.status),
        }))
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Không tải được đơn hàng');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  useEffect(() => {
    joinAdminOrdersRoom();
    return subscribeOrderStatusUpdates(({ orderId, status }) => {
      setOrders((prev) => applyStatus(prev, orderId, status));
    });
  }, []);

  const handleStatusChange = async (orderId: number, status: OrderStatus) => {
    const previous = orders.find((o) => o.id === orderId);
    setOrders((prev) => applyStatus(prev, orderId, status));
    setUpdatingId(orderId);

    try {
      const updated = await updateOrderStatus(orderId, status);
      setOrders((prev) => applyStatus(prev, orderId, updated.status));
    } catch (e) {
      if (previous) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? previous : o)));
      }
      alert(e instanceof Error ? e.message : 'Cập nhật thất bại');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageTitle subtitle="Quản lý và cập nhật trạng thái từng đơn — thay đổi được đồng bộ realtime.">
        <button type="button" onClick={() => void loadOrders()} className="admin-btn-primary shrink-0">
          Làm mới
        </button>
      </AdminPageTitle>

      {error && <div className="admin-alert-error font-body">{error}</div>}

      {loading ? (
        <div className="admin-card admin-card-static p-12 text-center">
          <p className="font-tech text-sm text-slate-500">Đang tải đơn hàng...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="admin-card admin-card-static p-12 text-center">
          <p className="font-tech text-sm text-slate-500">Chưa có đơn hàng nào.</p>
        </div>
      ) : (
        <div className="admin-card admin-card-static admin-table-wrap overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <p className="font-tech text-[10px] text-slate-500 uppercase tracking-widest">
              {orders.length} đơn hàng
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[640px]">
              <thead>
                <tr className="border-b border-slate-200/80">
                  <th className="px-5 py-4 font-tech text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                    Mã đơn
                  </th>
                  <th className="px-5 py-4 font-tech text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                    Khách
                  </th>
                  <th className="px-5 py-4 font-tech text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                    Ngày
                  </th>
                  <th className="px-5 py-4 font-tech text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                    Số SP
                  </th>
                  <th className="px-5 py-4 font-tech text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                    Tổng
                  </th>
                  <th className="px-5 py-4 font-tech text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const display = getOrderStatusDisplay(order.status);
                  return (
                    <tr
                      key={order.id}
                      className="border-b border-slate-100 last:border-0 transition-colors"
                    >
                      <td className="px-5 py-4 font-tech text-sm font-bold text-secondary">
                        #{order.id}
                      </td>
                      <td className="px-5 py-4 font-body text-sm text-slate-600">
                        {order.userId}
                      </td>
                      <td className="px-5 py-4 font-body text-sm text-slate-600">
                        {formatOrderDate(order.createdAt)}
                      </td>
                      <td className="px-5 py-4 font-body text-sm text-slate-600">
                        {order.items.length}
                      </td>
                      <td className="px-5 py-4 font-body text-sm font-semibold text-slate-900">
                        {formatVND(order.totalAmount)}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-2 min-w-[140px]">
                          <span
                            className={`inline-flex w-fit px-2.5 py-0.5 rounded-full text-[10px] font-tech uppercase font-bold transition-colors duration-300 ${display.statusBg} ${display.statusText}`}
                          >
                            {display.label}
                          </span>
                          <select
                            value={order.status}
                            disabled={updatingId === order.id}
                            onChange={(e) =>
                              void handleStatusChange(
                                order.id,
                                e.target.value as OrderStatus
                              )
                            }
                            className="text-xs border border-slate-200 rounded-xl px-3 py-2 bg-white font-body text-slate-800 focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none disabled:opacity-50"
                          >
                            {ORDER_STATUS_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
