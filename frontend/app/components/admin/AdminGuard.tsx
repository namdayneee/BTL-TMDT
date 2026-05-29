'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import {
  clearToken,
  fetchMe,
  getStoredToken,
  isAdminRole,
  type AuthUser,
} from '../../lib/auth-client';

type GuardState = 'loading' | 'allowed' | 'denied';

export default function AdminGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<GuardState>('loading');
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const check = async () => {
      const token = getStoredToken();
      if (!token) {
        setState('denied');
        router.replace('/login?redirect=/admin');
        return;
      }

      try {
        const me = await fetchMe();
        if (!isAdminRole(me.role)) {
          setState('denied');
          router.replace('/');
          return;
        }
        setUser(me);
        setState('allowed');
      } catch {
        clearToken();
        setState('denied');
        router.replace('/login?redirect=/admin');
      }
    };

    void check();
  }, [router]);

  if (state === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-secondary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 font-tech text-xs text-on-surface-variant uppercase tracking-widest">
            Đang xác thực...
          </p>
        </div>
      </div>
    );
  }

  if (state !== 'allowed' || !user) {
    return null;
  }

  return <>{children}</>;
}
