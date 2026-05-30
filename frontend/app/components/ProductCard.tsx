'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getStoredToken } from '../lib/auth-client';
import type { ApiProductVariant, DisplayProduct } from '../lib/types';

const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL'];

function getDefaultVariant(variants: ApiProductVariant[]) {
  const inStock = variants.filter((v) => v.stock > 0);
  if (!inStock.length) return null;

  return [...inStock].sort((a, b) => {
    const ai = SIZE_ORDER.indexOf(a.size.toUpperCase());
    const bi = SIZE_ORDER.indexOf(b.size.toUpperCase());
    if (ai === -1 && bi === -1) return a.size.localeCompare(b.size);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  })[0];
}

type ProductCardProps = {
  product: DisplayProduct;
  onClick: () => void;
  layout?: 'grid' | 'carousel';
};

export default function ProductCard({
  product: p,
  onClick,
  layout = 'grid',
}: ProductCardProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const [adding, setAdding] = useState(false);

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!p.inStock) return;

    const variant = getDefaultVariant(p.variants);
    if (!variant) return;

    const token = getStoredToken();
    if (!token) {
      router.push(`/login?redirect=/product/${p.id}`);
      return;
    }

    setAdding(true);
    try {
      await addItem(variant.id, 1);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Không thể thêm vào giỏ');
    } finally {
      setAdding(false);
    }
  };

  const isCarousel = layout === 'carousel';

  return (
    <motion.div
      layout={!isCarousel}
      initial={isCarousel ? undefined : { opacity: 0, y: 20 }}
      animate={isCarousel ? undefined : { opacity: 1, y: 0 }}
      exit={isCarousel ? undefined : { opacity: 0, scale: 0.95 }}
      whileHover={isCarousel ? { scale: 0.98 } : { y: -4 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className={`cursor-pointer group ${
        isCarousel ? 'shrink-0 min-w-75 md:min-w-0 snap-center md:snap-align-none' : ''
      }`}
    >
      <div
        className={`relative aspect-3/4 bg-surface-container-high overflow-hidden rounded-xl ${
          isCarousel ? '' : 'mb-4'
        }`}
      >
        <img
          src={p.img}
          alt={p.name}
          className={`w-full h-full object-cover ${
            isCarousel
              ? 'group-hover:scale-110 transition-transform duration-700'
              : 'group-hover:scale-105 transition-transform duration-700'
          }`}
        />

        <div
          className={`absolute flex flex-col gap-1.5 ${
            isCarousel ? 'top-4 left-4 gap-2' : 'top-3 left-3'
          }`}
        >
          {p.badges.map((b) => (
            <span
              key={b}
              className={`font-bold rounded-full uppercase ${
                isCarousel ? 'text-[10px] px-3 py-1' : 'text-[10px] px-2.5 py-1 tracking-wide'
              } ${
                b === 'MỚI'
                  ? 'vault-badge-cyan'
                  : b === 'GIỚI HẠN'
                    ? 'vault-badge-yellow'
                    : 'glass-card text-on-surface'
              }`}
            >
              {b}
            </span>
          ))}
          {!p.inStock && (
            <span
              className={`font-bold rounded-full uppercase bg-outline-variant/80 text-on-surface-variant ${
                isCarousel ? 'text-[10px] px-3 py-1' : 'text-[10px] px-2.5 py-1'
              }`}
            >
              HẾT HÀNG
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={(e) => void handleQuickAdd(e)}
          disabled={!p.inStock || adding}
          className={`absolute bg-white/90 backdrop-blur-sm rounded-full shadow-lg transition-all active:scale-90 disabled:opacity-50 ${
            isCarousel
              ? 'bottom-4 right-4 p-3'
              : 'bottom-3 right-3 p-2.5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300'
          }`}
        >
          <ShoppingCart
            size={isCarousel ? 20 : 18}
            className={`text-secondary ${adding ? 'opacity-50' : ''}`}
          />
        </button>
      </div>

      <div
        className={`flex justify-between items-start gap-3 ${
          isCarousel ? 'mt-4' : ''
        }`}
      >
        <h4
          className={`font-tech font-bold text-on-surface uppercase truncate min-w-0 flex-1 ${
            isCarousel ? 'text-base lg:text-lg' : 'text-sm'
          }`}
        >
          {p.name}
        </h4>
        <p className="font-tech text-sm font-bold text-secondary shrink-0 whitespace-nowrap min-w-[7.5rem] text-right">
          {p.price}
        </p>
      </div>
    </motion.div>
  );
}
