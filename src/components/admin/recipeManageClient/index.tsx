'use client';

import clsx from 'clsx';
import { useMemo, useState } from 'react';

import RecipeEditForm from '@/components/admin/recipeEditForm';
import SearchToolbar from '@/components/admin/searchToolbar';
import { showToast } from '@/components/sonner';
import { useDeleteRecipeMutation } from '@/hooks/mutations/useRecipeMutation';
import { useGetRecipesQuery } from '@/hooks/queries/useRecipeQuery';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { glassTypeOptions, type UpdateRecipeFormValues } from '@/schemas/recipe';

import type { RecipeResponse } from '@/types/recipe';

const glassLabelMap = Object.fromEntries(
  glassTypeOptions.map((option) => [option.value, option.label]),
) as Record<string, string>;

type RecipeLocalPatch = Partial<
  Pick<RecipeResponse, 'garnish' | 'mixing_method' | 'notes' | 'steps'>
> & {
  glass_type?: RecipeResponse['glass_type'];
};

const applyPatch = (recipe: RecipeResponse, patch?: RecipeLocalPatch): RecipeResponse => {
  if (!patch) {
    return recipe;
  }

  return {
    ...recipe,
    ...patch,
    glass_type: patch.glass_type ?? recipe.glass_type,
    steps: patch.steps ?? recipe.steps,
  };
};

const RecipeManageClient = () => {
  const [query, setQuery] = useState('');
  const keyword = useDebouncedValue(query.trim(), 300);
  const { data: recipes = [], isLoading, isError } = useGetRecipesQuery(keyword);

  const [editingRecipeId, setEditingRecipeId] = useState<string | null>(null);
  const [deletedIds, setDeletedIds] = useState<Set<string>>(() => new Set());
  const [localPatches, setLocalPatches] = useState<Record<string, RecipeLocalPatch>>({});

  const { mutate: deleteRecipe } = useDeleteRecipeMutation();

  const visibleRecipes = useMemo(
    () =>
      recipes
        .filter((recipe) => !deletedIds.has(recipe.id))
        .map((recipe) => applyPatch(recipe, localPatches[recipe.id])),
    [recipes, deletedIds, localPatches],
  );

  const handleDelete = (recipe: RecipeResponse) => {
    const confirmed = window.confirm(`"${recipe.menu.name}" 레시피를 삭제할까요?`);
    if (!confirmed) {
      return;
    }

    deleteRecipe(recipe.id, {
      onSuccess: () => {
        setDeletedIds((current) => new Set(current).add(recipe.id));
        if (editingRecipeId === recipe.id) {
          setEditingRecipeId(null);
        }
        showToast({ kind: 'success', message: '레시피를 삭제했어요.' });
      },
      onError: () => {
        showToast({
          kind: 'error',
          message: '레시피를 삭제하지 못했어요. 잠시 후 다시 시도해 주세요.',
        });
      },
    });
  };

  const handleSaved = (recipeId: string, values: UpdateRecipeFormValues) => {
    setLocalPatches((current) => {
      const base = recipes.find((recipe) => recipe.id === recipeId);
      if (!base) {
        return current;
      }

      return {
        ...current,
        [recipeId]: {
          garnish: values.garnish,
          mixing_method: values.mixing_method,
          notes: values.notes,
          glass_type: {
            ...base.glass_type,
            code: values.glass_type,
            name_ko: glassLabelMap[values.glass_type] ?? values.glass_type,
          },
          steps: values.steps.map((step, index) => ({
            id: base.steps[index]?.id ?? `local-${recipeId}-${index}`,
            recipe_id: recipeId,
            step_order: step.step_order,
            instruction: step.instruction,
          })),
        },
      };
    });
  };

  const toggleEdit = (recipeId: string) => {
    setEditingRecipeId((current) => (current === recipeId ? null : recipeId));
  };

  return (
    <>
      <SearchToolbar
        query={query}
        onQueryChange={setQuery}
        queryPlaceholder="메뉴명/영문명/제조방식/메모 검색"
      />

      <p className="mb-3 text-sm text-[#6b7280]">표시 {visibleRecipes.length}개</p>

      {isLoading ? (
        <div className="rounded-2xl border border-[#d7cec2] bg-[#f8f3ec] p-5 text-sm text-[#4b5563]">
          레시피를 불러오는 중이에요.
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-[#d7cec2] bg-[#f8f3ec] p-5 text-sm text-[#4b5563]">
          레시피를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
        </div>
      ) : visibleRecipes.length === 0 ? (
        <div className="rounded-2xl border border-[#d7cec2] bg-[#f8f3ec] p-5 text-sm text-[#4b5563]">
          등록된 레시피가 없어요.
        </div>
      ) : (
        <section className="space-y-3">
          {visibleRecipes.map((recipe) => {
            const isEditing = editingRecipeId === recipe.id;

            return (
              <article
                key={recipe.id}
                className={clsx(
                  'rounded-2xl border bg-[#f8f3ec] p-5 transition',
                  isEditing
                    ? 'border-[#1f2937] shadow-[0_10px_24px_rgba(31,41,55,0.08)]'
                    : 'border-[#d7cec2]',
                )}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-semibold text-[#111827]">{recipe.menu.name}</h2>
                    <p className="mt-1 text-sm text-[#6b7280]">{recipe.menu.name_en}</p>

                    <div className="mt-3 space-y-1 text-sm text-[#4b5563]">
                      <p>
                        <span className="font-medium text-[#374151]">잔 종류: </span>
                        {recipe.glass_type.name_ko}
                      </p>
                      <p>
                        <span className="font-medium text-[#374151]">제조 방식: </span>
                        {recipe.mixing_method || '-'}
                      </p>
                      {recipe.garnish ? (
                        <p>
                          <span className="font-medium text-[#374151]">가니쉬: </span>
                          {recipe.garnish}
                        </p>
                      ) : null}
                      {recipe.notes ? (
                        <p>
                          <span className="font-medium text-[#374151]">메모: </span>
                          {recipe.notes}
                        </p>
                      ) : null}
                    </div>

                    <div className="mt-4">
                      <p className="text-sm font-semibold text-[#374151]">제조 방법</p>
                      <ol className="mt-1 space-y-1.5 text-sm text-[#4b5563]">
                        {[...recipe.steps]
                          .sort((a, b) => a.step_order - b.step_order)
                          .map((step) => (
                            <li key={step.id}>
                              {step.step_order}. {step.instruction}
                            </li>
                          ))}
                        {recipe.steps.length === 0 ? <li>-</li> : null}
                      </ol>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:flex-col">
                    <button
                      type="button"
                      onClick={() => toggleEdit(recipe.id)}
                      className={clsx(
                        'rounded-lg px-3 py-2 text-sm font-medium',
                        isEditing
                          ? 'border border-[#1f2937] bg-white text-[#1f2937]'
                          : 'bg-[#1f2937] text-white',
                      )}
                    >
                      {isEditing ? '수정 닫기' : '상세 수정'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(recipe)}
                      className="rounded-lg border border-[#fecaca] bg-[#fff5f5] px-3 py-2 text-sm text-[#b91c1c]"
                    >
                      삭제
                    </button>
                  </div>
                </div>

                {isEditing ? (
                  <RecipeEditForm
                    recipe={recipe}
                    onCancel={() => setEditingRecipeId(null)}
                    onSaved={handleSaved}
                  />
                ) : null}
              </article>
            );
          })}
        </section>
      )}
    </>
  );
};

export default RecipeManageClient;
