"use client";

import { useState } from "react";
import { Search, Plus, Edit, Trash2, X, Save } from "lucide-react";

export default function MasterKirPage() {
  const [dataKir, setDataKir] = useState([
    { id: 1, nama: "Ruang Camat" },
    { id: 2, nama: "Ruang Pelayanan Terpadu" },
    { id: 3, nama: "Ruang Rapat Utama" },
    { id: 4, nama: "Ruang Kepegawaian" },
    { id: 5, nama: "Garasi Kendaraan" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  // State untuk Modal Inline
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState("");

  const filteredData = dataKir.filter((item) => item.nama.toLowerCase().includes(searchTerm.toLowerCase()));

  // Fungsi buka modal (bisa untuk Tambah atau Edit)
  const openModal = (item?: { id: number; nama: string }) => {
    if (item) {
      setEditingId(item.id);
      setInputValue(item.nama);
    } else {
      setEditingId(null);
      setInputValue("");
    }
    setIsModalOpen(true);
  };

  // Fungsi Simpan
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      // Update
      setDataKir(dataKir.map((k) => (k.id === editingId ? { ...k, nama: inputValue } : k)));
    } else {
      // Create
      setDataKir([...dataKir, { id: Date.now(), nama: inputValue }]);
    }
    setIsModalOpen(false);
  };

  // Fungsi Hapus
  const handleDelete = (id: number, nama: string) => {
    if (window.confirm(`Hapus ruangan "${nama}" dari sistem?`)) {
      setDataKir(dataKir.filter((k) => k.id !== id));
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
            className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-shadow"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden w-full">
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4 w-16">No</th>
                <th className="px-6 py-4">Nama Ruangan</th>
                <th className="px-6 py-4 text-center w-32">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 text-slate-500">{index + 1}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">{item.nama}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button onClick={() => openModal(item)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(item.id, item.nama)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
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

      {/* --- INLINE MODAL --- */}
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
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
                  Batal
                </button>
                <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                  <Save size={16} /> Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
