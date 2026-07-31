import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createRecipe, deleteRecipe, updateRecipe } from '@/services/recipe.service';
import { UpdateRecipeRequest } from '@/types/recipe';

export const useCreateRecipeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['createRecipe'],
    mutationFn: createRecipe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });
};

export const useUpdateRecipeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['updateRecipe'],
    mutationFn: ({ recipeId, recipeData }: { recipeId: string; recipeData: UpdateRecipeRequest }) =>
      updateRecipe(recipeId, recipeData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });
};

export const useDeleteRecipeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['deleteRecipe'],
    mutationFn: (recipeId: string) => deleteRecipe(recipeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });
};
