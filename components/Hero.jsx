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
  <section className="relative bg-[#fdf2e9] overflow-hidden min-h-[90vh] flex items-center pt-10 md:pt-0">
    {/* BACKGROUND DECORATION */}
    <div className="absolute top-[-5%] right-[-10%] w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-[#f8d5b8] rounded-full blur-3xl opacity-40" />
    
    <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-24 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
      
      {/* TEXT CONTENT: Now order-1 so it stays on top/left */}
      <div
        className={`order-1 transition-all duration-1000 ease-out
        ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}
      >
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-[#e25e2d] px-4 py-1.5 rounded-full text-sm font-bold mb-6">
            <Heart size={16} fill="currentColor" />
            <span>Join 1,000+ Active Donors</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 text-slate-900 leading-tight">
            One Hand <br className="hidden sm:block" />
            <span className="text-[#e25e2d] relative inline-block">
              Can Change a Life
            </span>
          </h1>

          <p className="text-slate-600 text-base md:text-xl mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed">
            What you no longer need could mean everything to someone else. 
            Connect with your community through dignified giving.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center lg:justify-start">
            <Link
              href="/login"
              className="group flex items-center justify-center gap-2 bg-[#e25e2d] text-white px-8 py-4 rounded-xl font-bold shadow-xl shadow-orange-200 transition-all hover:bg-[#ff7b50] hover:scale-105 active:scale-95"
            >
              Get Started
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              href="#features"
              className="flex items-center justify-center px-8 py-4 rounded-xl font-bold text-slate-700 hover:bg-white/40 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>

      {/* IMAGE CONTENT: Now order-2 so it stays below/right */}
      <div
        className={`order-2 relative transition-all duration-1000 ease-out delay-300
        ${visible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
      >
        <div className="relative w-full aspect-square max-w-[280px] sm:max-w-[400px] lg:max-w-[500px] mx-auto flex items-center justify-center">
          <div className="absolute inset-0 bg-[#e25e2d] rounded-full blur-3xl transform scale-75 opacity-30" />
          
          <div className="relative w-[95%] h-[95%] rounded-full overflow-hidden border-8 border-white shadow-2xl">
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

    {/* BOTTOM WAVE */}
    <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
      <svg 
        className="relative block w-full h-[40px] md:h-[100px]" 
        viewBox="0 0 1200 120" 
        preserveAspectRatio="none"
      >
       <path 
          d="M321.39,56.44C191.47,82.34,66.28,98.93,0,105.35V120H1200V0C1132.21,36.42,1035.6,69.52,912.45,74.87C746.18,82.04,585.15,31.42,321.39,56.44Z" 
          fill="#ffffff" 
        />
      </svg>
    </div>
  </section>
);
}