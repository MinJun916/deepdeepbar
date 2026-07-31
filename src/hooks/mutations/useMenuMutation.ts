import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createMenu, deleteMenu, updateMenu } from '@/services/menu.service';

import type { UpdateMenuRequest } from '@/types/menu';

export const useCreateMenuMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['createMenu'],
    mutationFn: createMenu,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menus'] });
    },
  });
};

export const useUpdateMenuMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['updateMenu'],
    mutationFn: ({ menuId, menuData }: { menuId: string; menuData: UpdateMenuRequest }) =>
      updateMenu(menuId, menuData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menus'] });
    },
  });
};

export const useDeleteMenuMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['deleteMenu'],
    mutationFn: deleteMenu,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menus'] });
    },
  });
};
