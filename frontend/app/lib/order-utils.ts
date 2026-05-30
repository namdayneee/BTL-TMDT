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

export function formatOrderDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
  });
}

export type TrackingStep = {
  id: string;
  title: string;
  description?: string;
  time?: string;
  active: boolean;
  completed: boolean;
  icon: 'truck' | 'check' | 'pending';
};

const STATUS_RANK: Record<OrderStatus, number> = {
  pending: 0,
  confirmed: 1,
  shipping: 2,
  delivered: 3,
  cancelled: -1,
};

export function buildTrackingSteps(order: ApiOrder): TrackingStep[] {
  const status = normalizeOrderStatus(order.status);
  const rank = STATUS_RANK[status];
  const createdAt = formatOrderDateTime(order.createdAt);

  if (status === 'cancelled') {
    return [
      {
        id: 'cancelled',
        title: 'Đơn hàng đã hủy',
        description: 'Đơn hàng không còn được xử lý',
        time: createdAt,
        active: true,
        completed: false,
        icon: 'pending',
      },
    ];
  }

  const steps: Omit<TrackingStep, 'active' | 'completed' | 'icon'>[] = [
    {
      id: 'delivered',
      title: 'Giao hàng thành công',
      description: 'Đơn hàng đã được giao tới bạn',
    },
    {
      id: 'shipping',
      title: 'Đang vận chuyển',
      description: 'Shipper đang trên đường tới địa chỉ của bạn',
    },
    {
      id: 'confirmed',
      title: 'Đơn hàng đã xác nhận',
      description: 'Kho Vault đã xác nhận và đóng gói',
    },
    {
      id: 'pending',
      title: 'Đơn hàng đã đặt',
      description: 'Chúng tôi đã nhận đơn của bạn',
      time: createdAt,
    },
  ];

  const stepRank: Record<string, number> = {
    pending: 0,
    confirmed: 1,
    shipping: 2,
    delivered: 3,
  };

  return steps.map((step) => {
    const stepLevel = stepRank[step.id] ?? 0;
    const completed = rank >= stepLevel;
    const active = rank === stepLevel;
    return {
      ...step,
      completed,
      active,
      icon: step.id === 'shipping' && active ? 'truck' : completed ? 'check' : 'pending',
    };
  });
}

export function getTrackingProgressPercent(status: string): number {
  const rank = STATUS_RANK[normalizeOrderStatus(status)];
  if (rank < 0) return 0;
  return Math.min(100, ((rank + 1) / 4) * 100);
}
