import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE = "sparc_demo_session";

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/dashboard")) {
    const has = req.cookies.get(COOKIE)?.value;
    if (!has) {
      const url = new URL("/sign-in", req.url);
      url.searchParams.set("next", req.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
