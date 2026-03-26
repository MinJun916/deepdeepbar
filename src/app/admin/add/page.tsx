import Link from 'next/link';

import { canUseSupabaseAdmin } from '@/lib/supabase/admin';

import { createMenuAction } from '../actions';

const categoryOptions = ['cocktail', 'whisky', 'non-alcohol', 'highball', 'side'] as const;

const AdminAddPage = () => {
  return (
    <main className="min-h-screen bg-[radial-gradient(120%_90%_at_50%_0%,#fcf8f2_0%,#f3ece2_56%,#ece2d6_100%)] text-[#1f2937]">
      <div className="mx-auto w-full max-w-3xl px-4 pt-10 pb-16 sm:px-6">
        <header className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium tracking-[0.22em] text-[#876a51]">ADMIN / ADD</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight">메뉴 추가</h1>
          </div>
          <Link
            href="/admin"
            className="rounded-lg border border-[#d7cec2] bg-[#f8f3ec] px-3 py-2 text-sm"
          >
            관리자 홈
          </Link>
        </header>

        {!canUseSupabaseAdmin ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            `.env.local`에 `SUPABASE_SECRET_KEY`를 추가해 주세요.
          </p>
        ) : (
          <form
            action={createMenuAction}
            className="grid gap-3 rounded-2xl border border-[#e2d8cb] bg-[#f8f3ec] p-5"
          >
            <select
              name="category"
              className="rounded-lg border border-[#d7cec2] bg-white px-3 py-2"
              defaultValue="cocktail"
              required
            >
              {categoryOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <input
              name="name"
              placeholder="name"
              className="rounded-lg border border-[#d7cec2] bg-white px-3 py-2"
              required
            />
            <input
              name="name_en"
              placeholder="name_en"
              className="rounded-lg border border-[#d7cec2] bg-white px-3 py-2"
              required
            />
            <textarea
              name="description"
              placeholder="description"
              className="min-h-24 rounded-lg border border-[#d7cec2] bg-white px-3 py-2"
              required
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                name="price"
                type="number"
                placeholder="price"
                className="rounded-lg border border-[#d7cec2] bg-white px-3 py-2"
                required
              />
              <input
                name="abv"
                type="number"
                step="0.1"
                placeholder="abv (optional)"
                className="rounded-lg border border-[#d7cec2] bg-white px-3 py-2"
              />
            </div>
            <input
              name="taste_note"
              placeholder="taste_note"
              className="rounded-lg border border-[#d7cec2] bg-white px-3 py-2"
              required
            />
            <textarea
              name="tags"
              placeholder='tags JSON or comma list (ex: ["Signature","Gin Base"])'
              className="min-h-20 rounded-lg border border-[#d7cec2] bg-white px-3 py-2"
              defaultValue="[]"
            />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="is_signature" />
              is_signature
            </label>
            <button
              type="submit"
              className="rounded-lg bg-[#1f2937] px-4 py-2 text-sm font-medium text-white"
            >
              메뉴 추가
            </button>
          </form>
        )}
      </div>
    </main>
  );
};

export default AdminAddPage;
