"use client";

import { useState } from "react";
import { Search, Filter, Download, ChevronDown, Upload, Plus, Edit, Trash2, ChevronLeft, ChevronRight, Eye } from "lucide-react";

import { generatePdfKibB, AssetItem } from "@/utils/exportPdfKibB";
import AssetCreateModal from "@/components/AssetCreateModal";
import AssetDetailModal, { AssetType } from "@/components/AssetDetailModal";
import AssetEditModal from "@/components/AssetEditModal";

// --- MOCK DATA ---
const mockInventaris: AssetItem[] = [
  {
    id: 1,
    kode: "02.06.01.01.01",
    nama: "Laptop ASUS ExpertBook",
    nomorRegister: "0001",
    merk: "ASUS",
    ukuran: "14 inch",
    bahan: "Plastik",
    tahun: "2023",
    pabrik: "PF12345",
    rangka: "-",
    mesin: "-",
    polisi: "-",
    bpkb: "-",
    asalUsul: "APBD",
    harga: 15000000,
    kondisi: "Baik",
    kir: "Ruang Camat",
    keterangan: "Baik",
  },
  {
    id: 2,
    kode: "02.06.02.01.15",
    nama: "Printer Laser Color",
    nomorRegister: "0002",
    merk: "HP",
    ukuran: "A4",
    bahan: "Plastik",
    tahun: "2022",
    pabrik: "-",
    rangka: "-",
    mesin: "-",
    polisi: "-",
    bpkb: "-",
    asalUsul: "APBD",
    harga: 2800000,
    kondisi: "Baik",
    kir: "Ruang Pelayanan",
    keterangan: "-",
  },
  {
    id: 3,
    kode: "02.06.01.04.02",
    nama: "Proyektor DLP",
    nomorRegister: "0003",
    merk: "Epson",
    ukuran: "-",
    bahan: "Plastik",
    tahun: "2021",
    pabrik: "-",
    rangka: "-",
    mesin: "-",
    polisi: "-",
    bpkb: "-",
    asalUsul: "APBD",
    harga: 5500000,
    kondisi: "Rusak Ringan",
    kir: "Ruang Rapat Utama",
    keterangan: "-",
  },
];

