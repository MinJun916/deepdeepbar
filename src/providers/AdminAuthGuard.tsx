'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useSyncExternalStore } from 'react';

import { getToken } from '@/lib/token';

type AdminAuthGuardProps = {
  children: React.ReactNode;
};

const subscribe = () => () => {};

const AdminAuthGuard = ({ children }: AdminAuthGuardProps) => {
  const router = useRouter();
  const token = useSyncExternalStore(subscribe, getToken, () => null);

  useEffect(() => {
    if (!token) {
      router.replace('/admin/login');
    }
  }, [router, token]);

  if (!token) {
    return null;
  }

  return children;
};

export default AdminAuthGuard;
