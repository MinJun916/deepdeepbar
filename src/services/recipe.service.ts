import { api } from '@/lib/axios';

import type { RecipeResponse } from '@/types/recipe';

export const getRecipes = async () => {
  const res = await api.get<RecipeResponse[]>('/recipes');

  return res.data;
};
