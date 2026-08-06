"use client";

import { useState, useEffect } from "react";
import { Package, CheckCircle, Wrench, Wallet, Calendar, ChevronDown } from "lucide-react";

export default function AdminDashboardPage() {
  // State untuk tanggal agar terhindar dari Error Hydration di Next.js
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    // Dibungkus setTimeout agar React tidak protes "synchronously render"
    setTimeout(() => {
      const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        year: "numeric",
        month: "short",
        day: "numeric",
      };
      setCurrentDate(new Date().toLocaleDateString("id-ID", options));
    }, 0);
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* ========================================= */}
      {/* 1. WELCOME SECTION & TANGGAL */}
      {/* ========================================= */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 tracking-tight">Halo, Selamat Datang di Panel Admin Kuta Selatan</h2>
          <p className="text-sm md:text-base text-slate-500">Berikut adalah ringkasan data inventaris aset Anda hari ini.</p>
        </div>
        <div className="flex items-center gap-2 text-slate-600 bg-slate-50 px-4 py-2.5 rounded-lg border border-slate-200 shadow-sm w-fit">
          <Calendar size={18} className="text-slate-400" />
          <span className="text-sm font-semibold">{currentDate || "Memuat tanggal..."}</span>
        </div>
      </div>

      {/* ========================================= */}
      {/* 2. TOP METRICS ROW (4 KARTU) */}
      {/* ========================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric 1: Total */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Package size={24} />
            </div>
            <span className="text-xs font-semibold bg-slate-100 text-slate-500 px-2.5 py-1 rounded-md">Total</span>
          </div>
          <p className="text-sm font-medium text-slate-500 mb-1">Total Inventaris</p>
          <h3 className="text-3xl font-bold text-slate-900">1.520</h3>
        </div>

        {/* Metric 2: Kondisi Baik */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle size={24} />
            </div>
            <span className="text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200/50 px-2.5 py-1 rounded-md">+12%</span>
          </div>
          <p className="text-sm font-medium text-slate-500 mb-1">Kondisi Baik</p>
          <h3 className="text-3xl font-bold text-slate-900">1.400</h3>
        </div>

        {/* Metric 3: Perawatan */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Wrench size={24} />
            </div>
            <span className="text-xs font-semibold bg-red-50 text-red-600 border border-red-200/50 px-2.5 py-1 rounded-md">Urgent</span>
          </div>
          <p className="text-sm font-medium text-slate-500 mb-1">Perlu Pemeliharaan</p>
          <h3 className="text-3xl font-bold text-slate-900">120</h3>
        </div>

        {/* Metric 4: Total Nilai */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Wallet size={24} />
            </div>
          </div>
          <p className="text-sm font-medium text-slate-500 mb-1">Total Nilai Aset</p>
          <h3 className="text-3xl font-bold text-slate-900">Rp 2.45B</h3>
        </div>
      </div>

      {/* ========================================= */}
      {/* 3. GRID BAWAH: GRAFIK & DAFTAR TINDAKAN */}
      {/* ========================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* KIRI: GRAFIK PERTUMBUHAN (2/3 Lebar) */}
        <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col min-h-400px">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-slate-900">Pertumbuhan Aset per Tahun</h3>
            <button className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors text-sm font-medium bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              <span>2026</span>
              <ChevronDown size={16} />
            </button>
          </div>

          {/* Faux Bar Chart (Visualisasi Murni CSS) */}
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
                  {/* Tooltip Hover */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-medium py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg">
                    {bar.active ? "+45 Aset" : "+Aset"}
                  </div>
                </div>
                <span className={`text-xs font-semibold ${bar.active ? "text-blue-600" : "text-slate-400"}`}>{bar.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* KANAN: DAFTAR TINDAKAN (1/3 Lebar) */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900">Menunggu Tindakan</h3>
            <span className="bg-red-50 text-red-600 font-semibold text-xs px-2.5 py-1 rounded-full border border-red-200/50">4 Item</span>
          </div>

          <div className="flex flex-col gap-4 flex-1">
            {/* Item 1 */}
            <div className="p-4 border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all bg-white group cursor-pointer">
              <div className="flex justify-between items-start mb-2 gap-2">
                <h4 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">Mobil Dinas Camat</h4>
                <span className="bg-red-50 text-red-600 font-semibold text-[10px] px-2 py-0.5 rounded border border-red-200/50 whitespace-nowrap">Rusak Berat</span>
              </div>
              <p className="text-xs text-slate-500 mb-4 font-medium">INV-2024-001 • Kendaraan</p>
              <button className="w-full py-2 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-lg text-slate-700 hover:text-blue-700 text-xs font-bold transition-colors">Update Status</button>
            </div>

            {/* Item 2 */}
            <div className="p-4 border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all bg-white group cursor-pointer">
              <div className="flex justify-between items-start mb-2 gap-2">
                <h4 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">Genset Balai Desa</h4>
                <span className="bg-amber-50 text-amber-600 font-semibold text-[10px] px-2 py-0.5 rounded border border-amber-200/50 whitespace-nowrap">Perlu Pemeliharaan</span>
              </div>
              <p className="text-xs text-slate-500 mb-4 font-medium">INV-2023-142 • Mesin</p>
              <button className="w-full py-2 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-lg text-slate-700 hover:text-blue-700 text-xs font-bold transition-colors">Update Status</button>
            </div>

            {/* Item 3 */}
            <div className="p-4 border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all bg-white group cursor-pointer">
              <div className="flex justify-between items-start mb-2 gap-2">
                <h4 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">AC Ruang Rapat</h4>
                <span className="bg-amber-50 text-amber-600 font-semibold text-[10px] px-2 py-0.5 rounded border border-amber-200/50 whitespace-nowrap">Perlu Pemeliharaan</span>
              </div>
              <p className="text-xs text-slate-500 mb-4 font-medium">INV-2024-088 • Elektronik</p>
              <button className="w-full py-2 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-lg text-slate-700 hover:text-blue-700 text-xs font-bold transition-colors">Update Status</button>
            </div>
          </div>

          <button className="mt-4 text-blue-600 text-sm font-bold hover:underline text-center w-full py-2">Lihat Semua Tindakan</button>
        </div>
      </div>
    </div>
  );
}
