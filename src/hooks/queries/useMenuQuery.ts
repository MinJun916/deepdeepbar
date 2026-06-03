import { useQuery } from '@tanstack/react-query';

import { getMenus } from '@/services/menu.service';

export const useMenusQuery = () => {
  return useQuery({
    queryKey: ['menus'],
    queryFn: getMenus,
  });
};
