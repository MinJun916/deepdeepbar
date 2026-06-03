import { useQuery } from '@tanstack/react-query';

import { getRecipes } from '@/services/recipe.service';

export const useGetRecipesQuery = () => {
  return useQuery({
    queryKey: ['recipes'],
    queryFn: getRecipes,
  });
};
