'use client';

import clsx from 'clsx';
import { useMemo, useState } from 'react';

import MenuEditForm from '@/components/admin/menuEditForm';
import SearchToolbar from '@/components/admin/searchToolbar';
import { useMenusQuery } from '@/hooks/queries/useMenuQuery';
import { formatAbv, normalizeMenuTags } from '@/lib/menu';

import type { Menu, MenuCategory } from '@/types/menu';

const categoryOptions: Array<{ value: MenuCategory | 'all'; label: string }> = [
  { value: 'all', label: '전체' },
  { value: 'cocktail', label: '칵테일' },
  { value: 'whisky', label: '위스키' },
  { value: 'non-alcohol', label: '논알콜' },
  { value: 'highball', label: '하이볼' },
  { value: 'beer', label: '맥주' },
  { value: 'side', label: '사이드' },
];

const categoryLabelMap = Object.fromEntries(
  categoryOptions.map((option) => [option.value, option.label]),
) as Record<MenuCategory | 'all', string>;

const currency = new Intl.NumberFormat('ko-KR');

const formatPriceLabel = (priceType: string) => {
  if (priceType === 'default') {
    return '기본';
  }
  if (priceType === 'shot') {
    return '샷';
  }
  if (priceType === 'bottle') {
    return '보틀';
  }

  return priceType;
};

const filterMenus = (menus: Menu[], query: string, category: MenuCategory | 'all') => {
  const keyword = query.trim().toLowerCase();

  return menus.filter((menu) => {
    if (category !== 'all' && menu.category !== category) {
      return false;
    }

    if (!keyword) {
      return true;
    }

    const tags = normalizeMenuTags(menu.tags).join(' ').toLowerCase();

    return (
      menu.name.toLowerCase().includes(keyword) ||
      menu.name_en.toLowerCase().includes(keyword) ||
      tags.includes(keyword)
    );
  });
};

type MenuQuickPatch = Partial<Pick<Menu, 'is_display' | 'is_sold_out'>>;

