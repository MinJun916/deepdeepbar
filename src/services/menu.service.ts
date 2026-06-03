import { api } from '@/lib/axios';

import type { CreateMenuRequest, Menu } from '@/types/menu';

export const getMenus = async () => {
  const res = await api.get<Menu[]>('/menus');
  return res.data;
};

export const createMenu = async (menuData: CreateMenuRequest) => {
  const res = await api.post<Menu>('/menus', menuData);
  return res.data;
};
