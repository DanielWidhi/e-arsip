"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { User, Menu, X, ChevronDown, LayoutDashboard, LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<{ nama: string; role: string; avatar_url?: string } | null>(null);

  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const checkSession = async (session: Session | null) => {
    if (session?.user?.email) {
      const { data } = await supabase.from("users").select("nama, role, avatar_url").eq("email", session.user.email).single();
      if (data) {
        setUserProfile({
          nama: data.nama,
          role: data.role,
          avatar_url: data.avatar_url,
        });
      }
    } else {
      setUserProfile(null);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      checkSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      checkSession(session);
    });

    const handleAvatarUpdate = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      checkSession(session);
    };

    window.addEventListener("local-avatar-updated", handleAvatarUpdate);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener("local-avatar-updated", handleAvatarUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    document.cookie = "sb-access-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setUserProfile(null);
    setIsProfileOpen(false); // Tutup dropdown saat logout
    router.refresh();
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shadow-sm">
      <div className="flex justify-between items-center w-full px-6 md:px-12 max-w-7xl mx-auto h-16">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2.5 text-xl font-extrabold text-blue-700 tracking-tight" onClick={closeMenu}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/assets/logos-sate.png" alt="Logo" className="w-8 h-8 md:w-10 md:h-10 object-contain drop-shadow-sm bg-white rounded-md p-0.5" />
            <span>
              SATE <span className="text-slate-800 text-sm md:text-lg">Kuta Selatan</span>
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex gap-8">
          <Link href="/" className={`font-semibold text-sm transition-colors pb-1 border-b-2 ${pathname === "/" ? "text-blue-700 border-blue-700" : "text-slate-500 border-transparent hover:text-blue-700"}`}>
            Beranda
          </Link>
          <Link href="/arsip" className={`font-semibold text-sm transition-colors pb-1 border-b-2 ${pathname === "/arsip" ? "text-blue-700 border-blue-700" : "text-slate-500 border-transparent hover:text-blue-700"}`}>
            Arsip
          </Link>
        </nav>

        <div className="hidden md:flex items-center">
          {userProfile ? (
            <div className="relative">
              {/* Tombol Profil */}
              <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-2 hover:bg-slate-50 p-1.5 pr-3 rounded-lg transition-colors border border-transparent hover:border-slate-200">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={userProfile.avatar_url || `https://ui-avatars.com/api/?name=${userProfile.nama}&background=0D8ABC&color=fff&bold=true`} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div className="text-left hidden lg:block">
                  <p className="text-xs font-bold text-slate-800 truncate max-w-30">{userProfile.nama}</p>
                </div>
                <ChevronDown size={14} className="text-slate-400" />
              </button>

              {/* ========================================================== */}
              {/* BACKDROP & MENU DROPDOWN DENGAN ANIMASI MULUS             */}
              {/* ========================================================== */}
              {/* Backdrop transparan (selalu di DOM, dikontrol visibilitasnya) */}
              <div className={`fixed inset-0 z-40 transition-opacity duration-200 ${isProfileOpen ? "opacity-100 visible" : "opacity-0 invisible"}`} onClick={() => setIsProfileOpen(false)} />

              {/* Box Menu Dropdown (Animasi Scale & Fade-in) */}
              <div
                className={`absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50 transform origin-top-right transition-all duration-200 ease-in-out ${isProfileOpen ? "opacity-100 scale-100 translate-y-0 visible" : "opacity-0 scale-95 -translate-y-2 invisible"
                  }`}
              >
                <Link href="/admin/pengaturan" className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors">
                  <User size={16} /> Profile
                </Link>
                <Link href="/admin/dashboard" className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors">
                  <LayoutDashboard size={16} /> Ke Dashboard
                </Link>
                <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors border-t border-slate-100 mt-1 pt-3">
                  <LogOut size={16} /> Keluar
                </button>
              </div>
            </div>
          ) : (
            <Link href="/login" className="flex items-center gap-2 text-slate-700 hover:text-blue-700 transition-colors bg-slate-100 hover:bg-blue-50 px-4 py-2 rounded-full text-sm font-medium">
              <User size={18} />
              <span>Admin</span>
            </Link>
          )}
        </div>

        <div className="md:hidden flex items-center">
          <button onClick={() => setIsOpen(!isOpen)} className="text-slate-700 p-2 bg-slate-50 rounded-md transition-transform duration-300 active:scale-95">
            <div className={`transform transition-transform duration-300 ${isOpen ? "rotate-90 scale-0 absolute opacity-0" : "rotate-0 scale-100 opacity-100"}`}>
              <Menu size={24} />
            </div>
            <div className={`transform transition-transform duration-300 ${isOpen ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 absolute opacity-0"}`}>
              <X size={24} />
            </div>
          </button>
        </div>
      </div>

      <div
        className={`md:hidden absolute left-0 w-full bg-white shadow-xl transition-all duration-300 ease-in-out overflow-hidden z-40 origin-top ${isOpen ? "max-h-100 opacity-100 border-b border-slate-200 translate-y-0 visible" : "max-h-0 opacity-0 border-transparent -translate-y-4 invisible"}`}
      >
        <div className="flex flex-col px-6 py-4 space-y-4">
          {userProfile && (
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={userProfile.avatar_url || `https://ui-avatars.com/api/?name=${userProfile.nama}&background=0D8ABC&color=fff&bold=true`} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">{userProfile.nama}</p>
                <p className="text-xs text-slate-500">{userProfile.role}</p>
              </div>
            </div>
          )}

          <Link href="/" onClick={closeMenu} className="text-base font-medium text-slate-600">
            Beranda
          </Link>
          <hr className="border-slate-100" />
          <Link href="/arsip" onClick={closeMenu} className="text-base font-medium text-slate-600">
            Arsip
          </Link>
          <hr className="border-slate-100" />

          {userProfile ? (
            <div className="flex flex-col gap-3">
              <Link href="/admin/pengaturan" onClick={closeMenu} className="flex items-center justify-center gap-2 bg-slate-100 text-slate-700 p-3 rounded-lg font-bold">
                <User size={18} /> Profile
              </Link>
              <Link href="/admin/dashboard" onClick={closeMenu} className="flex items-center justify-center gap-2 bg-blue-100 text-blue-700 p-3 rounded-lg font-bold">
                <LayoutDashboard size={18} /> Ke Dashboard
              </Link>
              <button onClick={handleLogout} className="flex items-center justify-center gap-2 bg-red-50 text-red-600 p-3 rounded-lg font-bold">
                <LogOut size={18} /> Keluar
              </button>
            </div>
          ) : (
            <Link href="/login" onClick={closeMenu} className="flex items-center justify-center gap-2 bg-blue-600 text-white p-3 rounded-lg font-semibold shadow-md">
              <User size={18} /> Login Admin
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
