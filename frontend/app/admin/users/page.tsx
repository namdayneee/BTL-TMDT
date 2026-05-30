'use client';

import { useCallback, useEffect, useState } from 'react';
import { Pencil, Users, X } from 'lucide-react';
import AdminPageTitle from '../../components/admin/AdminPageTitle';
import { fetchAdminUsers, type AdminUser } from '../../lib/admin-api';
import { roleBadgeLabel } from '../../lib/auth-client';
import { updateUserProfileAsAdmin } from '../../lib/profile-api';

const inputClass =
  'w-full bg-slate-50 border border-slate-200 focus:border-secondary rounded-lg py-2.5 px-3 outline-none font-body text-sm';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function UserEditModal({
  user,
  onClose,
  onSaved,
}: {
  user: AdminUser;
  onClose: () => void;
  onSaved: (userId: number, fullName: string | null, phone: string | null) => void;
}) {
  const [fullName, setFullName] = useState(user.profile?.fullName ?? '');
  const [phone, setPhone] = useState(user.profile?.phone ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await updateUserProfileAsAdmin(user.id, {
        fullName: fullName.trim() || null,
        phone: phone.trim() || null,
      });
      onSaved(user.id, fullName.trim() || null, phone.trim() || null);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lưu thất bại');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="admin-card admin-card-static w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div>
            <h3 className="font-display text-xl text-slate-900 uppercase tracking-wide">
              Sửa hồ sơ
            </h3>
            <p className="font-body text-xs text-slate-500 mt-0.5">{user.email}</p>
          </div>
          <button type="button" onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={(e) => void handleSubmit(e)} className="p-5 space-y-4">
          <div>
            <label className="font-tech text-[10px] text-slate-500 uppercase tracking-widest block mb-1">
              Họ và tên
            </label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={inputClass}
              placeholder="Nguyễn Văn A"
            />
          </div>
          <div>
            <label className="font-tech text-[10px] text-slate-500 uppercase tracking-widest block mb-1">
              Số điện thoại
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClass}
              placeholder="0901 234 567"
            />
          </div>
          <p className="font-body text-xs text-slate-500">
            Thay đổi được lưu vào hồ sơ khách — hiển thị đồng bộ trên trang Hồ sơ và Checkout khi khách đăng nhập lại.
          </p>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={saving}
            className="admin-btn-primary w-full justify-center disabled:opacity-50"
          >
            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'customer' | 'admin'>('all');
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAdminUsers();
      setUsers(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Không tải được danh sách');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered =
    filter === 'all' ? users : users.filter((u) => u.role === filter);

  const customerCount = users.filter((u) => u.role === 'customer').length;

  const handleProfileSaved = (
    userId: number,
    fullName: string | null,
    phone: string | null
  ) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              profile: {
                fullName,
                phone,
                address: u.profile?.address ?? null,
              },
            }
          : u
      )
    );
  };

  return (
    <div className="space-y-6">
      <AdminPageTitle subtitle="Xem và chỉnh sửa họ tên, số điện thoại khách hàng — đồng bộ với hồ sơ & checkout.">
        <button type="button" onClick={() => void load()} className="admin-btn-primary shrink-0">
          Làm mới
        </button>
      </AdminPageTitle>

      <div className="flex flex-wrap gap-2">
        {(
          [
            ['all', 'Tất cả'],
            ['customer', 'Khách hàng'],
            ['admin', 'Quản trị'],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-full font-tech text-[10px] font-bold uppercase tracking-widest transition-colors ${
              filter === key
                ? 'bg-secondary text-white shadow-md shadow-secondary/25'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-secondary'
            }`}
          >
            {label}
            {key === 'customer' && ` (${customerCount})`}
          </button>
        ))}
      </div>

      {error && <div className="admin-alert-error font-body">{error}</div>}

      {loading ? (
        <div className="admin-card admin-card-static h-48 animate-pulse bg-slate-100" />
      ) : filtered.length === 0 ? (
        <div className="admin-card admin-card-static p-12 text-center">
          <Users className="mx-auto text-slate-300 mb-3" size={40} />
          <p className="font-tech text-sm text-slate-500">Không có người dùng.</p>
        </div>
      ) : (
        <div className="admin-card admin-card-static admin-table-wrap overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th className="px-4 py-3 font-tech text-[10px] uppercase tracking-widest text-slate-500">
                  ID
                </th>
                <th className="px-4 py-3 font-tech text-[10px] uppercase tracking-widest text-slate-500">
                  Email
                </th>
                <th className="px-4 py-3 font-tech text-[10px] uppercase tracking-widest text-slate-500">
                  Họ tên
                </th>
                <th className="px-4 py-3 font-tech text-[10px] uppercase tracking-widest text-slate-500">
                  SĐT
                </th>
                <th className="px-4 py-3 font-tech text-[10px] uppercase tracking-widest text-slate-500">
                  Vai trò
                </th>
                <th className="px-4 py-3 font-tech text-[10px] uppercase tracking-widest text-slate-500">
                  Ngày tạo
                </th>
                <th className="px-4 py-3 font-tech text-[10px] uppercase tracking-widest text-slate-500">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">#{user.id}</td>
                  <td className="px-4 py-3 font-body text-slate-800">{user.email}</td>
                  <td className="px-4 py-3 font-body text-slate-600">
                    {user.profile?.fullName || '—'}
                  </td>
                  <td className="px-4 py-3 font-body text-slate-600">
                    {user.profile?.phone || '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-tech font-bold uppercase tracking-wider ${
                        user.role === 'admin'
                          ? 'bg-secondary/15 text-secondary'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {roleBadgeLabel(user.role)}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-body text-slate-500 text-xs">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setEditingUser(user)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-slate-200 font-tech text-[9px] font-bold uppercase tracking-widest text-slate-700 hover:border-secondary hover:text-secondary transition-colors"
                    >
                      <Pencil size={12} />
                      Sửa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingUser && (
        <UserEditModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSaved={handleProfileSaved}
        />
      )}
    </div>
  );
}
