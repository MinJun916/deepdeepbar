import { NextResponse } from 'next/server';

import { ADMIN_SESSION_COOKIE_NAME, getAdminAuthConfig } from '@/lib/adminAuth';

import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === '/admin/login') {
    return NextResponse.next();
  }

  const authConfig = getAdminAuthConfig();
  if (!authConfig) {
    return new NextResponse('Admin auth env vars are missing.', { status: 500 });
  }

  const session = request.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value;
  if (session !== 'authenticated') {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/admin/login';
    loginUrl.search = '';
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
