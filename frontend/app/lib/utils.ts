export function formatVND(amount: number): string {
  return amount.toLocaleString('vi-VN') + ' ₫';
}

export function formatPriceShort(amount: number): string {
  if (amount >= 1_000_000) {
    return `${Math.round(amount / 1000).toLocaleString('vi-VN')}k`;
  }
  return amount.toLocaleString('vi-VN');
}