const MenuManageClient = () => {
  const { data: menus = [], isLoading, isError } = useMenusQuery();
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<MenuCategory | 'all'>('all');
  const [editingMenuId, setEditingMenuId] = useState<string | null>(null);
  const [quickPatches, setQuickPatches] = useState<Record<string, MenuQuickPatch>>({});

  const filteredMenus = useMemo(
    () => filterMenus(menus, query, categoryFilter),
    [menus, query, categoryFilter],
  );

  const getMenuWithPatches = (menu: Menu): Menu => {
    const patch = quickPatches[menu.id];
    if (!patch) {
      return menu;
    }

    return { ...menu, ...patch };
  };

  const handleQuickToggle = (
    menu: Menu,
    field: 'is_display' | 'is_sold_out',
    nextValue: boolean,
  ) => {
    setQuickPatches((current) => ({
      ...current,
      [menu.id]: { ...current[menu.id], [field]: nextValue },
    }));
    console.log('[patchMenu]', menu.id, { [field]: nextValue });
  };

  const handleDelete = (menu: Menu) => {
    const confirmed = window.confirm(`"${menu.name}" 메뉴를 삭제할까요?`);
    if (!confirmed) {
      return;
    }

    console.log('[deleteMenu]', menu.id);
    if (editingMenuId === menu.id) {
      setEditingMenuId(null);
    }
  };

  const toggleEdit = (menuId: string) => {
    setEditingMenuId((current) => (current === menuId ? null : menuId));
  };

  return (
    <>
      <SearchToolbar
        query={query}
        onQueryChange={setQuery}
        queryPlaceholder="메뉴명, 영문명, 태그 검색"
      />

      <section className="mb-4 flex flex-wrap gap-2">
        {categoryOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setCategoryFilter(option.value)}
            className={clsx(
              'rounded-full border px-3 py-1.5 text-xs font-medium transition',
              categoryFilter === option.value
                ? 'border-[#1f2937] bg-[#1f2937] text-white'
                : 'border-[#d7cec2] bg-white text-[#4b5563] hover:bg-[#f8f3ec]',
            )}
          >
            {option.label}
          </button>
        ))}
      </section>

      <p className="mb-3 text-sm text-[#6b7280]">
        총 {menus.length}개 · 표시 {filteredMenus.length}개
      </p>

      {isLoading ? (
        <div className="rounded-2xl border border-[#d7cec2] bg-[#f8f3ec] p-5 text-sm text-[#4b5563]">
          메뉴를 불러오는 중이에요.
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-[#d7cec2] bg-[#f8f3ec] p-5 text-sm text-[#4b5563]">
          메뉴를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
        </div>
      ) : filteredMenus.length === 0 ? (
        <div className="rounded-2xl border border-[#d7cec2] bg-[#f8f3ec] p-5 text-sm text-[#4b5563]">
          {menus.length === 0 ? '등록된 메뉴가 없어요.' : '검색 조건에 맞는 메뉴가 없어요.'}
        </div>
      ) : (
        <section className="space-y-3">
          {filteredMenus.map((menu) => {
            const displayMenu = getMenuWithPatches(menu);
            const tags = normalizeMenuTags(displayMenu.tags);
            const sortedPrices = [...displayMenu.prices].sort(
              (a, b) => a.display_order - b.display_order,
            );
            const isEditing = editingMenuId === menu.id;

            return (
              <article
                key={menu.id}
                className={clsx(
                  'rounded-2xl border bg-[#f8f3ec] p-5 transition',
                  isEditing
                    ? 'border-[#1f2937] shadow-[0_10px_24px_rgba(31,41,55,0.08)]'
                    : 'border-[#d7cec2]',
                )}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-semibold text-[#111827]">{displayMenu.name}</h2>
                      <span className="rounded-full border border-[#e5d5c3] bg-white px-2 py-0.5 text-[11px] font-medium text-[#7a5a40]">
                        {categoryLabelMap[displayMenu.category]}
                      </span>
                      {displayMenu.is_signature ? (
                        <span className="rounded-full border border-[#d3b391] bg-[#f4e6d8] px-2 py-0.5 text-[11px] font-semibold text-[#5a3d26]">
                          SIGNATURE
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-sm text-[#6b7280]">{displayMenu.name_en}</p>
                    <p className="mt-2 line-clamp-2 text-sm text-[#4b5563]">
                      {displayMenu.description}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      <span
                        className={clsx(
                          'rounded-full px-2 py-1',
                          displayMenu.is_display
                            ? 'bg-[#e8f5e9] text-[#2e7d32]'
                            : 'bg-[#f3f4f6] text-[#6b7280]',
                        )}
                      >
                        {displayMenu.is_display ? '메뉴판 표시' : '메뉴판 숨김'}
                      </span>
                      <span
                        className={clsx(
                          'rounded-full px-2 py-1',
                          displayMenu.is_sold_out
                            ? 'bg-[#fef2f2] text-[#b91c1c]'
                            : 'bg-[#eff6ff] text-[#1d4ed8]',
                        )}
                      >
                        {displayMenu.is_sold_out ? '품절' : '판매 중'}
                      </span>
                      <span className="rounded-full bg-white px-2 py-1 text-[#4b5563]">
                        ABV {formatAbv(displayMenu.abv)}
                      </span>
                    </div>

                    {tags.length > 0 ? (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {tags.map((tag) => (
                          <span
                            key={`${menu.id}-${tag}`}
                            className="rounded-md border border-[#e5d5c3] bg-white px-2 py-0.5 text-xs text-[#6b7280]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    {sortedPrices.length > 0 ? (
                      <div className="mt-3 flex flex-wrap gap-2 text-sm text-[#374151]">
                        {sortedPrices.map((price) => (
                          <span
                            key={`${menu.id}-${price.id}`}
                            className="rounded-md border border-[#e5d5c3] bg-white px-2 py-1"
                          >
                            {formatPriceLabel(price.price_type)} {currency.format(price.price)}원
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-3 text-sm text-[#6b7280]">등록된 가격 없음</p>
                    )}
                  </div>

                  <div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:flex-col">
                    <label className="flex items-center gap-2 rounded-lg border border-[#e5d5c3] bg-white px-3 py-2 text-sm">
                      <input
                        type="checkbox"
                        checked={displayMenu.is_display}
                        onChange={(event) =>
                          handleQuickToggle(menu, 'is_display', event.target.checked)
                        }
                      />
                      표시
                    </label>
                    <label className="flex items-center gap-2 rounded-lg border border-[#e5d5c3] bg-white px-3 py-2 text-sm">
                      <input
                        type="checkbox"
                        checked={displayMenu.is_sold_out}
                        onChange={(event) =>
                          handleQuickToggle(menu, 'is_sold_out', event.target.checked)
                        }
                      />
                      품절
                    </label>
                    <button
                      type="button"
                      onClick={() => toggleEdit(menu.id)}
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
                      onClick={() => handleDelete(menu)}
                      className="rounded-lg border border-[#fecaca] bg-[#fff5f5] px-3 py-2 text-sm text-[#b91c1c]"
                    >
                      삭제
                    </button>
                  </div>
                </div>

                {isEditing ? (
                  <MenuEditForm menu={menu} onCancel={() => setEditingMenuId(null)} />
                ) : null}
              </article>
            );
          })}
        </section>
      )}
    </>
  );
};

export default MenuManageClient;
