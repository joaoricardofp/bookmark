import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from 'next/server';

const PROTECTED = ['/dashboard'];
const RESERVED = ['/dashboard', '/api', '/login', '/register'];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // blinda rotas protegidas — redireciona para login se não autenticado
  const isProtected = PROTECTED.some((path) => pathname.startsWith(path));
  if (isProtected) {
    const cookie = getSessionCookie(req);
    if (!cookie) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // blinda rotas reservadas de serem tratadas como [username]
  const isReserved = RESERVED.some((path) => pathname.startsWith(path));
  if (isReserved) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
