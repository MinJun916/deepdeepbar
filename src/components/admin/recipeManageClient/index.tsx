'use client';

import { useDeferredValue, useMemo, useState } from 'react';

import { createRecipeAction, deleteRecipeAction, updateRecipeAction } from '@/app/admin/actions';
import LazyRenderOnView from '@/components/admin/lazyRenderOnView';
import SearchToolbar from '@/components/admin/searchToolbar';
import useActionToast from '@/components/admin/useActionToast';

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

const sortOptions = [
  { value: 'menu_name_asc', label: '메뉴 가나다' },
  { value: 'menu_name_desc', label: '메뉴 역순' },
  { value: 'method_asc', label: '제조 방식 가나다' },
  { value: 'latest', label: '최신 등록순' },
  { value: 'oldest', label: '오래된 순' },
] as const;

type RecipeManageClientProps = {
  rows: RecipeRow[];
  menus: MenuRow[];
  glassTypes: GlassTypeRow[];
};

const RecipeManageClient = ({ rows, menus, glassTypes }: RecipeManageClientProps) => {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<(typeof sortOptions)[number]['value']>('menu_name_asc');
  const { runAction, isPending } = useActionToast();
  const deferredQuery = useDeferredValue(query);
  const keyword = deferredQuery.trim().toLowerCase();

  const searchIndexedRows = useMemo(
    () =>
      rows.map((recipe) => ({
        recipe,
        createdAtTs: new Date(recipe.created_at).getTime(),
        searchText:
          `${recipe.menus?.name ?? ''} ${recipe.mixing_method} ${recipe.notes ?? ''}`.toLowerCase(),
      })),
    [rows],
  );

  const filteredRows = useMemo(
    () =>
      searchIndexedRows
        .filter(({ searchText }) => {
          if (!keyword) return true;
          return searchText.includes(keyword);
        })
        .sort((a, b) => {
          if (sort === 'menu_name_desc') {
            return (b.recipe.menus?.name ?? '').localeCompare(a.recipe.menus?.name ?? '', 'ko-KR', {
              sensitivity: 'base',
            });
          }
          if (sort === 'method_asc') {
            return a.recipe.mixing_method.localeCompare(b.recipe.mixing_method, 'ko-KR', {
              sensitivity: 'base',
            });
          }
          if (sort === 'latest') {
            return b.createdAtTs - a.createdAtTs;
          }
          if (sort === 'oldest') {
            return a.createdAtTs - b.createdAtTs;
          }
          return (a.recipe.menus?.name ?? '').localeCompare(b.recipe.menus?.name ?? '', 'ko-KR', {
            sensitivity: 'base',
          });
        })
        .map((item) => item.recipe),
    [searchIndexedRows, keyword, sort],
  );

  return (
    <>
      <section className="mb-5 rounded-2xl border border-[#e2d8cb] bg-[#f8f3ec] p-4">
        <h2 className="text-lg font-semibold">새 레시피 추가</h2>
        <form
          className="mt-3 grid gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            runAction(createRecipeAction, formData, {
              loading: '레시피 추가 중...',
              success: '레시피를 추가했어요.',
              error: '레시피 추가에 실패했어요',
            });
          }}
        >
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
            disabled={isPending}
            className="rounded-lg bg-[#1f2937] px-4 py-2 text-sm font-medium text-white"
          >
            레시피 추가
          </button>
        </form>
      </section>

      <SearchToolbar
        query={query}
        onQueryChange={setQuery}
        queryPlaceholder="메뉴명/베이스/재료 검색"
        sortValue={sort}
        onSortChange={(value) => setSort(value as (typeof sortOptions)[number]['value'])}
        sortOptions={sortOptions}
      />

      <section className="space-y-3">
        {filteredRows.map((recipe) => (
          <LazyRenderOnView key={recipe.id} minHeight={0}>
            <form
              className="rounded-2xl border border-[#e2d8cb] bg-[#f8f3ec] p-4"
              onSubmit={(event) => {
                event.preventDefault();
                const formData = new FormData(event.currentTarget);
                runAction(updateRecipeAction, formData, {
                  loading: '레시피 저장 중...',
                  success: '레시피를 저장했어요.',
                  error: '레시피 저장에 실패했어요',
                });
              }}
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
                  disabled={isPending}
                  className="rounded-lg bg-[#1f2937] px-3 py-2 text-sm text-white"
                >
                  저장
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={(event) => {
                    const form = event.currentTarget.closest('form');
                    if (!form) {
                      return;
                    }
                    const formData = new FormData(form);
                    runAction(deleteRecipeAction, formData, {
                      loading: '레시피 삭제 중...',
                      success: '레시피를 삭제했어요.',
                      error: '레시피 삭제에 실패했어요',
                    });
                  }}
                  className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700"
                >
                  삭제
                </button>
              </div>
            </form>
          </LazyRenderOnView>
        ))}
        {filteredRows.length === 0 ? (
          <div className="rounded-2xl border border-[#d7cec2] bg-[#f8f3ec] p-5 text-sm text-[#4b5563]">
            조건에 맞는 레시피가 없습니다.
          </div>
        ) : null}
      </section>
    </>
  );
};

export default RecipeManageClient;
