'use client';

import { useDeferredValue, useMemo, useState } from 'react';

import LazyRenderOnView from '@/components/admin/lazyRenderOnView';

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

const sortOptions = [
  { value: 'menu_name_asc', label: '메뉴 가나다' },
  { value: 'menu_name_desc', label: '메뉴 역순' },
  { value: 'method_asc', label: '제조 방식 가나다' },
  { value: 'latest', label: '최신 등록순' },
  { value: 'oldest', label: '오래된 순' },
] as const;

type RecipeListClientProps = {
  recipes: RecipeRow[];
};

const RecipeListClient = ({ recipes }: RecipeListClientProps) => {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<(typeof sortOptions)[number]['value']>('menu_name_asc');
  const deferredQuery = useDeferredValue(query);
  const keyword = deferredQuery.trim().toLowerCase();

  const filteredRecipes = useMemo(
    () =>
      recipes
        .filter((recipe) => {
          if (!keyword) return true;
          return (
            (recipe.menus?.name ?? '').toLowerCase().includes(keyword) ||
            (recipe.menus?.name_en ?? '').toLowerCase().includes(keyword) ||
            recipe.mixing_method.toLowerCase().includes(keyword) ||
            (recipe.notes ?? '').toLowerCase().includes(keyword) ||
            (recipe.recipe_steps ?? []).some((step) =>
              step.instruction.toLowerCase().includes(keyword),
            )
          );
        })
        .sort((a, b) => {
          if (sort === 'menu_name_desc') {
            return (b.menus?.name ?? '').localeCompare(a.menus?.name ?? '', 'ko-KR', {
              sensitivity: 'base',
            });
          }
          if (sort === 'method_asc') {
            return a.mixing_method.localeCompare(b.mixing_method, 'ko-KR', { sensitivity: 'base' });
          }
          if (sort === 'latest') {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          }
          if (sort === 'oldest') {
            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          }
          return (a.menus?.name ?? '').localeCompare(b.menus?.name ?? '', 'ko-KR', {
            sensitivity: 'base',
          });
        }),
    [recipes, keyword, sort],
  );

  return (
    <>
      <section className="mb-4 grid gap-2 sm:grid-cols-[1fr_220px]">
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="메뉴명/영문명/제조방식/메모 검색"
          className="rounded-lg border border-[#d7cec2] bg-white px-3 py-2"
        />
        <select
          value={sort}
          onChange={(event) => setSort(event.target.value as (typeof sortOptions)[number]['value'])}
          className="rounded-lg border border-[#d7cec2] bg-white px-3 py-2"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </section>

      <section className="space-y-3">
        {filteredRecipes.map((recipe) => (
          <LazyRenderOnView key={recipe.id} minHeight={0}>
            <article className="rounded-2xl border border-[#d7cec2] bg-[#f8f3ec] p-5">
              <h2 className="text-xl font-semibold">{recipe.menus?.name ?? '이름 없는 메뉴'}</h2>
              <p className="mt-1 text-base text-[#6b7280]">{recipe.menus?.name_en ?? '-'}</p>

              <p className="mt-4 text-sm text-[#4b5563]">
                <span className="font-medium text-[#374151]">잔 종류: </span>
                {recipe.glass_types?.name_ko ?? '-'}
              </p>
              <p className="mt-1 text-sm text-[#4b5563]">
                <span className="font-medium text-[#374151]">제조 방식: </span>
                {recipe.mixing_method}
              </p>

              <div className="mt-4">
                <p className="text-sm font-semibold text-[#374151]">제조 방법</p>
                <ol className="mt-1 space-y-1.5 text-sm text-[#4b5563]">
                  {(recipe.recipe_steps ?? []).map((step) => (
                    <li key={step.id}>
                      {step.step_order}. {step.instruction}
                    </li>
                  ))}
                  {(recipe.recipe_steps ?? []).length === 0 ? <li>-</li> : null}
                </ol>
              </div>
              {recipe.garnish ? (
                <p className="mt-4 text-sm text-[#4b5563]">
                  <span className="font-medium text-[#374151]">가니쉬: </span>
                  {recipe.garnish}
                </p>
              ) : null}
              {recipe.notes ? (
                <p className="mt-2 text-sm text-[#4b5563]">
                  <span className="font-medium text-[#374151]">메모: </span>
                  {recipe.notes}
                </p>
              ) : null}
            </article>
          </LazyRenderOnView>
        ))}
        {filteredRecipes.length === 0 ? (
          <div className="rounded-2xl border border-[#d7cec2] bg-[#f8f3ec] p-5 text-sm text-[#4b5563]">
            등록된 레시피가 없습니다.
          </div>
        ) : null}
      </section>
    </>
  );
};

export default RecipeListClient;
