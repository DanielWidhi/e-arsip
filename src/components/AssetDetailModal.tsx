"use client";

import { X, CheckCircle, AlertTriangle, Wrench } from "lucide-react";

// Tipe data untuk properti yang dikirim ke modal
type AssetDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  asset: any; // Nantinya ganti dengan tipe data 16 kolom Anda
};

export default function AssetDetailModal({ isOpen, onClose, asset }: AssetDetailModalProps) {
  if (!isOpen || !asset) return null;

  // Render Ikon Status
  const renderStatus = () => {
    if (asset.kondisi === "Baik") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-semibold shadow-sm">
          <CheckCircle size={16} /> Kondisi: Baik
        </span>
      );
    } else if (asset.kondisi === "Rusak Ringan") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 text-sm font-semibold shadow-sm">
          <Wrench size={16} /> Kondisi: Rusak Ringan
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-100 text-red-700 text-sm font-semibold shadow-sm">
          <AlertTriangle size={16} /> Kondisi: Rusak Berat
        </span>
      );
    }
  };

  return (
    // OVERLAY: Latar belakang gelap transparan (klik luar untuk tutup)
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 sm:p-6" onClick={onClose}>
      {/* MODAL CONTAINER: Animasi muncul, max height 90% layar agar tidak tembus */}
      <div
        className="relative flex w-full max-w-4xl max-h-[90vh] flex-col rounded-xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()} // Mencegah klik di dalam modal menutup overlay
      >
        {/* HEADER: Fix di atas */}
        <div className="flex items-center justify-between border-b border-slate-200 p-4 md:p-6 bg-slate-50 rounded-t-xl">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800">Detail Informasi Inventaris</h2>
          <button onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors focus:outline-none" aria-label="Tutup">
            <X size={24} />
          </button>
        </div>

        {/* BODY: Area yang bisa di-scroll jika di HP kekecilan */}
        <div className="overflow-y-auto p-4 md:p-6">
          <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
            {/* KOLOM KIRI (HP: Atas, PC: Kiri) - FOTO & STATUS */}
            <div className="w-full lg:w-1/3 flex flex-col gap-4">
              <div className="aspect-video lg:aspect-square w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-100 relative shadow-inner">
                <img src={asset.foto || "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=600"} alt="Foto Aset" className="h-full w-full object-cover" />
              </div>
              <div className="flex justify-start">{renderStatus()}</div>
            </div>

            {/* KOLOM KANAN (HP: Bawah, PC: Kanan) - DATA LENGKAP */}
            <div className="w-full lg:w-2/3 flex flex-col">
              {/* Judul Barang & Kode */}
              <div className="mb-6 border-b border-slate-200 pb-4">
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">{asset.nama}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-500">Kode Barang:</span>
                  <span className="rounded bg-slate-100 px-2 py-1 font-mono text-sm font-semibold text-slate-700 border border-slate-200">{asset.kode}</span>
                </div>
              </div>

              {/* GRID DATA 16 KOLOM (HP: 1 Kolom, PC: 2 Kolom) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                {/* Data 1-12 */}
                {[
                  { label: "Nomor Register", value: "0001" },
                  { label: "Merk / Type", value: asset.merk },
                  { label: "Ukuran / CC", value: "125 CC" },
                  { label: "Bahan", value: "Besi / Plastik" },
                  { label: "Tahun Pembelian", value: asset.tahun },
                  { label: "Pabrik", value: "Astra Honda Motor" },
                  { label: "Rangka", value: "MH1JB000000K" },
                  { label: "No Mesin", value: "JB00E-0000000" },
                  { label: "Polisi", value: "DK 1234 ABC" },
                  { label: "BPKB", value: "12345678" },
                  { label: "Asal Usul", value: "APBD" },
                  { label: "Harga (Rp)", value: "Rp 18.500.000" },
                  { label: "Kartu Inventaris Ruangan (KIR)", value: asset.kir },
                ].map((item, index) => (
                  <div key={index} className="flex flex-col border-b border-slate-100 pb-2">
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{item.label}</span>
                    <span className="text-sm md:text-base font-semibold text-slate-800">{item.value}</span>
                  </div>
                ))}

                {/* Keterangan (Memakan ruang penuh / 2 kolom di PC) */}
                <div className="flex flex-col sm:col-span-2 pt-2">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Keterangan</span>
                  <span className="text-sm md:text-base text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                    Kendaraan operasional dinas kecamatan. Diservis rutin setiap 3 bulan di bengkel resmi. Kondisi mesin masih sangat prima.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER: Fix di bawah */}
        <div className="flex justify-end border-t border-slate-200 bg-slate-50 p-4 md:p-6 rounded-b-xl">
          <button onClick={onClose} className="rounded-lg border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors shadow-sm">
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
