'use client';

import { CartProvider } from '../context/CartContext';
import { ProfileProvider } from '../context/ProfileContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ProfileProvider>
      <CartProvider>{children}</CartProvider>
    </ProfileProvider>
  );
}
