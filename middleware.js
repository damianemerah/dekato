import { NextResponse } from "next/server";

export function middleware(request) {
  if (request.nextUrl.pathname === request.nextUrl.pathname.toLowerCase()) {
    return NextResponse.next();
  }
  return NextResponse.redirect(
    new URL(request.nextUrl.pathname.toLowerCase(), request.nextUrl.origin)
  );
}
