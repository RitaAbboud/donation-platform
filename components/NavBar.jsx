"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`w-full z-50 fixed top-0 transition-all duration-300
        ${scrolled
          ? "backdrop-blur-md bg-black/20 shadow-sm"
          : "bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 md:py-4 flex justify-between items-center">

        {/* Logo */}
        <h1 className="text-xl md:text-2xl font-bold text-[#e25e2d]">
          One Hand
        </h1>

        {/* Links + Button */}
        <div className="flex items-center gap-4 md:gap-6 font-medium text-black">
          <div className="flex gap-6 md:gap-8 text-sm md:text-base">
            <NavLink href="#">Home</NavLink>
            <NavLink href="#features">Features</NavLink>
            <NavLink href="#mission">Our Mission</NavLink>
            <NavLink href="#info">Info</NavLink>
          </div>

          {/* Get Started button in navbar */}
          <Link
            href="/login"
            className="ml-2 md:ml-4 bg-[#e25e2d] text-white px-2.5 md:px-3 py-1 md:py-1.5 rounded-full text-xs md:text-sm font-semibold
                       hover:bg-[#ff7b50] transition-all duration-200 transform hover:-translate-y-1"
          >
            Login / Sign Up
          </Link>
        </div>

      </div>
    </div>
  );
}

function NavLink({ href, children }) {
  return (
    <a
      href={href}
      className="transition-all duration-200 hover:-translate-y-1 hover:text-[#e25e2d]"
    >
      {children}
    </a>
  );
}
