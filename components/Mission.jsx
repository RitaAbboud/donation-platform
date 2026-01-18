"use client";

import { useEffect, useState } from "react";

export default function Mission() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <section id="mission" className="pt-20 pb-14 bg-white">
      <div
        className={`max-w-4xl mx-auto px-6 transition-all duration-700 ease-out
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-[#e25e2d] mb-6 text-center">
            Our Mission
          </h2>
        <div className="bg-[#fff7f0] p-10 md:p-14 rounded-2xl shadow-xl border border-[#f1d2b8] text-center">
          

          <p className="text-base md:text-lg text-gray-700 leading-relaxed">
            At <span className="font-semibold text-gray-900">One Hand</span>, help
            should never feel{" "}
            <span className="font-semibold text-[#e25e2d]">humiliating</span> or{" "}
            <span className="font-semibold text-[#e25e2d]">complicated</span>.
            <br />
            <br />
            Some people have more than they need. Others are missing the basics.
            We quietly connect them with{" "}
            <span className="font-semibold text-[#e25e2d]">respect</span>,{" "}
            <span className="font-semibold text-[#e25e2d]">transparency</span>, and{" "}
            <span className="font-semibold text-[#e25e2d]">empathy</span>.
            <br />
            <br />
            <span className="font-medium text-gray-900">
              One hand gives. Another receives. Both walk away stronger.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
