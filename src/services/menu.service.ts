import { api } from '@/lib/axios';

import type { Menu } from '@/types/menu';

export const getMenus = async () => {
  const res = await api.get<Menu[]>('/menus');
  return res.data;
};
