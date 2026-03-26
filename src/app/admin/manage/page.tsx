import Link from 'next/link';

import { canUseSupabaseAdmin, createSupabaseAdminClient } from '@/lib/supabase/admin';

import { deleteMenuAction, updateMenuAction } from '../actions';

type MenuRow = {
  id: string;
  category: 'cocktail' | 'whisky' | 'non-alcohol' | 'highball' | 'side';
  name: string;
  name_en: string;
  description: string;
  price: number;
  abv: number | null;
  taste_note: string;
  tags: string[] | null;
  is_signature: boolean | null;
};

type SearchParams = Promise<{
  q?: string;
  category?: string;
}>;

const categoryOptions = ['all', 'cocktail', 'whisky', 'non-alcohol', 'highball', 'side'] as const;
const menuTable = process.env.NEXT_PUBLIC_SUPABASE_COCKTAILS_TABLE ?? 'Menu';

const AdminManagePage = async ({ searchParams }: { searchParams: SearchParams }) => {
  const { q = '', category = 'all' } = await searchParams;

  if (!canUseSupabaseAdmin) {
    return (
      <main className="mx-auto min-h-screen w-full max-w-4xl p-6">
        <h1 className="text-2xl font-semibold">메뉴 관리</h1>
        <p className="mt-3 text-sm text-red-600">
          `.env.local`에 `SUPABASE_SECRET_KEY`를 추가해 주세요.
        </p>
      </main>
    );
  }

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .schema('public')
    .from(menuTable)
    .select('id, category, name, name_en, description, price, abv, taste_note, tags, is_signature')
    .order('name', { ascending: true });

  if (error) {
    return (
      <main className="mx-auto min-h-screen w-full max-w-4xl p-6">
        <h1 className="text-2xl font-semibold">메뉴 관리</h1>
        <p className="mt-3 text-sm text-red-600">{error.message}</p>
      </main>
    );
  }

  const rows = (data as MenuRow[] | null) ?? [];
  const keyword = q.trim().toLowerCase();

  const filteredRows = rows.filter((menu) => {
    const matchedCategory = category === 'all' || menu.category === category;
    const matchedKeyword =
      !keyword ||
      menu.name.toLowerCase().includes(keyword) ||
      menu.name_en.toLowerCase().includes(keyword) ||
      menu.description.toLowerCase().includes(keyword);

    return matchedCategory && matchedKeyword;
  });

  return (
    <main className="min-h-screen bg-[radial-gradient(120%_90%_at_50%_0%,#fcf8f2_0%,#f3ece2_56%,#ece2d6_100%)] text-[#1f2937]">
      <div className="mx-auto w-full max-w-4xl px-4 pt-10 pb-16 sm:px-6">
        <header className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium tracking-[0.22em] text-[#876a51]">ADMIN / MANAGE</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight">메뉴 검색/수정/삭제</h1>
          </div>
          <Link
            href="/admin"
            className="rounded-lg border border-[#d7cec2] bg-[#f8f3ec] px-3 py-2 text-sm"
          >
            관리자 홈
          </Link>
        </header>

        <form className="mb-5 grid gap-3 rounded-2xl border border-[#e2d8cb] bg-[#f8f3ec] p-4 sm:grid-cols-[1fr_180px_auto]">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="이름/영문명/설명 검색"
            className="rounded-lg border border-[#d7cec2] bg-white px-3 py-2"
          />
          <select
            name="category"
            defaultValue={category}
            className="rounded-lg border border-[#d7cec2] bg-white px-3 py-2"
          >
            {categoryOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-lg bg-[#1f2937] px-4 py-2 text-sm font-medium text-white"
          >
            검색
          </button>
        </form>

        <p className="mb-3 text-sm text-[#4b5563]">검색 결과 {filteredRows.length}건</p>

        <section className="space-y-3">
          {filteredRows.map((menu) => (
            <form
              key={menu.id}
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
                <div className="grid gap-2 sm:grid-cols-2">
                  <input
                    name="price"
                    type="number"
                    defaultValue={menu.price}
                    className="rounded-lg border border-[#d7cec2] bg-white px-3 py-2"
                    required
                  />
                  <input
                    name="abv"
                    type="number"
                    step="0.1"
                    defaultValue={menu.abv ?? ''}
                    className="rounded-lg border border-[#d7cec2] bg-white px-3 py-2"
                  />
                </div>
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
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    name="is_signature"
                    defaultChecked={Boolean(menu.is_signature)}
                  />
                  is_signature
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
          ))}
          {filteredRows.length === 0 ? (
            <div className="rounded-2xl border border-[#d7cec2] bg-[#f8f3ec] p-5 text-sm text-[#4b5563]">
              조건에 맞는 메뉴가 없습니다.
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
};

export default AdminManagePage;
