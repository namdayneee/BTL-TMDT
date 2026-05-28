import type { ApiOrder } from './types';

const STATUS_MAP: Record<
  ApiOrder['status'],
  { label: string; statusBg: string; statusText: string }
> = {
  pending: {
    label: 'CHỜ XỬ LÝ',
    statusBg: 'bg-tertiary-container',
    statusText: 'text-tertiary',
  },
  confirmed: {
    label: 'CHỜ XỬ LÝ',
    statusBg: 'bg-tertiary-container',
    statusText: 'text-tertiary',
  },
  shipping: {
    label: 'ĐANG GIAO',
    statusBg: 'bg-secondary',
    statusText: 'text-white',
  },
  delivered: {
    label: 'ĐÃ GIAO',
    statusBg: 'bg-surface-container-highest',
    statusText: 'text-on-surface',
  },
  cancelled: {
    label: 'ĐÃ HỦY',
    statusBg: 'bg-outline-variant',
    statusText: 'text-on-surface-variant',
  },
};

export function getOrderStatusDisplay(status: ApiOrder['status']) {
  return STATUS_MAP[status] ?? STATUS_MAP.pending;
}

export function formatOrderDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
