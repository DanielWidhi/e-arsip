"use client";

import { X, Save, UserPlus } from "lucide-react";
import { UserType } from "@/app/admin/pengguna/page";

type UserCreateModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newUser: UserType) => void;
};

export default function UserCreateModal({ isOpen, onClose, onSave }: UserCreateModalProps) {
  if (!isOpen) return null;

  const inputClass = "w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all placeholder:text-slate-400";
  const labelClass = "block text-xs font-semibold text-slate-700 mb-1.5";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: UserType = {
      id: Math.floor(Math.random() * 1000),
      nip: "Menunggu...",
      nama: "Pengguna Baru",
      role: "Admin",
    };
    alert("Berhasil menambahkan pengguna baru!");
    onSave(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 sm:p-6" onClick={onClose}>
      <div className="relative flex w-full max-w-lg flex-col rounded-xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
              <UserPlus size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Tambah Pengguna Baru</h2>
              <p className="text-xs text-slate-500 mt-0.5">Daftarkan NIP pegawai untuk akses sistem.</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form id="createUserForm" onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className={labelClass}>NIP Pegawai</label>
            <input required className={inputClass} placeholder="Contoh: 199001..." type="text" />
          </div>
          <div>
            <label className={labelClass}>Nama Lengkap</label>
            <input required className={inputClass} placeholder="Masukkan nama..." type="text" />
          </div>
          <div>
            <label className={labelClass}>Kata Sandi Awal</label>
            <input required className={inputClass} placeholder="Buat sandi sementara" type="password" />
            <p className="text-[11px] text-slate-500 mt-1.5">Pegawai dapat mengubahnya nanti.</p>
          </div>
          <div>
            <label className={labelClass}>Hak Akses (Role)</label>
            <select className={`${inputClass} bg-white cursor-pointer`}>
              <option value="Admin">Admin (Hanya Inventaris)</option>
              <option value="Superadmin">Superadmin (Akses Penuh)</option>
            </select>
          </div>
        </form>

        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-xl flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm">
            Batal
          </button>
          <button type="submit" form="createUserForm" className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2">
            <Save size={18} /> Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
