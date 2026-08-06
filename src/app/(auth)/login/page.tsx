"use client";

import { useState } from "react";
import { LogIn, ArrowLeft, Eye, EyeOff, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";


export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulasi proses login
    setTimeout(() => {
      setIsLoading(false);

      // ========================================================
      // TAMBAHAN BARU: Berikan "Tiket Bohongan" agar lolos Middleware
      // (Nanti baris ini akan dihapus saat kita sudah pakai Supabase asli)
      // ========================================================
      document.cookie = "sb-access-token=tiket-dummy-untuk-masuk; path=/; max-age=86400";

      // Setelah tiket diberikan, arahkan ke halaman Dashboard Admin
      router.push("/admin/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full flex font-sans bg-slate-50 lg:bg-white">
      {/* ==================================================== */}
      {/* KOLOM KIRI: BACKGROUND GAMBAR (Disembunyikan di HP) */}
      {/* ==================================================== */}
      <div
        className="hidden lg:flex lg:w-1/2 relative bg-cover bg-center"
        // TODO: Nanti ganti URL ini dengan foto dari folder public (contoh: "url('/images/kantor.jpg')")
        style={{ backgroundImage: "url('/images/hero/HeroBanner1.jpg')" }}
      >
        {/* Overlay Gelap agar teks terbaca */}
        <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-[2px]" />

        {/* Konten di Atas Gambar */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full h-full">
          <Link href="/" className="flex items-center gap-2 text-white/80 hover:text-white transition w-fit text-sm font-medium">
            <ArrowLeft size={18} /> Kembali ke Beranda
          </Link>

          <div className="mb-12">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">SI-ARSIP</h1>
            <p className="text-slate-300 text-lg font-medium max-w-md leading-relaxed">
              Sistem Informasi Arsip Inventaris Barang Terpadu
              <br />
              Kantor Camat Kuta Selatan.
            </p>
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* KOLOM KANAN: FORMULIR LOGIN (Penuh di HP, 1/2 di PC) */}
      {/* ==================================================== */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 relative">
        {/* Tombol Kembali (Hanya muncul di HP) */}
        <Link href="/" className="lg:hidden absolute top-6 left-6 flex items-center gap-2 text-slate-500 hover:text-blue-600 transition font-medium text-sm">
          <ArrowLeft size={18} /> Beranda
        </Link>

        {/* Kotak Form */}
        <div className="w-full max-w-400px bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-100 lg:shadow-none lg:border-none lg:p-0">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Panel Admin</h2>
            <p className="text-slate-500 text-sm">Masuk menggunakan NIP dan Kata Sandi.</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            {/* Input NIP */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">NIP Pegawai</label>
              <input
                required
                type="text"
                placeholder="Contoh: 199001012020..."
                className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Input Password dengan Fitur Intip (Toggle) */}
            <div className="space-y-2 relative">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kata Sandi</label>
              <div className="relative">
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full h-12 pl-4 pr-12 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all placeholder:text-slate-400"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none p-1">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Tombol Login */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 flex items-center justify-center text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white mt-2 rounded-xl transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-blue-600/20 active:translate-y-1px"
            >
              {isLoading ? (
                "Memverifikasi..."
              ) : (
                <>
                  <LogIn size={18} className="mr-2" /> Masuk Ke Sistem
                </>
              )}
            </button>
          </form>

          {/* Copyright di HP (di PC akan ada di bawah layar) */}
          <p className="text-center text-xs text-slate-400 mt-12 lg:absolute lg:bottom-8 lg:left-1/2 lg:-translate-x-1/2 w-full">&copy; 2026 SI-ARSIP Kantor Camat Kuta Selatan.</p>
        </div>
      </div>
    </div>
  );
}
