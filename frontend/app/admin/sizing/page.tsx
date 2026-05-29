'use client';

import { useState } from 'react';
import AdminPageTitle from '../../components/admin/AdminPageTitle';
import { createSizingRule, type SizingRuleInput } from '../../lib/admin-api';

const inputClass =
  'w-full bg-surface-container-low border-b-2 border-outline-variant focus:border-secondary transition-all py-3 px-3 outline-none font-body text-sm text-on-surface rounded-t-lg';

export default function AdminSizingPage() {
  const [form, setForm] = useState<SizingRuleInput>({
    minHeight: 150,
    maxHeight: 165,
    minWeight: 45,
    maxWeight: 60,
    size: 'M',
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const setNum = (key: keyof SizingRuleInput, value: string) => {
    setForm((prev) => ({ ...prev, [key]: key === 'size' ? value : Number(value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setSubmitting(true);
    try {
      await createSizingRule(form);
      setMessage('Đã tạo quy tắc sizing mới.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Tạo quy tắc thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl">
      <AdminPageTitle subtitle="Thêm quy tắc gợi ý size theo chiều cao và cân nặng." />

      <form
        onSubmit={(e) => void handleSubmit(e)}
        className="admin-card admin-card-static p-6 md:p-8 space-y-5"
      >
        <div className="grid grid-cols-2 gap-4">
          <NumField
            label="Chiều cao tối thiểu (cm)"
            value={form.minHeight}
            onChange={(v) => setNum('minHeight', v)}
          />
          <NumField
            label="Chiều cao tối đa (cm)"
            value={form.maxHeight}
            onChange={(v) => setNum('maxHeight', v)}
          />
          <NumField
            label="Cân nặng tối thiểu (kg)"
            value={form.minWeight}
            onChange={(v) => setNum('minWeight', v)}
          />
          <NumField
            label="Cân nặng tối đa (kg)"
            value={form.maxWeight}
            onChange={(v) => setNum('maxWeight', v)}
          />
        </div>

        <div>
          <label className="font-tech text-[10px] text-on-surface-variant uppercase tracking-widest block mb-1">
            Size đề xuất
          </label>
          <input
            value={form.size}
            onChange={(e) => setNum('size', e.target.value)}
            className={`${inputClass} uppercase`}
            placeholder="M"
            required
          />
        </div>

        {message && <div className="admin-alert-success font-body">{message}</div>}
        {error && <div className="admin-alert-error font-body">{error}</div>}

        <button type="submit" disabled={submitting} className="admin-btn-primary w-full justify-center disabled:opacity-50">
          {submitting ? 'Đang lưu...' : 'Tạo quy tắc'}
        </button>
      </form>

      <div className="admin-card admin-card-static p-5 font-body text-sm text-slate-600 space-y-1">
        <p className="font-tech text-[10px] uppercase text-secondary tracking-widest font-bold mb-2">
          Ví dụ
        </p>
        <p>150–165 cm, 45–60 kg → size M</p>
        <p>166–175 cm, 55–70 kg → size L</p>
      </div>
    </div>
  );
}

function NumField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="font-tech text-[10px] text-on-surface-variant uppercase tracking-widest block mb-1">
        {label}
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
        required
      />
    </div>
  );
}
