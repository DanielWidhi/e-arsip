"use client";

import React, { useState } from 'react';
import { Search, Plus, Filter, Eye, SquarePen, Printer, Trash2, Calendar, DollarSign, TrendingDown, Edit3 } from 'lucide-react';
import Swal from 'sweetalert2';
import VehicleRepairModal from '@/components/VehicleRepairModal';

export default function KendaraanPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // LOGIKA DINAMIS TAHUN & BULAN
  const currentYear = new Date().getFullYear();
  const startYear = 2026; // Tahun pertama aplikasi digunakan
  
  // Membuat array tahun dari tahun saat ini (atau +1 untuk persiapan tahun depan) mundur ke tahun awal
  const availableYears = [];
  for (let year = currentYear + 1; year >= startYear; year--) {
    availableYears.push(year);
  }

  // State Filter Tahun (Default otomatis ke tahun saat ini)
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  
  // Mendapatkan nama bulan saat ini otomatis (contoh: "Agustus")
  const currentMonthName = new Date().toLocaleString('id-ID', { month: 'long' });

  // Dummy Data PAGU (Sesuai PDF)
  const paguTahunan = 120000000;
  const paguBulanan = paguTahunan / 12; // Rp 10.000.000
  const realisasiBulanIni = 12000000; // Contoh Over Budget
  const sisaPaguBulanIni = paguBulanan - realisasiBulanIni; // -Rp 2.000.000

  // Fungsi Hapus (SweetAlert Konfirmasi)
  const handleDelete = (platNomor: string) => {
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: `Data pemeliharaan untuk kendaraan ${platNomor} akan dihapus!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Terhapus!', 'Data berhasil dihapus.', 'success');
      }
    });
  };

  // Fungsi Edit PAGU (Tambahan sesuai PDF)
  const handleEditPagu = () => {
    Swal.fire({
      title: 'Sesuaikan PAGU Tahunan',
      input: 'number',
      inputLabel: `Tahun Anggaran ${selectedYear}`,
      inputValue: paguTahunan,
      showCancelButton: true,
      confirmButtonText: 'Simpan',
      cancelButtonText: 'Batal',
    });
  };

  return (
    <div className="p-6 max-w-full overflow-hidden">
      
      {/* HEADER & FILTER TAHUN */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Daftar Kendaraan & PAGU</h1>
          <p className="text-gray-500 text-sm mt-1">
            Monitoring anggaran (PAGU) dan daftar pemeliharaan kendaraan dinas.
          </p>
        </div>
        
        {/* Dropdown Filter Tahun (Dinamis) */}
        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm w-fit">
          <Calendar size={18} className="text-gray-500" />
          <select 
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-transparent text-sm font-medium text-gray-800 focus:outline-none cursor-pointer"
          >
            {/* Me-render tahun secara otomatis dari array */}
            {availableYears.map((year) => (
              <option key={year} value={year}>
                Tahun Anggaran {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* RINGKASAN PAGU (CARD VIEW - Sesuai PDF) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Card 1: PAGU Tahunan */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <DollarSign size={64} />
          </div>
          <p className="text-sm font-medium text-gray-500 mb-1">Total PAGU Tahunan</p>
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-bold text-gray-800">
              Rp {paguTahunan.toLocaleString('id-ID')}
            </h3>
            <button onClick={handleEditPagu} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition tooltip" title="Sesuaikan PAGU">
              <Edit3 size={16} />
            </button>
          </div>
        </div>

        {/* Card 2: Jatah Bulanan */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm font-medium text-gray-500 mb-1">Alokasi Jatah Bulanan</p>
          <h3 className="text-2xl font-bold text-gray-800">
            Rp {paguBulanan.toLocaleString('id-ID')}
          </h3>
          <p className="text-xs text-gray-400 mt-1">Sistem bagi rata 12 bulan</p>
        </div>

        {/* Card 3: Status Bulan Berjalan (Dinamis Bulan & Logika Defisit) */}
        <div className={`p-5 rounded-xl border shadow-sm ${sisaPaguBulanIni < 0 ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
          <p className={`text-sm font-medium mb-1 ${sisaPaguBulanIni < 0 ? 'text-red-600' : 'text-emerald-700'}`}>
            Status Bulan {currentMonthName} {selectedYear}
          </p>
          <div className="flex items-end gap-2">
            <h3 className={`text-2xl font-bold ${sisaPaguBulanIni < 0 ? 'text-red-700' : 'text-emerald-800'}`}>
              {sisaPaguBulanIni < 0 ? 'Kekurangan' : 'Sisa Aman'}
            </h3>
          </div>
          
          <div className={`flex items-center gap-1.5 mt-2 text-sm font-semibold ${sisaPaguBulanIni < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
            {sisaPaguBulanIni < 0 && <TrendingDown size={16} />}
            {sisaPaguBulanIni < 0 ? `- Rp ${Math.abs(sisaPaguBulanIni).toLocaleString('id-ID')}` : `+ Rp ${sisaPaguBulanIni.toLocaleString('id-ID')}`}
          </div>
        </div>
      </div>

      {/* =========================================================================
          BAGIAN BAWAH INI ADALAH KODE ASLI ANDA (TIDAK ADA DESAIN YANG DIUBAH)
          ========================================================================= */}
          
      {/* Toolbar (Search & Buttons) */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm shadow-sm font-medium text-black placeholder:font-normal placeholder:text-gray-400"
            placeholder="Cari plat nomor atau nama kendaraan..."
          />
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 shadow-sm transition">
            <Filter size={16} /> Filter
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm transition"
          >
            <Plus size={16} /> Ajukan
          </button>
        </div>
      </div>

      {/* Tabel Data */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/80 text-gray-600 font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 w-16">NO</th>
                <th className="px-6 py-4">NAMA KENDARAAN</th>
                <th className="px-6 py-4">PLAT NOMOR (KIB B)</th>
                <th className="px-6 py-4">KATEGORI PENGELUARAN</th>
                <th className="px-6 py-4 text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {/* Row 1 */}
              <tr className="hover:bg-gray-50/50 transition">
                <td className="px-6 py-4 text-gray-500">1</td>
                <td className="px-6 py-4 text-gray-600 font-medium">Mobil - Toyota Avanza</td>
                <td className="px-6 py-4 font-bold text-gray-900">DK 8297 O</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    Bensin
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center items-center gap-3 text-gray-400">
                    <button className="hover:text-gray-700 transition" title="Lihat Detail"><Eye size={18} /></button>
                    <button className="hover:text-blue-600 transition" title="Edit"><SquarePen size={18} /></button>
                    <button className="hover:text-green-600 transition" title="Cetak SPK/Nota"><Printer size={18} /></button>
                    <button onClick={() => handleDelete('DK 8297 O')} className="hover:text-red-600 transition" title="Hapus"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
              {/* Row 2 */}
              <tr className="hover:bg-gray-50/50 transition">
                <td className="px-6 py-4 text-gray-500">2</td>
                <td className="px-6 py-4 text-gray-600 font-medium">Mobil - Toyota Kijang Innova</td>
                <td className="px-6 py-4 font-bold text-gray-900">DK 70 Q</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                    Bensin + Pemeliharaan
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center items-center gap-3 text-gray-400">
                    <button className="hover:text-gray-700 transition"><Eye size={18} /></button>
                    <button className="hover:text-blue-600 transition"><SquarePen size={18} /></button>
                    <button className="hover:text-green-600 transition"><Printer size={18} /></button>
                    <button onClick={() => handleDelete('DK 70 Q')} className="hover:text-red-600 transition"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between sm:flex-row flex-col gap-4">
          <span className="text-sm text-gray-500">Menampilkan 1-2 dari 2 kendaraan</span>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded hover:bg-gray-100 text-gray-500 disabled:opacity-50" disabled>&lt;</button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-blue-600 text-white text-sm font-medium">1</button>
            <button className="p-2 rounded hover:bg-gray-100 text-gray-500">&gt;</button>
          </div>
        </div>
      </div>

      {/* Render Komponen Modal */}
      <VehicleRepairModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}