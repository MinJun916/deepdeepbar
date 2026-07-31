import { api, publicApi } from '@/lib/axios';

import type { CreateMenuRequest, Menu, UpdateMenuRequest } from '@/types/menu';

export const getMenus = async (keyword?: string, signal?: AbortSignal) => {
  const res = await publicApi.get<Menu[]>('/menus/', {
    params: keyword ? { keyword } : undefined,
    signal,
  });
  return res.data;
};

export const createMenu = async (menuData: CreateMenuRequest) => {
  const res = await api.post<Menu>('/menus', menuData);
  return res.data;
};

export const updateMenu = async (menuId: string, menuData: UpdateMenuRequest) => {
  const res = await api.patch<Menu>(`/menus/${menuId}`, menuData);
  return res.data;
};

export const deleteMenu = async (menuId: string) => {
  const res = await api.delete<Menu>(`/menus/${menuId}`);
  return res.data;
};
