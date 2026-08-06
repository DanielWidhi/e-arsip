"use client";

import { X, Info, Wrench, ImagePlus, Save } from "lucide-react";

type AssetCreateModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AssetCreateModal({ isOpen, onClose }: AssetCreateModalProps) {
  if (!isOpen) return null;

  const inputClass = "w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all placeholder:text-slate-400";
  const labelClass = "block text-xs font-semibold text-slate-700 mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 sm:p-6 md:p-8 overflow-y-auto" onClick={onClose}>
      <div className="relative flex w-full max-w-5xl flex-col rounded-xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200 my-auto" onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 bg-white rounded-t-xl sticky top-0 z-20">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">Tambah Data Inventaris Baru</h2>
            <p className="text-xs md:text-sm text-slate-500 mt-1">Lengkapi form di bawah ini untuk mencatat aset baru ke dalam sistem KIB B.</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors focus:outline-none">
            <X size={24} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 md:p-8 overflow-y-auto max-h-[calc(100vh-180px)]">
          {/* UBAH: Di layar HP 1 kolom (grid-cols-1), di Layar PC 2 kolom (lg:grid-cols-2) */}
          <form className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* --- KOLOM KIRI: Informasi Utama --- */}
            <div className="space-y-5">
              <h3 className="text-sm font-bold text-blue-700 flex items-center gap-2 border-b border-slate-200 pb-2 uppercase tracking-wide">
                <Info size={18} /> Informasi Utama
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass} htmlFor="kode-barang">
                    Kode Barang
                  </label>
                  <input id="kode-barang" className={inputClass} placeholder="Mis: 02.06.01..." type="text" />
                </div>
                <div>
                  <label className={labelClass} htmlFor="no-register">
                    No Register
                  </label>
                  <input id="no-register" className={inputClass} placeholder="0001" type="text" />
                </div>
              </div>

              <div>
                <label className={labelClass} htmlFor="nama-barang">
                  Nama Barang / Jenis
                </label>
                <input id="nama-barang" className={inputClass} placeholder="Masukkan nama barang" type="text" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass} htmlFor="merk-type">
                    Merk/Type
                  </label>
                  <input id="merk-type" className={inputClass} placeholder="Mis: Toyota / Avanza" type="text" />
                </div>
                <div>
                  <label className={labelClass} htmlFor="ukuran-cc">
                    Ukuran/CC
                  </label>
                  <input id="ukuran-cc" className={inputClass} placeholder="Mis: 1500cc" type="text" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass} htmlFor="bahan">
                    Bahan
                  </label>
                  <select id="bahan" className={`${inputClass} bg-white cursor-pointer`}>
                    <option disabled selected value="">
                      Pilih Bahan...
                    </option>
                    <option value="besi">Besi/Logam</option>
                    <option value="kayu">Kayu</option>
                    <option value="plastik">Plastik</option>
                    <option value="campuran">Campuran</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass} htmlFor="tahun-beli">
                    Tahun Beli
                  </label>
                  <input id="tahun-beli" className={inputClass} placeholder="YYYY" type="number" min="1900" max="2099" />
                </div>
              </div>

              <div>
                <label className={labelClass} htmlFor="pabrik">
                  Pabrik
                </label>
                <input id="pabrik" className={inputClass} placeholder="Nama pabrik pembuat" type="text" />
              </div>

              <div>
                <label className={labelClass} htmlFor="keterangan">
                  Keterangan Khusus
                </label>
                <textarea id="keterangan" className={`${inputClass} h-24 resize-none`} placeholder="Tambahkan catatan mengenai barang ini..."></textarea>
              </div>
            </div>

            {/* --- KOLOM KANAN: Spesifikasi & Harga --- */}
            <div className="space-y-5">
              <h3 className="text-sm font-bold text-blue-700 flex items-center gap-2 border-b border-slate-200 pb-2 uppercase tracking-wide">
                <Wrench size={18} /> Spesifikasi Khusus & Harga
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass} htmlFor="rangka">
                    No. Rangka <span className="text-slate-400 font-normal ml-1">(Opsional)</span>
                  </label>
                  <input id="rangka" className={inputClass} placeholder="-" type="text" />
                </div>
                <div>
                  <label className={labelClass} htmlFor="mesin">
                    No. Mesin <span className="text-slate-400 font-normal ml-1">(Opsional)</span>
                  </label>
                  <input id="mesin" className={inputClass} placeholder="-" type="text" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass} htmlFor="polisi">
                    No. Polisi <span className="text-slate-400 font-normal ml-1">(Opsional)</span>
                  </label>
                  <input id="polisi" className={inputClass} placeholder="Mis: DK 1234 CD" type="text" />
                </div>
                <div>
                  <label className={labelClass} htmlFor="bpkb">
                    BPKB <span className="text-slate-400 font-normal ml-1">(Opsional)</span>
                  </label>
                  <input id="bpkb" className={inputClass} placeholder="-" type="text" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass} htmlFor="asal-usul">
                    Asal Usul
                  </label>
                  <select id="asal-usul" className={`${inputClass} bg-white cursor-pointer`}>
                    <option disabled selected value="">
                      Pilih Asal...
                    </option>
                    <option value="pembelian">APBD / Pembelian</option>
                    <option value="hibah">Hibah</option>
                    <option value="bantuan">Bantuan</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass} htmlFor="harga">
                    Harga
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 font-semibold text-sm">Rp</span>
                    <input id="harga" className={`${inputClass} pl-10`} placeholder="0" type="number" />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className={labelClass}>Upload Foto Aset Awal</label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-slate-50 hover:bg-slate-100 hover:border-blue-400 transition-colors cursor-pointer group">
                  <div className="w-14 h-14 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-blue-600 mb-3 group-hover:scale-110 transition-transform">
                    <ImagePlus size={28} />
                  </div>
                  <p className="text-sm font-bold text-blue-600 mb-1">Klik untuk upload atau drag and drop</p>
                  <p className="text-xs text-slate-500 font-medium">SVG, PNG, JPG (Maks. 5MB)</p>
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
          <button type="button" className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-2 active:scale-95">
            <Save size={18} />
            Simpan Data
          </button>
        </div>
      </div>
    </div>
  );
}
