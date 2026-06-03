import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createMenu } from '@/services/menu.service';

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
