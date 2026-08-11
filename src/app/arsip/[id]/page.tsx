"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Download, CheckCircle, AlertTriangle, Wrench, ImageOff, Loader2 } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { createClient } from "@/lib/supabase";

// 1. IMPORT AOS DAN CSS NYA
import AOS from "aos";
import "aos/dist/aos.css";

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

export default function DetailArsipPage() {
  const params = useParams();
  const idBarang = Number(params.id);

  const [asset, setAsset] = useState<ArsipItem | null>(null);
  const [currentUrl, setCurrentUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // 2. INISIALISASI AOS SECARA AMAN
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-out-cubic",
    });
  }, []);

  useEffect(() => {
    const fetchAssetDetail = async () => {
      setIsLoading(true);
      const supabase = createClient();

      const { data, error } = await supabase.from("inventaris_kib_b").select("*, kir:master_kir(nama_ruangan), asal_usul:master_asal_usul(nama_asal)").eq("id", idBarang).single();

      if (error) {
        console.error("Gagal memuat detail aset:", error.message);
      } else if (data) {
        const formattedAsset: ArsipItem = {
          id: data.id,
          kode: data.kode_barang,
          nama: data.nama_barang,
          nomorRegister: data.nomor_register || "0000",
          merk: data.merk_type || "-",
          ukuran: data.ukuran_cc || "-",
          bahan: data.bahan || "-",
          tahun: data.tahun_beli || "-",
          pabrik: data.pabrik || "-",
          rangka: data.no_rangka || "-",
          mesin: data.no_mesin || "-",
          polisi: data.no_polisi || "-",
          bpkb: data.no_bpkb || "-",
          asalUsul: data.asal_usul?.nama_asal || "-",
          harga: data.harga ? data.harga.toLocaleString("id-ID") : "0",
          kondisi: data.kondisi,
          kir: data.kir?.nama_ruangan || "-",
          keterangan: data.keterangan || "-",
          foto: data.foto_url || null,
        };

        setTimeout(() => {
          setAsset(formattedAsset);
          setCurrentUrl(window.location.href);
          setIsLoading(false);
        }, 0);
      } else {
        setIsLoading(false);
      }
    };

    if (idBarang) {
      fetchAssetDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idBarang]);

  const downloadQRCode = () => {
    const canvas = document.getElementById("qrCodeEl") as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `Stiker_QR_${asset?.kode || "Aset"}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

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

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />

      <main className="grow w-full max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-6">
        {/* Tombol Kembali (Meluncur turun dari atas) */}
        <div data-aos="fade-down" className="w-fit">
          <Link href="/arsip" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition font-medium">
            <ArrowLeft size={18} /> Kembali ke Daftar Arsip
          </Link>
        </div>

        {/* JIKA SEDANG LOADING */}
        {isLoading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-20 flex flex-col items-center justify-center gap-3 shadow-sm">
            <Loader2 className="animate-spin text-blue-600 mx-auto" size={32} />
            <p className="text-slate-500 text-sm font-medium">Menghubungi database Supabase...</p>
          </div>
        ) : asset ? (
          /* JIKA DATA BERHASIL DI-LOAD */
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col lg:flex-row">
            {/* KOLOM KIRI (Meluncur masuk dari kiri, delay 100ms) */}
            <div data-aos="fade-right" data-aos-delay="100" className="w-full lg:w-1/3 bg-slate-50 border-r border-slate-200 p-6 md:p-8 flex flex-col items-center gap-8">
              {/* Foto Aset */}
              <div className="w-full aspect-square rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-white group cursor-pointer flex items-center justify-center">
                {asset.foto ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={asset.foto} alt={`Foto ${asset.nama}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400 gap-2">
                    <ImageOff size={48} className="opacity-50" />
                    <span className="text-xs font-medium">Tidak ada foto aset</span>
                  </div>
                )}
              </div>

              <div className="w-full border-t border-slate-200 border-dashed"></div>

              {/* QR Code */}
              <div className="flex flex-col items-center w-full gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center gap-3 w-full">
                  <QRCodeCanvas id="qrCodeEl" value={currentUrl} size={160} level={"H"} includeMargin={true} />
                  <p className="text-xs font-mono text-slate-500 font-semibold">{asset.kode}</p>
                </div>

                <button onClick={downloadQRCode} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm">
                  <Download size={18} /> Download Stiker QR
                </button>
                <p className="text-[11px] text-slate-400 text-center px-2 leading-relaxed">Cetak QR Code ini dan tempelkan pada fisik aset. Scan menggunakan kamera HP untuk melihat detail.</p>
              </div>
            </div>

            {/* KOLOM KANAN (Meluncur masuk dari kanan, delay 200ms) */}
            <div data-aos="fade-left" data-aos-delay="200" className="w-full lg:w-2/3 p-6 md:p-8 flex flex-col">
              <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-4 mb-6">
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
                  <span className="block text-xs font-semibold text-slate-400 uppercase mb-1">Harga (Rupiah)</span>
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
        ) : (
          /* JIKA DATA GAGAL DIAMBIL */
          <div className="bg-white rounded-2xl border border-slate-200 p-20 text-center shadow-sm">
            <AlertTriangle className="mx-auto text-red-500 mb-4" size={48} />
            <h3 className="text-xl font-bold text-slate-900 mb-2">Aset Tidak Ditemukan</h3>
            <p className="text-slate-500 text-sm">Maaf, barang dengan ID tersebut tidak ada di database kami.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
