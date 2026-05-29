import type { ReactNode } from 'react';

/** Mô tả ngắn + nút hành động — tiêu đề trang nằm ở header shell. */
export default function AdminPageTitle({
  subtitle,
  children,
}: {
  subtitle?: string;
  children?: ReactNode;
}) {
  if (!subtitle && !children) return null;

  return (
    <div
      className={`mb-6 flex flex-col gap-4 ${
        children ? 'sm:flex-row sm:items-center sm:justify-between' : ''
      }`}
    >
      {subtitle && (
        <p className="font-body text-sm text-slate-500 max-w-2xl">{subtitle}</p>
      )}
      {children && <div className="flex shrink-0 justify-end">{children}</div>}
    </div>
  );
}
