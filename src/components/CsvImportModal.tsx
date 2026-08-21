"use client";

import { useState, useEffect, useRef } from "react";
import { X, UploadCloud, Download, Save, Loader2, FileSpreadsheet } from "lucide-react";
import Papa from "papaparse";
import { createClient } from "@/lib/supabase";
import Swal from "sweetalert2";

type CsvImportModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

// HELPER 1: PARSER HARGA YANG HANDAL (Mendukung format Indonesia 22.000.000, Rp, desimal, dsb.)
const parseHarga = (val: unknown): number => {
  if (val === null || val === undefined || val === "") return 0;
  if (typeof val === "number") return isNaN(val) ? 0 : val;
  const str = String(val).trim();
  if (!str) return 0;

  // Bersihkan simbol mata uang dan huruf
  let cleaned = str.replace(/[^0-9.,-]/g, "");
  if (!cleaned) return 0;

  if (cleaned.includes(".") && cleaned.includes(",")) {
    if (cleaned.indexOf(".") < cleaned.indexOf(",")) {
      // Format Indonesia: 22.000.000,00 -> hapus titik, ubah koma ke titik desimal
      cleaned = cleaned.replace(/\./g, "").replace(",", ".");
    } else {
      // Format US: 22,000,000.00 -> hapus koma
      cleaned = cleaned.replace(/,/g, "");
    }
  } else if (cleaned.includes(".")) {
    // Hanya ada titik: misal "22.000.000" atau "22000.50"
    const parts = cleaned.split(".");
    if (parts.length > 2 || (parts.length === 2 && parts[1].length === 3)) {
      cleaned = cleaned.replace(/\./g, "");
    }
  } else if (cleaned.includes(",")) {
    // Hanya ada koma: misal "22,000,000" atau "22000,50"
    const parts = cleaned.split(",");
    if (parts.length > 2 || (parts.length === 2 && parts[1].length === 3)) {
      cleaned = cleaned.replace(/,/g, "");
    } else {
      cleaned = cleaned.replace(",", ".");
    }
  }

  const num = Number(cleaned);
  return isNaN(num) ? 0 : num;
};

// HELPER 2: PENCARI NILAI KOLOM DENGAN FLEKSIBILITAS NAMA NAMA HEADER & BOM UTF-8
const getRowVal = (row: Record<string, unknown>, ...possibleKeys: string[]): string => {
  if (!row) return "";
  const keys = Object.keys(row);
  const normalizedKeys = keys.map((k) => ({
    original: k,
    clean: k.replace(/^\ufeff/, "").trim().toLowerCase().replace(/[\s_/-]+/g, ""),
  }));

  for (const targetKey of possibleKeys) {
    const targetClean = targetKey.toLowerCase().replace(/[\s_/-]+/g, "");
    const match = normalizedKeys.find((k) => k.clean === targetClean);
    if (match && row[match.original] !== undefined && row[match.original] !== null) {
      return String(row[match.original]).trim();
    }
  }
  return "";
};

// HELPER 3: PARSER KONDISI (Menyesuaikan dengan CHECK CONSTRAINT database: 'Baik', 'Rusak Ringan', 'Rusak Berat')
const parseKondisi = (val: string): string => {
  if (!val) return "Baik";
  const cleanVal = val.trim().toLowerCase();
  if (cleanVal.includes("rusak berat") || cleanVal === "rb") return "Rusak Berat";
  if (cleanVal.includes("rusak ringan") || cleanVal === "rr") return "Rusak Ringan";
  if (cleanVal.includes("rusak") && cleanVal.includes("berat")) return "Rusak Berat";
  if (cleanVal.includes("rusak")) return "Rusak Ringan";
  return "Baik"; // Default kondisi
};

