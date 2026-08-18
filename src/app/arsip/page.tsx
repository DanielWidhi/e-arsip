"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search, ChevronDown, Eye, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

import AOS from "aos";
import "aos/dist/aos.css";

// ===================================================================
// KONTEN UTAMA
// ===================================================================
function ArsipContent() {
  const searchParams = useSearchParams();
  const supabase = createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [dataArsip, setDataArsip] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterTahun, setFilterTahun] = useState("");
  const [filterKondisi, setFilterKondisi] = useState("");
  const [filterKir, setFilterKir] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const [listTahun, setListTahun] = useState<string[]>([]);
  const [listKir, setListKir] = useState<string[]>([]);

  const fetchDropdownData = async () => {
    const { data: kirData } = await supabase.from("master_kir").select("nama_ruangan").order("nama_ruangan", { ascending: true });
    if (kirData) {
      setListKir(kirData.map((k) => k.nama_ruangan).filter(Boolean));
    }

    const { data: tahunData } = await supabase.from("inventaris_kib_b").select("tahun_beli");
    if (tahunData) {
      const uniqueTahun = Array.from(new Set(tahunData.map((t) => t.tahun_beli).filter(Boolean))).sort((a, b) => Number(b) - Number(a));
      setListTahun(uniqueTahun as string[]);
    }
  };

  const fetchArsipData = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from("inventaris_kib_b").select("*, kir:master_kir(nama_ruangan)").order("id", { ascending: false });

    if (error) {
      console.error("Gagal memuat arsip:", error.message);
    } else if (data) {
      setDataArsip(data);
    }
    setIsLoading(false);

    // Refresh AOS setelah data tabel selesai dimuat agar animasinya sinkron
    setTimeout(() => {
      AOS.refresh();
    }, 100);
  };

  useEffect(() => {
    setTimeout(() => {
      fetchArsipData();
      fetchDropdownData();

      const query = searchParams.get("q");
      if (query) setSearchTerm(query);

      const condQuery = searchParams.get("cond");
      if (condQuery) setFilterKondisi(condQuery);
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [searchTerm, filterTahun, filterKondisi, filterKir]);

  const filteredData = dataArsip.filter((item) => {
    const matchSearch = item.nama_barang.toLowerCase().includes(searchTerm.toLowerCase()) || item.kode_barang.includes(searchTerm);
    const matchTahun = filterTahun === "" || item.tahun_beli === filterTahun;
    const matchKondisi = filterKondisi === "" || item.kondisi === filterKondisi;
    const matchKir = filterKir === "" || item.kir?.nama_ruangan === filterKir;
    return matchSearch && matchTahun && matchKondisi && matchKir;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <main className="grow flex flex-col items-center pb-16 md:pb-24">
      <div className="max-w-7xl mx-auto w-full px-6 py-10 flex flex-col gap-8">
        <div data-aos="fade-up" suppressHydrationWarning className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Daftar Inventaris Peralatan & Mesin (KIB B)</h1>
          <p className="text-lg text-slate-500">Transparansi data aset publik wilayah Kuta Selatan.</p>
        </div>

        <div data-aos="fade-up" data-aos-delay="100" suppressHydrationWarning className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="relative w-full sm:w-auto">
              <select
                value={filterTahun}
                onChange={(e) => setFilterTahun(e.target.value)}
                className="w-full sm:w-auto appearance-none bg-white border border-slate-300 text-slate-700 text-sm rounded-lg pl-4 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 cursor-pointer"
              >
                <option value="">Semua Tahun</option>
                {listTahun.map((tahun, idx) => (
                  <option key={idx} value={tahun}>
                    {tahun}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
            </div>

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

            <div className="relative w-full sm:w-auto">
              <select
                value={filterKir}
                onChange={(e) => setFilterKir(e.target.value)}
                className="w-full sm:w-auto appearance-none bg-white border border-slate-300 text-slate-700 text-sm rounded-lg pl-4 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 cursor-pointer"
              >
                <option value="">Semua Ruangan</option>
                {listKir.map((ruangan, idx) => (
                  <option key={idx} value={ruangan}>
                    {ruangan}
                  </option>
                ))}
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

        <div data-aos="fade-up" data-aos-delay="200" suppressHydrationWarning className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden w-full">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 w-16 text-slate-500">No</th>
                  <th className="px-6 py-4 text-slate-500">Kode Barang</th>
                  <th className="px-6 py-4 text-sm text-slate-500 uppercase tracking-wider">Nama/Jenis Barang</th>
                  <th className="px-6 py-4 text-sm text-slate-500">Merk</th>
                  <th className="px-6 py-4 text-sm text-slate-500">Tahun Beli</th>
                  <th className="px-6 py-4 text-sm text-slate-500">Ruangan (KIR)</th>
                  <th className="px-6 py-4 text-right text-slate-500">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse border-b border-slate-100">
                      <td className="px-6 py-5">
                        <div className="h-4 w-6 bg-slate-200 rounded-md" />
                      </td>
                      <td className="px-6 py-5">
                        <div className="h-4 w-28 bg-slate-200 rounded-md" />
                      </td>
                      <td className="px-6 py-5">
                        <div className="h-4 w-48 bg-slate-200 rounded-md" />
                      </td>
                      <td className="px-6 py-5">
                        <div className="h-4 w-24 bg-slate-200 rounded-md" />
                      </td>
                      <td className="px-6 py-5">
                        <div className="h-4 w-12 bg-slate-200 rounded-md" />
                      </td>
                      <td className="px-6 py-5">
                        <div className="h-4 w-32 bg-slate-200 rounded-md" />
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="inline-block h-8 w-8 bg-slate-200 rounded-md ml-auto" />
                      </td>
                    </tr>
                  ))
                ) : paginatedData.length > 0 ? (
                  paginatedData.map((item, index) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors duration-150 group">
                      <td className="px-6 py-4 text-sm text-slate-700">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td className="px-6 py-4 text-sm text-slate-700 font-mono">{item.kode_barang}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-900">{item.nama_barang}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{item.merk_type || "-"}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{item.tahun_beli || "-"}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{item.kir?.nama_ruangan || "-"}</td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/arsip/${item.id}`}
                          className="inline-flex items-center justify-center w-8 h-8 rounded border border-slate-200 bg-white hover:border-blue-600 hover:text-blue-600 text-slate-400 transition-all shadow-sm"
                          title="Lihat Detail & QR Code"
                        >
                          <Eye size={18} />
                        </Link>
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

          <div className="bg-white px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-700">Rows per page</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-slate-200 rounded-md px-2 py-1 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-white"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1 || totalPages === 0}
                className="flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-blue-600 disabled:opacity-50 disabled:hover:text-slate-700 transition-colors"
              >
                <ChevronLeft size={18} />
                Previous
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-blue-600 disabled:opacity-50 disabled:hover:text-slate-700 transition-colors"
              >
                Next
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// ===================================================================
// EXPORT DEFAULT UTAMA
// ===================================================================
export default function ArsipPage() {
  useEffect(() => {
    // PERBAIKAN: Berikan jeda 100ms agar React Hydration selesai 100%
    // sebelum AOS menyuntikkan class animasinya.
    const initAOS = setTimeout(() => {
      AOS.init({
        duration: 800,
        once: true,
        easing: "ease-out-cubic",
      });
    }, 100);

    return () => clearTimeout(initAOS);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />

      <Suspense
        fallback={
          <div className="flex h-screen w-full items-center justify-center bg-slate-50">
            <div className="flex flex-col items-center justify-center text-slate-500 gap-3">
              <Loader2 className="animate-spin text-blue-600" size={32} />
              <p className="text-sm font-medium">Menghubungi database Supabase...</p>
            </div>
          </div>
        }
      >
        <ArsipContent />
      </Suspense>

      <Footer />
    </div>
  );
}