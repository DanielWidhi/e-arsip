"use client"; // Wajib ditambahkan karena kita menggunakan interaksi klik (useState)

import { useState } from "react";
import Link from "next/link";
import { User, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname(); // Untuk mendeteksi kita sedang di halaman mana

  // Fungsi untuk buka/tutup menu mobile
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Fungsi untuk menutup menu otomatis saat link diklik (di HP)
  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shadow-sm">
      <div className="flex justify-between items-center w-full px-6 md:px-12 max-w-7xl mx-auto h-16">
        {/* Kiri: Logo & Judul */}
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xl font-extrabold text-blue-700 tracking-tight" onClick={closeMenu}>
            SI-ARSIP <span className="text-slate-800">Kuta Selatan</span>
          </Link>
        </div>

        {/* Tengah: Menu Navigasi Desktop (Disembunyikan di HP) */}
        <nav className="hidden md:flex gap-8">
          <Link href="/" className={`font-semibold text-sm transition-colors pb-1 border-b-2 ${pathname === "/" ? "text-blue-700 border-blue-700" : "text-slate-500 border-transparent hover:text-blue-700"}`}>
            Beranda
          </Link>
          <Link href="/arsip" className={`font-semibold text-sm transition-colors pb-1 border-b-2 ${pathname === "/arsip" ? "text-blue-700 border-blue-700" : "text-slate-500 border-transparent hover:text-blue-700"}`}>
            Arsip
          </Link>
          {/* <Link href="/tentang" className={`font-semibold text-sm transition-colors pb-1 border-b-2 ${pathname === "/tentang" ? "text-blue-700 border-blue-700" : "text-slate-500 border-transparent hover:text-blue-700"}`}>
            Tentang
          </Link> */}
        </nav>

        {/* Kanan: Tombol Login Admin Desktop (Disembunyikan di HP) */}
        <div className="hidden md:flex items-center">
          <Link href="/login" className="flex items-center gap-2 text-slate-700 hover:text-blue-700 transition-colors bg-slate-100 hover:bg-blue-50 px-4 py-2 rounded-full text-sm font-medium">
            <User size={18} />
          </Link>
        </div>

        {/* Kanan (Mobile): Tombol Hamburger / Close */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu} className="text-slate-700 hover:text-blue-700 focus:outline-none p-2 bg-slate-50 rounded-md" aria-label="Toggle Menu">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* DROPDOWN MENU MOBILE (Hanya muncul jika isOpen === true) */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-slate-200 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col px-6 py-4 space-y-4">
            <Link href="/" onClick={closeMenu} className={`text-base font-medium ${pathname === "/" ? "text-blue-700" : "text-slate-600"}`}>
              Beranda
            </Link>
            <hr className="border-slate-100" />
            <Link href="/arsip" onClick={closeMenu} className={`text-base font-medium ${pathname === "/arsip" ? "text-blue-700" : "text-slate-600"}`}>
              Arsip
            </Link>
            <hr className="border-slate-100" />
            {/* <Link href="/tentang" onClick={closeMenu} className={`text-base font-medium ${pathname === "/tentang" ? "text-blue-700" : "text-slate-600"}`}>
              Tentang
            </Link> */}
            <hr className="border-slate-100" />
            <Link href="/login" onClick={closeMenu} className="flex items-center justify-center gap-2 bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              <User size={18} />
              <span>Login Admin</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
