export default function AdminFooter() {
  return (
    <footer className="w-full px-4 md:px-8 py-4 bg-white border-t border-slate-200 shrink-0">
      <div className="flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-2">
        <p>&copy; 2026 SATE - Kantor Camat Kuta Selatan.</p>
        <div className="flex gap-4">
          <span className="hover:text-blue-600 cursor-pointer transition-colors">Bantuan</span>
          <span className="hover:text-blue-600 cursor-pointer transition-colors">Versi 1.0.0</span>
        </div>
      </div>
    </footer>
  );
}
