import AdminAuthGuard from '@/providers/AdminAuthGuard';

type AdminProtectedLayoutProps = {
  children: React.ReactNode;
};

const AdminProtectedLayout = ({ children }: AdminProtectedLayoutProps) => {
  return <AdminAuthGuard>{children}</AdminAuthGuard>;
};

export default AdminProtectedLayout;
