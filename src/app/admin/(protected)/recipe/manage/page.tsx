import Link from 'next/link';

import ApiPendingNotice from '@/components/admin/ApiPendingNotice';

const AdminRecipeManagePage = () => {
  return (
    <main className="min-h-screen bg-[radial-gradient(120%_90%_at_50%_0%,#fcf8f2_0%,#f3ece2_56%,#ece2d6_100%)] text-[#1f2937]">
      <div className="mx-auto w-full max-w-4xl px-4 pt-10 pb-16 sm:px-6">
        <header className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium tracking-[0.22em] text-[#876a51]">ADMIN / RECIPE</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight">레시피 관리</h1>
          </div>
          <Link
            href="/admin/recipe"
            prefetch={false}
            className="rounded-lg border border-[#d7cec2] bg-[#f8f3ec] px-3 py-2 text-sm"
          >
            레시피 목록
          </Link>
        </header>

        <ApiPendingNotice title="레시피 관리 API 연동 예정" />
      </div>
    </main>
  );
};

export default AdminRecipeManagePage;
