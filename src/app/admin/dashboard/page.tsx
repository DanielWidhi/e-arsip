"use client";

import { useState, useEffect } from "react";
import { Package, CheckCircle, Wrench, Wallet, Calendar, ChevronDown, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase";
import Link from "next/link";

import AssetDetailModal, { AssetType } from "@/components/AssetDetailModal";
import AssetEditModal from "@/components/AssetEditModal";
import { AssetItem } from "@/utils/exportPdfKibB";

interface SupabaseAsset {
  id: number;
  kode_barang: string;
  nama_barang: string;
  nomor_register?: string | null;
  merk_type?: string | null;
  ukuran_cc?: string | null;
  bahan?: string | null;
  tahun_beli?: string | null;
  pabrik?: string | null;
  no_rangka?: string | null;
  no_mesin?: string | null;
  no_polisi?: string | null;
  no_bpkb?: string | null;
  asal_usul_id?: number | null;
  harga?: number | null;
  kondisi: string;
  kir_id?: number | null;
  keterangan?: string | null;
  foto_url?: string | null;
  kir?: { nama_ruangan: string } | null;
  asal_usul?: { nama_asal: string } | null;
}

export default function AdminDashboardPage() {
  const [currentDate, setCurrentDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState("Admin");

  const [stats, setStats] = useState({ totalAset: 0, kondisiBaik: 0, perluPemeliharaan: 0, totalNilai: 0 });
  const [actionItems, setActionItems] = useState<AssetItem[]>([]);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<AssetType | null>(null);
  const [assetToEdit, setAssetToEdit] = useState<AssetItem | null>(null);

  const supabase = createClient();

  const fetchUserProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user && user.email) {
      const { data } = await supabase.from("users").select("nama").eq("email", user.email).single();
      if (data && data.nama) setUserName(data.nama);
    }
  };

  const fetchDashboardData = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from("inventaris_kib_b").select("*, kir:master_kir(nama_ruangan), asal_usul:master_asal_usul(nama_asal)").order("id", { ascending: false });

    if (!error && data) {
      const rawData = data as unknown as SupabaseAsset[];

      const formattedData: AssetItem[] = rawData.map((item) => ({
        id: item.id,
        kode: item.kode_barang,
        nama: item.nama_barang,
        nomorRegister: item.nomor_register || "0000",
        merk: item.merk_type || "-",
        ukuran: item.ukuran_cc || "-",
        bahan: item.bahan || "-",
        tahun: item.tahun_beli || "-",
        pabrik: item.pabrik || "-",
        rangka: item.no_rangka || "-",
        mesin: item.no_mesin || "-",
        polisi: item.no_polisi || "-",
        bpkb: item.no_bpkb || "-",
        asalUsul: item.asal_usul?.nama_asal || "-",
        asal_usul_id: item.asal_usul_id,
        harga: item.harga || 0,
        kondisi: item.kondisi,
        kir: item.kir?.nama_ruangan || "-",
        kir_id: item.kir_id,
        keterangan: item.keterangan || "-",
        foto: item.foto_url || null,
      }));

      const total = formattedData.length;
      const baik = formattedData.filter((item) => item.kondisi === "Baik").length;
      const perluPemeliharaanHitung = formattedData.filter((item) => item.kondisi === "Rusak Ringan" || item.kondisi === "Rusak Berat").length;
      const nilai = formattedData.reduce((sum, item) => sum + (Number(item.harga) || 0), 0);

      setStats({ totalAset: total, kondisiBaik: baik, perluPemeliharaan: perluPemeliharaanHitung, totalNilai: nilai });

      const rusakData = formattedData.filter((item) => item.kondisi === "Rusak Berat" || item.kondisi === "Rusak Ringan").slice(0, 4);
      setActionItems(rusakData);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setTimeout(() => {
      const options: Intl.DateTimeFormatOptions = { weekday: "long", year: "numeric", month: "short", day: "numeric" };
      setCurrentDate(new Date().toLocaleDateString("id-ID", options));
      fetchUserProfile();
      fetchDashboardData();
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatRupiahSingkat = (angka: number) => {
    if (angka >= 1000000000) return `Rp ${(angka / 1000000000).toFixed(2)} Miliar`;
    if (angka >= 1000000) return `Rp ${(angka / 1000000).toFixed(2)} Juta`;
    return `Rp ${angka.toLocaleString("id-ID")}`;
  };

  const handleOpenDetail = (item: AssetItem) => {
    setSelectedAsset(item as unknown as AssetType);
    setIsDetailModalOpen(true);
  };

  const handleOpenEdit = (e: React.MouseEvent, item: AssetItem) => {
    e.stopPropagation();
    setAssetToEdit(item);
    setIsEditModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* 1. WELCOME SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 tracking-tight">
            Halo, Selamat Datang <span className="text-blue-600">{userName}</span> di Panel Admin
          </h2>
          <p className="text-sm md:text-base text-slate-500">Berikut adalah ringkasan data inventaris aset Anda hari ini.</p>
        </div>
        <div className="flex items-center gap-2 text-slate-600 bg-slate-50 px-4 py-2.5 rounded-lg border border-slate-200 shadow-sm w-fit shrink-0">
          <Calendar size={18} className="text-slate-400" />
          <span className="text-sm font-semibold">{currentDate || "Memuat..."}</span>
        </div>
      </div>

      {/* 2. STATISTIK KARTU (SKELETON DI-INTEGRASIKAN DI SINI) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Aset */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Package size={24} />
            </div>
            <span className="text-xs font-semibold bg-slate-100 text-slate-500 px-2.5 py-1 rounded-md">Total</span>
          </div>
          <p className="text-sm font-medium text-slate-500 mb-1">Total Inventaris</p>
          {isLoading ? <div className="h-9 w-16 bg-slate-200 rounded animate-pulse mt-2" /> : <h3 className="text-3xl font-bold text-slate-900 mt-2">{stats.totalAset}</h3>}
        </div>

        {/* Kondisi Baik */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle size={24} />
            </div>
          </div>
          <p className="text-sm font-medium text-slate-500 mb-1">Kondisi Baik</p>
          {isLoading ? <div className="h-9 w-16 bg-slate-200 rounded animate-pulse mt-2" /> : <h3 className="text-3xl font-bold text-slate-900 mt-2">{stats.kondisiBaik}</h3>}
        </div>

        {/* Perlu Pemeliharaan */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Wrench size={24} />
            </div>
            <span className="text-xs font-semibold bg-red-50 text-red-600 border border-red-200/50 px-2.5 py-1 rounded-md">Urgent</span>
          </div>
          <p className="text-sm font-medium text-slate-500 mb-1">Perlu Pemeliharaan</p>
          {isLoading ? <div className="h-9 w-16 bg-slate-200 rounded animate-pulse mt-2" /> : <h3 className="text-3xl font-bold text-slate-900 mt-2">{stats.perluPemeliharaan}</h3>}
        </div>

        {/* Total Nilai Aset */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Wallet size={24} />
            </div>
          </div>
          <p className="text-sm font-medium text-slate-500 mb-1">Total Nilai Aset</p>
          {isLoading ? <div className="h-9 w-32 bg-slate-200 rounded animate-pulse mt-2" /> : <h3 className="text-3xl font-bold text-slate-900 mt-2">{formatRupiahSingkat(stats.totalNilai)}</h3>}
        </div>
      </div>

      {/* 3. GRID GRAFIK DAN DAFTAR TINDAKAN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* GRAFIK */}
        <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col min-h-100">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-slate-900">Pertumbuhan Aset per Tahun</h3>
            <button className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors text-sm font-medium bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              <span>2026</span>
              <ChevronDown size={16} />
            </button>
          </div>
          <div className="flex-1 w-full bg-slate-50 rounded-xl border border-slate-100 flex items-end p-6 gap-2 md:gap-6 relative">
            {[
              { month: "Jan", h: "h-[30%]" },
              { month: "Feb", h: "h-[45%]" },
              { month: "Mar", h: "h-[40%]" },
              { month: "Apr", h: "h-[60%]" },
              { month: "Mei", h: "h-[85%]", active: true },
              { month: "Jun", h: "h-[50%]" },
              { month: "Jul", h: "h-[70%]" },
            ].map((bar, i) => (
              <div key={i} className="w-full h-full flex flex-col justify-end items-center gap-3 group cursor-pointer">
                <div className={`w-full rounded-t-md transition-colors relative ${bar.active ? "bg-blue-600" : "bg-blue-200 hover:bg-blue-400"} ${bar.h}`}>
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-medium py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg">
                    {bar.active ? `+${stats.totalAset} Aset` : "+Aset"}
                  </div>
                </div>
                <span className={`text-xs font-semibold ${bar.active ? "text-blue-600" : "text-slate-400"}`}>{bar.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* DAFTAR TINDAKAN (SKELETON DI-INTEGRASIKAN DI SINI) */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900">Menunggu Tindakan</h3>
            <span className="bg-red-50 text-red-600 font-semibold text-xs px-2.5 py-1 rounded-full border border-red-200/50">{isLoading ? "..." : actionItems.length} Item</span>
          </div>

          <div className="flex flex-col gap-4 flex-1">
            {isLoading ? (
              /* SKELETON LOADER UNTUK 3 KARTU TINDAKAN */
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-4 border border-slate-200 rounded-xl bg-white animate-pulse space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="h-4 w-28 bg-slate-200 rounded" />
                    <div className="h-4 w-16 bg-slate-200 rounded" />
                  </div>
                  <div className="h-3 w-20 bg-slate-200 rounded" />
                  <div className="h-8 w-full bg-slate-200 rounded" />
                </div>
              ))
            ) : actionItems.length > 0 ? (
              actionItems.map((item) => (
                <div key={item.id} onClick={() => handleOpenDetail(item)} className="p-4 border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all bg-white group cursor-pointer animate-in fade-in duration-300">
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <h4 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors truncate">{item.nama}</h4>
                    <span className={`font-semibold text-[10px] px-2 py-0.5 rounded border whitespace-nowrap ${item.kondisi === "Rusak Berat" ? "bg-red-50 text-red-600 border-red-200" : "bg-amber-50 text-amber-600 border-amber-200"}`}>
                      {item.kondisi}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-4 font-medium">KODE: {item.kode}</p>
                  <button
                    onClick={(e) => handleOpenEdit(e, item)}
                    className="w-full py-2 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-lg text-slate-700 hover:text-blue-700 text-xs font-bold transition-colors"
                  >
                    Update Status
                  </button>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 text-sm gap-2">
                <CheckCircle size={32} className="text-green-300" />
                <p>Semua aset dalam kondisi baik.</p>
              </div>
            )}
          </div>

          <Link href="/admin/pemeliharaan" className="mt-4 text-blue-600 text-sm font-bold hover:underline text-center w-full py-2 block">
            Lihat Semua Tindakan
          </Link>
        </div>
      </div>

      <AssetDetailModal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} asset={selectedAsset} />
      <AssetEditModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} asset={assetToEdit} onSave={() => fetchDashboardData()} />
    </div>
  );
}
