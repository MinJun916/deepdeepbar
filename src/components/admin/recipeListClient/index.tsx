'use client';

import { useState } from 'react';

import LazyRenderOnView from '@/components/admin/lazyRenderOnView';
import SearchToolbar from '@/components/admin/searchToolbar';

import type { RecipeResponse } from '@/types/recipe';

type RecipeListClientProps = {
  recipes: RecipeResponse[];
};

const RecipeListClient = ({ recipes }: RecipeListClientProps) => {
  const [query, setQuery] = useState('');

  return (
    <>
      <SearchToolbar
        query={query}
        onQueryChange={setQuery}
        queryPlaceholder="메뉴명/영문명/제조방식/메모 검색"
      />

      <section className="space-y-3">
      {recipes.map((recipe) => (
        <LazyRenderOnView key={recipe.id} minHeight={0}>
          <article className="rounded-2xl border border-[#d7cec2] bg-[#f8f3ec] p-5">
            <h2 className="text-xl font-semibold">{recipe.menu.name}</h2>
            <p className="mt-1 text-base text-[#6b7280]">{recipe.menu.name_en}</p>

            <p className="mt-4 text-sm text-[#4b5563]">
              <span className="font-medium text-[#374151]">잔 종류: </span>
              {recipe.glass_type.name_ko}
            </p>
            <p className="mt-1 text-sm text-[#4b5563]">
              <span className="font-medium text-[#374151]">제조 방식: </span>
              {recipe.mixing_method}
            </p>

            <div className="mt-4">
              <p className="text-sm font-semibold text-[#374151]">제조 방법</p>
              <ol className="mt-1 space-y-1.5 text-sm text-[#4b5563]">
                {recipe.steps.map((step) => (
                  <li key={step.id}>
                    {step.step_order}. {step.instruction}
                  </li>
                ))}
                {recipe.steps.length === 0 ? <li>-</li> : null}
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
      {recipes.length === 0 ? (
        <div className="rounded-2xl border border-[#d7cec2] bg-[#f8f3ec] p-5 text-sm text-[#4b5563]">
          등록된 레시피가 없습니다.
        </div>
      ) : null}
      </section>
    </>
  );
};

export default RecipeListClient;
