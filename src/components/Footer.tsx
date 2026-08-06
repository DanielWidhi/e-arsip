// src/components/Footer.tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 text-slate-500 py-8 px-6 md:px-12 w-full mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-sm">© 2026 SI-ARSIP - Kantor Camat Kuta Selatan. All rights reserved.</div>
        <div className="flex gap-6 text-sm">
          <Link href="#" className="hover:text-blue-700 transition-colors">
            Kebijakan Privasi
          </Link>
          <Link href="#" className="hover:text-blue-700 transition-colors">
            Syarat & Ketentuan
          </Link>
          <Link href="#" className="hover:text-blue-700 transition-colors">
            Kontak Kami
          </Link>
        </div>
      </div>
    </footer>
  );
}
