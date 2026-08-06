"use client";

import { Bell, Menu } from "lucide-react";
import { usePathname } from "next/navigation";

// Menerima props onMenuClick dari layout.tsx
export default function AdminHeader({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();

  const currentMenu = pathname.includes("inventaris")
    ? "Manajemen Inventaris"
    : pathname.includes("pengguna")
      ? "Manajemen Pengguna"
      : pathname.includes("pengaturan")
        ? "Pengaturan Sistem"
        : pathname.includes("kategori/kir")
          ? "Kategori / KIR"
          : pathname.includes("kategori/asal-usul")
            ? "Kategori / Asal Usul"
            : "Beranda";

  return (
    <header className="flex justify-between items-center w-full px-4 md:px-8 h-16 sticky top-0 z-30 bg-white border-b border-slate-200 shrink-0 shadow-sm">
      {/* Kiri: Tombol Hamburger (Mobile) & Breadcrumb */}
      <div className="flex items-center gap-3">
        {/* Tombol Hamburger HANYA muncul di HP (md:hidden) */}
        <button onClick={onMenuClick} className="md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600">
          <Menu size={24} />
        </button>

        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <span className="hidden sm:inline">Dashboard</span>
          <span className="hidden sm:inline text-slate-300">/</span>
          <span className="font-semibold text-slate-800 truncate max-w-150px sm:max-w-none">{currentMenu}</span>
        </div>
      </div>

      {/* Kanan: Profil & Notifikasi */}
      <div className="flex items-center gap-2 md:gap-4">
        <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors">
          <Bell size={20} />
        </button>
        <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block"></div>
        <button className="flex items-center gap-3 hover:bg-slate-50 p-1.5 rounded-lg transition-colors">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 border border-slate-200 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://ui-avatars.com/api/?name=Admin+Sistem&background=0D8ABC&color=fff" alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-sm font-semibold text-slate-800 leading-tight">Admin Sistem</p>
            <p className="text-xs text-slate-500 leading-tight">Superadmin</p>
          </div>
        </button>
      </div>
    </header>
  );
}
