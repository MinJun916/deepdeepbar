'use client';

import clsx from 'clsx';
import { useRouter } from 'next/navigation';

import { showToast } from '@/components/sonner';
import { clearToken } from '@/lib/token';
import { logoutAdmin } from '@/services/auth.service';

type AdminLogoutButtonProps = {
  className?: string;
};

const AdminLogoutButton = ({ className }: AdminLogoutButtonProps) => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutAdmin();
      clearToken();
      showToast({
        kind: 'success',
        message: '로그아웃에 성공했어요',
      });
      router.replace('/admin/login');
    } catch {
      showToast({
        kind: 'error',
        message: '로그아웃에 실패했어요',
      });
    }
  };

  return (
    <button
      type="button"
      className={clsx(
        'rounded-lg border border-[#d7cec2] bg-[#f8f3ec] px-3 py-2 text-sm text-[#4b5563]',
        className,
      )}
      onClick={handleLogout}
    >
      로그아웃
    </button>
  );
};

export default AdminLogoutButton;
