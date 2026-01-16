"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: "700",
});

export default function Hero() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <section className="relative bg-[#f8d5b8] overflow-hidden">
      {/* CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-20 grid md:grid-cols-2 gap-16 items-center">
        
        {/* LEFT CONTENT */}
        <div
          className={`transition-all duration-700 ease-out
          ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <h1
            className={`${poppins.className} text-4xl md:text-5xl lg:text-6xl mb-6 leading-[1.1]`}
          >
            One Hand <br />
            <span className="text-[#e25e2d]">Can Change a Life</span>
          </h1>

          <p className="text-gray-700 text-base md:text-lg mb-8 leading-relaxed">
            What you no longer need could mean everything to someone else.
            Give with dignity. Receive with respect.
          </p>

          <Link
            href="/login"
            className="inline-block bg-[#e25e2d] text-white px-8 py-4 rounded-full font-semibold shadow-xl
                       transition-all duration-200 hover:-translate-y-1 hover:bg-[#ff7b50]"
          >
            Get Started
          </Link>
        </div>

        {/* RIGHT IMAGE */}
        <div
          className={`relative flex justify-center md:justify-end transition-all duration-700 ease-out delay-150
          ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <div className="relative w-64 h-64 md:w-[380px] md:h-[380px] rounded-full overflow-hidden">
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

      {/* WAVE */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg
          className="relative block w-[calc(100%+1.3px)] h-10 md:h-12"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44C191.47,82.34,66.28,98.93,0,105.35V120H1200V0
               C1132.21,36.42,1035.6,69.52,912.45,74.87
               C746.18,82.04,585.15,31.42,321.39,56.44Z"
            fill="#ffffff"
          />
        </svg>
      </div>
    </section>
  );
}
