'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import { Search } from 'lucide-react';
import { clearToken, fetchCurrentUser, getStoredToken } from '../lib/auth-client';
import { fetchMyOrders } from '../lib/order-api';
import { fetchVariantById } from '../lib/product-api';
import { formatOrderDate, getOrderStatusDisplay } from '../lib/order-utils';
import { formatVND } from '../lib/utils';
import type { ApiOrder } from '../lib/types';

type DisplayOrder = {
  id: string;
  date: string;
  status: string;
  statusBg: string;
  statusText: string;
  name: string;
  specs: string;
  price: string;
  img: string;
  eta?: string;
  action?: string;
};

const filters = ['TẤT CẢ', 'CHỜ XỬ LÝ', 'ĐANG GIAO', 'HOÀN THÀNH'];

async function mapOrdersToDisplay(orders: ApiOrder[]): Promise<DisplayOrder[]> {
  return Promise.all(
    orders.map(async (order) => {
      const firstItem = order.items[0];
      let name = 'Sản phẩm Vault';
      let specs = '';
      let img = '/images/products/pro1.png';

      if (firstItem) {
        try {
          const variant = await fetchVariantById(firstItem.variantId);
          name = variant.product.name;
          specs = `Size: ${variant.size}`;
          img = variant.product.thumbnail || img;
        } catch {
          specs = `Variant #${firstItem.variantId}`;
        }
      }

      const statusDisplay = getOrderStatusDisplay(order.status);

      return {
        id: `VT-${order.id}`,
        date: formatOrderDate(order.createdAt),
        status: statusDisplay.label,
        statusBg: statusDisplay.statusBg,
        statusText: statusDisplay.statusText,
        name,
        specs,
        price: formatVND(order.totalAmount),
        img,
        eta: order.status === 'shipping' ? 'Đang vận chuyển' : undefined,
        action: order.status === 'delivered' ? 'Đánh giá ngay' : undefined,
      };
    })
  );
}

export default function OrderList() {
  const router = useRouter();
  const [authState, setAuthState] = useState<'checking' | 'authenticated' | 'unauthenticated'>('checking');
  const [orders, setOrders] = useState<DisplayOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    const validateAccess = async () => {
      const token = getStoredToken();

      if (!token) {
        setAuthState('unauthenticated');
        return;
      }

      try {
        await fetchCurrentUser(token);
        setAuthState('authenticated');
        setLoadingOrders(true);
        const data = await fetchMyOrders();
        setOrders(await mapOrdersToDisplay(data));
      } catch {
        clearToken();
        setAuthState('unauthenticated');
      } finally {
        setLoadingOrders(false);
      }
    };

    void validateAccess();
  }, [router]);

  if (authState === 'checking') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="font-tech text-sm text-on-surface-variant">Đang kiểm tra đăng nhập...</p>
      </div>
    );
  }

  if (authState === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-12 px-5 md:px-8 lg:px-12 max-w-6xl mx-auto flex items-center justify-center">
          <button
            onClick={() => router.push('/login?redirect=/orders')}
            className="chrome-effect px-6 py-3 rounded-xl font-tech text-[10px] font-bold text-on-surface uppercase tracking-widest active:scale-95 transition-all"
          >
            Bạn chưa có tài khoản
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-12 px-5 md:px-8 lg:px-12 max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="font-display text-5xl md:text-6xl text-on-surface mb-2 uppercase tracking-tight">Đơn hàng</h2>
          <p className="font-body text-sm text-on-surface-variant font-medium">Theo dõi hành trình phong cách của bạn tại Vault.</p>
        </div>

        {/* Search + Filters row */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
          {/* Search */}
          <div className="relative group flex-1 max-w-md">
            <input
              className="w-full bg-surface-container-low border-b-2 border-outline-variant focus:border-secondary transition-all duration-300 py-4 px-12 outline-none font-tech text-sm font-medium text-on-surface placeholder:text-on-surface-variant/40"
              placeholder="Tìm kiếm mã đơn hàng..."
              type="text"
            />
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-secondary transition-colors" />
          </div>

          {/* Filters */}
          <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar shrink-0">
            {filters.map((f, i) => (
              <button
                key={f}
                className={`whitespace-nowrap px-5 py-2.5 rounded-full font-tech text-[10px] font-bold tracking-widest border transition-all ${i === 0 ? 'border-secondary bg-secondary text-white shadow-lg shadow-secondary/20' : 'border-outline-variant text-on-surface-variant hover:border-secondary'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {loadingOrders && (
          <p className="font-tech text-sm text-on-surface-variant mb-8">Đang tải đơn hàng...</p>
        )}

        {!loadingOrders && orders.length === 0 && (
          <p className="font-tech text-sm text-on-surface-variant mb-8">Bạn chưa có đơn hàng nào.</p>
        )}

        {/* Order list — 1 col mobile, 2 col desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orders.map((o) => (
            <motion.div
              key={o.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => router.push(`/order/${o.id.replace('VT-', '')}`)}
              className="glass-card rounded-3xl p-5 flex flex-col gap-5 relative overflow-hidden group cursor-pointer border border-outline-variant/20 hover:shadow-xl transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-tech text-xs font-bold text-secondary tracking-widest">{o.id}</span>
                  <p className="font-body text-[11px] text-on-surface-variant mt-1 opacity-70">{o.date}</p>
                </div>
                <span className={`px-3 py-1 ${o.statusBg} ${o.statusText} text-[9px] font-bold tracking-widest rounded-full uppercase`}>
                  {o.status}
                </span>
              </div>

              <div className="flex gap-4 items-center">
                <div className="w-20 h-24 rounded-2xl overflow-hidden shrink-0 bg-surface-container-high border border-outline-variant/10">
                  <img src={o.img} className="w-full h-full object-cover" alt={o.name} />
                </div>
                <div className="grow">
                  <h3 className="font-tech text-md font-bold text-on-surface uppercase line-clamp-2">{o.name}</h3>
                  <p className="font-body text-xs text-on-surface-variant opacity-70 mt-1">{o.specs}</p>
                  <p className="font-display text-xl text-secondary mt-2 tracking-tight">{o.price}</p>
                </div>
              </div>

              <div className="border-t border-outline-variant/20 pt-4 flex justify-between items-center">
                <p className="text-[10px] font-tech text-on-surface-variant uppercase tracking-widest opacity-60">
                  {o.eta || o.action}
                </p>
                <button className="chrome-effect px-6 py-2 rounded-xl font-tech text-[10px] font-bold text-on-surface uppercase tracking-widest active:scale-95 transition-all">
                  Chi tiết
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
