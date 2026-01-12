"use client";

import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center">
      {/* Background Image */}
      <Image
        src="/images/download (3).jpg"
        alt="Helping hands"
        fill
        priority
        quality={100}
        sizes="100vw"
        className="hero-image"
      />

      {/* Top gradient for navbar readability */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/70 to-transparent z-10"></div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50 z-10"></div>

      {/* Content */}
      <div className="relative z-20 max-w-4xl mx-auto px-6 text-center text-white animate-fadeInUp">
        {/* Hero heading - first sentence slightly smaller */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
          One Hand Can Change a Life
        </h2>

        {/* Hero paragraph - professionally split, second sentence stays */}
        <p className="text-sm md:text-base lg:text-lg mb-10 opacity-95 leading-relaxed">
          What you no longer need could mean everything to someone else.<br />
          Give with dignity. Receive with respect.
        </p>

        {/* Single One Hand button */}
        <div className="flex justify-center">
          <Link
            href="/login"
            className="bg-[#e25e2d] text-white px-8 md:px-10 py-3 md:py-4 rounded-full text-base md:text-lg font-semibold shadow-lg
                       transition-all duration-200 transform hover:-translate-y-1 hover:bg-[#ff7b50]"
          >
            Get Started
          </Link>
        </div>
      </div>
    </section>
  );
}
