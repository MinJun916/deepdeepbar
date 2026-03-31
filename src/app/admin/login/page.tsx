import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { ADMIN_SESSION_COOKIE_NAME, getAdminAuthConfig } from '@/lib/adminAuth';

import { loginAdminAction } from '../actions';

type SearchParams = Promise<{
  error?: string;
}>;

const AdminLoginPage = async ({ searchParams }: { searchParams: SearchParams }) => {
  const cookieStore = await cookies();
  const authConfig = getAdminAuthConfig();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE_NAME)?.value;

  if (authConfig && session === 'authenticated') {
    redirect('/admin');
  }

  const { error } = await searchParams;
  const errorMessage =
    error === 'invalid'
      ? '아이디 또는 비밀번호가 올바르지 않습니다.'
      : error === 'config'
        ? '관리자 로그인 환경변수가 설정되지 않았습니다.'
        : null;

  return (
    <main className="min-h-screen bg-[radial-gradient(120%_90%_at_50%_0%,#fcf8f2_0%,#f3ece2_56%,#ece2d6_100%)] text-[#1f2937]">
      <div className="mx-auto flex min-h-screen w-full max-w-md items-center px-4 py-10 sm:px-6">
        <section className="w-full rounded-2xl border border-[#e2d8cb] bg-[#f8f3ec] p-6">
          <p className="text-xs font-medium tracking-[0.22em] text-[#876a51]">ADMIN LOGIN</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">Menu Admin</h1>
          <p className="mt-2 text-sm text-[#4b5563]">관리자 계정으로 로그인해 주세요.</p>

          {errorMessage ? (
            <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {errorMessage}
            </p>
          ) : null}

          <form action={loginAdminAction} className="mt-5 grid gap-3">
            <input
              name="username"
              placeholder="아이디"
              className="rounded-lg border border-[#d7cec2] bg-white px-3 py-2"
              required
            />
            <input
              name="password"
              type="password"
              placeholder="비밀번호"
              className="rounded-lg border border-[#d7cec2] bg-white px-3 py-2"
              required
            />
            <button
              type="submit"
              className="rounded-lg bg-[#1f2937] px-4 py-2 text-sm font-medium text-white"
            >
              로그인
            </button>
          </form>
        </section>
      </div>
    </main>
  );
};

export default AdminLoginPage;