export default function InventarisAdminPage() {
  // --- STATE DATA TABEL ---
  const [dataInventaris, setDataInventaris] = useState<AssetItem[]>(mockInventaris);

  // --- STATE PENCARIAN & FILTER ---
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [filterTahun, setFilterTahun] = useState("");
  const [filterKondisi, setFilterKondisi] = useState("");
  const [filterKir, setFilterKir] = useState("");

  // --- STATE MODAL ---
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<AssetType | null>(null);
  const [assetToEdit, setAssetToEdit] = useState<AssetItem | null>(null);

  // --- LOGIKA FILTERING ---
  const filteredData = dataInventaris.filter((item) => {
    const matchSearch = item.nama.toLowerCase().includes(searchTerm.toLowerCase()) || item.kode.includes(searchTerm);
    const matchTahun = filterTahun === "" || item.tahun === filterTahun;
    const matchKondisi = filterKondisi === "" || item.kondisi === filterKondisi;
    const matchKir = filterKir === "" || item.kir === filterKir;
    return matchSearch && matchTahun && matchKondisi && matchKir;
  });

  // --- FUNGSI CRUD TABEL ---
  const handleDelete = (id: number, nama: string) => {
    const confirmDelete = window.confirm(`Peringatan!\n\nApakah Anda yakin ingin menghapus "${nama}"?\nData yang dihapus tidak dapat dikembalikan.`);
    if (confirmDelete) {
      const newData = dataInventaris.filter((item) => item.id !== id);
      setDataInventaris(newData);
    }
  };

  const handleEditClick = (item: AssetItem) => {
    setAssetToEdit(item);
    setIsEditModalOpen(true);
  };

  const exportToPDF = () => generatePdfKibB(filteredData);
  const exportToExcel = () => alert("Fitur Export Excel akan menggunakan library SheetJS (xlsx) nantinya.");

  // --- FUNGSI TAMPILAN BADGE ---
  const getKondisiBadge = (kondisi: string) => {
    if (kondisi === "Baik")
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/50">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Baik
        </span>
      );
    if (kondisi === "Rusak Ringan")
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200/50">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Rusak Ringan
        </span>
      );
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200/50">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Rusak Berat
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* HEADER HALAMAN & TOOLBAR */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Daftar Inventaris KIB B</h2>
          <p className="text-sm text-slate-500 mt-1">Kelola data peralatan dan mesin secara terpusat.</p>
        </div>

        {/* Toolbar (Pencarian & Tombol Aksi) */}
        <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 w-full xl:w-auto mt-2 xl:mt-0">
          <div className="relative w-full sm:flex-1 sm:min-w-50 xl:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Cari aset..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 sm:py-2 border border-slate-200 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-shadow bg-white text-slate-800 shadow-sm"
            />
          </div>

          <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={`flex justify-center items-center gap-2 border text-sm font-semibold py-2.5 sm:py-2 px-3 rounded-lg transition-all shadow-sm ${showFilter ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"}`}
            >
              <Filter size={16} className={showFilter ? "text-blue-600" : "text-slate-500"} />
              <span>Filter</span>
            </button>

            <div className="relative group w-full sm:w-auto">
              <button className="w-full flex justify-center items-center gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:shadow-sm text-sm font-semibold py-2.5 sm:py-2 px-3 rounded-lg transition-all">
                <Download size={16} className="text-slate-500" />
                <span>Export</span>
                <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
              </button>
              <div className="absolute right-0 mt-1 w-full sm:w-32 bg-white border border-slate-200 rounded-lg shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                <button onClick={exportToExcel} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                  Excel (.xlsx)
                </button>
                <button onClick={exportToPDF} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors font-semibold text-red-600">
                  PDF (.pdf)
                </button>
              </div>
            </div>

            <button className="flex justify-center items-center gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:shadow-sm text-sm font-semibold py-2.5 sm:py-2 px-3 rounded-lg transition-all">
              <Upload size={16} className="text-slate-500" />
              <span className="hidden sm:inline">Import CSV</span>
            </button>

            <button onClick={() => setIsCreateModalOpen(true)} className="flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 sm:py-2 px-4 rounded-lg text-sm font-semibold transition-colors shadow-sm">
              <Plus size={18} />
              <span className="hidden sm:inline">Tambah Aset</span>
            </button>
          </div>
        </div>
      </div>

      {/* PANEL FILTER */}
      {showFilter && (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-sm font-semibold text-slate-700 w-16">Tahun:</span>
            <select value={filterTahun} onChange={(e) => setFilterTahun(e.target.value)} className="flex-1 sm:w-40 border border-slate-200 rounded-lg px-3 py-2 sm:py-1.5 text-sm text-slate-700 focus:ring-2 focus:ring-blue-600 outline-none">
              <option value="">Semua</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
            </select>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-sm font-semibold text-slate-700 w-16">Kondisi:</span>
            <select
              value={filterKondisi}
              onChange={(e) => setFilterKondisi(e.target.value)}
              className="flex-1 sm:w-40 border border-slate-200 rounded-lg px-3 py-2 sm:py-1.5 text-sm text-slate-700 focus:ring-2 focus:ring-blue-600 outline-none"
            >
              <option value="">Semua</option>
              <option value="Baik">Baik</option>
              <option value="Rusak Ringan">Rusak Ringan</option>
              <option value="Rusak Berat">Rusak Berat</option>
            </select>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-sm font-semibold text-slate-700 w-16 sm:w-10">KIR:</span>
            <select value={filterKir} onChange={(e) => setFilterKir(e.target.value)} className="flex-1 sm:w-48 border border-slate-200 rounded-lg px-3 py-2 sm:py-1.5 text-sm text-slate-700 focus:ring-2 focus:ring-blue-600 outline-none">
              <option value="">Semua Ruangan</option>
              <option value="Ruang Camat">Ruang Camat</option>
              <option value="Ruang Pelayanan">Ruang Pelayanan</option>
              <option value="Ruang Rapat Utama">Ruang Rapat Utama</option>
            </select>
          </div>
          <button
            onClick={() => {
              setFilterTahun("");
              setFilterKondisi("");
              setFilterKir("");
            }}
            className="text-sm text-red-600 font-semibold hover:bg-red-50 px-3 py-2 rounded-lg w-full sm:w-auto text-center sm:ml-auto transition-colors"
          >
            Reset Filter
          </button>
        </div>
      )}

      {/* CARD TABEL */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col w-full">
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4 w-16">No</th>
                <th className="px-6 py-4">Kode Barang</th>
                <th className="px-6 py-4">Nama Barang</th>
                <th className="px-6 py-4">Kondisi</th>
                <th className="px-6 py-4 text-right">Harga (Rp)</th>
                <th className="px-6 py-4 text-center w-32">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 text-slate-500">{index + 1}</td>
                    <td className="px-6 py-4 font-mono text-slate-600">{item.kode}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">{item.nama}</td>
                    <td className="px-6 py-4">{getKondisiBadge(item.kondisi)}</td>
                    <td className="px-6 py-4 text-right tabular-nums">{item.harga.toLocaleString("id-ID")}</td>
                    <td className="px-6 py-4 text-center">
                      {/* IKON AKSI PERMANEN (Tidak perlu hover) */}
                      <div className="flex items-center justify-center gap-1.5">
                        <button onClick={() => setSelectedAsset(item as unknown as AssetType)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Lihat Detail">
                          <Eye size={16} />
                        </button>
                        <button onClick={() => handleEditClick(item)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Edit Data">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(item.id, item.nama)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Hapus Data">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    Tidak ada data yang sesuai filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="px-6 py-4 border-t border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto">
          <div className="text-sm text-slate-500 text-center sm:text-left">
            Showing <span className="font-semibold text-slate-800">{filteredData.length > 0 ? 1 : 0}</span> to <span className="font-semibold text-slate-800">{filteredData.length}</span> of{" "}
            <span className="font-semibold text-slate-800">{dataInventaris.length}</span> entries
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 border border-slate-200 rounded-lg text-slate-400 disabled:opacity-50" disabled>
              <ChevronLeft size={18} />
            </button>
            <div className="hidden sm:flex items-center gap-1">
              <button className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold bg-blue-600 text-white shadow-sm">1</button>
            </div>
            <button className="p-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50" disabled>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* --- KOMPONEN MODAL DARI FILE LUAR --- */}
      <AssetDetailModal isOpen={selectedAsset !== null} onClose={() => setSelectedAsset(null)} asset={selectedAsset} />

      <AssetCreateModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />

      <AssetEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        asset={assetToEdit}
        onSave={(updatedAsset) => {
          // Logika menyimpan data hasil editan kembali ke tabel
          const updatedList = dataInventaris.map((item) => (item.id === updatedAsset.id ? updatedAsset : item));
          setDataInventaris(updatedList);
        }}
      />
    </div>
  );
}
