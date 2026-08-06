"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shadow-sm">
      <div className="flex justify-between items-center w-full px-6 md:px-12 max-w-7xl mx-auto h-16 bg-white relative z-50">
        {/* Kiri: Logo & Judul */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2.5 text-xl font-extrabold text-blue-700 tracking-tight" onClick={closeMenu}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo-badung.png" alt="Logo" className="w-8 h-8 md:w-10 md:h-10 object-contain drop-shadow-sm" />
            <span>
              SI-ARSIP <span className="text-slate-800">Kuta Selatan</span>
            </span>
          </Link>
        </div>

        {/* Tengah: Menu Navigasi Desktop */}
        <nav className="hidden md:flex gap-8">
          <Link href="/" className={`font-semibold text-sm transition-colors pb-1 border-b-2 ${pathname === "/" ? "text-blue-700 border-blue-700" : "text-slate-500 border-transparent hover:text-blue-700"}`}>
            Beranda
          </Link>
          <Link href="/arsip" className={`font-semibold text-sm transition-colors pb-1 border-b-2 ${pathname === "/arsip" ? "text-blue-700 border-blue-700" : "text-slate-500 border-transparent hover:text-blue-700"}`}>
            Arsip
          </Link>
        </nav>

        {/* Kanan: Tombol Login Admin Desktop */}
        <div className="hidden md:flex items-center">
          <Link href="/login" className="flex items-center gap-2 text-slate-700 hover:text-blue-700 transition-colors bg-slate-100 hover:bg-blue-50 px-4 py-2 rounded-full text-sm font-medium">
            <User size={18} />
          </Link>
        </div>

        {/* Kanan (Mobile): Tombol Hamburger / Close */}
        <div className="md:hidden flex items-center">
          {/* Tambahan animasi putar (rotate) pada ikon hamburger agar lebih interaktif */}
          <button onClick={toggleMenu} className="text-slate-700 hover:text-blue-700 focus:outline-none p-2 bg-slate-50 rounded-md transition-transform duration-300 ease-in-out active:scale-95" aria-label="Toggle Menu">
            <div className={`transform transition-transform duration-300 ${isOpen ? "rotate-90 scale-0 absolute opacity-0" : "rotate-0 scale-100 opacity-100"}`}>
              <Menu size={24} />
            </div>
            <div className={`transform transition-transform duration-300 ${isOpen ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 absolute opacity-0"}`}>
              <X size={24} />
            </div>
          </button>
        </div>
      </div>

      {/* 
        DROPDOWN MENU MOBILE (ANIMASI MULUS)
        Menggunakan kombinasi max-h (height), opacity, dan -translate-y agar menunya seolah turun dari balik navbar.
      */}
      <div
        className={`md:hidden absolute left-0 w-full bg-white shadow-xl transition-all duration-300 ease-in-out overflow-hidden z-40 origin-top
          ${isOpen ? "max-h-[400px] opacity-100 border-b border-slate-200 translate-y-0 visible" : "max-h-0 opacity-0 border-transparent -translate-y-4 invisible"}
        `}
      >
        <div className="flex flex-col px-6 py-4 space-y-4">
          <Link href="/" onClick={closeMenu} className={`text-base font-medium transition-colors ${pathname === "/" ? "text-blue-700" : "text-slate-600 hover:text-blue-600"}`}>
            Beranda
          </Link>
          <hr className="border-slate-100" />
          <Link href="/arsip" onClick={closeMenu} className={`text-base font-medium transition-colors ${pathname === "/arsip" ? "text-blue-700" : "text-slate-600 hover:text-blue-600"}`}>
            Arsip
          </Link>
          <hr className="border-slate-100" />
          <Link href="/login" onClick={closeMenu} className="flex items-center justify-center gap-2 bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md active:translate-y-0.5">
            <User size={18} />
            <span>Login Admin</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
