'use client';

import { useCallback, useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Package, Save } from 'lucide-react';
import AdminPageTitle from '../../components/admin/AdminPageTitle';
import {
  fetchAdminProducts,
  updateProductVariants,
  type VariantStockInput,
} from '../../lib/admin-api';
import type { ApiProduct, ApiProductVariant } from '../../lib/types';

const inputClass =
  'w-full bg-slate-50 border border-slate-200 focus:border-secondary rounded-lg py-2 px-3 outline-none font-body text-sm';

const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL'];

function sortVariants(variants: ApiProductVariant[]) {
  return [...variants].sort((a, b) => {
    const ai = SIZE_ORDER.indexOf(a.size.toUpperCase());
    const bi = SIZE_ORDER.indexOf(b.size.toUpperCase());
    if (ai === -1 && bi === -1) return a.size.localeCompare(b.size);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}

function stockBadge(stock: number) {
  if (stock === 0) return 'bg-red-100 text-red-700';
  if (stock < 5) return 'bg-amber-100 text-amber-800';
  return 'bg-emerald-100 text-emerald-800';
}

function InventoryPanel({
  product,
  onSaved,
}: {
  product: ApiProduct;
  onSaved: () => void;
}) {
  const [rows, setRows] = useState(
    sortVariants(product.variants).map((v) => ({
      id: v.id,
      size: v.size,
      stock: String(v.stock),
    }))
  );
  const [newSize, setNewSize] = useState('');
  const [newStock, setNewStock] = useState('0');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const totalStock = rows.reduce((sum, r) => sum + (Number(r.stock) || 0), 0);

  const handleSave = async () => {
    setError('');
    const payload: VariantStockInput[] = rows.map((r) => ({
      id: r.id,
      size: r.size,
      stock: Number(r.stock) || 0,
    }));

    if (newSize.trim()) {
      payload.push({
        size: newSize.trim(),
        stock: Number(newStock) || 0,
      });
    }

    setSaving(true);
    try {
      await updateProductVariants(product.id, payload);
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Cập nhật thất bại');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="border-t border-slate-100 bg-slate-50/80 p-4 md:p-5 space-y-4">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <span className="font-tech text-[10px] uppercase tracking-widest text-slate-500">
          {product.variants.length} size · Tổng tồn:{' '}
          <strong className="text-slate-800">{totalStock}</strong>
        </span>
      </div>

      <div className="overflow-x-auto admin-table-wrap rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr>
              <th className="px-4 py-3 font-tech text-[10px] uppercase tracking-widest text-slate-500">
                Size
              </th>
              <th className="px-4 py-3 font-tech text-[10px] uppercase tracking-widest text-slate-500">
                Tồn kho
              </th>
              <th className="px-4 py-3 font-tech text-[10px] uppercase tracking-widest text-slate-500">
                Trạng thái
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const stock = Number(row.stock) || 0;
              return (
                <tr key={row.id} className="border-t border-slate-100">
                  <td className="px-4 py-2 font-tech font-bold uppercase text-slate-800">
                    {row.size}
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      min={0}
                      value={row.stock}
                      onChange={(e) => {
                        const next = [...rows];
                        next[i] = { ...next[i], stock: e.target.value };
                        setRows(next);
                      }}
                      className={`w-28 ${inputClass}`}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-tech font-bold uppercase ${stockBadge(stock)}`}
                    >
                      {stock === 0 ? 'Hết hàng' : stock < 5 ? 'Sắp hết' : 'Còn hàng'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap gap-2 items-end">
        <div className="flex-1 min-w-[100px]">
          <label className="font-tech text-[9px] text-slate-500 uppercase tracking-widest block mb-1">
            Thêm size mới
          </label>
          <input
            placeholder="VD: XL"
            value={newSize}
            onChange={(e) => setNewSize(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="w-28">
          <label className="font-tech text-[9px] text-slate-500 uppercase tracking-widest block mb-1">
            Tồn
          </label>
          <input
            type="number"
            min={0}
            value={newStock}
            onChange={(e) => setNewStock(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-600 font-body">{error}</p>}

      <button
        type="button"
        disabled={saving}
        onClick={() => void handleSave()}
        className="admin-btn-primary disabled:opacity-50"
      >
        <Save size={14} />
        {saving ? 'Đang lưu...' : 'Lưu tồn kho'}
      </button>
    </div>
  );
}

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAdminProducts();
      setProducts(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Không tải được dữ liệu');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const lowStockCount = products.filter((p) =>
    p.variants.some((v) => v.stock < 5)
  ).length;

  return (
    <div className="space-y-6">
      <AdminPageTitle subtitle="Xem số lượng size mỗi sản phẩm và cập nhật tồn kho theo từng size.">
        <button type="button" onClick={() => void load()} className="admin-btn-primary shrink-0">
          Làm mới
        </button>
      </AdminPageTitle>

      {!loading && !error && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="admin-card admin-card-static p-4">
            <p className="font-tech text-[9px] text-slate-500 uppercase tracking-widest">Sản phẩm</p>
            <p className="font-display text-2xl text-slate-900 mt-1">{products.length}</p>
          </div>
          <div className="admin-card admin-card-static p-4">
            <p className="font-tech text-[9px] text-slate-500 uppercase tracking-widest">
              Tổng biến thể
            </p>
            <p className="font-display text-2xl text-slate-900 mt-1">
              {products.reduce((n, p) => n + p.variants.length, 0)}
            </p>
          </div>
          <div className="admin-card admin-card-static p-4 col-span-2 sm:col-span-1">
            <p className="font-tech text-[9px] text-amber-600 uppercase tracking-widest">
              Sắp hết / hết
            </p>
            <p className="font-display text-2xl text-amber-600 mt-1">{lowStockCount}</p>
          </div>
        </div>
      )}

      {error && <div className="admin-alert-error font-body">{error}</div>}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="admin-card admin-card-static h-20 animate-pulse bg-slate-100" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="admin-card admin-card-static p-12 text-center">
          <Package className="mx-auto text-slate-300 mb-3" size={40} />
          <p className="font-tech text-sm text-slate-500">Chưa có sản phẩm.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((product) => {
            const open = expandedId === product.id;
            const sizes = product.variants.length;
            const total = product.variants.reduce((s, v) => s + v.stock, 0);
            const hasLow = product.variants.some((v) => v.stock < 5);

            return (
              <div key={product.id} className="admin-card admin-card-static overflow-hidden">
                <button
                  type="button"
                  onClick={() => setExpandedId(open ? null : product.id)}
                  className="w-full flex items-center gap-4 p-4 text-left hover:bg-slate-50/80 transition-colors"
                >
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                    <img
                      src={product.thumbnail || '/images/products/pro1.png'}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-tech text-sm font-bold text-slate-900 uppercase tracking-wide truncate">
                      {product.name}
                    </h3>
                    <p className="font-tech text-[10px] text-slate-500 mt-0.5 uppercase tracking-wider">
                      {sizes} size · Tổng {total} đơn vị
                      {hasLow && (
                        <span className="ml-2 text-amber-600 font-bold">· Cần nhập thêm</span>
                      )}
                    </p>
                    <p className="font-body text-xs text-slate-400 mt-1 truncate">
                      {sortVariants(product.variants)
                        .map((v) => `${v.size}: ${v.stock}`)
                        .join(' · ')}
                    </p>
                  </div>
                  {open ? (
                    <ChevronUp className="text-slate-400 shrink-0" size={20} />
                  ) : (
                    <ChevronDown className="text-slate-400 shrink-0" size={20} />
                  )}
                </button>

                {open && (
                  <InventoryPanel
                    key={product.variants.map((v) => `${v.id}-${v.stock}-${v.size}`).join('|')}
                    product={product}
                    onSaved={() => void load()}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
