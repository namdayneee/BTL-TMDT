import type { ApiOrder } from './types';

export const TIERS = ['CORE', 'SILVER', 'BLACK', 'ELITE'] as const;
export type TierId = (typeof TIERS)[number];

/** Ngưỡng XP mở từng hạng */
export const TIER_XP: Record<TierId, number> = {
  CORE: 0,
  SILVER: 1000,
  BLACK: 2500,
  ELITE: 5000,
};

/** 1.000đ chi tiêu (đơn không hủy) = 1 XP */
export function computeXpFromOrders(orders: ApiOrder[]): number {
  return orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + Math.floor(o.totalAmount / 1000), 0);
}

/** 10.000đ đơn đã giao = 1 VP (Vault Point) */
export function computeVaultPoints(orders: ApiOrder[]): number {
  return orders
    .filter((o) => o.status === 'delivered')
    .reduce((sum, o) => sum + Math.floor(o.totalAmount / 10000), 0);
}

export type TierProgress = {
  xp: number;
  currentTier: TierId;
  currentTierIndex: number;
  nextTier: TierId | null;
  xpToNext: number;
  progressPercent: number;
  eliteTargetXp: number;
};

export function getTierProgress(xp: number): TierProgress {
  let currentTierIndex = 0;
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (xp >= TIER_XP[TIERS[i]]) {
      currentTierIndex = i;
      break;
    }
  }

  const currentTier = TIERS[currentTierIndex];
  const nextTier = currentTierIndex < TIERS.length - 1 ? TIERS[currentTierIndex + 1] : null;
  const currentMin = TIER_XP[currentTier];
  const nextMin = nextTier ? TIER_XP[nextTier] : TIER_XP.ELITE;

  const progressPercent = nextTier
    ? Math.min(100, Math.max(0, ((xp - currentMin) / (nextMin - currentMin)) * 100))
    : 100;

  const xpToNext = nextTier ? Math.max(0, nextMin - xp) : 0;

  return {
    xp,
    currentTier,
    currentTierIndex,
    nextTier,
    xpToNext,
    progressPercent,
    eliteTargetXp: TIER_XP.ELITE,
  };
}

export function formatXp(n: number): string {
  return n.toLocaleString('vi-VN');
}

/** Mặc định: 15/06/2026 10:00 giờ VN — có thể ghi đè bằng env */
export function getDropTargetDate(): Date {
  const raw = process.env.NEXT_PUBLIC_VAULT_DROP_AT;
  if (raw) {
    const parsed = new Date(raw);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return new Date('2026-06-15T03:00:00.000Z');
}

export function formatCountdown(ms: number): string {
  if (ms <= 0) return '00:00:00';
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':');
}

const NOTIFY_KEY_PREFIX = 'vault_drop_notify_';

export function isDropNotifySubscribed(userId: number): boolean {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(`${NOTIFY_KEY_PREFIX}${userId}`) === '1';
}

export function subscribeDropNotify(userId: number): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(`${NOTIFY_KEY_PREFIX}${userId}`, '1');
}
