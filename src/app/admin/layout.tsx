"use client";

import { useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";
import AdminFooter from "@/components/AdminFooter";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // State untuk mengontrol buka/tutup sidebar di Mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
      {/* SIDEBAR (Di-passing state agar bisa ditutup/dibuka) */}
      <AdminSidebar isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />

      {/* AREA KANAN (Header + Konten Utama + Footer) */}
      <div className="flex-1 flex flex-col h-full overflow-hidden w-full bg-slate-50 relative">
        {/* HEADER (Di-passing fungsi untuk membuka menu) */}
        <AdminHeader onMenuClick={() => setIsMobileMenuOpen(true)} />

        {/* KONTEN UTAMA HALAMAN */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col">
          <div className="grow">{children}</div>

          <div className="mt-8">
            <AdminFooter />
          </div>
        </main>
      </div>
    </div>
  );
}
