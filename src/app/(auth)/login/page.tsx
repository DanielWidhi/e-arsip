"use client";

import { useState } from "react";
import { LogIn, ArrowLeft, Eye, EyeOff, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  // 1. UBAH STATE: Dari nip menjadi email
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    // 2. TEMBAK LANGSUNG MENGGUNAKAN EMAIL ASLI
    const { error } = await supabase.auth.signInWithPassword({
      email: email, // Langsung pakai state email
      password: password,
    });

    if (error) {
      setIsLoading(false);
      // Ubah teks peringatan
      setErrorMsg("Email atau Kata Sandi salah. Silakan coba lagi.");
    } else {
      setIsLoading(false);
      // Bersihkan cookie dummy jika ada
      document.cookie = "sb-access-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      router.push("/admin/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen w-full flex font-sans bg-slate-50 lg:bg-white">
      {/* --- KOLOM KIRI (GAMBAR) --- */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-cover bg-center" style={{ backgroundImage: "url('/images/hero/HeroBanner1.jpg')" }}>
        <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-[2px]" />
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

      {/* --- KOLOM KANAN (FORM LOGIN) --- */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 relative">
        <Link href="/" className="lg:hidden absolute top-6 left-6 flex items-center gap-2 text-slate-500 hover:text-blue-600 transition font-medium text-sm">
          <ArrowLeft size={18} /> Beranda
        </Link>

        <div className="w-full max-w-[400px] bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-100 lg:shadow-none lg:border-none lg:p-0">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Panel Admin</h2>
            {/* Ubah teks instruksi */}
            <p className="text-slate-500 text-sm">Masuk menggunakan Email dan Kata Sandi.</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            {/* 3. INPUT EMAIL */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Pegawai</label>
              <input
                required
                type="email" // Menggunakan type="email" agar keyboard HP memunculkan tombol '@'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Contoh: admin@gmail.com"
                className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all placeholder:text-slate-400"
              />
            </div>

            {/* INPUT PASSWORD */}
            <div className="space-y-2 relative">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kata Sandi</label>
              <div className="relative">
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-12 pl-4 pr-12 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all placeholder:text-slate-400"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none p-1">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* PESAN ERROR */}
            {errorMsg && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 font-medium text-center">{errorMsg}</div>}

            {/* TOMBOL SUBMIT */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 flex items-center justify-center text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white mt-2 rounded-xl transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-blue-600/20 active:translate-y-px"
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

          <p className="text-center text-xs text-slate-400 mt-12 lg:absolute lg:bottom-8 lg:left-1/2 lg:-translate-x-1/2 w-full">&copy; 2026 SI-ARSIP Kantor Camat Kuta Selatan.</p>
        </div>
      </div>
    </div>
  );
}
