export default function AdminFooter() {
  return (
    <footer className="w-full px-6 py-4 bg-white border-t border-slate-200 mt-auto shrink-0">
      <div className="flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-2">
        <p>&copy; 2026 SI-ARSIP Kantor Camat Kuta Selatan.</p>
        <div className="flex gap-4">
          <span className="hover:text-blue-600 cursor-pointer">Bantuan</span>
          <span className="hover:text-blue-600 cursor-pointer">Versi 1.0.0</span>
        </div>
      </div>
    </footer>
  );
}
