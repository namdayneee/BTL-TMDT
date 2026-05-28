'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { getStoredToken } from '../lib/auth-client';
import {
  addToCartApi,
  fetchCart,
  removeCartItemApi,
  updateCartItemApi,
} from '../lib/cart-api';
import { fetchVariantById } from '../lib/product-api';
import type { EnrichedCartItem } from '../lib/types';

type CartContextValue = {
  items: EnrichedCartItem[];
  itemCount: number;
  subtotal: number;
  loading: boolean;
  refreshCart: () => Promise<void>;
  addItem: (variantId: number, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

async function enrichCartItems(
  cartItems: { id: number; variantId: number; quantity: number }[]
): Promise<EnrichedCartItem[]> {
  const enriched = await Promise.all(
    cartItems.map(async (item) => {
      const variant = await fetchVariantById(item.variantId);
      return {
        id: item.id,
        variantId: item.variantId,
        quantity: item.quantity,
        size: variant.size,
        name: variant.product.name,
        price: variant.product.price,
        img: variant.product.thumbnail || '/images/products/pro1.png',
        stock: variant.stock,
      };
    })
  );
  return enriched;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<EnrichedCartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    const token = getStoredToken();
    if (!token) {
      setItems([]);
      return;
    }

    setLoading(true);
    try {
      const cart = await fetchCart();
      if (!cart?.items?.length) {
        setItems([]);
        return;
      }
      const enriched = await enrichCartItems(cart.items);
      setItems(enriched);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshCart();
  }, [refreshCart]);

  const addItem = useCallback(
    async (variantId: number, quantity = 1) => {
      await addToCartApi(variantId, quantity);
      await refreshCart();
    },
    [refreshCart]
  );

  const updateQuantity = useCallback(
    async (itemId: number, quantity: number) => {
      await updateCartItemApi(itemId, quantity);
      await refreshCart();
    },
    [refreshCart]
  );

  const removeItem = useCallback(
    async (itemId: number) => {
      await removeCartItemApi(itemId);
      await refreshCart();
    },
    [refreshCart]
  );

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        loading,
        refreshCart,
        addItem,
        updateQuantity,
        removeItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider');
  }
  return ctx;
}
