'use client';

import { useMemo, useState } from 'react';

import Footer from '@/components/footer';
import IntroOverlay from '@/components/introOverlay';
import MenuCard from '@/components/menu/menuCard';
import ScrollToTopButton from '@/components/scrollToTopButton';
import { useMenusQuery } from '@/hooks/queries/useMenuQuery';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { normalizeMenuTags } from '@/lib/menu';

import type { Menu } from '@/types/menu';

const categories = [
  { key: 'all', label: '전체' },
  { key: 'cocktail', label: '칵테일' },
  { key: 'whisky', label: '위스키' },
  { key: 'non-alcohol', label: '논알콜' },
  { key: 'highball', label: '하이볼' },
  { key: 'beer', label: '맥주' },
  { key: 'side', label: '사이드' },
] as const;

type MenuCategory = (typeof categories)[number]['key'];

const currency = new Intl.NumberFormat('ko-KR');

const sortMenus = (items: Menu[]) =>
  [...items].sort((a, b) => {
    if (a.is_signature !== b.is_signature) {
      return a.is_signature ? -1 : 1;
    }
    return a.name.localeCompare(b.name, 'ko-KR');
  });

const HomePageView = () => {
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory>('all');
  const [searchKeyword, setSearchKeyword] = useState('');

  const debouncedSearchKeyword = useDebouncedValue(searchKeyword.trim(), 300);
  const { data, isLoading, isError } = useMenusQuery(debouncedSearchKeyword);

  const displayMenus = useMemo(() => {
    const items = (data ?? [])
      .filter((menu) => menu.is_display)
      .map((menu) => ({
        ...menu,
        tags: normalizeMenuTags(menu.tags),
      }));

    return sortMenus(items);
  }, [data]);

  const filteredMenus = useMemo(() => {
    if (selectedCategory === 'all') {
      return displayMenus;
    }

    return displayMenus.filter((menu) => menu.category === selectedCategory);
  }, [displayMenus, selectedCategory]);

  return (
    <main className="min-h-screen bg-[radial-gradient(120%_90%_at_50%_0%,#fcf8f2_0%,#f3ece2_56%,#ece2d6_100%)] text-[#1f2937]">
      <IntroOverlay />
      <div className="mx-auto w-full max-w-3xl px-4 pt-8 pb-16 sm:px-6 sm:pt-10">
        <header className="mb-7 sm:mb-9">
          <p className="text-xs font-medium tracking-[0.24em] text-[#876a51]">DEEP DEEP BAR</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#1f2937] sm:text-3xl">
            Menu
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 break-keep text-[#4b5563] sm:text-[15px]">
            혼자와도 함께하는, 밤이 깊어질수록 더 좋아지는 공간. 혼술바 딥딥
          </p>
        </header>

        <section className="mb-4 sm:mb-5">
          <div className="relative">
            <input
              type="search"
              value={searchKeyword}
              onChange={(event) => setSearchKeyword(event.target.value)}
              placeholder="메뉴명, 영문명, 태그 검색"
              aria-label="메뉴 검색"
              className="w-full rounded-full border border-[#d7cec2] bg-[#f8f3ec] py-2.5 pr-10 pl-4 text-sm text-[#1f2937] transition outline-none placeholder:text-[#9ca3af] focus:border-[#c29a74] focus:bg-white [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
            />
            {searchKeyword ? (
              <button
                type="button"
                onClick={() => setSearchKeyword('')}
                aria-label="검색어 지우기"
                className="absolute top-1/2 right-3 -translate-y-1/2 text-sm text-[#9ca3af] transition hover:text-[#4b5563]"
              >
                ×
              </button>
            ) : null}
          </div>
        </section>

        <section className="hide-scrollbar -mx-1 mb-5 overflow-x-auto px-1 sm:mb-6">
          <div className="flex min-w-max gap-2">
            {categories.map((category) => {
              const isActive = selectedCategory === category.key;

              return (
                <button
                  key={category.key}
                  type="button"
                  onClick={() => setSelectedCategory(category.key)}
                  className={`rounded-full border px-3.5 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'border-[#c29a74] bg-[#f0dfcf] text-[#4a3322] shadow-[0_8px_18px_rgba(120,84,52,0.14)]'
                      : 'border-[#d7cec2] bg-[#f8f3ec] text-[#374151]'
                  }`}
                >
                  {category.label}
                </button>
              );
            })}
          </div>
        </section>

        <section className="space-y-3.5 sm:space-y-4">
          {isLoading ? (
            <div className="rounded-2xl border border-[#d7cec2] bg-[#f8f3ec] p-5 text-sm text-[#4b5563]">
              메뉴를 불러오는 중이에요.
            </div>
          ) : isError ? (
            <div className="rounded-2xl border border-[#d7cec2] bg-[#f8f3ec] p-5 text-sm text-[#4b5563]">
              메뉴를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
            </div>
          ) : filteredMenus.length > 0 ? (
            filteredMenus.map((menu) => <MenuCard key={menu.id} menu={menu} currency={currency} />)
          ) : (
            <div className="rounded-2xl border border-[#d7cec2] bg-[#f8f3ec] p-5 text-sm text-[#4b5563]">
              {debouncedSearchKeyword.trim() ? '검색 결과가 없어요.' : '표시할 메뉴가 없어요.'}
            </div>
          )}
        </section>

        <Footer />
      </div>
      <ScrollToTopButton />
    </main>
  );
};

export default HomePageView;
