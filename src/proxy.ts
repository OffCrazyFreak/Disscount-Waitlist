import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get("host") || "";

  // Check if user is on get.disscount.me subdomain
  const isGetSubdomain = hostname.startsWith("get.");

  // Check if user is on zelim.disscount.me subdomain
  const isZelimSubdomain = hostname.startsWith("zelim.");

  // If on get.disscount.me and not already on /en, redirect to /en
  if (isGetSubdomain && !pathname.startsWith("/en")) {
    // Don't redirect API routes or static files
    if (pathname.startsWith("/api") || pathname.startsWith("/_next")) {
      return NextResponse.next();
    }

    const url = request.nextUrl.clone();
    url.pathname = `/en${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }

  // If on zelim.disscount.me and on /en, redirect to root
  if (isZelimSubdomain && pathname.startsWith("/en")) {
    // Don't redirect API routes or static files
    if (pathname.startsWith("/api") || pathname.startsWith("/_next")) {
      return NextResponse.next();
    }

    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/en/, "") || "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg|.*\\.webp).*)",
  ],
};
