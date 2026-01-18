"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Poppins } from "next/font/google";
import { Heart, ArrowRight } from "lucide-react"; // Modern icons

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700", "800"],
});

export default function Hero() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <section className="relative bg-[#fdf2e9] overflow-hidden min-h-[90vh] flex items-center">
      {/* BACKGROUND DECORATION */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#f8d5b8] rounded-full blur-3xl opacity-50" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-24 grid lg:grid-cols-2 gap-12 items-center">
        
        {/* LEFT CONTENT */}
        <div
          className={`transition-all duration-1000 ease-out
          ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}
        >
          <div className="inline-flex items-center gap-2 bg-orange-100 text-[#e25e2d] px-4 py-1.5 rounded-full text-sm font-bold mb-6">
            <Heart size={16} fill="currentColor" />
            <span>Join 1,000+ Active Donors</span>
          </div>

          <h1 className={`${poppins.className} text-5xl md:text-6xl lg:text-7xl mb-6 leading-tight text-slate-900`}>
            One Hand <br />
            <span className="text-[#e25e2d] relative inline-block">
              Can Change a Life
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 20" fill="none"><path d="M5 15C70 5 150 5 295 15" stroke="#f8d5b8" strokeWidth="8" strokeLinecap="round"/></svg>
            </span>
          </h1>

          <p className="text-slate-600 text-lg md:text-xl mb-10 max-w-lg leading-relaxed">
            What you no longer need could mean everything to someone else. 
            Connect with your community through dignified giving.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/login"
              className="group flex items-center justify-center gap-2 bg-[#e25e2d] text-white px-8 py-4 rounded-xl font-bold shadow-2xl shadow-orange-200 transition-all hover:bg-[#ff7b50] hover:scale-105 active:scale-95"
            >
              Get Started
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              href="#features"
              className="flex items-center justify-center px-8 py-4 rounded-xl font-bold text-slate-700 hover:bg-white/50 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* RIGHT IMAGE AREA */}
        <div
          className={`relative transition-all duration-1000 ease-out delay-300
          ${visible ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}
        >
          {/* Decorative Ring */}
          <div className="absolute inset-0 border-2 border-dashed border-orange-200 rounded-full animate-[spin_20s_linear_infinite]" />
          
          <div className="relative z-10 w-full aspect-square max-w-[500px] mx-auto p-4">
            <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-[0_32px_64px_-15px_rgba(226,94,45,0.3)] rotate-3 hover:rotate-0 transition-transform duration-500">
              <Image
                src="/images/hero.png"
                alt="Helping hands"
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* WAVE (Updated to blend better) */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180">
        <svg className="relative block w-full h-[60px]" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44C191.47,82.34,66.28,98.93,0,105.35V120H1200V0C1132.21,36.42,1035.6,69.52,912.45,74.87C746.18,82.04,585.15,31.42,321.39,56.44Z" fill="#ffffff" />
        </svg>
      </div>
    </section>
  );
}