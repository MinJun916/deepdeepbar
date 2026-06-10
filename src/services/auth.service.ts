import { api } from '@/lib/axios';

import type { LoginFormData, LoginResponse, LogoutResponse } from '@/types/auth';

export const loginAdmin = async (formData: LoginFormData) => {
  const res = await api.post<LoginResponse>('/auth/login', {
    ...formData,
  });

  return res.data;
};

export const logoutAdmin = async () => {
  const res = await api.post<LogoutResponse>('/auth/logout');
  return res.data;
};
