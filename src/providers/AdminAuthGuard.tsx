'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useSyncExternalStore } from 'react';

import { getToken } from '@/lib/token';

type AdminAuthGuardProps = {
  children: React.ReactNode;
};

const subscribe = () => () => {};

const useIsClient = () =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

const AdminAuthGuard = ({ children }: AdminAuthGuardProps) => {
  const router = useRouter();
  const isClient = useIsClient();
  const token = isClient ? getToken() : null;

  useEffect(() => {
    if (!isClient || token) {
      return;
    }

    router.replace('/admin/login');
  }, [isClient, router, token]);

  if (!isClient || !token) {
    return null;
  }

  return children;
};

export default AdminAuthGuard;
