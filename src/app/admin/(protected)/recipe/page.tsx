import Link from 'next/link';

import ApiPendingNotice from '@/components/admin/ApiPendingNotice';

const AdminRecipePage = () => {
  return (
    <main className="min-h-screen bg-[radial-gradient(120%_90%_at_50%_0%,#fcf8f2_0%,#f3ece2_56%,#ece2d6_100%)] text-[#1f2937]">
      <div className="mx-auto w-full max-w-4xl px-4 pt-10 pb-16 sm:px-6">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium tracking-[0.22em] text-[#876a51]">ADMIN / RECIPE</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight">레시피 보기</h1>
          </div>
          <div className="flex gap-2">
            <Link
              href="/admin/recipe/manage"
              prefetch={false}
              className="rounded-lg border border-[#c7a887] bg-[#f0dfcf] px-3 py-2 text-sm text-[#4a3322]"
            >
              레시피 관리
            </Link>
            <Link
              href="/admin"
              prefetch={false}
              className="rounded-lg border border-[#d7cec2] bg-[#f8f3ec] px-3 py-2 text-sm"
            >
              관리자 홈
            </Link>
          </div>
        </header>

        <ApiPendingNotice title="레시피 조회 API 연동 예정" />
      </div>
    </main>
  );
};

export default AdminRecipePage;
