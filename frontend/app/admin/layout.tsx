import AdminGuard from '../components/admin/AdminGuard';
import AdminShell from '../components/admin/AdminShell';

export const metadata = {
  title: 'VAULT Admin',
  description: 'Bảng điều khiển quản trị VAULT',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <AdminShell>{children}</AdminShell>
    </AdminGuard>
  );
}
