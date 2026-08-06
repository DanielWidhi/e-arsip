"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Download, ChevronDown, Upload, Plus, Edit, Trash2, ChevronLeft, ChevronRight, Eye, Loader2 } from "lucide-react";

import { generatePdfKibB, AssetItem } from "@/utils/exportPdfKibB";
import AssetCreateModal from "@/components/AssetCreateModal";
import AssetDetailModal, { AssetType } from "@/components/AssetDetailModal";
import AssetEditModal from "@/components/AssetEditModal";
import { createClient } from "@/lib/supabase";

export default function InventarisAdminPage() {
  const [dataInventaris, setDataInventaris] = useState<AssetItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [filterTahun, setFilterTahun] = useState("");
  const [filterKondisi, setFilterKondisi] = useState("");
  const [filterKir, setFilterKir] = useState("");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<AssetType | null>(null);
  const [assetToEdit, setAssetToEdit] = useState<AssetItem | null>(null);

  const supabase = createClient();

  const fetchInventaris = async () => {
    setIsLoading(true);

    const { data, error } = await supabase.from("inventaris_kib_b").select(`*, kir:master_kir(nama_ruangan), asal_usul:master_asal_usul(nama_asal)`).order("id", { ascending: false });

    if (error) {
      console.error("Error fetching data:", error.message);
      alert("Gagal mengambil data dari database!");
    } else if (data) {
      // 1. PERBAIKAN ERROR MERAH: Mengubah (item: any) menjadi (item: Record<string, any>)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const formattedData: AssetItem[] = data.map((item: Record<string, any>) => ({
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

      setDataInventaris(formattedData);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    // 2. PERBAIKAN ERROR MERAH: Membungkus fungsi dengan setTimeout
    setTimeout(() => {
      fetchInventaris();
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id: number, nama: string) => {
    const confirmDelete = window.confirm(`Peringatan!\n\nApakah Anda yakin ingin menghapus "${nama}"?\nData yang dihapus tidak dapat dikembalikan.`);
    if (confirmDelete) {
      const { error } = await supabase.from("inventaris_kib_b").delete().eq("id", id);
      if (error) alert("Gagal menghapus data: " + error.message);
      else setDataInventaris(dataInventaris.filter((item) => item.id !== id));
    }
  };

  const filteredData = dataInventaris.filter((item) => {
    const matchSearch = item.nama.toLowerCase().includes(searchTerm.toLowerCase()) || item.kode.includes(searchTerm);
    const matchTahun = filterTahun === "" || item.tahun === filterTahun;
    const matchKondisi = filterKondisi === "" || item.kondisi === filterKondisi;
    const matchKir = filterKir === "" || item.kir === filterKir;
    return matchSearch && matchTahun && matchKondisi && matchKir;
  });

  const handleEditClick = (item: AssetItem) => {
    setAssetToEdit(item);
    setIsEditModalOpen(true);
  };

  const handleOpenDetail = (item: AssetItem) => {
    setSelectedAsset(item as unknown as AssetType);
    setIsDetailModalOpen(true);
  };

  const exportToPDF = () => generatePdfKibB(filteredData);
  const exportToExcel = () => alert("Fitur Export Excel akan menggunakan library SheetJS (xlsx) nantinya.");

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
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Daftar Inventaris KIB B</h2>
          <p className="text-sm text-slate-500 mt-1">Kelola data peralatan dan mesin secara terpusat.</p>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 w-full xl:w-auto mt-2 xl:mt-0">
          <div className="relative w-full sm:flex-1 sm:min-w-50 xl:w-64">
            <Search className="absolute inset-y-0 left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Cari aset..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 sm:py-2 border border-slate-200 rounded-lg text-sm bg-white text-slate-800 shadow-sm outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className={`flex justify-center items-center gap-2 border text-sm font-semibold py-2.5 sm:py-2 px-3 rounded-lg transition-all shadow-sm ${showFilter ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"}`}
            >
              <Filter size={16} />
              <span className="hidden sm:inline">Filter</span>
            </button>
            <div className="relative group w-full sm:w-auto">
              <button className="w-full flex justify-center items-center gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:shadow-sm text-sm font-semibold py-2.5 sm:py-2 px-3 rounded-lg transition-all">
                <Download size={16} />
                <span className="hidden sm:inline">Export</span>
                <ChevronDown size={14} className="hidden sm:block" />
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
              <Upload size={16} />
              <span className="hidden sm:inline">Import CSV</span>
            </button>
            <button onClick={() => setIsCreateModalOpen(true)} className="flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 sm:py-2 px-4 rounded-lg text-sm font-semibold transition-colors shadow-sm">
              <Plus size={18} />
              <span className="hidden sm:inline">Tambah Aset</span>
            </button>
          </div>
        </div>
      </div>

      {showFilter && (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-sm font-semibold text-slate-700 w-16">Tahun:</span>
            <select value={filterTahun} onChange={(e) => setFilterTahun(e.target.value)} className="flex-1 sm:w-40 border border-slate-200 rounded-lg px-3 py-2 sm:py-1.5 text-sm text-slate-700 outline-none">
              <option value="">Semua</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-sm font-semibold text-slate-700 w-16">Kondisi:</span>
            <select value={filterKondisi} onChange={(e) => setFilterKondisi(e.target.value)} className="flex-1 sm:w-40 border border-slate-200 rounded-lg px-3 py-2 sm:py-1.5 text-sm text-slate-700 outline-none">
              <option value="">Semua</option>
              <option value="Baik">Baik</option>
              <option value="Rusak Ringan">Rusak Ringan</option>
              <option value="Rusak Berat">Rusak Berat</option>
            </select>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-sm font-semibold text-slate-700 w-16 sm:w-10">KIR:</span>
            <select value={filterKir} onChange={(e) => setFilterKir(e.target.value)} className="flex-1 sm:w-48 border border-slate-200 rounded-lg px-3 py-2 sm:py-1.5 text-sm text-slate-700 outline-none">
              <option value="">Semua Ruangan</option>
              <option value="Ruang Camat">Ruang Camat</option>
              <option value="Ruang Pelayanan">Ruang Pelayanan</option>
              <option value="Garasi">Garasi</option>
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

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col w-full min-h-100">
        <div className="overflow-x-auto w-full flex-1">
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
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-500 gap-3">
                      <Loader2 size={32} className="animate-spin text-blue-600" />
                      <p>Memuat data dari Database...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 text-slate-500">{index + 1}</td>
                    <td className="px-6 py-4 font-mono text-slate-600">{item.kode}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">{item.nama}</td>
                    <td className="px-6 py-4">{getKondisiBadge(item.kondisi)}</td>
                    <td className="px-6 py-4 text-right tabular-nums">{item.harga.toLocaleString("id-ID")}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button onClick={() => handleOpenDetail(item)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Lihat Detail">
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
                    Tidak ada data inventaris.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

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
              <button className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold bg-blue-50 text-blue-600">1</button>
            </div>
            <button className="p-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50" disabled>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <AssetDetailModal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} asset={selectedAsset} />
      <AssetCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          fetchInventaris();
        }}
      />
      <AssetEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        asset={assetToEdit}
        onSave={() => {
          fetchInventaris();
        }}
      />
    </div>
  );
}
