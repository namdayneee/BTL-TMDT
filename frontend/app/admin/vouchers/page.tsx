'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus, Ticket, X } from 'lucide-react';
import AdminPageTitle from '../../components/admin/AdminPageTitle';
import {
  createPromotion,
  fetchPromotions,
  togglePromotion,
  type ApiPromotion,
  type CreatePromotionInput,
} from '../../lib/admin-api';
import { formatVND } from '../../lib/utils';

const inputClass =
  'w-full bg-slate-50 border border-slate-200 focus:border-secondary rounded-lg py-2.5 px-3 outline-none font-body text-sm';

function discountLabel(promo: ApiPromotion) {
  if (promo.discountType === 'percent') {
    return `${promo.discountValue}%`;
  }
  return formatVND(promo.discountValue);
}

function VoucherFormModal({
  onClose,
  onSaved,
}: {
  onClose: () => void;
  onSaved: () => void;
}) {
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percent' | 'fixed'>('percent');
  const [discountValue, setDiscountValue] = useState('');
  const [minOrderValue, setMinOrderValue] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const value = Number(discountValue);
    if (!code.trim() || Number.isNaN(value) || value <= 0) {
      setError('Nhập mã và giá trị giảm hợp lệ.');
      return;
    }

    const payload: CreatePromotionInput = {
      code: code.trim().toUpperCase(),
      discountType,
      discountValue: value,
      minOrderValue: minOrderValue ? Number(minOrderValue) : undefined,
    };

    setSubmitting(true);
    try {
      await createPromotion(payload);
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Tạo voucher thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="admin-card admin-card-static w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h3 className="font-display text-xl text-slate-900 uppercase tracking-wide">
            Tạo voucher
          </h3>
          <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={(e) => void handleSubmit(e)} className="p-5 space-y-4">
          <div>
            <label className="font-tech text-[10px] text-slate-500 uppercase tracking-widest block mb-1">
              Mã voucher
            </label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className={`${inputClass} uppercase font-mono`}
              placeholder="VAULT10"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-tech text-[10px] text-slate-500 uppercase tracking-widest block mb-1">
                Loại giảm
              </label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as 'percent' | 'fixed')}
                className={inputClass}
              >
                <option value="percent">Phần trăm (%)</option>
                <option value="fixed">Số tiền cố định</option>
              </select>
            </div>
            <div>
              <label className="font-tech text-[10px] text-slate-500 uppercase tracking-widest block mb-1">
                Giá trị
              </label>
              <input
                type="number"
                min={1}
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                className={inputClass}
                required
              />
            </div>
          </div>
          <div>
            <label className="font-tech text-[10px] text-slate-500 uppercase tracking-widest block mb-1">
              Đơn tối thiểu (VNĐ, tùy chọn)
            </label>
            <input
              type="number"
              min={0}
              value={minOrderValue}
              onChange={(e) => setMinOrderValue(e.target.value)}
              className={inputClass}
              placeholder="200000"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="admin-btn-primary w-full justify-center disabled:opacity-50"
          >
            {submitting ? 'Đang tạo...' : 'Tạo voucher'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminVouchersPage() {
  const [promos, setPromos] = useState<ApiPromotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchPromotions();
      setPromos(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Không tải được voucher');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleToggle = async (id: number) => {
    setTogglingId(id);
    try {
      const updated = await togglePromotion(id);
      setPromos((prev) => prev.map((p) => (p.id === id ? updated : p)));
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Cập nhật thất bại');
    } finally {
      setTogglingId(null);
    }
  };

  const activeCount = promos.filter((p) => p.isActive).length;

  return (
    <div className="space-y-6">
      <AdminPageTitle subtitle="Tạo mã giảm giá, bật/tắt voucher cho cửa hàng.">
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="admin-btn-primary shrink-0"
        >
          <Plus size={16} />
          Thêm voucher
        </button>
      </AdminPageTitle>

      {!loading && !error && (
        <p className="font-tech text-[10px] text-slate-500 uppercase tracking-widest">
          {activeCount} / {promos.length} voucher đang hoạt động
        </p>
      )}

      {error && <div className="admin-alert-error font-body">{error}</div>}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="admin-card admin-card-static h-32 animate-pulse bg-slate-100" />
          ))}
        </div>
      ) : promos.length === 0 ? (
        <div className="admin-card admin-card-static p-12 text-center">
          <Ticket className="mx-auto text-slate-300 mb-3" size={40} />
          <p className="font-tech text-sm text-slate-500 mb-4">Chưa có voucher.</p>
          <button type="button" onClick={() => setShowForm(true)} className="admin-btn-primary">
            <Plus size={14} />
            Tạo voucher đầu tiên
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {promos.map((promo) => (
            <div
              key={promo.id}
              className={`admin-card admin-card-static p-5 border-l-4 ${
                promo.isActive ? 'border-l-secondary' : 'border-l-slate-300 opacity-75'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-lg font-bold text-slate-900 tracking-wider">
                    {promo.code}
                  </p>
                  <p className="font-display text-2xl text-secondary mt-1">{discountLabel(promo)}</p>
                  <p className="font-body text-xs text-slate-500 mt-2">
                    {promo.minOrderValue != null && promo.minOrderValue > 0
                      ? `Đơn tối thiểu ${formatVND(promo.minOrderValue)}`
                      : 'Không yêu cầu đơn tối thiểu'}
                  </p>
                </div>
                <span
                  className={`shrink-0 px-2 py-1 rounded-full text-[9px] font-tech font-bold uppercase ${
                    promo.isActive
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {promo.isActive ? 'Đang bật' : 'Đã tắt'}
                </span>
              </div>
              <button
                type="button"
                disabled={togglingId === promo.id}
                onClick={() => void handleToggle(promo.id)}
                className="mt-4 w-full py-2 rounded-full border border-slate-200 font-tech text-[10px] font-bold uppercase tracking-widest text-slate-700 hover:border-secondary hover:text-secondary transition-colors disabled:opacity-50"
              >
                {togglingId === promo.id
                  ? '...'
                  : promo.isActive
                    ? 'Tắt voucher'
                    : 'Bật voucher'}
              </button>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <VoucherFormModal
          onClose={() => setShowForm(false)}
          onSaved={() => void load()}
        />
      )}
    </div>
  );
}
