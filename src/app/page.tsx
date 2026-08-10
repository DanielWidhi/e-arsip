"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroCarousel from "@/components/HeroCarousel";
import { Folder, CheckCircle, Wrench, Search, Building, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase";
import Link from "next/link";
import SurveyCTA from "@/components/SurveyCTA";

// IMPORT AOS
import AOS from "aos";
import "aos/dist/aos.css";

export default function Home() {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [stats, setStats] = useState({
    totalAset: 0,
    totalKir: 0,
    baik: 0,
    rusakRingan: 0,
    rusakBerat: 0,
  });

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-out-cubic",
    });
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      const supabase = createClient();

      try {
        const [resAset, resKir, resBaik, resRingan] = await Promise.all([
          supabase.from("inventaris_kib_b").select("*", { count: "exact", head: true }),
          supabase.from("master_kir").select("*", { count: "exact", head: true }),
          supabase.from("inventaris_kib_b").select("*", { count: "exact", head: true }).eq("kondisi", "Baik"),
          supabase.from("inventaris_kib_b").select("*", { count: "exact", head: true }).eq("kondisi", "Rusak Ringan"),
        ]);

        setStats({
          totalAset: resAset.count || 0,
          totalKir: resKir.count || 0,
          baik: resBaik.count || 0,
          rusakRingan: resRingan.count || 0,
          rusakBerat: 0,
        });
      } catch (err) {
        console.error("Gagal memuat statistik:", err);
      }
      setIsLoading(false);
    };

    fetchStats();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim() !== "") {
      router.push(`/arsip?q=${encodeURIComponent(searchInput)}`);
    } else {
      router.push(`/arsip`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />

      <main className="grow flex flex-col items-center pb-16 md:pb-24">
        <HeroCarousel />

        {/* SEARCH BAR */}
        <div data-aos="fade-up" data-aos-delay="100" className="w-full max-w-4xl px-4 md:px-8 relative z-20 -mt-5 md:-mt-10">
          <form onSubmit={handleSearch} className="bg-white rounded-xl shadow-lg border border-slate-100 p-2 md:p-3 flex items-center gap-2 md:gap-4 transition-transform hover:-translate-y-1 duration-300">
            <Search className="text-slate-400 ml-2 md:ml-4 shrink-0" size={24} />

            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Cari Kode / Nama Barang..."
              className="w-full pl-2 pr-2 py-3 md:py-3 outline-none text-slate-700 text-sm md:text-lg font-medium bg-transparent grow"
            />

            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 md:px-8 md:py-3 rounded-lg text-sm md:text-base font-semibold transition-colors shrink-0">
              Cari
            </button>
          </form>
        </div>

        {/* GRID STATISTIK RESPONSIVE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-7xl w-full px-4 md:px-6 mt-12 md:mt-20">
          <Link
            href="/arsip"
            data-aos="fade-up"
            data-aos-delay="200"
            className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 flex flex-col items-center text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          >
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4 md:mb-6 text-blue-600">
              <Folder size={28} strokeWidth={2.5} />
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-slate-700">Total Aset</h3>
            <p className="text-3xl md:text-4xl font-bold text-blue-600 mt-2">{isLoading ? <Loader2 className="animate-spin text-slate-300" size={24} /> : stats.totalAset}</p>
          </Link>

          <Link
            href="/arsip"
            data-aos="fade-up"
            data-aos-delay="300"
            className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 flex flex-col items-center text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          >
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4 md:mb-6 text-purple-600">
              <Building size={28} strokeWidth={2.5} />
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-slate-700">Total KIR</h3>
            <p className="text-3xl md:text-4xl font-bold text-purple-600 mt-2">{isLoading ? <Loader2 className="animate-spin text-slate-300" size={24} /> : stats.totalKir}</p>
          </Link>

          <Link
            href="/arsip?cond=Baik"
            data-aos="fade-up"
            data-aos-delay="400"
            className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 flex flex-col items-center text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          >
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-green-100 flex items-center justify-center mb-4 md:mb-6 text-green-600">
              <CheckCircle size={28} strokeWidth={2.5} />
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-slate-700">Baik</h3>
            <p className="text-3xl md:text-4xl font-bold text-green-600 mt-2">{isLoading ? <Loader2 className="animate-spin text-slate-300" size={24} /> : stats.baik}</p>
          </Link>

          <Link
            href="/arsip?cond=Rusak Ringan"
            data-aos="fade-up"
            data-aos-delay="500"
            className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 flex flex-col items-center text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          >
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4 md:mb-6 text-amber-600">
              <Wrench size={28} strokeWidth={2.5} />
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-slate-700">Rusak Ringan</h3>
            <p className="text-3xl md:text-4xl font-bold text-amber-600 mt-2">{isLoading ? <Loader2 className="animate-spin text-slate-300" size={24} /> : stats.rusakRingan}</p>
          </Link>
        </div>

        <SurveyCTA />
      </main>

      <Footer />
    </div>
  );
}
