import { useQuery } from '@tanstack/react-query';

import { getRecipes } from '@/services/recipe.service';

export const useGetRecipesQuery = (keyword: string) => {
  return useQuery({
    queryKey: ['recipes', keyword],
    queryFn: () => getRecipes(keyword || undefined),
  });
};
