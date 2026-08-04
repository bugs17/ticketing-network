import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "rahasia-super-aman-diskominfo-123"
);

export async function middleware(request) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

  // Cek apakah pengguna mencoba membuka rute /dashboard
  if (pathname.startsWith("/dashboard")) {
    // 1. Jika tidak ada token, langsung tendang ke "/"
    if (!token) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    try {
      // 2. Verifikasi token JWT
      await jwtVerify(token, JWT_SECRET);
      return NextResponse.next();
    } catch (err) {
      // 3. Jika token kedaluwarsa/invalid, hapus cookie & tendang ke "/"
      const response = NextResponse.redirect(new URL("/", request.url));
      response.cookies.delete("auth_token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};