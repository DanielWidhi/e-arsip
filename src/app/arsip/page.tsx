"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AssetDetailModal from "@/components/AssetDetailModal"; // Import Modal
import { Search, ChevronDown, Eye } from "lucide-react";

// --- MOCK DATA ---
const mockData = [
  { id: 1, kode: "02.06.01.01.03", nama: "Laptop Core i7", merk: "Asus ExpertBook", tahun: "2023", kondisi: "Baik", kir: "Ruang Camat", foto: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=600" },
  {
    id: 2,
    kode: "02.06.02.01.15",
    nama: "Printer Laser Color",
    merk: "HP LaserJet Pro",
    tahun: "2022",
    kondisi: "Baik",
    kir: "Ruang Pelayanan",
    foto: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&q=80&w=600",
  },
  { id: 3, kode: "02.06.01.04.02", nama: "Proyektor DLP", merk: "Epson EB-X41", tahun: "2021", kondisi: "Rusak Ringan", kir: "Ruang Rapat Utama", foto: null },
  {
    id: 4,
    kode: "02.05.01.02.01",
    nama: "Kendaraan Dinas Roda 4",
    merk: "Toyota Innova Reborn",
    tahun: "2020",
    kondisi: "Baik",
    kir: "Garasi",
    foto: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=600",
  },
  { id: 5, kode: "02.06.01.01.03", nama: "Laptop Core i5", merk: "Lenovo ThinkPad", tahun: "2022", kondisi: "Rusak Berat", kir: "Ruang Kepegawaian", foto: null },
  { id: 6, kode: "02.06.02.01.10", nama: "AC Split 1 PK", merk: "Daikin", tahun: "2023", kondisi: "Baik", kir: "Ruang Rapat Utama", foto: null },
];

export default function ArsipPage() {
  // --- STATE UNTUK FILTER, SEARCH & MODAL ---
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTahun, setFilterTahun] = useState("");
  const [filterKondisi, setFilterKondisi] = useState("");
  const [filterKir, setFilterKir] = useState("");

  // State untuk menyimpan data barang yang sedang diklik (awalnya null)
  const [selectedAsset, setSelectedAsset] = useState<any>(null);

  // --- LOGIKA FILTERING ---
  const filteredData = mockData.filter((item) => {
    const matchSearch = item.nama.toLowerCase().includes(searchTerm.toLowerCase()) || item.kode.includes(searchTerm);
    const matchTahun = filterTahun === "" || item.tahun === filterTahun;
    const matchKondisi = filterKondisi === "" || item.kondisi === filterKondisi;
    const matchKir = filterKir === "" || item.kir === filterKir;
    return matchSearch && matchTahun && matchKondisi && matchKir;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />

      <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-10 flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Daftar Inventaris Peralatan & Mesin (KIB B)</h1>
          <p className="text-lg text-slate-500">Transparansi data aset publik wilayah Kuta Selatan.</p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {/* Filter Tahun */}
            <div className="relative w-full sm:w-auto">
              <select
                value={filterTahun}
                onChange={(e) => setFilterTahun(e.target.value)}
                className="w-full sm:w-auto appearance-none bg-white border border-slate-300 text-slate-700 text-sm rounded-lg pl-4 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 cursor-pointer"
              >
                <option value="">Semua Tahun</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
                <option value="2020">2020</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
            </div>

            {/* Filter Kondisi */}
            <div className="relative w-full sm:w-auto">
              <select
                value={filterKondisi}
                onChange={(e) => setFilterKondisi(e.target.value)}
                className="w-full sm:w-auto appearance-none bg-white border border-slate-300 text-slate-700 text-sm rounded-lg pl-4 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 cursor-pointer"
              >
                <option value="">Semua Kondisi</option>
                <option value="Baik">Baik</option>
                <option value="Rusak Ringan">Rusak Ringan</option>
                <option value="Rusak Berat">Rusak Berat</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
            </div>

            {/* Filter KIR */}
            <div className="relative w-full sm:w-auto">
              <select
                value={filterKir}
                onChange={(e) => setFilterKir(e.target.value)}
                className="w-full sm:w-auto appearance-none bg-white border border-slate-300 text-slate-700 text-sm rounded-lg pl-4 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 cursor-pointer"
              >
                <option value="">Semua Ruangan (KIR)</option>
                <option value="Ruang Camat">Ruang Camat</option>
                <option value="Ruang Pelayanan">Ruang Pelayanan</option>
                <option value="Ruang Rapat Utama">Ruang Rapat Utama</option>
                <option value="Ruang Kepegawaian">Ruang Kepegawaian</option>
                <option value="Garasi">Garasi</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
            </div>
          </div>

          <div className="w-full lg:w-96 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari Kode / Nama Barang..."
              className="w-full bg-white border border-slate-300 text-slate-700 text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-shadow"
            />
          </div>
        </div>

        {/* Tabel */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 font-semibold text-xs text-slate-500 uppercase tracking-wider w-16">No</th>
                  <th className="px-6 py-4 font-semibold text-xs text-slate-500 uppercase tracking-wider">Kode Barang</th>
                  <th className="px-6 py-4 font-semibold text-xs text-slate-500 uppercase tracking-wider">Nama/Jenis Barang</th>
                  <th className="px-6 py-4 font-semibold text-xs text-slate-500 uppercase tracking-wider">Merk</th>
                  <th className="px-6 py-4 font-semibold text-xs text-slate-500 uppercase tracking-wider">Tahun Beli</th>
                  <th className="px-6 py-4 font-semibold text-xs text-slate-500 uppercase tracking-wider">Ruangan (KIR)</th>
                  <th className="px-6 py-4 font-semibold text-xs text-slate-500 uppercase tracking-wider text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors duration-150 group">
                      <td className="px-6 py-4 text-sm text-slate-600">{index + 1}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 font-mono">{item.kode}</td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{item.nama}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">{item.merk}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">{item.tahun}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">{item.kir}</td>
                      <td className="px-6 py-4 text-right">
                        {/* INI TOMBOL UNTUK MEMUNCULKAN MODAL */}
                        <button
                          onClick={() => setSelectedAsset(item)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded border border-slate-200 bg-white hover:border-blue-600 hover:text-blue-600 text-slate-400 transition-all shadow-sm"
                          title="Lihat Detail"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                      Tidak ada data inventaris yang cocok dengan pencarian atau filter Anda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white px-6 py-4 border-t border-slate-200 flex items-center justify-between sm:justify-center gap-2">
            <button className="px-3 py-1.5 text-sm font-medium text-slate-500 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors">Sebelumnya</button>
            <div className="hidden sm:flex items-center gap-1">
              <button className="w-8 h-8 flex items-center justify-center text-sm font-semibold rounded-md bg-blue-600 text-white shadow-sm">1</button>
              <button className="w-8 h-8 flex items-center justify-center text-sm font-medium rounded-md text-slate-500 hover:bg-slate-100 transition-colors">2</button>
              <span className="text-slate-400 px-1">...</span>
              <button className="w-8 h-8 flex items-center justify-center text-sm font-medium rounded-md text-slate-500 hover:bg-slate-100 transition-colors">12</button>
            </div>
            <button className="px-3 py-1.5 text-sm font-medium text-slate-500 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors">Selanjutnya</button>
          </div>
        </div>
      </main>

      <Footer />

      {/* KOMPONEN MODAL DITARUH DI SINI */}
      <AssetDetailModal isOpen={selectedAsset !== null} onClose={() => setSelectedAsset(null)} asset={selectedAsset} />
    </div>
  );
}
