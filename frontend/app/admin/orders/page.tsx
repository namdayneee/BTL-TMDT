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
      <AdminPageTitle title="Đơn hàng">
        <button
          type="button"
          onClick={() => void loadOrders()}
          className="chrome-effect px-5 py-2.5 rounded-full font-tech text-[10px] font-bold text-secondary uppercase tracking-widest active:scale-95 transition-all shrink-0"
        >
          Làm mới
        </button>
      </AdminPageTitle>

      {error && (
        <div className="rounded-2xl bg-tertiary-container border border-tertiary/20 px-4 py-3 text-sm text-tertiary font-body">
          {error}
        </div>
      )}

      {loading ? (
        <p className="font-tech text-sm text-on-surface-variant">Đang tải...</p>
      ) : orders.length === 0 ? (
        <p className="font-tech text-sm text-on-surface-variant">Chưa có đơn hàng nào.</p>
      ) : (
        <div className="glass-card rounded-3xl border border-outline-variant/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[640px]">
              <thead>
                <tr className="border-b border-outline-variant/30 bg-surface-container-low">
                  <th className="px-4 py-3 font-tech text-[10px] uppercase tracking-widest text-on-surface-variant">
                    Mã đơn
                  </th>
                  <th className="px-4 py-3 font-tech text-[10px] uppercase tracking-widest text-on-surface-variant">
                    Khách
                  </th>
                  <th className="px-4 py-3 font-tech text-[10px] uppercase tracking-widest text-on-surface-variant">
                    Ngày
                  </th>
                  <th className="px-4 py-3 font-tech text-[10px] uppercase tracking-widest text-on-surface-variant">
                    Số SP
                  </th>
                  <th className="px-4 py-3 font-tech text-[10px] uppercase tracking-widest text-on-surface-variant">
                    Tổng
                  </th>
                  <th className="px-4 py-3 font-tech text-[10px] uppercase tracking-widest text-on-surface-variant">
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
                      className="border-b border-outline-variant/10 last:border-0 hover:bg-surface-container-low/50 transition-colors"
                    >
                      <td className="px-4 py-4 font-tech text-sm font-bold text-on-surface">
                        #{order.id}
                      </td>
                      <td className="px-4 py-4 font-body text-sm text-on-surface-variant">
                        {order.userId}
                      </td>
                      <td className="px-4 py-4 font-body text-sm text-on-surface-variant">
                        {formatOrderDate(order.createdAt)}
                      </td>
                      <td className="px-4 py-4 font-body text-sm text-on-surface-variant">
                        {order.items.length}
                      </td>
                      <td className="px-4 py-4 font-body text-sm font-semibold text-on-surface">
                        {formatVND(order.totalAmount)}
                      </td>
                      <td className="px-4 py-4">
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
                            className="text-xs border border-outline-variant/40 rounded-xl px-2 py-2 bg-surface font-body text-on-surface focus:border-secondary outline-none disabled:opacity-50"
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
