import type { ReactNode } from 'react';

export default function AdminPageTitle({
  title,
  children,
}: {
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
      <h2 className="font-display text-5xl md:text-6xl text-on-surface uppercase tracking-tight leading-none">
        {title}
      </h2>
      {children}
    </div>
  );
}
