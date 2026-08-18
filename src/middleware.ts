import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // 1. Persiapkan respons default
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // 2. Inisialisasi Supabase khusus untuk Server (Membaca Cookie Asli)
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
      },
    },
  });

  // 3. Minta Supabase mengecek apakah ada User asli yang sedang login
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 4. LOGIKA PENJAGA GERBANG
  const isProtectedPath = request.nextUrl.pathname.startsWith("/admin");

  if (isProtectedPath && !user) {
    // Jika mau masuk halaman admin TAPI user tidak valid -> Tendang ke /login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Jika aman, biarkan lewat
  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Mengecek semua rute KECUALI file statis (gambar, css, dll)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|images/|.*\\..*).*)",
  ],
};
