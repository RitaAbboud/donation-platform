"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { LogOut, LayoutDashboard, User, Menu, X, Heart } from "lucide-react"; 
import { supabase } from "../lib/supabaseClient";

export default function NavBar({ variant = "landing", title, subtitle }) {
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Mobile menu state
  const router = useRouter();

  useEffect(() => {
    if (variant !== "landing") return;
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [variant]);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    getUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  // Helper to close menu when link is clicked
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav
      className={`fixed top-0 w-full z-[100] transition-all duration-500 px-4 sm:px-8
      ${variant === "landing"
          ? scrolled || isMenuOpen
            ? "py-3 bg-white/90 backdrop-blur-xl shadow-sm"
            : "py-6 bg-transparent"
          : "py-3 bg-white/40 backdrop-blur-md border-b border-slate-200/50"
        }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* ================= LEFT: BRAND ================= */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-9 h-9 transition-transform group-hover:scale-110">
              <Image
                src="/images/logo3c.png"
                alt="Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="font-black text-xl tracking-tighter text-slate-900">
              One<span className="text-[#e25e2d]">Hand.</span>
            </div>
          </Link>

          {variant === "profile" && (
            <div className="hidden md:flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="h-8 w-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                <LayoutDashboard size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black uppercase tracking-widest text-slate-400 leading-none mb-1">
                  {title}
                </span>
                <span className="text-sm font-bold text-slate-700 leading-none">
                  {subtitle?.split('@')[0]}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ================= CENTER: DESKTOP NAV ================= */}
        {variant === "landing" && (
          <div className="hidden md:flex gap-8 font-bold text-slate-600">
            <NavLink href="#hero">Home</NavLink>
            <NavLink href="#features">Features</NavLink>
            <NavLink href="#mission">Mission</NavLink>
            <NavLink href="#info">Info</NavLink>
          </div>
        )}

        {/* ================= RIGHT: ACTIONS & HAMBURGER ================= */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            {variant === "profile" ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-400 text-white text-xs font-black uppercase tracking-wider hover:bg-red-500 transition-all active:scale-95"
              >
                <LogOut size={14} strokeWidth={3} />
                Logout
              </button>
            ) : user ? (
  <Link 
    href="/dashboard" 
    className="px-6 py-2.5 rounded-xl bg-[#e25e2d]  text-white text-sm font-semibold hover:from-orange-600 hover:to-orange-700 transition-all active:scale-95 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50"
  >
    Dashboard
  </Link>
) : (
  <Link 
    href="/login" 
    className="px-6 py-2.5 rounded-xl bg-[#e25e2d] text-white text-sm font-semibold hover:from-orange-600 hover:to-orange-700 transition-all active:scale-95 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50"
  >
    Join Community
  </Link>
)}
          </div>

          {/* Hamburger Button */}
          {variant === "landing" && (
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-slate-600 md:hidden hover:bg-orange-50 rounded-lg transition-colors"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          )}
        </div>
      </div>

      {/* ================= MOBILE MENU DRAWER ================= */}
      <div className={`
        md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-2xl border-b border-orange-100 transition-all duration-300 ease-in-out overflow-hidden
        ${isMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"}
      `}>
        <div className="flex flex-col p-6 gap-6 font-bold text-slate-600">
          <Link href="#hero" onClick={closeMenu} className="hover:text-[#e25e2d]">Home</Link>
          <Link href="#features" onClick={closeMenu} className="hover:text-[#e25e2d]">Features</Link>
          <Link href="#mission" onClick={closeMenu} className="hover:text-[#e25e2d]">Mission</Link>
          <Link href="#info" onClick={closeMenu} className="hover:text-[#e25e2d]">Info</Link>
          <hr className="border-orange-100" />
          {user ? (
            <Link href="/dashboard" onClick={closeMenu} className="text-[#e25e2d]">Go to Dashboard</Link>
          ) : (
            <Link href="/login" onClick={closeMenu} className="text-[#e25e2d]">Join Community</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

// NavLink Helper
function NavLink({ href, children }) {
  return (
    <Link href={href} className="text-sm transition-colors hover:text-orange-600">
      {children}
    </Link>
  );
}