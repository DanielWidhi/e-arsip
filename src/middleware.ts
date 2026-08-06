// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 1. Ambil URL tujuan pengguna
  const path = request.nextUrl.pathname;

  // 2. Cek apakah pengguna mencoba masuk ke area yang dilindungi
  const isProtectedPath = path.startsWith("/admin") || path.startsWith("/superadmin");

  // 3. Cek Tiket Login (Untuk saat ini kita deteksi dari Cookies)
  // (Nantinya kode ini akan disesuaikan dengan Supabase Auth)
  const isAuthenticated = request.cookies.has("sb-access-token"); // Nama cookie standar Supabase

  // 4. LOGIKA PENJAGA GERBANG:
  // Jika mencoba masuk area terlindungi TAPI tidak terotentikasi (belum login)
  if (isProtectedPath && !isAuthenticated) {
    // Tendang (Redirect) kembali ke halaman Login!
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Jika aman (sudah login, atau mengakses halaman publik seperti Beranda/Arsip), biarkan lewat
  return NextResponse.next();
}

// 5. Konfigurasi agar middleware hanya berjalan di URL tertentu (biar website tidak lambat)
export const config = {
  matcher: [
    /*
     * Cocokkan semua request path KECUALI untuk:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder (images, etc)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|images/|.*\\..*).*)",
  ],
};
