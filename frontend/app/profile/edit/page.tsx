'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { fetchMe, getStoredToken } from '../../lib/auth-client';
import { useProfile } from '../../context/ProfileContext';

const inputClass =
  'w-full bg-surface-container-low border border-outline-variant/30 rounded-xl px-4 py-3 font-body text-sm outline-none focus:border-secondary transition-all';

export default function ProfileEditPage() {
  const router = useRouter();
  const { profile, updateProfile, loading } = useProfile();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      router.replace('/login?redirect=/profile/edit');
      return;
    }
    void fetchMe()
      .then(() => setReady(true))
      .catch(() => router.replace('/login?redirect=/profile/edit'));
  }, [router]);

  useEffect(() => {
    if (loading) return;
    setFullName(profile.fullName ?? '');
    setPhone(profile.phone ?? '');
  }, [profile.fullName, profile.phone, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) {
      setError('Vui lòng nhập họ và tên.');
      return;
    }
    if (!phone.trim()) {
      setError('Vui lòng nhập số điện thoại.');
      return;
    }

    setSaving(true);
    try {
      await updateProfile({
        fullName: fullName.trim(),
        phone: phone.trim(),
      });
      router.push('/profile');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại');
    } finally {
      setSaving(false);
    }
  };

  if (!ready) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="font-tech text-sm text-on-surface-variant">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <Header title="CHỈNH SỬA HỒ SƠ" />

      <main className="pt-24 pb-20 px-5 md:px-8 lg:px-12 max-w-lg mx-auto">
        <button
          type="button"
          onClick={() => router.push('/profile')}
          className="inline-flex items-center gap-2 font-tech text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-secondary transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Quay lại hồ sơ
        </button>

        <div className="bg-surface-container-highest/20 rounded-3xl p-6 md:p-8 border border-outline-variant/20">
          <h1 className="font-display text-2xl uppercase tracking-wide text-on-surface mb-1">
            Thông tin liên hệ
          </h1>
          <p className="font-body text-sm text-on-surface-variant mb-6">
            Cập nhật họ tên và số điện thoại — đồng bộ sang trang thanh toán và đơn hàng.
          </p>

          <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5">
            <div>
              <label className="font-tech text-[9px] opacity-50 uppercase tracking-widest font-bold mb-2 block">
                Họ và tên
              </label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nguyễn Văn A"
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className="font-tech text-[9px] opacity-50 uppercase tracking-widest font-bold mb-2 block">
                Số điện thoại
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0901 234 567"
                className={inputClass}
                required
              />
            </div>

            {error && (
              <p className="text-sm text-tertiary font-body bg-tertiary-container rounded-xl px-3 py-2">
                {error}
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => router.push('/profile')}
                className="flex-1 py-3.5 rounded-full border border-outline-variant font-tech text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:border-secondary transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-3.5 rounded-full bg-secondary text-white font-tech text-[10px] font-bold uppercase tracking-widest disabled:opacity-50 shadow-lg shadow-secondary/20 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Save size={14} />
                )}
                {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
