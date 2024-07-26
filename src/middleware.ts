export { default } from "next-auth/middleware";

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });

  const url = req.nextUrl.clone();

  // Check if the request is for the admin section
  if (url.pathname.startsWith("/dashboard/admin/:path*")) {
    if (!token || token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/403", req.url));
    }
  }

  // Allow access to other dashboard routes for authenticated users
  if (url.pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*"] };
