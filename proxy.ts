import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const { pathname, search } = request.nextUrl;

  // FIX 1 (Step 5): Redirect www.kawaiisubete.com to apex https://kawaiisubete.com
  // Preserves path and query parameters with 301 Permanent Redirect
  if (host.toLowerCase().startsWith("www.")) {
    const cleanPath = pathname.replace(/\/{2,}/g, "/");
    return NextResponse.redirect(`https://kawaiisubete.com${cleanPath}${search}`, 301);
  }

  // FIX 2 (Step 6): Collapse duplicate slashes (e.g. //shop -> /shop)
  if (pathname.includes("//")) {
    const cleanPath = pathname.replace(/\/{2,}/g, "/");
    const targetUrl = new URL(`${cleanPath}${search}`, request.url);
    return NextResponse.redirect(targetUrl, 301);
  }

  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, images, and fonts
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|woff|woff2)$).*)",
  ],
};
