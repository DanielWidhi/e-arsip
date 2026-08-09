"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroCarousel from "@/components/HeroCarousel";
import { Folder, CheckCircle, Wrench, Search, Building, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase";
import Link from "next/link";

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

        {/* ========================================================================= */}
        {/* BANNER SURVEI                                                             */}
        {/* ========================================================================= */}
        <section data-aos="fade-up" data-aos-delay="200" className="w-full mt-16 md:mt-24 px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="relative overflow-hidden text-white rounded-[20px] p-[40px] shadow-[0_15px_35px_rgba(0,0,0,0.15)] bg-gradient-to-br from-[#0f4c81] to-[#1976d2]">
              <div className="absolute right-[-70px] top-[-70px] w-[220px] h-[220px] bg-[hsla(0,0%,100%,.08)] rounded-full pointer-events-none" />

              <div className="flex flex-col lg:flex-row items-center justify-between relative z-10 w-full gap-8">
                <div className="w-full lg:w-2/3 flex justify-center lg:justify-start">
                  <div className="flex flex-col md:flex-row items-center md:items-start gap-5 md:gap-6 text-center md:text-left">
                    {/* PERBAIKAN: Wadah Lingkaran Putih Transparan (Sempurna di Tengah) */}
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img alt="Survei Icon" className="max-w-[40px] md:max-w-[50px] h-auto object-contain drop-shadow-sm" src="/images/assets/feedback.png" />
                    </div>

                    <div>
                      <h3 className="text-2xl md:text-[28px] font-bold tracking-wide mb-2">Bagaimana Pengalaman Anda?</h3>
                      <p className="text-white/95 text-sm md:text-[16px] leading-relaxed max-w-2xl">
                        Pendapat Anda sangat berarti bagi kami. Mari berpartisipasi dalam <strong className="font-bold">Survei Kepuasan Layanan Website Pemerintah</strong> untuk membantu meningkatkan kualitas pelayanan Pemerintah Kabupaten
                        Badung.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="w-full lg:w-1/3 flex justify-center lg:justify-end shrink-0">
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-white text-[#0f4c81] hover:bg-[#ffce3a] hover:text-[#0b4a8f] font-bold px-8 py-3.5 rounded-full shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 active:scale-95 text-sm md:text-[15px]"
                    href="https://kabbadu.ng/survei-web-diskominfo"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 20h9"></path>
                      <path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"></path>
                    </svg>{" "}
                    Isi Survei
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
