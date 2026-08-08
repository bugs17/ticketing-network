import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "rahasia-super-aman-diskominfo-123"
);

export async function middleware(request) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

  async function verifyToken() {
    if (!token) return null;
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      return payload;
    } catch (err) {
      return null;
    }
  }

  const user = await verifyToken();

  // 1. JIKA DIAKSES DI HALAMAN UTAMA ("/")
  if (pathname === "/") {
    if (user) {
      if (user.role === "admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
      if (user.role === "teknisi") {
        return NextResponse.redirect(new URL("/dashboard-teknisi", request.url));
      }
    }
    return NextResponse.next();
  }

  // 2. JIKA DIAKSES DI RUTE /dashboard (KHUSUS ADMIN)
  if (pathname.startsWith("/dashboard") && !pathname.startsWith("/dashboard-teknisi")) {
    if (!user) {
      const response = NextResponse.redirect(new URL("/", request.url));
      if (token) response.cookies.delete("auth_token");
      return response;
    }

    if (user.role === "teknisi") {
      return NextResponse.redirect(new URL("/dashboard-teknisi", request.url));
    }
  }

  // 3. JIKA DIAKSES DI RUTE /dashboard-teknisi (KHUSUS TEKNISI)
  if (pathname.startsWith("/dashboard-teknisi")) {
    if (!user) {
      const response = NextResponse.redirect(new URL("/", request.url));
      if (token) response.cookies.delete("auth_token");
      return response;
    }

    if (user.role === "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

// PERBAIKAN DI SINI: Pengecualian aset statis & gambar
export const config = {
  matcher: [
    /*
     * Match semua request rute KECUALI yang berakhiran ekstensi statis:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, logo.png, dll.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};