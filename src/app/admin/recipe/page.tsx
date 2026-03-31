import Link from 'next/link';

import RecipeListClient from '@/components/admin/recipeListClient';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

type StepRow = {
  id: string;
  step_order: number;
  instruction: string;
};

type RecipeRow = {
  id: string;
  created_at: string;
  garnish: string | null;
  mixing_method: string;
  notes: string | null;
  menus: { name: string | null; name_en: string | null } | null;
  glass_types: { name_ko: string } | null;
  recipe_steps: StepRow[] | null;
};

const recipeTable = process.env.NEXT_PUBLIC_SUPABASE_RECIPES_TABLE ?? 'recipes';
const AdminRecipePage = async () => {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .schema('public')
    .from(recipeTable)
    .select(
      'id, created_at, garnish, mixing_method, notes, menus(name, name_en), glass_types(name_ko), recipe_steps(id, step_order, instruction)',
    );

  const recipes = ((data as RecipeRow[] | null) ?? []).map((recipe) => ({
    ...recipe,
    recipe_steps: (recipe.recipe_steps ?? []).sort((a, b) => a.step_order - b.step_order),
  }));

  return (
    <main className="min-h-screen bg-[radial-gradient(120%_90%_at_50%_0%,#fcf8f2_0%,#f3ece2_56%,#ece2d6_100%)] text-[#1f2937]">
      <div className="mx-auto w-full max-w-4xl px-4 pt-10 pb-16 sm:px-6">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium tracking-[0.22em] text-[#876a51]">ADMIN / RECIPE</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight">레시피 보기</h1>
          </div>
          <div className="flex gap-2">
            <Link
              href="/admin/recipe/manage"
              prefetch={false}
              className="rounded-lg border border-[#c7a887] bg-[#f0dfcf] px-3 py-2 text-sm text-[#4a3322]"
            >
              레시피 관리
            </Link>
            <Link
              href="/admin"
              prefetch={false}
              className="rounded-lg border border-[#d7cec2] bg-[#f8f3ec] px-3 py-2 text-sm"
            >
              관리자 홈
            </Link>
          </div>
        </header>
        {error ? (
          <section className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            레시피를 불러오지 못했습니다: {error.message}
          </section>
        ) : (
          <RecipeListClient recipes={recipes} />
        )}
      </div>
    </main>
  );
};

export default AdminRecipePage;
