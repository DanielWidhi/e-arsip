"use client";

import { useState, useRef } from "react";
import { X, UploadCloud, Download, Save, Loader2, FileSpreadsheet } from "lucide-react";
import Papa from "papaparse";
import { createClient } from "@/lib/supabase";
import Swal from "sweetalert2";

type CsvImportModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function CsvImportModal({ isOpen, onClose, onSuccess }: CsvImportModalProps) {
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [fileName, setFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  // FUNGSI 1: DOWNLOAD TEMPLATE CSV UNTUK ADMIN
  const downloadTemplate = () => {
    const templateHeader =
      "kode_barang,nama_barang,nomor_register,merk_type,ukuran_cc,bahan,tahun_beli,pabrik,no_rangka,no_mesin,no_polisi,no_bpkb,harga,kondisi,keterangan\n02.06.01.01.01,Laptop Core i5,0001,Lenovo,14 Inch,Plastik,2023,Lenovo,-,-,-,-,12000000,Baik,Pengadaan Baru 2023\n02.03.01.04.01,Motor Supra X,0002,Honda,125 CC,Besi,2020,Astra Honda,MH123,KE456,DK 1234 A,12345,18500000,Baik,Kendaraan Operasional";
    const blob = new Blob([templateHeader], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Template_Import_KIB_B.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // FUNGSI 2: MEMBACA DAN MEMPARSING FILE CSV DENGAN PAPAPARSE
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        complete: (results: any) => {
          setParsedData(results.data);
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        error: (error: any) => {
          Swal.fire({ icon: "error", title: "Gagal Membaca File", text: error.message, confirmButtonColor: "#ba1a1a" });
        },
      });
    }
  };

  // FUNGSI 3: BULK INSERT MASSAL KE SUPABASE
  const handleImportSubmit = async () => {
    if (parsedData.length === 0) {
      Swal.fire({ icon: "warning", title: "File Kosong", text: "Silakan pilih file CSV yang berisi data terlebih dahulu.", confirmButtonColor: "#2563eb" });
      return;
    }

    setIsLoading(true);

    try {
      // Format ulang data dari CSV ke payload yang siap masuk Supabase
      const formattedPayload = parsedData.map((row) => ({
        kode_barang: row.kode_barang || "00.00.00.00.00",
        nama_barang: row.nama_barang || "Barang Tanpa Nama",
        nomor_register: row.nomor_register || "0000",
        merk_type: row.merk_type || "-",
        ukuran_cc: row.ukuran_cc || "-",
        bahan: row.bahan || "-",
        tahun_beli: row.tahun_beli || "-",
        pabrik: row.pabrik || "-",
        no_rangka: row.no_rangka || "-",
        no_mesin: row.no_mesin || "-",
        no_polisi: row.no_polisi || "-",
        no_bpkb: row.no_bpkb || "-",
        harga: row.harga ? Number(row.harga) : 0,
        kondisi: row.kondisi || "Baik",
        keterangan: row.keterangan || "-",
      }));

      // Kirim seluruh array dalam SATU PANGGILAN (Bulk Insert)
      const { error } = await supabase.from("inventaris_kib_b").insert(formattedPayload);

      if (error) throw error;

      Swal.fire({
        icon: "success",
        title: "Import Berhasil!",
        text: `Sebanyak ${formattedPayload.length} data inventaris berhasil dimasukkan ke database.`,
        confirmButtonColor: "#2563eb",
      });

      setParsedData([]);
      setFileName("");
      onSuccess(); // Refresh tabel admin
      onClose(); // Tutup modal
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Terjadi kesalahan saat import data.";
      Swal.fire({ icon: "error", title: "Gagal Import", text: msg, confirmButtonColor: "#ba1a1a" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 sm:p-6" onClick={onClose}>
      <div className="relative flex w-full max-w-2xl flex-col rounded-xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200 my-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0">
              <FileSpreadsheet size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Import Data dari CSV / Excel</h2>
              <p className="text-xs text-slate-500 mt-0.5">Unggah file CSV untuk memasukkan banyak data sekaligus.</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Langkah 1: Template */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-slate-700">Langkah 1: Unduh Format Template</p>
              <p className="text-xs text-slate-500 mt-0.5">Gunakan format susunan kolom CSV yang sesuai dengan sistem.</p>
            </div>
            <button onClick={downloadTemplate} type="button" className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 px-3 py-2 rounded-lg text-xs font-bold transition-colors shrink-0 shadow-sm">
              <Download size={14} /> Download Template
            </button>
          </div>

          {/* Langkah 2: Upload */}
          <div>
            <p className="text-xs font-bold text-slate-700 mb-2">Langkah 2: Unggah File CSV Anda</p>
            <input type="file" accept=".csv" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-slate-50 hover:bg-slate-100 hover:border-blue-400 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-blue-600 mb-3 group-hover:scale-110 transition-transform">
                <UploadCloud size={24} />
              </div>
              <p className="text-sm font-bold text-blue-600 mb-1">{fileName ? fileName : "Klik untuk memilih file CSV"}</p>
              <p className="text-xs text-slate-400">{parsedData.length > 0 ? `${parsedData.length} baris data terdeteksi` : "Hanya mendukung file dengan ekstensi .csv"}</p>
            </div>
          </div>

          {/* Preview Data */}
          {parsedData.length > 0 && (
            <div className="max-h-36 overflow-y-auto border border-slate-200 rounded-lg text-xs">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-100 sticky top-0">
                  <tr>
                    <th className="p-2 border-b font-bold">Kode</th>
                    <th className="p-2 border-b font-bold">Nama Barang</th>
                    <th className="p-2 border-b font-bold">Kondisi</th>
                    <th className="p-2 border-b font-bold">Harga</th>
                  </tr>
                </thead>
                <tbody>
                  {parsedData.slice(0, 5).map((row, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="p-2 font-mono">{row.kode_barang || "-"}</td>
                      <td className="p-2 font-medium">{row.nama_barang || "-"}</td>
                      <td className="p-2">{row.kondisi || "-"}</td>
                      <td className="p-2">{row.harga || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {parsedData.length > 5 && <p className="p-2 text-center text-slate-400 italic bg-slate-50">...dan {parsedData.length - 5} data lainnya</p>}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-xl flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm">
            Batal
          </button>
          <button
            onClick={handleImportSubmit}
            disabled={isLoading || parsedData.length === 0}
            type="button"
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {isLoading ? "Proses Import..." : "Proses Import ke Database"}
          </button>
        </div>
      </div>
    </div>
  );
}
