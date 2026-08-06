"use client";

import { useState, useEffect } from "react";
import { X, Info, Wrench, ImagePlus, Save, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase";

type AssetCreateModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void; // Untuk me-refresh tabel setelah data disimpan
};

export default function AssetCreateModal({ isOpen, onClose, onSave }: AssetCreateModalProps) {
  const supabase = createClient();

  // --- STATE UNTUK MENGAMBIL DATA MASTER DARI SUPABASE ---
  const [listKir, setListKir] = useState<{ id: number; nama_ruangan: string }[]>([]);
  const [listAsal, setListAsal] = useState<{ id: number; nama_asal: string }[]>([]);

  // --- STATE UNTUK FORM INPUT ---
  const [kodeBarang, setKodeBarang] = useState("");
  const [noRegister, setNoRegister] = useState("0000");
  const [namaBarang, setNamaBarang] = useState("");
  const [merkType, setMerkType] = useState("");
  const [ukuranCc, setUkuranCc] = useState("");
  // Kolom Bahan sekarang menjadi input teks biasa
  const [bahan, setBahan] = useState("");
  const [tahunBeli, setTahunBeli] = useState("");
  const [pabrik, setPabrik] = useState("");
  const [keterangan, setKeterangan] = useState("");

  const [noRangka, setNoRangka] = useState("");
  const [noMesin, setNoMesin] = useState("");
  const [noPolisi, setNoPolisi] = useState("");
  const [noBpkb, setNoBpkb] = useState("");
  const [asalUsulId, setAsalUsulId] = useState("");
  const [harga, setHarga] = useState("");
  const [kondisi, setKondisi] = useState("Baik");
  const [kirId, setKirId] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  // EFEK MENGAMBIL DATA KIR & ASAL USUL SAAT MODAL DIBUKA
  useEffect(() => {
    if (isOpen) {
      const fetchMasterData = async () => {
        const { data: dataKir } = await supabase.from("master_kir").select("*");
        const { data: dataAsal } = await supabase.from("master_asal_usul").select("*");

        if (dataKir) setListKir(dataKir);
        if (dataAsal) setListAsal(dataAsal);
      };
      fetchMasterData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  const inputClass = "w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all placeholder:text-slate-400";
  const labelClass = "block text-xs font-semibold text-slate-700 mb-1.5";

  // FUNGSI MENYIMPAN DATA KE SUPABASE
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const newAsset = {
      kode_barang: kodeBarang,
      nama_barang: namaBarang,
      nomor_register: noRegister,
      merk_type: merkType,
      ukuran_cc: ukuranCc,
      bahan: bahan,
      tahun_beli: tahunBeli,
      pabrik: pabrik,
      no_rangka: noRangka,
      no_mesin: noMesin,
      no_polisi: noPolisi,
      no_bpkb: noBpkb,
      asal_usul_id: asalUsulId ? Number(asalUsulId) : null,
      harga: harga ? Number(harga) : 0,
      kondisi: kondisi,
      kir_id: kirId ? Number(kirId) : null,
      keterangan: keterangan,
    };

    const { error } = await supabase.from("inventaris_kib_b").insert([newAsset]);

    if (error) {
      alert("Gagal menyimpan data: " + error.message);
    } else {
      alert("Data inventaris berhasil ditambahkan!");

      // Bersihkan form setelah sukses
      setKodeBarang("");
      setNoRegister("0000");
      setNamaBarang("");
      setMerkType("");
      setUkuranCc("");
      setBahan("");
      setTahunBeli("");
      setPabrik("");
      setKeterangan("");
      setNoRangka("");
      setNoMesin("");
      setNoPolisi("");
      setNoBpkb("");
      setAsalUsulId("");
      setHarga("");
      setKondisi("Baik");
      setKirId("");

      if (onSave) onSave(); // Refresh tabel di halaman admin
      onClose(); // Tutup modal
    }

    setIsLoading(false);
  };

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
        <div className="p-6 md:p-8 overflow-y-auto max-h-[calc(100vh-180px)] custom-scrollbar">
          <form id="createAssetForm" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* --- KOLOM KIRI: Informasi Utama --- */}
            <div className="space-y-5">
              <h3 className="text-sm font-bold text-blue-700 flex items-center gap-2 border-b border-slate-200 pb-2 uppercase tracking-wide">
                <Info size={18} /> Informasi Utama
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    Kode Barang <span className="text-red-500">*</span>
                  </label>
                  <input required value={kodeBarang} onChange={(e) => setKodeBarang(e.target.value)} className={inputClass} placeholder="Mis: 02.06.01..." type="text" />
                </div>
                <div>
                  <label className={labelClass}>No Register</label>
                  <input value={noRegister} onChange={(e) => setNoRegister(e.target.value)} className={inputClass} placeholder="0001" type="text" />
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  Nama Barang / Jenis <span className="text-red-500">*</span>
                </label>
                <input required value={namaBarang} onChange={(e) => setNamaBarang(e.target.value)} className={inputClass} placeholder="Masukkan nama barang" type="text" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Merk/Type</label>
                  <input value={merkType} onChange={(e) => setMerkType(e.target.value)} className={inputClass} placeholder="Mis: Toyota / Avanza" type="text" />
                </div>
                <div>
                  <label className={labelClass}>Ukuran/CC</label>
                  <input value={ukuranCc} onChange={(e) => setUkuranCc(e.target.value)} className={inputClass} placeholder="Mis: 1500cc" type="text" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  {/* UBAH: Bahan sekarang adalah Input text biasa */}
                  <label className={labelClass}>Bahan</label>
                  <input value={bahan} onChange={(e) => setBahan(e.target.value)} className={inputClass} placeholder="Mis: Besi/Kayu/Plastik" type="text" />
                </div>
                <div>
                  <label className={labelClass}>Tahun Beli</label>
                  <input value={tahunBeli} onChange={(e) => setTahunBeli(e.target.value)} className={inputClass} placeholder="YYYY" type="number" min="1900" max="2099" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Pabrik</label>
                  <input value={pabrik} onChange={(e) => setPabrik(e.target.value)} className={inputClass} placeholder="Nama pabrik" type="text" />
                </div>
                <div>
                  <label className={labelClass}>
                    Lokasi Ruangan (KIR) <span className="text-red-500">*</span>
                  </label>
                  {/* DROPDOWN DINAMIS DARI TABEL MASTER_KIR */}
                  {/* PERBAIKAN: Tidak memakai 'selected' di option */}
                  <select required value={kirId} onChange={(e) => setKirId(e.target.value)} className={`${inputClass} bg-white cursor-pointer`}>
                    <option disabled value="">
                      Pilih Ruangan...
                    </option>
                    {listKir.map((kir) => (
                      <option key={kir.id} value={kir.id}>
                        {kir.nama_ruangan}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>Keterangan Khusus</label>
                <textarea value={keterangan} onChange={(e) => setKeterangan(e.target.value)} className={`${inputClass} h-20 resize-none`} placeholder="Catatan mengenai barang ini..."></textarea>
              </div>
            </div>

            {/* --- KOLOM KANAN: Spesifikasi & Harga --- */}
            <div className="space-y-5">
              <h3 className="text-sm font-bold text-blue-700 flex items-center gap-2 border-b border-slate-200 pb-2 uppercase tracking-wide">
                <Wrench size={18} /> Spesifikasi Khusus & Harga
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    No. Rangka <span className="text-slate-400 font-normal ml-1">(Opsional)</span>
                  </label>
                  <input value={noRangka} onChange={(e) => setNoRangka(e.target.value)} className={inputClass} placeholder="-" type="text" />
                </div>
                <div>
                  <label className={labelClass}>
                    No. Mesin <span className="text-slate-400 font-normal ml-1">(Opsional)</span>
                  </label>
                  <input value={noMesin} onChange={(e) => setNoMesin(e.target.value)} className={inputClass} placeholder="-" type="text" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    No. Polisi <span className="text-slate-400 font-normal ml-1">(Opsional)</span>
                  </label>
                  <input value={noPolisi} onChange={(e) => setNoPolisi(e.target.value)} className={inputClass} placeholder="Mis: DK 1234 CD" type="text" />
                </div>
                <div>
                  <label className={labelClass}>
                    BPKB <span className="text-slate-400 font-normal ml-1">(Opsional)</span>
                  </label>
                  <input value={noBpkb} onChange={(e) => setNoBpkb(e.target.value)} className={inputClass} placeholder="-" type="text" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>
                      Asal Usul <span className="text-red-500">*</span>
                    </label>
                    {/* DROPDOWN DINAMIS DARI TABEL MASTER_ASAL_USUL */}
                    {/* PERBAIKAN: Tidak memakai 'selected' di option */}
                    <select required value={asalUsulId} onChange={(e) => setAsalUsulId(e.target.value)} className={`${inputClass} bg-white cursor-pointer`}>
                      <option disabled value="">
                        Pilih Asal...
                      </option>
                      {listAsal.map((asal) => (
                        <option key={asal.id} value={asal.id}>
                          {asal.nama_asal}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>
                      Kondisi Saat Ini <span className="text-red-500">*</span>
                    </label>
                    <select required value={kondisi} onChange={(e) => setKondisi(e.target.value)} className={`${inputClass} bg-white cursor-pointer`}>
                      <option value="Baik">Baik</option>
                      <option value="Rusak Ringan">Rusak Ringan</option>
                      <option value="Rusak Berat">Rusak Berat</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Harga (Rp)</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 font-semibold text-sm">Rp</span>
                    <input value={harga} onChange={(e) => setHarga(e.target.value)} className={`${inputClass} pl-10`} placeholder="0" type="number" />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label className={labelClass}>
                  Upload Foto Aset Awal <span className="text-slate-400 font-normal ml-1">(Tahap Selanjutnya)</span>
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group opacity-60">
                  <div className="w-12 h-12 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 mb-2">
                    <ImagePlus size={24} />
                  </div>
                  <p className="text-xs font-bold text-slate-500 mb-1">Fitur Upload Gambar belum aktif</p>
                  <p className="text-[10px] text-slate-400 font-medium">Membutuhkan setup Supabase Storage Bucket.</p>
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
          <button
            type="submit"
            form="createAssetForm"
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {isLoading ? "Menyimpan..." : "Simpan Data Inventaris"}
          </button>
        </div>
      </div>
    </div>
  );
}