export default function CsvImportModal({ isOpen, onClose, onSuccess }: CsvImportModalProps) {
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [fileName, setFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // STATE SENSOR DRAG & DROP
  const [isDragging, setIsDragging] = useState(false);

  // EFEK PEMBERSIHAN OTOMATIS SAAT MODAL DITUTUP / DIBATALKAN
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setParsedData([]);
        setFileName("");
        setIsDragging(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }, 0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // FUNGSI 1: DOWNLOAD TEMPLATE CSV UNTUK ADMIN (DENGAN BOM UTF-8)
  const downloadTemplate = () => {
    const templateHeader =
      "\ufeffkode_barang,nama_barang,nomor_register,merk_type,ukuran_cc,bahan,tahun_beli,pabrik,no_rangka,no_mesin,no_polisi,no_bpkb,harga,kondisi,keterangan\n02.06.01.01.01,Laptop Core i5,0001,Lenovo,14 Inch,Plastik,2023,Lenovo,-,-,-,-,12000000,Baik,Pengadaan Baru 2023\n02.03.01.04.01,Motor Supra X,0002,Honda,125 CC,Besi,2020,Astra Honda,MH123,KE456,DK 1234 A,12345,18500000,Baik,Kendaraan Operasional";
    const blob = new Blob([templateHeader], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Template_Import_KIB_B.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // FUNGSI 2: LOGIKA TERPUSAT MENGOLAH FILE CSV
  const processCsvFile = (file: File) => {
    setFileName(file.name);

    // AUTO-DETECT PEMISAH KOMA (,) ATAU TITIK KOMA (;)
    Papa.parse(file, {
      header: true,
      skipEmptyLines: "greedy",
      delimitersToGuess: [",", ";", "\t", "|"],
      transformHeader: (h) => h.replace(/^\ufeff/, "").trim(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      complete: (results: any) => {
        setParsedData(results.data);
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      error: (error: any) => {
        Swal.fire({ icon: "error", title: "Gagal Membaca File", text: error.message, confirmButtonColor: "#ba1a1a" });
      },
    });
  };

  // PEMANGGIL LEWAT TOMBOL PILIH FILE (KLIK)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processCsvFile(e.target.files[0]);
    }
  };

  // SENSOR DRAG & DROP HTML5
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Mencegah browser membuka file di tab baru
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processCsvFile(e.dataTransfer.files[0]); // Ambil file pertama yang diseret
    }
  };

  // FUNGSI 3: BULK INSERT MASSAL KE SUPABASE (MENGGUNAKAN LOGIKA PENGAMAN TINGKAT TINGGI)
  const handleImportSubmit = async () => {
    if (parsedData.length === 0) {
      Swal.fire({ icon: "warning", title: "File Kosong", text: "Silakan pilih file CSV yang berisi data terlebih dahulu.", confirmButtonColor: "#2563eb" });
      return;
    }

    setIsLoading(true);

    try {
      const formattedPayload = parsedData
        .map((row) => {
          let kode = getRowVal(row, "kode_barang", "kode", "kode barang");
          let nama = getRowVal(row, "nama_barang", "nama", "nama barang");
          let register = getRowVal(row, "nomor_register", "no_register", "nomor register", "no register");
          let merk = getRowVal(row, "merk_type", "merk", "type", "merk / type", "merk/type");
          let ukuran = getRowVal(row, "ukuran_cc", "ukuran", "cc", "ukuran / cc", "ukuran/cc");
          let bahan = getRowVal(row, "bahan");
          let tahun = getRowVal(row, "tahun_beli", "tahun", "tahun beli");
          let pabrik = getRowVal(row, "pabrik");
          let rangka = getRowVal(row, "no_rangka", "rangka", "no rangka");
          let mesin = getRowVal(row, "no_mesin", "mesin", "no mesin");
          let polisi = getRowVal(row, "no_polisi", "polisi", "nopol", "no polisi");
          let bpkb = getRowVal(row, "no_bpkb", "bpkb", "no bpkb");
          let hargaStr = getRowVal(row, "harga", "harga (rp)", "hargarp", "harga_barang");
          let kondisi = getRowVal(row, "kondisi");
          let keterangan = getRowVal(row, "keterangan");

          // 🛡️ PENGAMAN TINGKAT TINGGI: JIKA EXCEL MENGGABUNGKAN SEMUANYA KE SATU STRING
          if (kode.includes(",") && (!nama || nama === "")) {
            // Pecah string secara manual
            const parts = kode.split(",").map((p) => p.trim());
            kode = parts[0] || "00.00.00.00.00";
            nama = parts[1] || "Aset Tanpa Nama";
            register = parts[2] || "0000";
            merk = parts[3] || "-";
            ukuran = parts[4] || "-";
            bahan = parts[5] || "-";
            tahun = parts[6] || "-";
            pabrik = parts[7] || "-";
            rangka = parts[8] || "-";
            mesin = parts[9] || "-";
            polisi = parts[10] || "-";
            bpkb = parts[11] || "-";
            hargaStr = parts[12] || "0";
            kondisi = parts[13] || "Baik";
            keterangan = parts[14] || "-";
          } else if (kode.includes(";") && (!nama || nama === "")) {
            const parts = kode.split(";").map((p) => p.trim());
            kode = parts[0] || "00.00.00.00.00";
            nama = parts[1] || "Aset Tanpa Nama";
            register = parts[2] || "0000";
            merk = parts[3] || "-";
            ukuran = parts[4] || "-";
            bahan = parts[5] || "-";
            tahun = parts[6] || "-";
            pabrik = parts[7] || "-";
            rangka = parts[8] || "-";
            mesin = parts[9] || "-";
            polisi = parts[10] || "-";
            bpkb = parts[11] || "-";
            hargaStr = parts[12] || "0";
            kondisi = parts[13] || "Baik";
            keterangan = parts[14] || "-";
          }

          // MAPPING KE SNAKE_CASE AGAR SESUAI DENGAN SUPABASE
          return {
            kode_barang: kode || "00.00.00.00.00",
            nama_barang: nama || "Aset Tanpa Nama",
            nomor_register: register || "0000",
            merk_type: merk || "-",
            ukuran_cc: ukuran || "-",
            bahan: bahan || "-",
            tahun_beli: tahun || "-",
            pabrik: pabrik || "-",
            no_rangka: rangka || "-",
            no_mesin: mesin || "-",
            no_polisi: polisi || "-",
            no_bpkb: bpkb || "-",
            harga: parseHarga(hargaStr),
            kondisi: parseKondisi(kondisi),
            keterangan: keterangan || "-",
          };
        })
        .filter((item) => item.kode_barang !== "00.00.00.00.00" || item.nama_barang !== "Aset Tanpa Nama");

      if (formattedPayload.length === 0) {
        Swal.fire({ icon: "warning", title: "Data Tidak Valid", text: "Tidak ditemukan baris data yang valid dalam file CSV.", confirmButtonColor: "#2563eb" });
        setIsLoading(false);
        return;
      }

      // Batch insert massal (chunk 50 baris per request agar stabil)
      const chunkSize = 50;
      for (let i = 0; i < formattedPayload.length; i += chunkSize) {
        const chunk = formattedPayload.slice(i, i + chunkSize);
        const { error } = await supabase.from("inventaris_kib_b").insert(chunk);
        if (error) throw error;
      }

      Swal.fire({
        icon: "success",
        title: "Import Berhasil!",
        text: `Sebanyak ${formattedPayload.length} data inventaris berhasil dimasukkan ke database.`,
        confirmButtonColor: "#2563eb",
      });

      setParsedData([]);
      setFileName("");
      onSuccess();
      onClose();
    } catch (error: unknown) {
      console.error("Error import CSV:", error);
      let errorMsg = "Terjadi kesalahan saat import data.";
      if (error && typeof error === "object") {
        const errObj = error as Record<string, unknown>;
        if (typeof errObj.message === "string" && errObj.message) {
          errorMsg = errObj.message;
        } else if (typeof errObj.error_description === "string" && errObj.error_description) {
          errorMsg = errObj.error_description;
        } else if (error instanceof Error) {
          errorMsg = error.message;
        }
        if (typeof errObj.details === "string" && errObj.details) {
          errorMsg += ` (${errObj.details})`;
        }
      } else if (typeof error === "string") {
        errorMsg = error;
      }
      Swal.fire({ icon: "error", title: "Gagal Import", text: errorMsg, confirmButtonColor: "#ba1a1a" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 sm:p-6" onClick={onClose}>
      <div className="relative flex w-full max-w-2xl flex-col rounded-xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
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

            {/* AREA DROPZONE DENGAN DETEKTOR DRAG & DROP HTML5 */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer group transform duration-200
                ${isDragging ? "border-blue-500 bg-blue-50/50 scale-[1.01]" : "border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-blue-400"}
              `}
            >
              <div className="w-12 h-12 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-blue-600 mb-3 group-hover:scale-110 transition-transform">
                <UploadCloud size={24} />
              </div>
              <p className="text-sm font-bold text-blue-600 mb-1">{fileName ? fileName : "Klik untuk memilih atau seret file CSV ke sini"}</p>
              <p className="text-xs text-slate-400">{parsedData.length > 0 ? `${parsedData.length} baris data terdeteksi` : "Hanya mendukung file dengan ekstensi .csv"}</p>
            </div>
          </div>

          {/* Preview Data (Gaya Shadcn) */}
          {parsedData.length > 0 && (
            <div className="max-h-44 overflow-y-auto border border-slate-200 rounded-lg text-xs shadow-inner bg-white custom-scrollbar">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead className="bg-slate-100 sticky top-0 z-10 border-b border-slate-200">
                  <tr>
                    <th className="p-2.5 font-bold text-slate-700 uppercase tracking-wider">Status Preview</th>
                    <th className="p-2.5 font-bold text-slate-700 uppercase tracking-wider">Total Baris</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  <tr>
                    <td className="p-2.5 text-emerald-600 font-bold">File Siap Diproses & Dipisahkan Otomatis</td>
                    <td className="p-2.5 font-mono">{parsedData.length} Data Aset Terdeteksi</td>
                  </tr>
                </tbody>
              </table>
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