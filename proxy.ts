import { NextResponse, NextRequest } from "next/server";

export const config = {
  matcher: ["/profile/:path*"],
};

export function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("access_token")?.value;

  if (!accessToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}
