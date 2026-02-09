"use client";

import { useEffect, useState, useRef } from "react";
import { Quote,Heart } from "lucide-react";

export default function Mission() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 },
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

return (
  <section
    id="mission"
    ref={sectionRef}
    className="relative pt-24 pb-20 md:pt-40 md:pb-32 bg-[#fdf2e9] overflow-hidden"
  >
    {/* TOP WAVE TRANSITION */}
    <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180">
      <svg 
        className="relative block w-full h-[50px] md:h-[120px]" 
        viewBox="0 0 1200 120" 
        preserveAspectRatio="none"
      >
        <path 
          d="M0,0 C300,0 300,80 600,80 C900,80 900,0 1200,0 V120 H0 Z" 
          fill="#ffffff" 
        />
      </svg>
    </div>

    {/* DECORATIVE ACCENT */}
    <div className="absolute top-1/4 right-0 w-48 h-48 md:w-64 md:h-64 bg-orange-50 rounded-full blur-3xl -z-0 opacity-60" />

    <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-10 md:gap-16 items-center">
      
      {/* LEFT SIDE: VISUAL ELEMENT */}
      <div
        className={`lg:col-span-5 relative transition-all duration-1000 delay-200 ${
          isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
        }`}
      >
        <div className="relative text-center lg:text-left">
          {/* Decorative Large Quote Mark - Scaled and repositioned for mobile */}
          <span className="absolute -top-16 left-1/2 -translate-x-1/2 lg:left-[-3rem] lg:translate-x-0 text-[10rem] md:text-[18rem] font-serif font-black text-white/60 lg:text-white select-none leading-none -z-10">
            “
          </span>
          
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.2] lg:leading-[1.1] relative z-10">
            Dignity is the <br className="hidden sm:block" />
            <span className="text-[#e25e2d] inline-block mt-2">Heart of Giving.</span>
          </h2>
          
          <div className="mt-6 md:mt-8 flex justify-center lg:justify-start items-center gap-4">
            <div className="w-12 md:w-16 h-1.5 bg-[#e25e2d] rounded-full" />         
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: CONTENT CARD */}
      <div
        className={`lg:col-span-7 transition-all duration-1000 delay-500 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}
      >
        <div className="relative group p-0 md:p-2">
          {/* Subtle Glows - Hidden or scaled on mobile to avoid layout shifts */}
          <div className="absolute -top-6 -right-6 w-32 h-32 md:w-48 md:h-48 bg-orange-100/40 rounded-full blur-3xl" />
          <div className="absolute -bottom-6 -left-6 w-32 h-32 md:w-48 md:h-48 bg-slate-100/50 rounded-full blur-3xl" />

          {/* The Main Card */}
          <div className="relative bg-white/90 backdrop-blur-md p-7 md:p-14 rounded-[2rem] md:rounded-[3rem] shadow-[0_30px_70px_-20px_rgba(15,23,42,0.08)] border border-orange-50/50 transition-all duration-500 group-hover:shadow-[0_40px_90px_-20px_rgba(226,94,45,0.12)]">
            
            {/* Refined Quote Icon */}
            <div className="mb-6 md:mb-8 inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-orange-50/50 text-[#e25e2d]">
              <Quote size={28} className="md:w-[32px] md:h-[32px]" />
            </div>

            <div className="space-y-6 md:space-y-8">
              <h3 className="text-xl md:text-3xl text-slate-800 leading-snug font-semibold tracking-tight">
                At{" "}
                <span className="px-1.5 py-0.5 bg-orange-100/50 rounded-md text-slate-900 font-bold">
                  One Hand
                </span>
                , we believe help should never feel humiliating or complicated.
              </h3>

              <p className="text-base md:text-xl text-slate-600/90 leading-relaxed">
                Some have more than they need; others are missing the basics. We
                bridge that gap with respect and transparency.
              </p>
            </div>

            {/* Signature Footer */}
            <div className="mt-10 md:mt-12 pt-6 md:pt-8 border-t border-slate-100">
              <div className="flex items-start md:items-center gap-4 md:gap-5">
                <Heart size={20} className="text-[#e25e2d]/60 mt-1 md:mt-0 flex-shrink-0" />
                <p className="text-slate-500 text-base md:text-xl font-medium italic leading-tight">
                  "One hand gives. Another receives. Both walk away stronger."
                </p>
              </div>
            </div>

            {/* Subtle corner accent - hidden on very small screens for cleanliness */}
            <div className="hidden sm:flex absolute top-10 right-10 gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-200" />
              <div className="w-1.5 h-1.5 rounded-full bg-orange-100" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
}
