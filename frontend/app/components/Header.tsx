'use client';

import { Menu, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
}

export default function Header({ title, showBack }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/60 backdrop-blur-xl border-b border-outline-variant/30 flex justify-between items-center w-full px-5 h-16 shadow-sm">
      <div className="flex items-center gap-4">
        {showBack ? (
          <button 
            onClick={() => router.back()}
            className="text-on-surface hover:opacity-80 transition-opacity active:scale-95 duration-200"
          >
            <ArrowLeft size={24} />
          </button>
        ) : (
          <button className="text-on-surface active:scale-95 transition-transform duration-200">
            <Menu size={24} />
          </button>
        )}
        {title && (
          <h1 className="font-tech text-lg font-semibold tracking-tight uppercase text-on-surface">
            {title}
          </h1>
        )}
      </div>

      {!title && (
        <div 
          onClick={() => router.push('/')}
          className="font-display text-4xl tracking-[0.2em] translate-x-2 text-on-surface uppercase drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] cursor-pointer"
        >
          VAULT
        </div>
      )}

      <button 
        onClick={() => router.push('/cart')}
        className="text-on-surface relative active:scale-95 transition-transform duration-200"
      >
        <ShoppingBag size={24} />
        {pathname !== '/cart' && (
          <span className="absolute -top-1 -right-1 bg-secondary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
            2
          </span>
        )}
      </button>
    </header>
  );
}
