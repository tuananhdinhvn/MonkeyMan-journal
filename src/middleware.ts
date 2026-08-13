import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default function middleware(req: NextRequest) {
  // If no locale cookie, inject default locale into request so next-intl
  // ignores Accept-Language and always starts with English
  if (!req.cookies.has('NEXT_LOCALE')) {
    const headers = new Headers(req.headers);
    const existing = headers.get('cookie') || '';
    headers.set('cookie', existing ? `${existing}; NEXT_LOCALE=${routing.defaultLocale}` : `NEXT_LOCALE=${routing.defaultLocale}`);

    const patched = new NextRequest(req.url, { headers, method: req.method });
    const res = intlMiddleware(patched);
    res.cookies.set('NEXT_LOCALE', routing.defaultLocale, {
      path: '/',
      maxAge: 365 * 24 * 60 * 60,
      sameSite: 'lax',
    });
    return res;
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api|admin|images|uploads|videos|.*\\..*).*)'],
};
