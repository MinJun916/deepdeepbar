import Link from 'next/link';

import AdminPageHeader from '@/components/admin/AdminPageHeader';

const AdminPageView = () => {
  return (
    <main className="min-h-screen bg-[radial-gradient(120%_90%_at_50%_0%,#fcf8f2_0%,#f3ece2_56%,#ece2d6_100%)] text-[#1f2937]">
      <div className="mx-auto w-full max-w-4xl px-4 pt-10 pb-16 sm:px-6">
        <AdminPageHeader
          title="Admin"
          description="메뉴 관리와 레시피 관리를 선택할 수 있습니다."
        />

        <section className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/admin/menu"
            prefetch={false}
            className="rounded-2xl border border-[#e2d8cb] bg-[#f8f3ec] p-5 transition hover:shadow-[0_10px_24px_rgba(120,84,52,0.12)]"
          >
            <p className="text-xs font-semibold tracking-wide text-[#876a51]">MENU</p>
            <h2 className="mt-2 text-xl font-semibold">메뉴 관리</h2>
            <p className="mt-2 text-sm text-[#4b5563]">메뉴 추가/수정/삭제를 진행합니다.</p>
          </Link>

          <Link
            href="/admin/recipe"
            prefetch={false}
            className="rounded-2xl border border-[#e2d8cb] bg-[#f8f3ec] p-5 transition hover:shadow-[0_10px_24px_rgba(120,84,52,0.12)]"
          >
            <p className="text-xs font-semibold tracking-wide text-[#876a51]">RECIPE</p>
            <h2 className="mt-2 text-xl font-semibold">레시피 관리</h2>
            <p className="mt-2 text-sm text-[#4b5563]">칵테일 레시피를 관리합니다.</p>
          </Link>
        </section>
      </div>
    </main>
  );
};

export default AdminPageView;
