import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

const unauthorizedResponse = () =>
  new NextResponse('Authentication required.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Admin Area"',
    },
  });

export function middleware(request: NextRequest) {
  const adminUsername = process.env.ADMIN_BASIC_AUTH_USERNAME;
  const adminPassword = process.env.ADMIN_BASIC_AUTH_PASSWORD;

  if (!adminUsername || !adminPassword) {
    return new NextResponse('Admin auth env vars are missing.', { status: 500 });
  }

  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Basic ')) {
    return unauthorizedResponse();
  }

  const encoded = authHeader.slice('Basic '.length);
  let decoded = '';

  try {
    decoded = atob(encoded);
  } catch {
    return unauthorizedResponse();
  }

  const separatorIndex = decoded.indexOf(':');
  if (separatorIndex < 0) {
    return unauthorizedResponse();
  }

  const username = decoded.slice(0, separatorIndex);
  const password = decoded.slice(separatorIndex + 1);

  if (username !== adminUsername || password !== adminPassword) {
    return unauthorizedResponse();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
