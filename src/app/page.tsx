import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroCarousel from "@/components/HeroCarousel";
import { Folder, CheckCircle, Wrench, Search, AlertTriangle } from "lucide-react"; // Tambahkan AlertTriangle

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />

      <main className="flex-grow flex flex-col items-center pb-16 md:pb-24">
        <HeroCarousel />

        {/* SEARCH BAR (Responsif & Anti Terpotong) */}
        <div className="w-full max-w-4xl px-4 md:px-8 relative z-20 -mt-8 md:-mt-10">
          <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-2 md:p-3 flex items-center gap-2 md:gap-4 transition-transform hover:-translate-y-1 duration-300">
            <Search className="text-slate-400 ml-2 md:ml-4 shrink-0" size={24} />

            <input type="text" placeholder="Cari Kode / Nama Barang..." className="w-full pl-2 pr-2 py-3 md:py-3 outline-none text-slate-700 text-sm md:text-lg font-medium bg-transparent flex-grow" />

            <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 md:px-8 md:py-3 rounded-lg text-sm md:text-base font-semibold transition-colors shrink-0">Cari</button>
          </div>
        </div>

        {/* 
          REVISI GRID STATISTIK: 
          - grid-cols-1 (1 Kolom di HP) 
          - sm:grid-cols-2 (2 Kolom di Tablet)
          - lg:grid-cols-4 (4 Kolom berjajar di Monitor PC)
          - max-w-7xl (Diperlebar sedikit agar 4 kotak muat sempurna)
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-7xl w-full px-4 md:px-6 mt-12 md:mt-20">
          {/* Card 1: Total Aset */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4 md:mb-6 text-blue-600">
              <Folder size={28} strokeWidth={2.5} />
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-slate-700">Total Aset</h3>
            <p className="text-3xl md:text-4xl font-bold text-blue-600 mt-2">1.520</p>
          </div>

          {/* Card 2: Kondisi Baik */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-green-100 flex items-center justify-center mb-4 md:mb-6 text-green-600">
              <CheckCircle size={28} strokeWidth={2.5} />
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-slate-700">Baik</h3>
            <p className="text-3xl md:text-4xl font-bold text-green-600 mt-2">1.400</p>
          </div>

          {/* Card 3: Rusak Ringan */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
            {/* Pakai warna Amber (Oranye Kekuningan) agar lebih jelas & kontras dari putih */}
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4 md:mb-6 text-amber-600">
              <Wrench size={28} strokeWidth={2.5} />
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-slate-700">Rusak Ringan</h3>
            <p className="text-3xl md:text-4xl font-bold text-amber-600 mt-2">100</p>
          </div>

          {/* Card 4: Rusak Berat */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
            {/* Ganti ikon dari Wrench ke AlertTriangle untuk melambangkan Rusak Berat */}
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-red-100 flex items-center justify-center mb-4 md:mb-6 text-red-600">
              <AlertTriangle size={28} strokeWidth={2.5} />
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-slate-700">Rusak Berat</h3>
            <p className="text-3xl md:text-4xl font-bold text-red-600 mt-2">120</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
