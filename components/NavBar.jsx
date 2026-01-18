"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Added this
import { Heart } from "lucide-react";

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-[100] transition-all duration-500 ${
        scrolled
          ? "py-3 bg-white/80 backdrop-blur-xl shadow-lg shadow-black/5"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        
        {/* LOGO */}
        <div
          className="group flex items-center gap-1 font-black text-2xl tracking-tighter text-[#e25e2d] cursor-pointer"
          onClick={() => router.push("/")}
        >
          <Heart className="group-hover:scale-110 transition-transform" fill="#e25e2d" size={24} />
          <span>
            OneHand<span className="text-[#f3a552]">.</span>
          </span>
        </div>

        {/* NAVIGATION LINKS */}
        <div className="hidden md:flex items-center gap-8 font-semibold text-slate-700">
          <NavLink href="#hero">Home</NavLink>
          <NavLink href="#features">Features</NavLink>
          <NavLink href="#mission">Mission</NavLink>
          <NavLink href="#info">Info</NavLink>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="bg-[#e25e2d] text-white px-6 py-2.5 rounded-xl text-sm font-bold
                       hover:bg-[#ff7b50] hover:shadow-[0_8px_20px_-6px_rgba(226,94,45,0.6)] 
                       transition-all duration-300 active:scale-95"
          >
            Join Now
          </Link>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, children }) {
  return (
    <Link
      href={href}
      className="relative text-sm tracking-wide transition-colors hover:text-[#e25e2d] group"
    >
      {children}
      {/* Animated Underline */}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#e25e2d] transition-all duration-300 group-hover:w-full" />
    </Link>
  );
}