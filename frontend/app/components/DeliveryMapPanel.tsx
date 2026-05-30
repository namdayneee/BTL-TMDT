'use client';

import { MapPin, Package, Truck } from 'lucide-react';
import type { OrderStatus } from '../lib/order-utils';

type DeliveryMapPanelProps = {
  status: OrderStatus;
  trackingCode: string;
  recipientName?: string | null;
  address?: string | null;
};

function shortenAddress(address: string | null | undefined, max = 42): string {
  if (!address?.trim()) return 'Địa chỉ giao hàng';
  const oneLine = address.replace(/\s+/g, ' ').trim();
  return oneLine.length > max ? `${oneLine.slice(0, max)}…` : oneLine;
}

const ROUTE_PROGRESS: Record<OrderStatus, number> = {
  pending: 0.12,
  confirmed: 0.35,
  shipping: 0.72,
  delivered: 1,
  cancelled: 0,
};

export default function DeliveryMapPanel({
  status,
  trackingCode,
  recipientName,
  address,
}: DeliveryMapPanelProps) {
  const progress = ROUTE_PROGRESS[status] ?? 0.12;
  const isShipping = status === 'shipping';
  const isDelivered = status === 'delivered';
  const isCancelled = status === 'cancelled';
  const destLabel = shortenAddress(address);

  return (
    <div className="relative h-75 md:h-100 rounded-3xl overflow-hidden glass-card shadow-2xl border border-outline-variant/20">
      {/* Map base */}
      <div className="absolute inset-0 bg-[#0c1218]" />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,183,235,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,183,235,0.06) 1px, transparent 1px)
          `,
          backgroundSize: '28px 28px',
        }}
      />
      <div className="absolute inset-0 bg-linear-to-br from-secondary/10 via-transparent to-tertiary/5" />

      {/* Decorative blocks — city blocks */}
      <div className="absolute top-[18%] left-[12%] w-16 h-10 rounded-md bg-white/5 border border-white/10" />
      <div className="absolute top-[28%] left-[22%] w-24 h-14 rounded-md bg-white/5 border border-white/10" />
      <div className="absolute bottom-[32%] right-[18%] w-20 h-12 rounded-md bg-white/5 border border-white/10" />
      <div className="absolute bottom-[22%] right-[28%] w-14 h-20 rounded-md bg-white/5 border border-white/10" />

      {/* Route SVG */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 400 240"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00b7eb" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#00b7eb" stopOpacity="1" />
          </linearGradient>
        </defs>
        <path
          d="M 48 168 Q 120 80, 200 120 T 352 72"
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M 48 168 Q 120 80, 200 120 T 352 72"
          fill="none"
          stroke="url(#routeGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="400"
          strokeDashoffset={400 - progress * 400}
          className="transition-all duration-700 ease-out"
        />
      </svg>

      {/* Origin — warehouse */}
      <div className="absolute left-[8%] bottom-[22%] flex flex-col items-center gap-1.5 z-10">
        <div className="w-10 h-10 rounded-full bg-surface border-2 border-secondary flex items-center justify-center shadow-lg shadow-secondary/30">
          <Package size={18} className="text-secondary" />
        </div>
        <span className="font-tech text-[8px] font-bold text-white/80 uppercase tracking-widest text-center max-w-20">
          Kho Vault
        </span>
      </div>

      {/* Moving truck */}
      {!isCancelled && !isDelivered && (
        <div
          className="absolute z-20 transition-all duration-700 ease-out"
          style={{
            left: `${12 + progress * 68}%`,
            top: `${58 - progress * 28}%`,
          }}
        >
          <div
            className={`w-9 h-9 rounded-full bg-secondary flex items-center justify-center shadow-lg shadow-secondary/40 ${
              isShipping ? 'animate-pulse' : ''
            }`}
          >
            <Truck size={16} className="text-white fill-white" />
          </div>
        </div>
      )}

      {/* Destination */}
      <div className="absolute right-[8%] top-[18%] flex flex-col items-end gap-1.5 z-10 max-w-[45%]">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center border-2 shadow-lg ${
            isDelivered
              ? 'bg-emerald-500 border-emerald-300'
              : 'bg-surface border-secondary shadow-secondary/30'
          }`}
        >
          <MapPin
            size={18}
            className={isDelivered ? 'text-white fill-white' : 'text-secondary fill-secondary'}
          />
        </div>
        <span className="font-tech text-[8px] font-bold text-white/90 uppercase tracking-widest text-right">
          {recipientName || 'Bạn'}
        </span>
        <span className="font-body text-[9px] text-white/60 text-right leading-snug">{destLabel}</span>
      </div>

      {/* Top overlay */}
      <div className="absolute top-0 left-0 right-0 p-4 md:p-5 bg-linear-to-b from-black/55 to-transparent z-10">
        <div className="flex justify-between items-start gap-3">
          <div>
            <p className="font-tech text-[9px] text-secondary uppercase tracking-[0.35em] font-bold">
              Live tracking
            </p>
            <p className="font-tech text-xs text-white/90 mt-0.5 uppercase tracking-widest">
              {isCancelled
                ? 'Đơn đã hủy'
                : isDelivered
                  ? 'Đã giao thành công'
                  : isShipping
                    ? 'Đang trên đường giao'
                    : 'Chuẩn bị tại kho'}
            </p>
          </div>
          <div className="glass-card px-3 py-1.5 rounded-lg border border-white/10 bg-black/30 backdrop-blur-sm">
            <p className="font-tech text-[8px] text-white/50 uppercase tracking-widest">Mã vận đơn</p>
            <p className="font-tech text-[10px] font-bold text-secondary tracking-wider">{trackingCode}</p>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 holographic-sweep opacity-20 pointer-events-none" />
    </div>
  );
}
