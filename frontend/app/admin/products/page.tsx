'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import AdminPageTitle from '../../components/admin/AdminPageTitle';
import {
  createProduct,
  deleteProduct,
  fetchAdminProducts,
  updateProduct,
  type CreateProductInput,
  type UpdateProductInput,
} from '../../lib/admin-api';
import { formatVND } from '../../lib/utils';
import type { ApiProduct } from '../../lib/types';

type VariantRow = { size: string; stock: string };

const emptyVariant = (): VariantRow => ({ size: '', stock: '0' });

const inputClass =
  'w-full bg-surface-container-low border-b-2 border-outline-variant focus:border-secondary transition-all py-3 px-3 outline-none font-body text-sm text-on-surface placeholder:text-on-surface-variant/40 rounded-t-lg';

function ProductFormModal({
  mode,
  product,
  onClose,
  onSaved,
}: {
  mode: 'create' | 'edit';
  product?: ApiProduct;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(product?.name ?? '');
  const [description, setDescription] = useState(product?.description ?? '');
  const [price, setPrice] = useState(product ? String(product.price) : '');
  const [thumbnail, setThumbnail] = useState(product?.thumbnail ?? '');
  const [variants, setVariants] = useState<VariantRow[]>(
    mode === 'create' ? [emptyVariant(), emptyVariant()] : []
  );
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    const priceNum = Number(price);
    if (!name.trim() || !description.trim() || Number.isNaN(priceNum) || priceNum < 0) {
      setFormError('Vui lòng điền đầy đủ thông tin sản phẩm.');
      return;
    }

    setSubmitting(true);
    try {
      if (mode === 'create') {
        const parsedVariants = variants
          .filter((v) => v.size.trim())
          .map((v) => ({ size: v.size.trim(), stock: Number(v.stock) || 0 }));
        if (parsedVariants.length === 0) {
          setFormError('Cần ít nhất một biến thể (size).');
          setSubmitting(false);
          return;
        }
        const payload: CreateProductInput = {
          name: name.trim(),
          description: description.trim(),
          price: priceNum,
          thumbnail: thumbnail.trim() || undefined,
          variants: parsedVariants,
        };
        await createProduct(payload);
      } else if (product) {
        const payload: UpdateProductInput = {
          name: name.trim(),
          description: description.trim(),
          price: priceNum,
          thumbnail: thumbnail.trim() || undefined,
        };
        await updateProduct(product.id, payload);
      }
      onSaved();
      onClose();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Lưu thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  const addVariant = () => setVariants((v) => [...v, emptyVariant()]);
  const removeVariant = (index: number) =>
    setVariants((v) => v.filter((_, i) => i !== index));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm">
      <div className="glass-card rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-outline-variant/30 shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-outline-variant/20">
          <h3 className="font-display text-2xl text-on-surface uppercase tracking-wide">
            {mode === 'create' ? 'Thêm sản phẩm' : `Sửa #${product?.id}`}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={(e) => void handleSubmit(e)} className="p-5 space-y-4">
          <Field label="Tên" value={name} onChange={setName} required />
          <div>
            <label className="font-tech text-[10px] text-on-surface-variant uppercase tracking-widest block mb-1">
              Mô tả
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className={inputClass}
              required
            />
          </div>
          <Field label="Giá (VNĐ)" value={price} onChange={setPrice} type="number" required />
          <Field
            label="Ảnh thumbnail (URL)"
            value={thumbnail}
            onChange={setThumbnail}
            placeholder="/images/products/pro1.png"
          />

          {mode === 'create' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-tech text-[10px] text-on-surface-variant uppercase tracking-widest">
                  Biến thể (size / tồn)
                </span>
                <button
                  type="button"
                  onClick={addVariant}
                  className="text-[10px] text-secondary font-tech uppercase font-bold tracking-widest"
                >
                  + Thêm size
                </button>
              </div>
              <div className="space-y-2">
                {variants.map((v, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      placeholder="Size (M, L...)"
                      value={v.size}
                      onChange={(e) => {
                        const next = [...variants];
                        next[i] = { ...next[i], size: e.target.value };
                        setVariants(next);
                      }}
                      className={`flex-1 ${inputClass}`}
                    />
                    <input
                      type="number"
                      min={0}
                      placeholder="Tồn"
                      value={v.stock}
                      onChange={(e) => {
                        const next = [...variants];
                        next[i] = { ...next[i], stock: e.target.value };
                        setVariants(next);
                      }}
                      className={`w-24 ${inputClass}`}
                    />
                    {variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVariant(i)}
                        className="p-2 text-tertiary"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {formError && (
            <p className="text-sm text-tertiary font-body bg-tertiary-container rounded-xl px-3 py-2">
              {formError}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-full border border-outline-variant font-tech text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:border-secondary transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 rounded-full bg-secondary text-white font-tech text-[10px] font-bold uppercase tracking-widest disabled:opacity-50 shadow-lg shadow-secondary/20"
            >
              {submitting ? 'Đang lưu...' : 'Lưu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="font-tech text-[10px] text-on-surface-variant uppercase tracking-widest block mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  );
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [editingProduct, setEditingProduct] = useState<ApiProduct | undefined>();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAdminProducts();
      setProducts(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Không tải được sản phẩm');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  const handleDelete = async (id: number) => {
    if (!confirm('Xóa sản phẩm này?')) return;
    setDeletingId(id);
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Xóa thất bại');
    } finally {
      setDeletingId(null);
    }
  };

  const lowStock = (p: ApiProduct) => p.variants.some((v) => v.stock < 5);

  return (
    <div className="space-y-6">
      <AdminPageTitle title="Sản phẩm">
        <button
          type="button"
          onClick={() => {
            setEditingProduct(undefined);
            setModal('create');
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary text-white font-tech text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-secondary/20 active:scale-95 transition-transform shrink-0"
        >
          <Plus size={16} />
          Thêm sản phẩm
        </button>
      </AdminPageTitle>

      {error && (
        <div className="rounded-2xl bg-tertiary-container border border-tertiary/20 px-4 py-3 text-sm text-tertiary font-body">
          {error}
        </div>
      )}

      {loading ? (
        <p className="font-tech text-sm text-on-surface-variant">Đang tải...</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="glass-card rounded-2xl border border-outline-variant/20 p-3 md:p-4 flex gap-3 md:gap-4 hover:shadow-lg transition-shadow"
            >
              <div className="relative w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-xl overflow-hidden bg-surface-container-low">
                <img
                  src={product.thumbnail || '/images/products/pro1.png'}
                  alt=""
                  className="w-full h-full object-cover"
                />
                {lowStock(product) && (
                  <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-tertiary text-white text-[8px] font-tech uppercase font-bold rounded">
                    Sắp hết
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0 flex flex-col justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-tech text-xs md:text-sm font-bold text-on-surface line-clamp-1 uppercase tracking-wide">
                    {product.name}
                  </h3>
                  <p className="font-body text-[11px] text-on-surface-variant line-clamp-1 mt-0.5">
                    {product.description}
                  </p>
                  <p className="font-display text-lg md:text-xl text-secondary mt-1 leading-none">
                    {formatVND(product.price)}
                  </p>
                  <p className="font-tech text-[9px] text-on-surface-variant mt-1 uppercase tracking-wider truncate">
                    {product.variants.map((v) => `${v.size}:${v.stock}`).join(' · ')}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProduct(product);
                      setModal('edit');
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-1 py-2 rounded-full border border-outline-variant font-tech text-[10px] font-bold uppercase tracking-widest text-on-surface hover:border-secondary transition-colors"
                  >
                    <Pencil size={13} />
                    Sửa
                  </button>
                  <button
                    type="button"
                    disabled={deletingId === product.id}
                    onClick={() => void handleDelete(product.id)}
                    className="inline-flex items-center justify-center px-3 py-2 rounded-full border border-tertiary/30 text-tertiary font-tech text-[10px] font-bold uppercase disabled:opacity-50 hover:bg-tertiary-container transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal === 'create' && (
        <ProductFormModal
          mode="create"
          onClose={() => setModal(null)}
          onSaved={() => void loadProducts()}
        />
      )}
      {modal === 'edit' && editingProduct && (
        <ProductFormModal
          mode="edit"
          product={editingProduct}
          onClose={() => setModal(null)}
          onSaved={() => void loadProducts()}
        />
      )}
    </div>
  );
}
