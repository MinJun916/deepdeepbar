'use client';

import { useDeferredValue, useMemo, useState } from 'react';

import { deleteMenuAction, updateMenuAction } from '@/app/admin/actions';
import LazyRenderOnView from '@/components/admin/lazyRenderOnView';
import MenuPriceEditor from '@/components/admin/menuPriceEditor';
import SearchToolbar from '@/components/admin/searchToolbar';

type MenuRow = {
  id: string;
  category: 'cocktail' | 'whisky' | 'non-alcohol' | 'highball' | 'beer' | 'side';
  name: string;
  name_en: string;
  description: string;
  abv: number | null;
  taste_note: string;
  tags: string[] | null;
  is_signature: boolean | null;
  is_display: boolean | null;
  menu_prices:
    | {
        id: string;
        price_type: 'default' | 'shot' | 'bottle' | string;
        price: number;
        display_order: number;
        is_active: boolean;
      }[]
    | null;
};

const categoryOptions = [
  'all',
  'cocktail',
  'whisky',
  'non-alcohol',
  'highball',
  'beer',
  'side',
] as const;
const categorySelectOptions = categoryOptions.map((item) => ({ value: item, label: item }));
const sortOptions = [
  { value: 'signature_first', label: '시그니처 우선 + 가나다' },
  { value: 'name_asc', label: '이름 가나다' },
  { value: 'name_desc', label: '이름 역순' },
  { value: 'category_name', label: '카테고리 + 이름' },
] as const;

type MenuManageClientProps = {
  rows: MenuRow[];
};

const MenuManageClient = ({ rows }: MenuManageClientProps) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<(typeof categoryOptions)[number]>('all');
  const [sort, setSort] = useState<(typeof sortOptions)[number]['value']>('signature_first');
  const deferredQuery = useDeferredValue(query);
  const keyword = deferredQuery.trim().toLowerCase();

  const searchIndexedRows = useMemo(
    () =>
      rows.map((menu) => ({
        menu,
        searchText: `${menu.name} ${menu.name_en} ${menu.description}`.toLowerCase(),
      })),
    [rows],
  );

  const filteredRows = useMemo(
    () =>
      searchIndexedRows
        .filter(({ menu, searchText }) => {
          const matchedCategory = category === 'all' || menu.category === category;
          const matchedKeyword = !keyword || searchText.includes(keyword);
          return matchedCategory && matchedKeyword;
        })
        .map((item) => item.menu)
        .sort((a, b) => {
          if (sort === 'name_desc') {
            return b.name.localeCompare(a.name, 'ko-KR', { sensitivity: 'base' });
          }
          if (sort === 'name_asc') {
            return a.name.localeCompare(b.name, 'ko-KR', { sensitivity: 'base' });
          }
          if (sort === 'category_name') {
            const categoryCompare = a.category.localeCompare(b.category, 'ko-KR', {
              sensitivity: 'base',
            });
            if (categoryCompare !== 0) return categoryCompare;
            return a.name.localeCompare(b.name, 'ko-KR', { sensitivity: 'base' });
          }
          if (a.is_signature !== b.is_signature) return a.is_signature ? -1 : 1;
          return a.name.localeCompare(b.name, 'ko-KR', { sensitivity: 'base' });
        }),
    [searchIndexedRows, category, keyword, sort],
  );

  return (
    <>
      <SearchToolbar
        query={query}
        onQueryChange={setQuery}
        queryPlaceholder="이름/영문명/설명 검색"
        sortValue={sort}
        onSortChange={(value) => setSort(value as (typeof sortOptions)[number]['value'])}
        sortOptions={sortOptions}
        secondaryValue={category}
        onSecondaryChange={(value) => setCategory(value as (typeof categoryOptions)[number])}
        secondaryOptions={categorySelectOptions}
        className="mb-5 grid gap-3 rounded-2xl border border-[#e2d8cb] bg-[#f8f3ec] p-4 sm:grid-cols-[1fr_180px_220px]"
      />

      <p className="mb-3 text-sm text-[#4b5563]">검색 결과 {filteredRows.length}건</p>

      <section className="space-y-3">
        {filteredRows.map((menu) => (
          <LazyRenderOnView key={menu.id} minHeight={560}>
            <form
              action={updateMenuAction}
              className="rounded-2xl border border-[#e2d8cb] bg-[#f8f3ec] p-4"
            >
              <input type="hidden" name="id" value={menu.id} />
              <div className="grid gap-2">
                <select
                  name="category"
                  className="rounded-lg border border-[#d7cec2] bg-white px-3 py-2"
                  defaultValue={menu.category}
                  required
                >
                  {categoryOptions
                    .filter((item) => item !== 'all')
                    .map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                </select>
                <input
                  name="name"
                  defaultValue={menu.name}
                  className="rounded-lg border border-[#d7cec2] bg-white px-3 py-2"
                  required
                />
                <input
                  name="name_en"
                  defaultValue={menu.name_en}
                  className="rounded-lg border border-[#d7cec2] bg-white px-3 py-2"
                  required
                />
                <textarea
                  name="description"
                  defaultValue={menu.description}
                  className="min-h-24 rounded-lg border border-[#d7cec2] bg-white px-3 py-2"
                  required
                />
                <input
                  name="abv"
                  type="number"
                  step="0.1"
                  defaultValue={menu.abv ?? ''}
                  className="rounded-lg border border-[#d7cec2] bg-white px-3 py-2"
                />
                <input
                  name="taste_note"
                  defaultValue={menu.taste_note}
                  className="rounded-lg border border-[#d7cec2] bg-white px-3 py-2"
                  required
                />
                <textarea
                  name="tags"
                  defaultValue={JSON.stringify(menu.tags ?? [])}
                  className="min-h-16 rounded-lg border border-[#d7cec2] bg-white px-3 py-2"
                />
                <MenuPriceEditor
                  name="price_options"
                  defaultSerializedValue={(menu.menu_prices ?? [])
                    .filter((option) => option.is_active)
                    .sort((a, b) => a.display_order - b.display_order)
                    .map((option) => `${option.price_type}|${option.price}`)
                    .join('\n')}
                />
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    name="is_signature"
                    defaultChecked={Boolean(menu.is_signature)}
                  />
                  is_signature
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    name="is_display"
                    defaultChecked={menu.is_display ?? true}
                  />
                  is_display
                </label>
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
                  formAction={deleteMenuAction}
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
            조건에 맞는 메뉴가 없습니다.
          </div>
        ) : null}
      </section>
    </>
  );
};

export default MenuManageClient;
