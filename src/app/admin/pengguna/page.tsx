"use client";

import { useState } from "react";
import { Search, Plus, Edit, Key, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import UserCreateModal from "@/components/UserCreateModal";
import UserEditModal from "@/components/UserEditModal";

// 1. Definisikan Tipe Data dengan Tegas (Menggantikan 'any' dan 'Record')
export type UserType = {
  id: number;
  nip: string;
  nama: string;
  role: string;
};

const initialUsers: UserType[] = [
  { id: 1, nip: "19850312 201012 1 002", nama: "Budi Santoso, S.Kom", role: "Superadmin" },
  { id: 2, nip: "19900815 201402 2 001", nama: "Siti Rahmawati, S.E.", role: "Admin" },
  { id: 3, nip: "19881120 201101 1 004", nama: "Agus Setiawan, M.T.", role: "Admin" },
];

export default function PenggunaAdminPage() {
  const [dataUsers, setDataUsers] = useState<UserType[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<UserType | null>(null);

  const filteredUsers = dataUsers.filter((user) => user.nama.toLowerCase().includes(searchTerm.toLowerCase()) || user.nip.includes(searchTerm));

  const handleDelete = (id: number, nama: string) => {
    const confirmDelete = window.confirm(`Apakah Anda yakin ingin menghapus akses untuk pengguna "${nama}"?`);
    if (confirmDelete) {
      const newData = dataUsers.filter((user) => user.id !== id);
      setDataUsers(newData);
    }
  };

  const handleResetPassword = (nama: string) => {
    const confirmReset = window.confirm(`Reset kata sandi untuk "${nama}" menjadi default (CamatKuta2026!) ?`);
    if (confirmReset) {
      alert("Kata sandi berhasil direset!");
    }
  };

  // Hanya ada SATU fungsi handleEditClick sekarang
  const handleEditClick = (user: UserType) => {
    setUserToEdit(user);
    setIsEditOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Manajemen Pengguna Sistem</h2>
        <p className="text-sm text-slate-500 mt-1">Kelola akses, peran, dan data profil pengguna sistem secara komprehensif.</p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <button
          onClick={() => setIsCreateOpen(true)}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 sm:py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm active:scale-95"
        >
          <Plus size={18} />
          <span>Tambah Pengguna</span>
        </button>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Cari NIP atau Nama..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 sm:py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-shadow"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col w-full">
        <div className="overflow-x-auto w-full">
          <table className="min-w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4 w-16">No</th>
                <th className="px-6 py-4">NIP</th>
                <th className="px-6 py-4">Nama Lengkap</th>
                <th className="px-6 py-4">Hak Akses</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 text-slate-500">{index + 1}</td>
                    <td className="px-6 py-4 font-mono font-medium text-slate-700 tracking-wide">{user.nip}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">{user.nama}</td>
                    <td className="px-6 py-4">
                      {user.role === "Superadmin" ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-slate-900 text-white tracking-wide">Superadmin</span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold bg-white text-slate-600 border border-slate-300 tracking-wide">Admin</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button onClick={() => handleEditClick(user)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Edit Profil">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleResetPassword(user.nama)} className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors" title="Reset Password">
                          <Key size={16} />
                        </button>
                        <button onClick={() => handleDelete(user.id, user.nama)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Hapus Pengguna">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    Pengguna tidak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto">
          <div className="text-sm text-slate-500 text-center sm:text-left">
            Menampilkan{" "}
            <span className="font-semibold text-slate-800">
              {filteredUsers.length > 0 ? 1 : 0}-{filteredUsers.length}
            </span>{" "}
            dari <span className="font-semibold text-slate-800">{dataUsers.length}</span> pengguna
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 border border-slate-200 rounded-lg text-slate-400 disabled:opacity-50" disabled>
              <ChevronLeft size={18} />
            </button>
            <div className="hidden sm:flex items-center gap-1">
              <button className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold bg-blue-600 text-white shadow-sm">1</button>
            </div>
            <button className="p-2 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50" disabled>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* MODALS */}
      <UserCreateModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onSave={(newUser) => setDataUsers([...dataUsers, newUser])} />
      <UserEditModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        user={userToEdit}
        onSave={(updatedUser) => {
          const updatedList = dataUsers.map((u) => (u.id === updatedUser.id ? updatedUser : u));
          setDataUsers(updatedList);
        }}
      />
    </div>
  );
}
