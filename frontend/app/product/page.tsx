'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import { SlidersHorizontal, X, Search } from 'lucide-react';
import { fetchProducts } from '../lib/product-api';
import { mapApiProduct, type DisplayProduct } from '../lib/types';

const sortOptions = [
  { id: 'default', label: 'Mặc định' },
  { id: 'price-asc', label: 'Giá tăng dần' },
  { id: 'price-desc', label: 'Giá giảm dần' },
  { id: 'new', label: 'Mới nhất' },
];

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<DisplayProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSort, setActiveSort] = useState('default');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data.map(mapApiProduct));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Không tải được sản phẩm');
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let list = q
      ? products.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.desc.toLowerCase().includes(q)
        )
      : [...products];

    if (activeSort === 'price-asc') list.sort((a, b) => a.priceNum - b.priceNum);
    else if (activeSort === 'price-desc') list.sort((a, b) => b.priceNum - a.priceNum);
    else if (activeSort === 'new') list.sort((a, b) => b.id.localeCompare(a.id));

    return list;
  }, [products, activeSort, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 max-w-7xl mx-auto">
        <div className="px-5 md:px-8 lg:px-12 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-display text-5xl md:text-6xl text-on-surface uppercase tracking-tight leading-none whitespace-nowrap">
              TẤT CẢ SẢN PHẨM
            </h1>
          </motion.div>
        </div>

        {/* Filter Bar */}
        <div className="sticky top-16 z-30 bg-background/90 backdrop-blur-md border-b border-outline-variant/20">
          <div className="px-5 md:px-8 lg:px-12">
            <div className="flex items-center gap-3 py-3">
              <div className="relative flex-1 min-w-0">
                <Search
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
                />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-full bg-surface-container border border-outline-variant/30 rounded-full pl-11 pr-4 py-2.5 font-tech text-xs text-on-surface placeholder:text-on-surface-variant/50 outline-none focus:border-secondary transition-colors"
                />
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <select
                  value={activeSort}
                  onChange={e => setActiveSort(e.target.value)}
                  className="bg-surface-container border border-outline-variant/30 rounded-full px-4 py-2.5 font-tech text-[10px] uppercase tracking-widest text-on-surface-variant focus:outline-none focus:border-secondary transition-colors cursor-pointer hidden md:block"
                >
                  {sortOptions.map(o => (
                    <option key={o.id} value={o.id}>{o.label}</option>
                  ))}
                </select>
                <button
                  onClick={() => setShowFilters(v => !v)}
                  className="md:hidden flex items-center gap-2 px-4 py-2.5 rounded-full bg-surface-container font-tech text-[10px] uppercase tracking-widest text-on-surface-variant border border-outline-variant/30"
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
        <section className="px-5 md:px-8 lg:px-12 py-8">
          {loading && (
            <p className="text-center font-tech text-sm text-on-surface-variant py-24">
              Đang tải sản phẩm...
            </p>
          )}
          {error && (
            <p className="text-center font-tech text-sm text-tertiary py-24">{error}</p>
          )}
          {!loading && !error && (
            <motion.div
              layout
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-12"
            >
              <AnimatePresence mode="popLayout">
                {filtered.map(p => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onClick={() => router.push(`/product/${p.id}`)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <p className="font-display text-3xl text-on-surface-variant uppercase">
                {searchQuery.trim() ? 'Không tìm thấy sản phẩm' : 'Không có sản phẩm'}
              </p>
            </motion.div>
          )}
        </section>
      </main>
    </div>
  );
}
