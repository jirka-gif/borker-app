import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "star_session";

/** Routy přístupné bez přihlášení. */
const PUBLIC_PATHS = ["/login"];

/**
 * Ochrana rout na úrovni serveru:
 *  - nepřihlášený uživatel je z chráněných rout přesměrován na /login
 *  - přihlášený uživatel je z /login přesměrován na /dashboard
 *  - "/" přesměruje podle stavu přihlášení
 *
 * Pozn.: Middleware ověřuje pouze přítomnost session cookie. Skutečnou
 * validaci tokenu (podpis, expirace) provede backend, až bude k dispozici.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = Boolean(request.cookies.get(SESSION_COOKIE)?.value);
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(hasSession ? "/dashboard" : "/login", request.url),
    );
  }

  if (!hasSession && !isPublic) {
    const url = new URL("/login", request.url);
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  if (hasSession && isPublic) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Vynecháme statické soubory, API a Next interní cesty.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.svg$).*)"],
};
