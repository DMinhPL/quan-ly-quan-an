import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const privatePaths = ['/manage'];
const unAuthPaths = ['/login'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  // Not logged in, block access to private paths
  if (privatePaths.some((path) => pathname.startsWith(path)) && !refreshToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If logged in, block access to login page
  if (unAuthPaths.some((path) => pathname.startsWith(path)) && refreshToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Already logged in, but accessToken has expired
  if (privatePaths.some((path) => pathname.startsWith(path)) && !accessToken && refreshToken) {
    const url = new URL('/refresh-token', request.url);
    url.searchParams.set('refreshToken', refreshToken);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
// matcher allows you to filter Middleware to run on specific paths.

export const config = {
  matcher: ['/login', '/manage/:path*'],
};
