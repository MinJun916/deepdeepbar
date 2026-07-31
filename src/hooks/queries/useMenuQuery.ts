import { useQuery } from '@tanstack/react-query';

import { getMenus } from '@/services/menu.service';

export const useMenusQuery = (keyword = '') => {
  return useQuery({
    queryKey: ['menus', keyword],
    queryFn: ({ signal }) => getMenus(keyword || undefined, signal),
  });
};
