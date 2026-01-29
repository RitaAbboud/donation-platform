"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, LogOut, Home } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

export default function NavBar({
  variant = "landing", // "landing" | "profile"
  title,
  subtitle,
}) {
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  /* ================= SCROLL EFFECT ================= */
  useEffect(() => {
    if (variant !== "landing") return;

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [variant]);

  /* ================= AUTH ================= */
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <nav
      className={`fixed top-0 w-full z-[100] transition-all duration-500
      ${
        variant === "landing"
          ? scrolled
            ? "py-3 bg-gradient-to-b from-white/80 to-white/60 backdrop-blur-xl shadow-[0_20px_50px_-25px_rgba(0,0,0,0.35)]"
            : "py-5 bg-transparent"
          : "py-4 bg-gradient-to-b from-[#fff7f2]/90 to-white/70 backdrop-blur-xl shadow-[0_15px_40px_-20px_rgba(0,0,0,0.3)]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

        {/* ================= LEFT ================= */}
        <div
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div
            className="flex items-center justify-center w-9 h-9 rounded-xl
                       bg-[#e25e2d] 
                       shadow-[0_10px_25px_-10px_rgba(226,94,45,0.8)]"
          >
            <Heart size={18} className="text-white" fill="white" />
          </div>

          <span className="font-black text-xl text-slate-900 tracking-tight">
            OneHand<span className="text-[#e25e2d]">.</span>
          </span>

          {variant === "profile" && (
            <div className="ml-6">
              <p className="text-slate-900 font-extrabold leading-tight">
                {title}
              </p>
              <p className="text-xs text-slate-500">{subtitle}</p>
            </div>
          )}
        </div>

        {/* ================= CENTER (LANDING) ================= */}
        {variant === "landing" && (
          <div className="hidden md:flex gap-10 font-semibold text-slate-700">
            <NavLink href="#hero">Home</NavLink>
            <NavLink href="#features">Features</NavLink>
            <NavLink href="#mission">Mission</NavLink>
            <NavLink href="#info">Info</NavLink>
          </div>
        )}

        {/* ================= RIGHT ================= */}
        <div className="flex items-center gap-3">
          {variant === "profile" ? (
            <>        
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl
                           bg-white/70 text-slate-700 text-sm font-semibold
                           
                           hover:bg-red-400 transition hover:text-white"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : user ? (
            <Link
              href="/dashboard"
              className="px-6 py-3 rounded-xl text-sm font-bold text-white
                         bg-[#e25e2d] 
                         shadow-[0_15px_35px_-15px_rgba(226,94,45,0.7)]
                         hover:scale-[1.03] transition"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="px-6 py-3 rounded-xl text-sm font-bold text-white
                         bg-gradient-to-br from-[#e25e2d] to-[#f3a552]
                         shadow-[0_15px_35px_-15px_rgba(226,94,45,0.7)]
                         hover:scale-[1.03] transition"
            >
              Join Now
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

/* ================= LINK ================= */

function NavLink({ href, children }) {
  return (
    <Link
      href={href}
      className="relative text-sm transition hover:text-[#e25e2d]"
    >
      {children}
      <span
        className="absolute left-0 -bottom-1 h-0.5 w-0
                   bg-gradient-to-r from-[#e25e2d] to-[#f3a552]
                   transition-all duration-300 hover:w-full"
      />
    </Link>
  );
}
