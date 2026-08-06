"use client";

import { X, Info, Wrench, Save } from "lucide-react";
import { AssetItem } from "@/utils/exportPdfKibB";

type AssetEditModalProps = {
  isOpen: boolean;
  onClose: () => void;
  asset: AssetItem | null;
  onSave: (updatedAsset: AssetItem) => void; // Fungsi untuk menyimpan ke tabel
};

export default function AssetEditModal({ isOpen, onClose, asset, onSave }: AssetEditModalProps) {
  if (!isOpen || !asset) return null;

  const inputClass = "w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all placeholder:text-slate-400";
  const labelClass = "block text-xs font-semibold text-slate-700 mb-1.5";

  // Fungsi saat tombol simpan ditekan
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Di sini kita pura-pura menyimpan data yang tidak diubah.
    // Nanti Anda bisa mengikat setiap input dengan useState masing-masing.
    alert("Data berhasil diperbarui!");
    onSave(asset);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 sm:p-6 md:p-8 overflow-y-auto" onClick={onClose}>
      <div className="relative flex w-full max-w-5xl flex-col rounded-xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200 my-auto" onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 bg-white rounded-t-xl sticky top-0 z-20">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">Edit Data Inventaris</h2>
            <p className="text-xs md:text-sm text-slate-500 mt-1">Perbarui informasi untuk aset dengan kode {asset.kode}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 md:p-8 overflow-y-auto max-h-[calc(100vh-180px)]">
          <form id="editForm" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* --- KOLOM KIRI --- */}
            <div className="space-y-5">
              <h3 className="text-sm font-bold text-blue-700 flex items-center gap-2 border-b border-slate-200 pb-2 uppercase tracking-wide">
                <Info size={18} /> Informasi Utama
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Kode Barang</label>
                  <input className={inputClass} defaultValue={asset.kode} type="text" />
                </div>
                <div>
                  <label className={labelClass}>No Register</label>
                  <input className={inputClass} defaultValue={asset.nomorRegister} type="text" />
                </div>
              </div>

              <div>
                <label className={labelClass}>Nama Barang / Jenis</label>
                <input className={inputClass} defaultValue={asset.nama} type="text" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Merk/Type</label>
                  <input className={inputClass} defaultValue={asset.merk} type="text" />
                </div>
                <div>
                  <label className={labelClass}>Ukuran/CC</label>
                  <input className={inputClass} defaultValue={asset.ukuran} type="text" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Tahun Beli</label>
                  <input className={inputClass} defaultValue={asset.tahun} type="text" />
                </div>
                <div>
                  <label className={labelClass}>Kondisi Saat Ini</label>
                  <select className={`${inputClass} bg-white cursor-pointer`} defaultValue={asset.kondisi}>
                    <option value="Baik">Baik</option>
                    <option value="Rusak Ringan">Rusak Ringan</option>
                    <option value="Rusak Berat">Rusak Berat</option>
                  </select>
                </div>
              </div>
            </div>

            {/* --- KOLOM KANAN --- */}
            <div className="space-y-5">
              <h3 className="text-sm font-bold text-blue-700 flex items-center gap-2 border-b border-slate-200 pb-2 uppercase tracking-wide">
                <Wrench size={18} /> Spesifikasi Khusus & Harga
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>No. Rangka</label>
                  <input className={inputClass} defaultValue={asset.rangka} type="text" />
                </div>
                <div>
                  <label className={labelClass}>No. Mesin</label>
                  <input className={inputClass} defaultValue={asset.mesin} type="text" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Asal Usul</label>
                  <input className={inputClass} defaultValue={asset.asalUsul} type="text" />
                </div>
                <div>
                  <label className={labelClass}>Harga (Rp)</label>
                  <input className={inputClass} defaultValue={asset.harga} type="number" />
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-xl flex flex-col sm:flex-row items-center justify-end gap-3 sticky bottom-0 z-20">
          <button type="button" onClick={onClose} className="w-full sm:w-auto px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm">
            Batal
          </button>
          <button type="submit" form="editForm" className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-2">
            <Save size={18} />
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
}
