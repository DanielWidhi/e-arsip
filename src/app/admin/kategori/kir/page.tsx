"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, X, Save, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase";
import Swal from "sweetalert2"; // Import SweetAlert2

type KirType = {
  id: number;
  nama_ruangan: string;
};

export default function MasterKirPage() {
  const [dataKir, setDataKir] = useState<KirType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState("");

  const supabase = createClient();

  const fetchKir = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from("master_kir").select("*").order("id", { ascending: true });

    if (error) {
      Swal.fire({ icon: "error", title: "Gagal Memuat Data", text: error.message, confirmButtonColor: "#ba1a1a" });
    } else if (data) {
      setDataKir(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setTimeout(() => {
      fetchKir();
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredData = dataKir.filter((item) => item.nama_ruangan.toLowerCase().includes(searchTerm.toLowerCase()));

  const openModal = (item?: KirType) => {
    if (item) {
      setEditingId(item.id);
      setInputValue(item.nama_ruangan);
    } else {
      setEditingId(null);
      setInputValue("");
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setIsSaving(true);

    if (editingId) {
      const { error } = await supabase.from("master_kir").update({ nama_ruangan: inputValue }).eq("id", editingId);

      if (error) {
        Swal.fire({ icon: "error", title: "Gagal Mengubah", text: error.message, confirmButtonColor: "#ba1a1a" });
      } else {
        Swal.fire({ icon: "success", title: "Berhasil!", text: "Nama ruangan berhasil diperbarui.", confirmButtonColor: "#2563eb", timer: 2000, showConfirmButton: false });
        fetchKir();
      }
    } else {
      const { error } = await supabase.from("master_kir").insert([{ nama_ruangan: inputValue }]);

      if (error) {
        Swal.fire({ icon: "error", title: "Gagal Menambah", text: error.message, confirmButtonColor: "#ba1a1a" });
      } else {
        Swal.fire({ icon: "success", title: "Berhasil!", text: "Ruangan baru berhasil didaftarkan.", confirmButtonColor: "#2563eb", timer: 2000, showConfirmButton: false });
        fetchKir();
      }
    }

    setIsModalOpen(false);
    setIsSaving(false);
  };

  // MENGGUNAKAN SWEETALERT2 UNTUK HAPUS (DELETE) RUANGAN
  const handleDelete = async (id: number, nama: string) => {
    const swalResult = await Swal.fire({
      title: "Hapus Ruangan?",
      text: `Apakah Anda yakin ingin menghapus ruangan "${nama}"?\nPastikan tidak ada aset yang terdaftar di ruangan ini.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ba1a1a",
      cancelButtonColor: "#cbd5e1",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (swalResult.isConfirmed) {
      const { error } = await supabase.from("master_kir").delete().eq("id", id);

      if (error) {
        Swal.fire({ icon: "error", title: "Gagal Menghapus", text: error.message, confirmButtonColor: "#ba1a1a" });
      } else {
        Swal.fire({ icon: "success", title: "Terhapus!", text: `Ruangan "${nama}" telah dihapus.`, confirmButtonColor: "#2563eb", timer: 2000, showConfirmButton: false });
        fetchKir();
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Kartu Inventaris Ruangan (KIR)</h2>
        <p className="text-sm text-slate-500 mt-1">Kelola master data nama ruangan yang tersedia di kantor.</p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <button
          onClick={() => openModal()}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm active:scale-95"
        >
          <Plus size={18} /> Tambah Ruangan
        </button>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Cari nama ruangan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden w-full min-h-75 flex flex-col">
        <div className="overflow-x-auto w-full flex-1">
          <table className="min-w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4 w-16">No</th>
                <th className="px-6 py-4">Nama Ruangan</th>
                <th className="px-6 py-4 text-center w-32">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-16 text-center">
                    <Loader2 className="animate-spin mx-auto text-blue-600" size={32} />
                  </td>
                </tr>
              ) : filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 text-slate-500">{index + 1}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">{item.nama_ruangan}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button onClick={() => openModal(item)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(item.id, item.nama_ruangan)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-slate-500">
                    Ruangan tidak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4" onClick={() => setIsModalOpen(false)}>
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl animate-in fade-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h3 className="font-bold text-slate-900">{editingId ? "Edit Ruangan" : "Tambah Ruangan"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-5">
              <div className="mb-6">
                <label className="block text-xs font-semibold text-slate-700 mb-2">Nama Ruangan</label>
                <input
                  autoFocus
                  required
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Contoh: Ruang Arsip"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  Batal
                </button>
                <button type="submit" disabled={isSaving} className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors disabled:opacity-50">
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {isSaving ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
