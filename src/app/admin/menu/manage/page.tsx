import Link from 'next/link';

import MenuManageClient from '@/components/admin/menuManageClient';
import { canUseSupabaseAdmin, createSupabaseAdminClient } from '@/lib/supabase/admin';

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

const menuTable =
  process.env.NEXT_PUBLIC_SUPABASE_MENUS_TABLE ??
  process.env.NEXT_PUBLIC_SUPABASE_COCKTAILS_TABLE ??
  'menus';

const AdminManagePage = async () => {
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
    .select(
      'id, category, name, name_en, description, abv, taste_note, tags, is_signature, is_display, menu_prices(id, price_type, price, display_order, is_active)',
    )
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

  return (
    <main className="min-h-screen bg-[radial-gradient(120%_90%_at_50%_0%,#fcf8f2_0%,#f3ece2_56%,#ece2d6_100%)] text-[#1f2937]">
      <div className="mx-auto w-full max-w-4xl px-4 pt-10 pb-16 sm:px-6">
        <header className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium tracking-[0.22em] text-[#876a51]">ADMIN / MANAGE</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight">메뉴 검색/수정/삭제</h1>
          </div>
          <Link
            href="/admin/menu"
            prefetch={false}
            className="rounded-lg border border-[#d7cec2] bg-[#f8f3ec] px-3 py-2 text-sm"
          >
            관리자 홈
          </Link>
        </header>
        <MenuManageClient rows={rows} />
      </div>
    </main>
  );
};

export default AdminManagePage;
