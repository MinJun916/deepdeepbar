import type { CartItem } from '@/types/order';

export const TABLE_SESSION_TOKEN_KEY = 'deepdeepbar_table_session_token';
export const CART_STORAGE_KEY = 'deepdeepbar_cart';

const canUseStorage = () => typeof window !== 'undefined';

export const getTableSessionToken = () =>
  canUseStorage() ? localStorage.getItem(TABLE_SESSION_TOKEN_KEY) : null;

export const setTableSessionToken = (token: string) =>
  localStorage.setItem(TABLE_SESSION_TOKEN_KEY, token);

export const getStoredCart = (): CartItem[] => {
  if (!canUseStorage()) return [];
  try {
    const value: unknown = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) ?? '[]');
    return Array.isArray(value) ? (value as CartItem[]) : [];
  } catch {
    return [];
  }
};

export const storeCart = (cart: CartItem[]) =>
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));

export const clearCustomerSession = () => {
  if (!canUseStorage()) return;
  localStorage.removeItem(TABLE_SESSION_TOKEN_KEY);
  localStorage.removeItem(CART_STORAGE_KEY);
};
