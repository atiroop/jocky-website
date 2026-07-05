import { NextRequest, NextResponse } from "next/server";

const APD_HOST = "apd.jocky.website";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";

  if (host === APD_HOST) {
    const url = request.nextUrl.clone();
    url.pathname = "/apd";
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/",
};
