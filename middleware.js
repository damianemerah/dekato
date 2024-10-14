import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const protectedRoutes = ["/admin", "/account", "/checkout"];

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    console.log(token, "token❤️❤️");

    if (!token) {
      const callbackUrl = encodeURIComponent(request.url);
      return NextResponse.redirect(
        new URL(`/signin?callbackUrl=${callbackUrl}`, request.url),
      );
    }

    if (pathname.startsWith("/admin") && token.role !== "admin") {
      const callbackUrl = encodeURIComponent(request.url);
      return NextResponse.redirect(
        new URL(`/signin?callbackUrl=${callbackUrl}`, request.url),
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*", "/checkout"],
};
