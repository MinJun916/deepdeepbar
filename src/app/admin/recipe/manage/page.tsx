import Link from 'next/link';

import { createSupabaseAdminClient } from '@/lib/supabase/admin';

import { createRecipeAction, deleteRecipeAction, updateRecipeAction } from '../../actions';

type RecipeRow = {
  id: string;
  menu_id: string;
  glass_type_id: string | null;
  garnish: string | null;
  mixing_method: string;
  notes: string | null;
  menus: { id: string; name: string | null } | null;
  recipe_steps: { id: string; step_order: number; instruction: string }[] | null;
};

type SearchParams = Promise<{
  q?: string;
}>;

type MenuRow = { id: string; name: string | null };
type GlassTypeRow = { id: string; name_ko: string };

const recipeTable = process.env.NEXT_PUBLIC_SUPABASE_RECIPES_TABLE ?? 'recipes';
const menuTable =
  process.env.NEXT_PUBLIC_SUPABASE_MENUS_TABLE ??
  process.env.NEXT_PUBLIC_SUPABASE_COCKTAILS_TABLE ??
  'menus';
const glassTypesTable = process.env.NEXT_PUBLIC_SUPABASE_GLASS_TYPES_TABLE ?? 'glass_types';

const AdminRecipeManagePage = async ({ searchParams }: { searchParams: SearchParams }) => {
  const { q = '' } = await searchParams;
  const keyword = q.trim().toLowerCase();
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
        'id, menu_id, glass_type_id, garnish, mixing_method, notes, menus(id, name), recipe_steps(id, step_order, instruction)',
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
  const filteredRows = rows.filter((recipe) => {
    if (!keyword) {
      return true;
    }

    return (
      (recipe.menus?.name ?? '').toLowerCase().includes(keyword) ||
      recipe.mixing_method.toLowerCase().includes(keyword) ||
      (recipe.notes ?? '').toLowerCase().includes(keyword)
    );
  });
  const menus = (menusData as MenuRow[] | null) ?? [];
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

        <section className="mb-5 rounded-2xl border border-[#e2d8cb] bg-[#f8f3ec] p-4">
          <h2 className="text-lg font-semibold">새 레시피 추가</h2>
          <form action={createRecipeAction} className="mt-3 grid gap-2">
            <select
              name="menu_id"
              className="rounded-lg border border-[#d7cec2] bg-white px-3 py-2"
              required
              defaultValue=""
            >
              <option value="" disabled>
                메뉴 선택
              </option>
              {menus.map((menu) => (
                <option key={menu.id} value={menu.id}>
                  {menu.name ?? '(이름 없음)'}
                </option>
              ))}
            </select>
            <select
              name="glass_type_id"
              className="rounded-lg border border-[#d7cec2] bg-white px-3 py-2"
              defaultValue=""
            >
              <option value="">잔 종류 선택 (선택)</option>
              {glassTypes.map((glass) => (
                <option key={glass.id} value={glass.id}>
                  {glass.name_ko}
                </option>
              ))}
            </select>
            <input
              name="mixing_method"
              placeholder="mixing_method (예: shake + double strain)"
              className="rounded-lg border border-[#d7cec2] bg-white px-3 py-2"
              required
            />
            <textarea
              name="steps_input"
              placeholder="제조 순서를 한 줄씩 입력"
              className="min-h-24 rounded-lg border border-[#d7cec2] bg-white px-3 py-2"
            />
            <input
              name="garnish"
              placeholder="garnish"
              className="rounded-lg border border-[#d7cec2] bg-white px-3 py-2"
            />
            <textarea
              name="notes"
              placeholder="notes"
              className="min-h-16 rounded-lg border border-[#d7cec2] bg-white px-3 py-2"
            />
            <button
              type="submit"
              className="rounded-lg bg-[#1f2937] px-4 py-2 text-sm font-medium text-white"
            >
              레시피 추가
            </button>
          </form>
        </section>

        <form className="mb-4 flex gap-2">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="메뉴명/베이스/재료 검색"
            className="flex-1 rounded-lg border border-[#d7cec2] bg-white px-3 py-2"
          />
          <button
            type="submit"
            className="rounded-lg bg-[#1f2937] px-4 py-2 text-sm font-medium text-white"
          >
            검색
          </button>
        </form>

        {recipesError ? (
          <section className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            레시피를 불러오지 못했습니다: {recipesError.message}
          </section>
        ) : (
          <section className="space-y-3">
            {filteredRows.map((recipe) => (
              <form
                key={recipe.id}
                action={updateRecipeAction}
                className="rounded-2xl border border-[#e2d8cb] bg-[#f8f3ec] p-4"
              >
                <input type="hidden" name="id" value={recipe.id} />
                <div className="grid gap-2">
                  <select
                    name="menu_id"
                    defaultValue={recipe.menu_id}
                    className="rounded-lg border border-[#d7cec2] bg-white px-3 py-2"
                    required
                  >
                    {menus.map((menu) => (
                      <option key={menu.id} value={menu.id}>
                        {menu.name ?? '(이름 없음)'}
                      </option>
                    ))}
                  </select>
                  <select
                    name="glass_type_id"
                    defaultValue={recipe.glass_type_id ?? ''}
                    className="rounded-lg border border-[#d7cec2] bg-white px-3 py-2"
                  >
                    <option value="">잔 종류 선택 (선택)</option>
                    {glassTypes.map((glass) => (
                      <option key={glass.id} value={glass.id}>
                        {glass.name_ko}
                      </option>
                    ))}
                  </select>
                  <input
                    name="mixing_method"
                    defaultValue={recipe.mixing_method}
                    className="rounded-lg border border-[#d7cec2] bg-white px-3 py-2"
                    required
                  />
                  <textarea
                    name="steps_input"
                    defaultValue={(recipe.recipe_steps ?? [])
                      .map((item) => item.instruction)
                      .join('\n')}
                    className="min-h-24 rounded-lg border border-[#d7cec2] bg-white px-3 py-2"
                  />
                  <input
                    name="garnish"
                    defaultValue={recipe.garnish ?? ''}
                    className="rounded-lg border border-[#d7cec2] bg-white px-3 py-2"
                  />
                  <textarea
                    name="notes"
                    defaultValue={recipe.notes ?? ''}
                    className="min-h-16 rounded-lg border border-[#d7cec2] bg-white px-3 py-2"
                  />
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    type="submit"
                    className="rounded-lg bg-[#1f2937] px-3 py-2 text-sm text-white"
                  >
                    저장
                  </button>
                  <button
                    type="submit"
                    formAction={deleteRecipeAction}
                    className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700"
                  >
                    삭제
                  </button>
                </div>
              </form>
            ))}
            {filteredRows.length === 0 ? (
              <div className="rounded-2xl border border-[#d7cec2] bg-[#f8f3ec] p-5 text-sm text-[#4b5563]">
                조건에 맞는 레시피가 없습니다.
              </div>
            ) : null}
          </section>
        )}
      </div>
    </main>
  );
};

export default AdminRecipeManagePage;
