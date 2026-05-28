'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import { ShoppingCart, SlidersHorizontal, X } from 'lucide-react';
import { products, categories } from '../data/products';
import type { Product } from '../data/products';

const sortOptions = [
  { id: 'default', label: 'Mặc định' },
  { id: 'price-asc', label: 'Giá tăng dần' },
  { id: 'price-desc', label: 'Giá giảm dần' },
  { id: 'new', label: 'Mới nhất' },
];

function ProductCard({ p, onClick }: { p: Product; onClick: () => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className="cursor-pointer group"
    >
      <div className="relative aspect-3/4 bg-surface-container-high overflow-hidden rounded-xl mb-4">
        <img
          src={p.img}
          alt={p.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {p.badges.map(b => (
            <span
              key={b}
              className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${
                b === 'MỚI' ? 'bg-secondary text-white' :
                b === 'GIỚI HẠN' ? 'bg-tertiary text-white' :
                'glass-card text-on-surface'
              }`}
            >
              {b}
            </span>
          ))}
          {!p.inStock && (
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase bg-outline-variant/80 text-on-surface-variant">
              HẾT HÀNG
            </span>
          )}
        </div>

        {/* Quick-add */}
        <button
          onClick={e => { e.stopPropagation(); onClick(); }}
          className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 active:scale-90"
        >
          <ShoppingCart size={18} className="text-secondary" />
        </button>

        {/* Color dots */}
        <div className="absolute bottom-3 left-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {p.colors.map(c => (
            <div
              key={c}
              className="w-3.5 h-3.5 rounded-full border border-white/60 shadow"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-between items-start gap-2">
        <div className="min-w-0">
          <h4 className="font-tech text-sm font-bold text-on-surface uppercase truncate">{p.name}</h4>
          <p className="font-body text-xs text-on-surface-variant mt-0.5">{p.desc}</p>
        </div>
        <p className="font-tech text-sm font-bold text-secondary shrink-0">{p.price}</p>
      </div>
    </motion.div>
  );
}

export default function ProductsPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSort, setActiveSort] = useState('default');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    const list = activeCategory === 'all'
      ? [...products]
      : products.filter(p => p.category === activeCategory);

    if (activeSort === 'price-asc') list.sort((a, b) => a.priceNum - b.priceNum);
    else if (activeSort === 'price-desc') list.sort((a, b) => b.priceNum - a.priceNum);

    return list;
  }, [activeCategory, activeSort]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24">
        {/* Page Hero */}
        <section className="px-5 md:px-10 lg:px-16 pt-10 pb-6 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="font-tech text-[10px] text-secondary uppercase tracking-[0.3em] block mb-3">
              BỘ SƯU TẬP 2026
            </span>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-on-surface uppercase leading-none">
              TẤT CẢ<br />SẢN PHẨM
            </h1>
            <p className="font-body text-sm text-on-surface-variant mt-3">
              {filtered.length} sản phẩm
            </p>
          </motion.div>
        </section>

        {/* Filter Bar */}
        <div className="sticky top-16 z-30 bg-background/90 backdrop-blur-md border-b border-outline-variant/20">
          <div className="px-5 md:px-10 lg:px-16 max-w-7xl mx-auto">
            <div className="flex items-center gap-3 py-3 overflow-x-auto no-scrollbar">
              {/* Category pills */}
              <div className="flex gap-2 shrink-0">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-4 py-2 rounded-full font-tech text-[10px] uppercase tracking-widest whitespace-nowrap transition-all duration-200 ${
                      activeCategory === cat.id
                        ? 'bg-secondary text-white shadow-md'
                        : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Sort + Filter toggle */}
              <div className="ml-auto flex items-center gap-2 shrink-0">
                <select
                  value={activeSort}
                  onChange={e => setActiveSort(e.target.value)}
                  className="bg-surface-container border border-outline-variant/30 rounded-full px-4 py-2 font-tech text-[10px] uppercase tracking-widest text-on-surface-variant focus:outline-none focus:border-secondary transition-colors cursor-pointer hidden md:block"
                >
                  {sortOptions.map(o => (
                    <option key={o.id} value={o.id}>{o.label}</option>
                  ))}
                </select>
                <button
                  onClick={() => setShowFilters(v => !v)}
                  className="md:hidden flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container font-tech text-[10px] uppercase tracking-widest text-on-surface-variant"
                >
                  <SlidersHorizontal size={14} />
                  Lọc
                </button>
              </div>
            </div>

            {/* Mobile filter drawer */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden pb-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-tech text-[10px] uppercase tracking-widest text-on-surface-variant">Sắp xếp</span>
                    <button onClick={() => setShowFilters(false)}><X size={16} /></button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {sortOptions.map(o => (
                      <button
                        key={o.id}
                        onClick={() => { setActiveSort(o.id); setShowFilters(false); }}
                        className={`px-4 py-2 rounded-full font-tech text-[10px] uppercase tracking-widest transition-all ${
                          activeSort === o.id
                            ? 'bg-secondary text-white'
                            : 'bg-surface-container text-on-surface-variant'
                        }`}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Product Grid */}
        <section className="px-5 md:px-10 lg:px-16 max-w-7xl mx-auto py-8">
          <motion.div
            layout
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-12"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map(p => (
                <ProductCard
                  key={p.id}
                  p={p}
                  onClick={() => router.push(`/product/${p.id}`)}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <p className="font-display text-3xl text-on-surface-variant uppercase">Không có sản phẩm</p>
              <button
                onClick={() => setActiveCategory('all')}
                className="mt-6 font-tech text-xs text-secondary uppercase tracking-widest border-b border-secondary pb-0.5"
              >
                Xem tất cả
              </button>
            </motion.div>
          )}
        </section>
      </main>
    </div>
  );
}
