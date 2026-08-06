"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, Users, Settings, LogOut, X, Tags, ChevronDown } from "lucide-react";

type AdminSidebarProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export default function AdminSidebar({ isOpen, setIsOpen }: AdminSidebarProps) {
  const pathname = usePathname();
  // State untuk membuka/menutup submenu Kategori
  const [isKategoriOpen, setIsKategoriOpen] = useState(pathname.includes("/kategori"));

  const closeMenuMobile = () => {
    setIsOpen(false);
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200" onClick={closeMenuMobile} />}

      <nav
        className={`fixed md:relative top-0 left-0 h-screen w-64 bg-slate-900 border-r border-slate-800 py-6 text-white z-50 flex flex-col shrink-0 transform transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <button onClick={closeMenuMobile} className="md:hidden absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
          <X size={24} />
        </button>

        <div className="px-6 mb-8 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center shrink-0">
            <span className="font-bold text-white text-xs">SA</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight leading-tight">Simaset</h1>
            <p className="text-xs text-slate-400 mt-0.5">Sistem Manajemen Aset</p>
          </div>
        </div>

        <ul className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          <li>
            <Link
              onClick={closeMenuMobile}
              href="/admin/dashboard"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors group ${pathname === "/admin/dashboard" ? "text-white bg-blue-600/20 border-l-4 border-blue-600" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}
            >
              <Home size={20} className={pathname === "/admin/dashboard" ? "text-blue-600" : "group-hover:text-white"} />
              <span>Beranda</span>
            </Link>
          </li>

          {/* MENU KATEGORI DENGAN SUBMENU */}
          <li>
            <button
              onClick={() => setIsKategoriOpen(!isKategoriOpen)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors group ${pathname.includes("/kategori") ? "text-white bg-slate-800" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}
            >
              <div className="flex items-center gap-3">
                <Tags size={20} className={pathname.includes("/kategori") ? "text-blue-500" : "group-hover:text-white"} />
                <span>Kategori</span>
              </div>
              <ChevronDown size={16} className={`transition-transform duration-200 ${isKategoriOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Isi Submenu */}
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isKategoriOpen ? "max-h-40 opacity-100 mt-1" : "max-h-0 opacity-0"}`}>
              <ul className="flex flex-col gap-1 pl-11 pr-2 border-l border-slate-700 ml-5">
                <li>
                  <Link
                    onClick={closeMenuMobile}
                    href="/admin/kategori/kir"
                    className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${pathname === "/admin/kategori/kir" ? "text-blue-400 bg-slate-800" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"}`}
                  >
                    Ruangan (KIR)
                  </Link>
                </li>
                <li>
                  <Link
                    onClick={closeMenuMobile}
                    href="/admin/kategori/asal-usul"
                    className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${pathname === "/admin/kategori/asal-usul" ? "text-blue-400 bg-slate-800" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"}`}
                  >
                    Asal Usul
                  </Link>
                </li>
              </ul>
            </div>
          </li>

          <li>
            <Link
              onClick={closeMenuMobile}
              href="/admin/inventaris"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors group ${pathname === "/admin/inventaris" ? "text-white bg-blue-600/20 border-l-4 border-blue-600" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}
            >
              <Package size={20} className={pathname === "/admin/inventaris" ? "text-blue-600" : "group-hover:text-white"} />
              <span>Inventaris</span>
            </Link>
          </li>
          <li>
            <Link
              onClick={closeMenuMobile}
              href="/admin/pengguna"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors group ${pathname === "/admin/pengguna" ? "text-white bg-blue-600/20 border-l-4 border-blue-600" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}
            >
              <Users size={20} className={pathname === "/admin/pengguna" ? "text-blue-600" : "group-hover:text-white"} />
              <span>Pengguna</span>
            </Link>
          </li>
          <li>
            <Link
              onClick={closeMenuMobile}
              href="/admin/pengaturan"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors group ${pathname === "/admin/pengaturan" ? "text-white bg-blue-600/20 border-l-4 border-blue-600" : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}
            >
              <Settings size={20} className={pathname === "/admin/pengaturan" ? "text-blue-600" : "group-hover:text-white"} />
              <span>Pengaturan</span>
            </Link>
          </li>
        </ul>

        <div className="px-4 mt-auto">
          <Link onClick={closeMenuMobile} href="/login" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 text-sm font-semibold hover:bg-red-500/10 hover:text-red-500 transition-colors group">
            <LogOut size={20} className="group-hover:text-red-500 transition-colors" />
            <span>Keluar</span>
          </Link>
        </div>
      </nav>
    </>
  );
}
