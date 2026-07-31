import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

import { clearToken, getToken, setToken } from './token';

import type { LoginResponse } from '@/types/auth';

type RetryableConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  withCredentials: true,
});

const redirectToLogin = () => {
  if (typeof window === 'undefined') {
    return;
  }

  if (window.location.pathname.startsWith('/admin/login')) {
    return;
  }

  clearToken();
  window.location.replace('/admin/login');
};

/** 동시에 401이 여러 번 나와도 refresh 요청은 한 번만 보냅니다. */
let refreshPromise: Promise<string> | null = null;

const refreshAccessToken = async () => {
  if (!refreshPromise) {
    refreshPromise = axios
      .post<LoginResponse>(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, null, {
        withCredentials: true,
      })
      .then(({ data }) => {
        setToken(data.access_token);
        return data.access_token;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

const isAuthRoute = (url?: string) =>
  Boolean(url?.includes('/auth/login') || url?.includes('/auth/refresh'));

api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetryableConfig | undefined;

    if (!config || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    if (isAuthRoute(config.url) || config._retry) {
      redirectToLogin();
      return Promise.reject(error);
    }

    config._retry = true;

    try {
      const accessToken = await refreshAccessToken();
      config.headers.Authorization = `Bearer ${accessToken}`;
      return api(config);
    } catch {
      redirectToLogin();
      return Promise.reject(error);
    }
  },
);
