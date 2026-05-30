import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { ArrowUpRight } from 'lucide-react';

type Accent = 'cyan' | 'amber' | 'slate';

const accentStyles: Record<
  Accent,
  { icon: string; bar: string; glow: string }
> = {
  cyan: {
    icon: 'bg-secondary/15 text-secondary',
    bar: 'from-secondary to-accent-cyan',
    glow: 'bg-secondary/10',
  },
  amber: {
    icon: 'bg-amber-100 text-amber-700',
    bar: 'from-amber-500 to-amber-400',
    glow: 'bg-amber-500/10',
  },
  slate: {
    icon: 'bg-slate-100 text-slate-700',
    bar: 'from-slate-600 to-slate-500',
    glow: 'bg-slate-500/10',
  },
};

export default function AdminStatCard({
  label,
  value,
  icon: Icon,
  href,
  accent = 'cyan',
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  href: string;
  accent?: Accent;
}) {
  const styles = accentStyles[accent];

  return (
    <Link href={href} className="admin-card group block p-6 relative overflow-hidden">
      <div
        className={`absolute -top-8 -right-8 w-28 h-28 rounded-full blur-2xl pointer-events-none ${styles.glow}`}
      />
      <div className={`absolute left-0 top-4 bottom-4 w-1 rounded-full bg-linear-to-b ${styles.bar}`} />
      <div className="flex items-start justify-between pl-3">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center ${styles.icon}`}
        >
          <Icon size={24} strokeWidth={2} />
        </div>
        <ArrowUpRight
          size={18}
          className="text-slate-300 group-hover:text-secondary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
        />
      </div>
      <p className="font-tech text-[10px] text-slate-500 uppercase tracking-widest mt-5 pl-3">
        {label}
      </p>
      <p className="font-display text-4xl text-slate-900 mt-1 pl-3 tracking-tight">{value}</p>
    </Link>
  );
}
