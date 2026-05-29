import type { ApiOrder } from './types';

export type OrderStatus = ApiOrder['status'];

const STATUS_MAP: Record<
  OrderStatus,
  { label: string; statusBg: string; statusText: string }
> = {
  pending: {
    label: 'CHỜ XỬ LÝ',
    statusBg: 'bg-tertiary-container',
    statusText: 'text-tertiary',
  },
  confirmed: {
    label: 'ĐÃ XÁC NHẬN',
    statusBg: 'bg-secondary/15',
    statusText: 'text-secondary',
  },
  shipping: {
    label: 'ĐANG GIAO',
    statusBg: 'bg-secondary',
    statusText: 'text-white',
  },
  delivered: {
    label: 'ĐÃ GIAO',
    statusBg: 'bg-emerald-100',
    statusText: 'text-emerald-800',
  },
  cancelled: {
    label: 'ĐÃ HỦY',
    statusBg: 'bg-surface-container-highest',
    statusText: 'text-on-surface-variant',
  },
};

/** Chuẩn hóa status từ API (phòng trường hợp khác chữ hoa). */
export function normalizeOrderStatus(status: string): OrderStatus {
  const key = status?.toLowerCase() as OrderStatus;
  if (key in STATUS_MAP) return key;
  return 'pending';
}

export function getOrderStatusDisplay(status: string) {
  return STATUS_MAP[normalizeOrderStatus(status)];
}

export function formatOrderDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
