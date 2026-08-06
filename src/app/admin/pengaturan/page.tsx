"use client";

import { useState } from "react";
import { Eye, EyeOff, Camera } from "lucide-react";

export default function PengaturanAdminPage() {
  // State untuk toggle visibilitas masing-masing kolom password
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="max-w-3xl mx-auto w-full">
      {/* KOTAK UTAMA (CARD) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* HEADER KOTAK */}
        <div className="px-6 md:px-8 py-6 border-b border-slate-200 bg-white">
          <h3 className="text-xl md:text-2xl font-bold text-slate-900">Pengaturan Akun</h3>
          <p className="text-sm text-slate-500 mt-1">Kelola informasi profil dan keamanan akun Anda.</p>
        </div>

        {/* ISI KOTAK */}
        <div className="p-6 md:p-8">
          {/* --- BAGIAN PROFIL --- */}
          <div className="flex flex-col md:flex-row gap-8">
            {/* Kolom Kiri: Foto Profil */}
            <div className="shrink-0 flex flex-col items-center gap-3">
              <div className="w-24 h-24 rounded-full bg-slate-100 overflow-hidden border border-slate-200 relative group cursor-pointer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8TgNK0AVBckykdI6ao8n-DVU3v8y2pxNe4aVRTdpCqbAvcQ_756eHhteWnpVCVx4qrXc2NFKCHSeZzWJNoOLLa8epqp6OV2dj8_F0N0xyfuPgzheAlNSadBaX98nko12wt9be8kuD7l9UQSAoHgMOovQy3dwVjMaOQ08Eieyh3DHMbckYDHn1OnZ2_rLD8w7LT7JHfa_gN_t4X-c5qw_6FnnlUQR4GSmKD9BdiE4cH-MIZJWOiCZBEA"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                {/* Overlay Hitam Transparan saat di-hover */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={24} className="text-white" />
                </div>
              </div>
              <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-all">Ubah Foto</button>
            </div>

            {/* Kolom Kanan: Input NIP & Nama */}
            <div className="flex-1 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="nip">
                  NIP Pegawai
                </label>
                <input id="nip" type="text" value="199001012020121001" disabled className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 text-sm cursor-not-allowed focus:outline-none" />
                <p className="text-xs text-slate-400 mt-1.5">NIP tidak dapat diubah. Hubungi admin sistem jika ada kesalahan.</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="nama">
                  Nama Lengkap
                </label>
                <input id="nama" type="text" value="Admin Kuta Selatan" disabled className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 text-sm cursor-not-allowed focus:outline-none" />
              </div>
            </div>
          </div>

          {/* Garis Pembatas */}
          <div className="my-8 border-t border-slate-200"></div>

          {/* --- BAGIAN KATA SANDI --- */}
          <div>
            <h4 className="text-lg font-bold text-slate-900 mb-5">Ubah Kata Sandi</h4>

            <div className="space-y-5 max-w-xl">
              {/* Kata Sandi Saat Ini */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="current_password">
                  Kata Sandi Saat Ini
                </label>
                <div className="relative">
                  <input
                    id="current_password"
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Masukkan kata sandi saat ini"
                    className="w-full px-4 py-2.5 pr-10 bg-white border border-slate-200 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all placeholder:text-slate-400"
                  />
                  <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors">
                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Kata Sandi Baru */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="new_password">
                  Kata Sandi Baru
                </label>
                <div className="relative">
                  <input
                    id="new_password"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Masukkan kata sandi baru"
                    className="w-full px-4 py-2.5 pr-10 bg-white border border-slate-200 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all placeholder:text-slate-400"
                  />
                  <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors">
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-1.5">Minimal 8 karakter, mengandung huruf besar, huruf kecil, dan angka.</p>
              </div>

              {/* Konfirmasi Kata Sandi Baru */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="confirm_password">
                  Konfirmasi Kata Sandi Baru
                </label>
                <div className="relative">
                  <input
                    id="confirm_password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Ketik ulang kata sandi baru"
                    className="w-full px-4 py-2.5 pr-10 bg-white border border-slate-200 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all placeholder:text-slate-400"
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors">
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER KOTAK (TOMBOL AKSI) */}
        <div className="px-6 md:px-8 py-5 bg-slate-50 border-t border-slate-200 flex flex-col-reverse sm:flex-row justify-end gap-3 rounded-b-xl">
          <button className="w-full sm:w-auto px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm">Batal</button>
          <button className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm active:translate-y-px">Simpan Perubahan</button>
        </div>
      </div>
    </div>
  );
}
