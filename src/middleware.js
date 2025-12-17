import { NextResponse } from 'next/server';
import { decrypt } from '@/lib/session';

// CHANGE 1: Use 'export default' instead of 'export'
export default async function middleware(req) {
  // 1. Check if session cookie exists
  const cookie = req.cookies.get('session')?.value;
  const session = await decrypt(cookie);

  // 2. Check current path
  const isProtectedRoute = req.nextUrl.pathname.startsWith('/dashboard');
  const isPublicRoute = ['/login', '/register'].includes(req.nextUrl.pathname);

  // 3. Redirect logic
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (isPublicRoute && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

// CHANGE 2: Ensure config is exported specifically
export const config = {
  matcher: ['/login', '/register', '/dashboard/:path*'],
};
