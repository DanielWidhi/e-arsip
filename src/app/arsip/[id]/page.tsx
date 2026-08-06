"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, CheckCircle, AlertTriangle, Wrench } from "lucide-react";

type ArsipItem = {
  id: number;
  kode: string;
  nama: string;
  nomorRegister: string;
  merk: string;
  ukuran: string;
  bahan: string;
  tahun: string;
  pabrik: string;
  rangka: string;
  mesin: string;
  polisi: string;
  bpkb: string;
  asalUsul: string;
  harga: string;
  kondisi: string;
  kir: string;
  keterangan: string;
  foto?: string | null;
};

const mockData: ArsipItem[] = [
  {
    id: 1,
    kode: "02.06.01.01.03",
    nama: "Laptop Core i7",
    nomorRegister: "0001",
    merk: "Asus ExpertBook",
    ukuran: "14 Inch",
    bahan: "Plastik/Logam",
    tahun: "2023",
    pabrik: "ASUS",
    rangka: "-",
    mesin: "-",
    polisi: "-",
    bpkb: "-",
    asalUsul: "APBD",
    harga: "15.000.000",
    kondisi: "Baik",
    kir: "Ruang Camat",
    keterangan: "Barang baru pengadaan 2023.",
    foto: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=800",
  },
];

export default function DetailArsipPage() {
  const params = useParams();
  const idBarang = Number(params.id);
  const [asset, setAsset] = useState<ArsipItem | null>(null);

  useEffect(() => {
    setTimeout(() => {
      const foundAsset = mockData.find((item) => item.id === idBarang);
      setAsset(foundAsset || { ...mockData[0], id: idBarang, nama: "Aset Tidak Ditemukan" });
    }, 0);
  }, [idBarang]);

  const renderStatus = (kondisi: string) => {
    if (kondisi === "Baik")
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
          <CheckCircle size={16} /> Kondisi: Baik
        </span>
      );
    if (kondisi === "Rusak Ringan")
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 text-sm font-semibold">
          <Wrench size={16} /> Kondisi: Rusak Ringan
        </span>
      );
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-100 text-red-700 text-sm font-semibold">
        <AlertTriangle size={16} /> Kondisi: Rusak Berat
      </span>
    );
  };

  if (!asset) return <div className="min-h-screen flex items-center justify-center">Memuat data...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />

      <main className="grow w-full max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-6">
        <Link href="/arsip" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition font-medium w-fit">
          <ArrowLeft size={18} /> Kembali ke Daftar Arsip
        </Link>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col lg:flex-row">
          {/* KOLOM KIRI: HANYA FOTO (Rasio 1:1) */}
          <div className="w-full lg:w-1/3 bg-slate-50 border-r border-slate-200 p-6 md:p-8 flex flex-col items-center">
            {/* Mengubah aspect-video menjadi aspect-square (1:1) */}
            <div className="w-full aspect-square rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-white group cursor-pointer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset.foto || "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800"}
                alt={`Foto ${asset.nama}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* KOLOM KANAN: DATA SPESIFIKASI */}
          <div className="w-full lg:w-2/3 p-6 md:p-8 flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">{asset.nama}</h1>
                <p className="font-mono text-slate-600 font-medium bg-slate-100 px-3 py-1 rounded border border-slate-200 w-fit">Kode: {asset.kode}</p>
              </div>
              <div>{renderStatus(asset.kondisi)}</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 text-sm mt-4">
              <div className="border-b border-slate-100 pb-2">
                <span className="block text-xs font-semibold text-slate-400 uppercase mb-1">Nomor Register</span>
                <span className="font-medium text-slate-800">{asset.nomorRegister}</span>
              </div>
              <div className="border-b border-slate-100 pb-2">
                <span className="block text-xs font-semibold text-slate-400 uppercase mb-1">Merk / Type</span>
                <span className="font-medium text-slate-800">{asset.merk}</span>
              </div>
              <div className="border-b border-slate-100 pb-2">
                <span className="block text-xs font-semibold text-slate-400 uppercase mb-1">Ukuran / CC</span>
                <span className="font-medium text-slate-800">{asset.ukuran}</span>
              </div>
              <div className="border-b border-slate-100 pb-2">
                <span className="block text-xs font-semibold text-slate-400 uppercase mb-1">Bahan</span>
                <span className="font-medium text-slate-800">{asset.bahan}</span>
              </div>
              <div className="border-b border-slate-100 pb-2">
                <span className="block text-xs font-semibold text-slate-400 uppercase mb-1">Tahun Pembelian</span>
                <span className="font-medium text-slate-800">{asset.tahun}</span>
              </div>
              <div className="border-b border-slate-100 pb-2">
                <span className="block text-xs font-semibold text-slate-400 uppercase mb-1">Pabrik</span>
                <span className="font-medium text-slate-800">{asset.pabrik}</span>
              </div>
              <div className="border-b border-slate-100 pb-2">
                <span className="block text-xs font-semibold text-slate-400 uppercase mb-1">No. Rangka</span>
                <span className="font-medium text-slate-800">{asset.rangka}</span>
              </div>
              <div className="border-b border-slate-100 pb-2">
                <span className="block text-xs font-semibold text-slate-400 uppercase mb-1">No. Mesin</span>
                <span className="font-medium text-slate-800">{asset.mesin}</span>
              </div>
              <div className="border-b border-slate-100 pb-2">
                <span className="block text-xs font-semibold text-slate-400 uppercase mb-1">No. Polisi</span>
                <span className="font-medium text-slate-800">{asset.polisi}</span>
              </div>
              <div className="border-b border-slate-100 pb-2">
                <span className="block text-xs font-semibold text-slate-400 uppercase mb-1">BPKB</span>
                <span className="font-medium text-slate-800">{asset.bpkb}</span>
              </div>
              <div className="border-b border-slate-100 pb-2">
                <span className="block text-xs font-semibold text-slate-400 uppercase mb-1">Asal Usul</span>
                <span className="font-medium text-slate-800">{asset.asalUsul}</span>
              </div>
              <div className="border-b border-slate-100 pb-2">
                <span className="block text-xs font-semibold text-slate-400 uppercase mb-1">Harga</span>
                <span className="font-medium text-slate-800">Rp {asset.harga}</span>
              </div>
              <div className="border-b border-slate-100 pb-2">
                <span className="block text-xs font-semibold text-slate-400 uppercase mb-1">Lokasi (KIR)</span>
                <span className="font-medium text-slate-800">{asset.kir}</span>
              </div>
              <div className="sm:col-span-2 pt-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="block text-xs font-semibold text-slate-400 uppercase mb-1">Keterangan</span>
                <span className="font-medium text-slate-800 leading-relaxed">{asset.keterangan}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
