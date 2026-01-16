"use client";

import { HeartHandshake, Recycle, Users } from "lucide-react";

export default function Features() {
  const features = [
    {
      title: "Help Others",
      desc: "Donate items easily and support people in need with dignity and transparency.",
      icon: HeartHandshake,
    },
    {
      title: "Reduce Waste",
      desc: "Give unused items a second life and help build a more sustainable future.",
      icon: Recycle,
    },
    {
      title: "Community",
      desc: "Be part of a caring community that connects givers with those in need.",
      icon: Users,
    },
  ];

  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-[#e25e2d] mb-14">
          Our Features
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="bg-[#fff7f0] rounded-2xl p-8 shadow-lg border border-[#f1d2b8]
                           transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="flex items-center justify-center w-14 h-14 mx-auto mb-6
                                rounded-full bg-[#ffe8d9] text-[#e25e2d]">
                  <Icon size={28} strokeWidth={1.8} />
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {f.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
