"use client";

import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, Eye, SquarePen, Printer, Trash2, Calendar, DollarSign, TrendingDown, TrendingUp, Edit3, Wallet, CreditCard, Activity } from 'lucide-react';
import Swal from 'sweetalert2';
import VehicleRepairModal from '@/components/VehicleRepairModal';
import { createClient } from "@/lib/supabase";

export default function KendaraanPage() {
  const supabase = createClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Data states
  const [paguTahunan, setPaguTahunan] = useState(0);
  const [pemeliharaanList, setPemeliharaanList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // LOGIKA DINAMIS TAHUN & BULAN
  const currentYear = new Date().getFullYear();
  const currentMonthNum = new Date().getMonth() + 1;
  
  // State Filter Tahun, Bulan, dan Modal
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(currentMonthNum);
  
  // STATE BARU: Fitur Pencarian Tabel
  const [searchQuery, setSearchQuery] = useState('');

  const [isAddYearModalOpen, setIsAddYearModalOpen] = useState(false);
  const [newYearInput, setNewYearInput] = useState('');
  const [newPaguInput, setNewPaguInput] = useState('');
  const [isSubmittingYear, setIsSubmittingYear] = useState(false);

  // State Modal Edit PAGU
  const [isEditPaguModalOpen, setIsEditPaguModalOpen] = useState(false);
  const [editPaguInput, setEditPaguInput] = useState('');
  const [isSubmittingEditPagu, setIsSubmittingEditPagu] = useState(false);

  // Daftar Nama Bulan
  const months = [
    { value: 1, label: 'Januari' }, { value: 2, label: 'Februari' }, { value: 3, label: 'Maret' },
    { value: 4, label: 'April' }, { value: 5, label: 'Mei' }, { value: 6, label: 'Juni' },
    { value: 7, label: 'Juli' }, { value: 8, label: 'Agustus' }, { value: 9, label: 'September' },
    { value: 10, label: 'Oktober' }, { value: 11, label: 'November' }, { value: 12, label: 'Desember' }
  ];
  
  const selectedMonthName = months.find(m => m.value === selectedMonth)?.label;

  // FITUR 1: Load Bulan dari Memori saat Halaman Dibuka
  useEffect(() => {
    const savedMonth = localStorage.getItem('sate_selected_month');
    if (savedMonth) {
      setSelectedMonth(parseInt(savedMonth, 10));
    }
  }, []);

  // FITUR 1: Fetch Available Years & Load Tahun dari Memori
  useEffect(() => {
    const fetchYears = async () => {
      try {
        const { data, error } = await supabase
          .from('pagu')
          .select('tahun')
          .order('tahun', { ascending: false });
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          const years = data.map((d: any) => d.tahun);
          years.sort((a, b) => b - a); // Urutkan descending
          setAvailableYears(years);
          
          // Cek apakah ada Tahun tersimpan di memori (localStorage)
          const savedYear = localStorage.getItem('sate_selected_year');
          
          if (savedYear && years.includes(parseInt(savedYear))) {
            setSelectedYear(savedYear); // Gunakan tahun dari memori jika valid
          } else {
            setSelectedYear(years[0].toString()); // Jika tidak ada memori, gunakan tahun paling baru
          }
        } else {
          setAvailableYears([]);
          setSelectedYear('');
        }
      } catch (error) {
        console.error("Gagal mengambil daftar tahun:", error);
        setAvailableYears([]);
        setSelectedYear('');
      }
    };
    fetchYears();
  }, []); // Cukup dipanggil sekali saat mount

  // FITUR 1: Menyimpan Perubahan Filter ke Memori secara Instan
  useEffect(() => {
    if (selectedYear) localStorage.setItem('sate_selected_year', selectedYear);
  }, [selectedYear]);

  useEffect(() => {
    if (selectedMonth) localStorage.setItem('sate_selected_month', selectedMonth.toString());
  }, [selectedMonth]);


  // 2. Fetch Data Transaksi & Relasi ke Tabel Kendaraan
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedYear) {
        setIsLoading(false);
        setPaguTahunan(0);
        setPemeliharaanList([]);
        return;
      }
      
      setIsLoading(true);
      try {
        // A. Fetch Data PAGU Tahunan
        const { data: paguData } = await supabase
          .from('pagu')
          .select('nominal_tahunan')
          .eq('tahun', parseInt(selectedYear))
          .single();
          
        if (paguData) {
          setPaguTahunan(paguData.nominal_tahunan);
        } else {
          setPaguTahunan(0);
        }

        // B. Fetch Pemeliharaan
        const startOfYear = `${selectedYear}-01-01`;
        const endOfYear = `${selectedYear}-12-31`;

        const { data: pemeliharaanData, error } = await supabase
          .from('pemeliharaan')
          .select(`
            id, 
            tanggal_pengajuan, 
            bengkel_rekanan, 
            total_biaya, 
            kategori_pengeluaran,
            inventaris_kib_b ( nama_barang, merk_type, no_polisi )
          `)
          .gte('tanggal_pengajuan', startOfYear)
          .lte('tanggal_pengajuan', endOfYear)
          .order('tanggal_pengajuan', { ascending: false });
          
        if (error) {
          console.error("Error query relasi tabel:", error);
          throw error;
        }
        
        setPemeliharaanList(pemeliharaanData || []);
      } catch (err) {
        console.error("Gagal mengambil data dari Supabase:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [selectedYear]);

  // ==========================================
  // KALKULASI ANGGARAN (PAGU)
  // ==========================================
  
  const paguBulanan = Math.round(paguTahunan / 12); 
  const realisasiTahunan = pemeliharaanList.reduce((sum, item) => sum + Number(item.total_biaya), 0);
  
  const pemeliharaanBulanIni = pemeliharaanList.filter(p => {
    if (!p.tanggal_pengajuan) return false;
    const monthStr = p.tanggal_pengajuan.split('-')[1]; 
    return parseInt(monthStr, 10) === selectedMonth;
  });

  const realisasiBulanIni = pemeliharaanBulanIni.reduce((sum, item) => sum + Number(item.total_biaya), 0);
  
  const sisaPaguTahunan = paguTahunan - realisasiTahunan;
  const sisaPaguBulanIni = paguBulanan - realisasiBulanIni;

  // ==========================================
  // FITUR 2: FILTER PENCARIAN TABEL (LIVE SEARCH)
  // ==========================================
  const filteredPemeliharaanList = pemeliharaanList.filter((item) => {
    if (!searchQuery) return true; // Jika tidak ada pencarian, tampilkan semua
    
    const searchLower = searchQuery.toLowerCase();
    const namaKendaraan = item.inventaris_kib_b?.nama_barang?.toLowerCase() || '';
    const platNomor = item.inventaris_kib_b?.no_polisi?.toLowerCase() || '';
    
    return namaKendaraan.includes(searchLower) || platNomor.includes(searchLower);
  });

  // Fungsi Hapus
  const handleDelete = (id: number, platNomor: string) => {
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: `Data pemeliharaan untuk kendaraan ${platNomor} akan dihapus!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { error } = await supabase.from('pemeliharaan').delete().eq('id', id);
          if (error) throw error;
          
          setPemeliharaanList(prev => prev.filter(item => item.id !== id));
          Swal.fire('Terhapus!', 'Data berhasil dihapus.', 'success');
        } catch (err) {
          Swal.fire('Error', 'Gagal menghapus data.', 'error');
        }
      }
    });
  };

  // Fungsi Edit PAGU
  const openEditPaguModal = () => {
    setEditPaguInput(paguTahunan.toString());
    setIsEditPaguModalOpen(true);
  };

  const handleSaveEditPagu = async () => {
    if (!editPaguInput || isNaN(Number(editPaguInput))) {
      Swal.fire('Error', 'Harap masukkan nominal yang valid.', 'error');
      return;
    }

    setIsSubmittingEditPagu(true);
    try {
      const { error } = await supabase
        .from('pagu')
        .upsert({ tahun: parseInt(selectedYear), nominal_tahunan: Number(editPaguInput) }, { onConflict: 'tahun' });
        
      if (error) throw error;
      
      setPaguTahunan(Number(editPaguInput));
      setIsEditPaguModalOpen(false);
      Swal.fire('Tersimpan!', 'PAGU Tahunan berhasil diperbarui.', 'success');
    } catch (error: any) {
      Swal.fire('Error', `Gagal menyimpan: ${error.message}`, 'error');
    } finally {
      setIsSubmittingEditPagu(false);
    }
  };

  // Fungsi Tambah Tahun Anggaran Baru
  const handleAddYear = async () => {
    if (!newYearInput || isNaN(Number(newYearInput))) {
      Swal.fire('Error', 'Harap masukkan tahun yang valid.', 'error');
      return;
    }
    
    const yearToInsert = parseInt(newYearInput);

    if (availableYears.includes(yearToInsert)) {
      Swal.fire({
        title: 'Tahun Sudah Ada!',
        text: `Tahun anggaran ${yearToInsert} sudah ada di database. Silakan pilih di menu dropdown.`,
        icon: 'warning',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }
    
    setIsSubmittingYear(true);
    try {
      const paguToInsert = Number(newPaguInput) || 0;
      
      const { error } = await supabase
        .from('pagu')
        .insert([{ tahun: yearToInsert, nominal_tahunan: paguToInsert }]);
        
      if (error && error.code !== '23505') throw error;
      
      const updatedYears = [...availableYears, yearToInsert].sort((a, b) => b - a);
      setAvailableYears(updatedYears);
      setSelectedYear(yearToInsert.toString());
      
      setIsAddYearModalOpen(false);
      setNewYearInput('');
      setNewPaguInput('');
      Swal.fire('Berhasil', 'Tahun anggaran berhasil ditambahkan.', 'success');
      
    } catch (err: any) {
      console.error("Detail Error Supabase:", JSON.stringify(err, null, 2));
      const errorMsg = err.message || err.details || err.hint || 'Terjadi kesalahan tidak dikenal';
      Swal.fire('Error', 'Gagal menambahkan tahun: ' + errorMsg, 'error');
    } finally {
      setIsSubmittingYear(false);
    }
  };

  return (
    <div className="p-6 max-w-full overflow-hidden">
      
      {/* HEADER & FILTER TAHUN - BULAN */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Daftar Kendaraan & PAGU</h1>
          <p className="text-gray-500 text-sm mt-1">
            Monitoring anggaran (PAGU) dan daftar pemeliharaan kendaraan dinas.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          
          <div className="flex items-center gap-2 bg-white text-black border border-gray-300 rounded-lg px-3 py-2 shadow-sm w-fit">
            <Calendar size={18} className="text-gray-500" /> 
            <select 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="bg-transparent text-sm font-medium text-gray-800 focus:outline-none cursor-pointer"
            >
              {months.map((m) => (
                <option key={m.value} value={m.value}>
                  Bulan {m.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-white text-black border border-gray-300 rounded-lg px-3 py-2 shadow-sm w-fit">
            <select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-transparent text-sm font-medium text-gray-800 focus:outline-none cursor-pointer"
            >
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  Tahun Anggaran {year}
                </option>
              ))}
            </select>
          </div>
          <button 
            onClick={() => setIsAddYearModalOpen(true)}
            className="flex items-center justify-center p-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition text-gray-600"
            title="Tambah Tahun Anggaran"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      {/* RINGKASAN PAGU (CARD VIEW) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2">
            <h3 className="tracking-tight text-sm font-medium text-gray-500">Total PAGU Tahunan</h3>
            <DollarSign className="h-4 w-4 text-gray-400" />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-gray-800">
                Rp {paguTahunan.toLocaleString('id-ID')}
              </div>
              <button onClick={openEditPaguModal} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition tooltip" title="Sesuaikan PAGU">
                <Edit3 size={16} />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">Anggaran pemeliharaan tahun ini</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2">
            <h3 className="tracking-tight text-sm font-medium text-gray-500">Sisa PAGU Tahunan</h3>
            <Wallet className="h-4 w-4 text-gray-400" />
          </div>
          <div>
            <div className={`text-2xl font-bold ${sisaPaguTahunan < 0 ? 'text-red-600' : 'text-gray-800'}`}>
              {sisaPaguTahunan < 0 ? `- Rp ${Math.abs(sisaPaguTahunan).toLocaleString('id-ID')}` : `Rp ${sisaPaguTahunan.toLocaleString('id-ID')}`}
            </div>
            <p className="text-xs text-gray-400 mt-1">Sisa anggaran untuk tahun {selectedYear}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2">
            <h3 className="tracking-tight text-sm font-medium text-gray-500">Alokasi Jatah Bulanan</h3>
            <CreditCard className="h-4 w-4 text-gray-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-800">
              Rp {paguBulanan.toLocaleString('id-ID')}
            </div>
            <p className="text-xs text-gray-400 mt-1">Sistem bagi rata 12 bulan</p>
          </div>
        </div>

        <div className={`p-5 rounded-xl border shadow-sm flex flex-col justify-between ${sisaPaguBulanIni < 0 ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
          <div className="flex items-center justify-between pb-2">
            <h3 className={`tracking-tight text-sm font-medium ${sisaPaguBulanIni < 0 ? 'text-red-600' : 'text-emerald-700'}`}>
              Status Bulan {selectedMonthName} {selectedYear}
            </h3>
            <Activity className={`h-4 w-4 ${sisaPaguBulanIni < 0 ? 'text-red-400' : 'text-emerald-400'}`} />
          </div>
          <div>
            <div className={`text-2xl font-bold ${sisaPaguBulanIni < 0 ? 'text-red-700' : 'text-emerald-800'}`}>
              {sisaPaguBulanIni < 0 ? `- Rp ${Math.abs(sisaPaguBulanIni).toLocaleString('id-ID')}` : `Rp ${sisaPaguBulanIni.toLocaleString('id-ID')}`}
            </div>
            <div className={`flex items-center gap-1.5 mt-1 text-xs font-bold uppercase tracking-wide ${sisaPaguBulanIni < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
              {sisaPaguBulanIni < 0 ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
              {sisaPaguBulanIni < 0 ? 'Kekurangan' : 'Aman'}
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar & Live Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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

      {/* Tabel Data (Dinamis & Searchable) */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50/80 text-gray-600 font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 w-16">NO</th>
                <th className="px-6 py-4">NAMA KENDARAAN</th>
                <th className="px-6 py-4">PLAT NOMOR</th>
                <th className="px-6 py-4">KATEGORI PENGELUARAN</th>
                <th className="px-6 py-4">TOTAL BIAYA</th>
                <th className="px-6 py-4 text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500 font-medium">Memuat data dari database...</td>
                </tr>
              ) : filteredPemeliharaanList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    {searchQuery ? 'Data tidak ditemukan.' : `Belum ada pengajuan pemeliharaan untuk tahun ${selectedYear}.`}
                  </td>
                </tr>
              ) : (
                filteredPemeliharaanList.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4 text-gray-500">{index + 1}</td>
                    <td className="px-6 py-4 text-gray-600 font-medium">
                      {item.inventaris_kib_b?.nama_barang} {item.inventaris_kib_b?.merk_type ? `- ${item.inventaris_kib_b?.merk_type}` : ''}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">{item.inventaris_kib_b?.no_polisi || '-'}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        {item.kategori_pengeluaran || 'Pemeliharaan'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-800">
                      Rp {Number(item.total_biaya).toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center items-center gap-3 text-gray-400">
                        <button className="hover:text-gray-700 transition" title="Lihat Detail"><Eye size={18} /></button>
                        <button className="hover:text-blue-600 transition" title="Edit"><SquarePen size={18} /></button>
                        <button className="hover:text-green-600 transition" title="Cetak SPK/Nota"><Printer size={18} /></button>
                        <button onClick={() => handleDelete(item.id, item.inventaris_kib_b?.no_polisi || '-')} className="hover:text-red-600 transition" title="Hapus"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between sm:flex-row flex-col gap-4">
          <span className="text-sm text-gray-500">Menampilkan {filteredPemeliharaanList.length > 0 ? `1-${filteredPemeliharaanList.length} dari ${filteredPemeliharaanList.length}` : '0'} kendaraan</span>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded hover:bg-gray-100 text-gray-500 disabled:opacity-50" disabled>&lt;</button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-blue-600 text-white text-sm font-medium">1</button>
            <button className="p-2 rounded hover:bg-gray-100 text-gray-500">&gt;</button>
          </div>
        </div>
      </div>

      {/* Render Komponen Modal Pengajuan */}
      <VehicleRepairModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      {/* MODAL 1: Tambah Tahun */}
      {isAddYearModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-xl shadow-lg border overflow-hidden mx-4">
            <div className="p-6">
              <h2 className="text-lg font-semibold tracking-tight text-gray-900">Tambah Tahun Anggaran</h2>
              <p className="text-sm text-gray-500 mt-1.5">Masukkan tahun anggaran baru untuk ditambahkan ke dalam filter.</p>
              
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tahun</label>
                  <input 
                    type="number" 
                    value={newYearInput}
                    onChange={(e) => setNewYearInput(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium text-gray-900 placeholder:text-gray-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="Contoh: 2027"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nominal PAGU Tahunan</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-900 text-sm font-medium">Rp.</span>
                    <input 
                      type="number" 
                      value={newPaguInput}
                      onChange={(e) => setNewPaguInput(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium text-gray-900 placeholder:text-gray-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex items-center justify-end gap-2 border-t">
              <button 
                onClick={() => setIsAddYearModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-100 transition text-sm"
              >
                Batal
              </button>
              <button 
                onClick={handleAddYear}
                disabled={isSubmittingYear}
                className="px-4 py-2 bg-slate-900 text-white rounded-md font-medium hover:bg-slate-800 transition shadow-sm text-sm disabled:opacity-50"
              >
                {isSubmittingYear ? 'Menyimpan...' : 'Simpan Tahun'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Edit PAGU Tahunan */}
      {isEditPaguModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-xl shadow-lg border overflow-hidden mx-4">
            <div className="p-6">
              <h2 className="text-lg font-semibold tracking-tight text-gray-900">Sesuaikan PAGU Tahunan</h2>
              <p className="text-sm text-gray-500 mt-1.5">Ubah anggaran pemeliharaan untuk tahun berjalan ({selectedYear}).</p>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Nominal PAGU Tahunan</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-900 text-sm font-medium">Rp.</span>
                  <input 
                    type="number" 
                    value={editPaguInput}
                    onChange={(e) => setEditPaguInput(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium text-gray-900 placeholder:text-gray-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex items-center justify-end gap-2 border-t">
              <button 
                onClick={() => setIsEditPaguModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-100 transition text-sm"
              >
                Batal
              </button>
              <button 
                onClick={handleSaveEditPagu}
                disabled={isSubmittingEditPagu}
                className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition shadow-sm text-sm disabled:opacity-50"
              >
                {isSubmittingEditPagu ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}