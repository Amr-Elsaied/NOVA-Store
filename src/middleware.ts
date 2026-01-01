import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware({
  locales: ['en', 'ar'],
  defaultLocale: 'en',
  localePrefix: 'always'
});

export default function middleware(req: NextRequest) {
  const token = req.cookies.get('userToken')?.value;
  const { pathname } = req.nextUrl;

  const isAuthPage = pathname.includes('/login') || pathname.includes('/register');
  const protectedPaths = ['/checkout', '/profile', '/all-orders', '/wishlist'];
  const isProtectedPage = protectedPaths.some((path) => pathname.includes(path));

  const locale = pathname.split('/')[1] || 'en';

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL(`/${locale}`, req.url));
  }

  if (!token && isProtectedPage) {
    return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};