"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff, Camera, Loader2, Save } from "lucide-react";
import { createClient } from "@/lib/supabase";

export default function PengaturanAdminPage() {
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState({ nip: "", nama: "", email: "" });

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user && user.email) {
        const { data } = await supabase.from("users").select("*").eq("email", user.email).single();
        if (data) setProfile({ nip: data.nip, nama: data.nama, email: data.email });
      }
      setIsLoading(false);
    };
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdatePassword = async () => {
    if (newPassword.length < 6) {
      alert("Kata sandi minimal 6 karakter!");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Konfirmasi kata sandi tidak cocok!");
      return;
    }

    setIsSaving(true);
    // Supabase menyediakan API bawaan untuk user mengupdate password mereka sendiri dengan aman
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      alert("Gagal mengubah kata sandi: " + error.message);
    } else {
      alert("Kata sandi berhasil diperbarui! Silakan gunakan kata sandi baru untuk login selanjutnya.");
      setNewPassword("");
      setConfirmPassword("");
    }
    setIsSaving(false);
  };

  if (isLoading)
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto w-full">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 md:px-8 py-6 border-b border-slate-200 bg-white">
          <h3 className="text-xl md:text-2xl font-bold text-slate-900">Pengaturan Akun</h3>
          <p className="text-sm text-slate-500 mt-1">Kelola informasi profil dan keamanan akun Anda.</p>
        </div>

        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="shrink-0 flex flex-col items-center gap-3">
              <div className="w-24 h-24 rounded-full bg-slate-100 overflow-hidden border border-slate-200 relative group cursor-pointer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`https://ui-avatars.com/api/?name=${profile.nama}&background=0D8ABC&color=fff&size=150`} alt="Profile" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={24} className="text-white" />
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Pengguna</label>
                <input type="text" value={profile.email} disabled className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 text-sm cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">NIP Pegawai</label>
                <input type="text" value={profile.nip} disabled className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 text-sm cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Lengkap</label>
                <input type="text" value={profile.nama} disabled className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 text-sm cursor-not-allowed" />
              </div>
            </div>
          </div>

          <div className="my-8 border-t border-slate-200"></div>

          <div>
            <h4 className="text-lg font-bold text-slate-900 mb-5">Ubah Kata Sandi</h4>
            <div className="space-y-5 max-w-xl">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Kata Sandi Baru</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Masukkan kata sandi baru"
                    className="w-full px-4 py-2.5 pr-10 bg-white border border-slate-200 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                  <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-slate-600">
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Konfirmasi Kata Sandi Baru</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ketik ulang kata sandi baru"
                    className="w-full px-4 py-2.5 pr-10 bg-white border border-slate-200 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-slate-600">
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 md:px-8 py-5 bg-slate-50 border-t border-slate-200 flex flex-col-reverse sm:flex-row justify-end gap-3 rounded-b-xl">
          <button
            onClick={() => {
              setNewPassword("");
              setConfirmPassword("");
            }}
            className="w-full sm:w-auto px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
          >
            Batal
          </button>
          <button
            onClick={handleUpdatePassword}
            disabled={isSaving || !newPassword}
            className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
}
