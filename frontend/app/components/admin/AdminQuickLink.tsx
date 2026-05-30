import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { ArrowRight } from 'lucide-react';

export default function AdminQuickLink({
  href,
  label,
  description,
  icon: Icon,
}: {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <Link
      href={href}
      className="admin-card group flex items-center gap-5 p-6 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-linear-to-br from-secondary/5 via-transparent to-accent-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative w-14 h-14 rounded-2xl bg-linear-to-br from-secondary to-accent-cyan flex items-center justify-center text-white shadow-lg shadow-secondary/25 shrink-0">
        <Icon size={26} strokeWidth={1.75} />
      </div>
      <div className="relative flex-1 min-w-0">
        <p className="font-tech text-sm font-bold text-slate-900 uppercase tracking-wider">
          {label}
        </p>
        <p className="font-body text-xs text-slate-500 mt-1">{description}</p>
      </div>
      <ArrowRight
        size={20}
        className="relative text-slate-300 group-hover:text-secondary group-hover:translate-x-1 transition-all shrink-0"
      />
    </Link>
  );
}
