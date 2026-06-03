import { api } from '@/lib/axios';

import type { RecipeResponse } from '@/types/recipe';

export const getRecipes = async (keyword?: string) => {
  const res = await api.get<RecipeResponse[]>('/recipes', {
    params: keyword ? { keyword } : undefined,
  });

  return res.data;
};
