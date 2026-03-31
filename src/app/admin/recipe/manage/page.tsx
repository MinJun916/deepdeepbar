import Link from 'next/link';

import RecipeManageClient from '@/components/admin/recipeManageClient';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

type RecipeRow = {
  id: string;
  created_at: string;
  menu_id: string;
  glass_type_id: string | null;
  garnish: string | null;
  mixing_method: string;
  notes: string | null;
  menus: { id: string; name: string | null } | null;
  recipe_steps: { id: string; step_order: number; instruction: string }[] | null;
};

type MenuRow = { id: string; name: string | null };
type GlassTypeRow = { id: string; name_ko: string };

const recipeTable = process.env.NEXT_PUBLIC_SUPABASE_RECIPES_TABLE ?? 'recipes';
const menuTable =
  process.env.NEXT_PUBLIC_SUPABASE_MENUS_TABLE ??
  process.env.NEXT_PUBLIC_SUPABASE_COCKTAILS_TABLE ??
  'menus';
const glassTypesTable = process.env.NEXT_PUBLIC_SUPABASE_GLASS_TYPES_TABLE ?? 'glass_types';
const AdminRecipeManagePage = async () => {
  const supabase = createSupabaseAdminClient();

  const [
    { data: recipesData, error: recipesError },
    { data: menusData },
    { data: glassTypesData },
  ] = await Promise.all([
    supabase
      .schema('public')
      .from(recipeTable)
      .select(
        'id, created_at, menu_id, glass_type_id, garnish, mixing_method, notes, menus(id, name), recipe_steps(id, step_order, instruction)',
      )
      .order('created_at', { ascending: false }),
    supabase.schema('public').from(menuTable).select('id, name').order('name', { ascending: true }),
    supabase
      .schema('public')
      .from(glassTypesTable)
      .select('id, name_ko')
      .eq('is_active', true)
      .order('name_ko', { ascending: true }),
  ]);

  const rows = ((recipesData as RecipeRow[] | null) ?? []).map((recipe) => ({
    ...recipe,
    recipe_steps: (recipe.recipe_steps ?? []).sort((a, b) => a.step_order - b.step_order),
  }));
  const menus = ((menusData as MenuRow[] | null) ?? []).sort((a, b) =>
    (a.name ?? '').localeCompare(b.name ?? '', 'ko-KR', { sensitivity: 'base' }),
  );
  const glassTypes = (glassTypesData as GlassTypeRow[] | null) ?? [];

  return (
    <main className="min-h-screen bg-[radial-gradient(120%_90%_at_50%_0%,#fcf8f2_0%,#f3ece2_56%,#ece2d6_100%)] text-[#1f2937]">
      <div className="mx-auto w-full max-w-4xl px-4 pt-10 pb-16 sm:px-6">
        <header className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium tracking-[0.22em] text-[#876a51]">
              ADMIN / RECIPE MANAGE
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight">레시피 추가/수정/삭제</h1>
          </div>
          <Link
            href="/admin/recipe"
            prefetch={false}
            className="rounded-lg border border-[#d7cec2] bg-[#f8f3ec] px-3 py-2 text-sm"
          >
            레시피 보기
          </Link>
        </header>

        {recipesError ? (
          <section className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            레시피를 불러오지 못했습니다: {recipesError.message}
          </section>
        ) : (
          <RecipeManageClient rows={rows} menus={menus} glassTypes={glassTypes} />
        )}
      </div>
    </main>
  );
};

export default AdminRecipeManagePage;
