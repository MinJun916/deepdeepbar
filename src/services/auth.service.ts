import { api } from '@/lib/axios';

import type { LoginFormData, LoginResponse } from '@/types/auth';

export const loginAdmin = async (formData: LoginFormData) => {
  const res = await api.post<LoginResponse>('/auth/login', {
    ...formData,
  });

  return res.data;
};
