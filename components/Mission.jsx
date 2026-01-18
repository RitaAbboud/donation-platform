"use client";

import { useEffect, useState, useRef } from "react";
import { Quote } from "lucide-react";

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
      className="py-32 bg-[#fdf2e9] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-16 items-center">
        {/* LEFT SIDE: VISUAL ELEMENT */}
        <div
          className={`lg:col-span-5 relative transition-all duration-1000 delay-200 ${
            isVisible
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-12"
          }`}
        >
          <div className="relative">
            {/* Large background text or shape */}
            <span className="absolute -top-20 -left-10 text-[15rem] font-black text-orange-200/30 select-none">
              “
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight relative z-10">
              Dignity is the <br />
              <span className="text-[#e25e2d]">Heart of Giving.</span>
            </h2>
            <div className="mt-8 w-24 h-1.5 bg-[#e25e2d] rounded-full" />
          </div>
        </div>

        {/* RIGHT SIDE: CONTENT */}
        <div
          className={`lg:col-span-7 transition-all duration-1000 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <div className="bg-white/50 backdrop-blur-sm p-8 md:p-12 rounded-[3rem] shadow-2xl shadow-orange-900/5 border border-white">
            <Quote className="text-[#e25e2d] mb-6 opacity-40" size={40} />

            <p className="text-xl md:text-2xl text-slate-700 leading-relaxed font-medium">
              At{" "}
              <span className="text-slate-900 font-bold underline decoration-[#f8d5b8] decoration-4 underline-offset-4">
                One Hand
              </span>
              , we believe help should never feel{" "}
              <span className="text-[#e25e2d]">humiliating</span> or
              complicated.
            </p>

            <p className="mt-8 text-lg text-slate-600 leading-relaxed">
              Some have more than they need; others are missing the basics. We
              bridge that gap with{" "}
              <span className="font-semibold text-slate-900">respect</span> and
              <span className="font-semibold text-slate-900">
                {" "}
                transparency
              </span>
              .
            </p>

            <div className="mt-10 pt-8 border-t border-orange-100">
              <p className="text-[#e25e2d] font-bold text-xl italic">
                "One hand gives. Another receives. Both walk away stronger."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
