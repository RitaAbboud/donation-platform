"use client";

import { HeartHandshake, Recycle, Users, ArrowUpRight } from "lucide-react";

export default function Features() {
  const features = [
    {
      title: "Help Others",
      desc: "Donate items easily and support people in need with dignity and transparency.",
      icon: HeartHandshake,
      color: "bg-rose-100 text-rose-600",
    },
    {
      title: "Reduce Waste",
      desc: "Give unused items a second life and help build a more sustainable future.",
      icon: Recycle,
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      title: "Community",
      desc: "Be part of a caring community that connects givers with those in need.",
      icon: Users,
      color: "bg-blue-100 text-blue-600",
    },
  ];

  return (
    <section id="features" className="py-32 bg-white relative">
      {/* Decorative background element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        {/* HEADER */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-[#e25e2d] font-bold tracking-wider uppercase text-sm mb-4">
            Why Choose OneHand
          </h2>
          <p className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Small acts, <span className="text-[#e25e2d]">big impact.</span>
          </p>
        </div>

        {/* FEATURE CARDS */}
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="group relative p-10 rounded-[2.5rem] bg-white border border-slate-100 
                           hover:border-orange-100 transition-all duration-500 
                           hover:shadow-[0_30px_60px_-15px_rgba(226,94,45,0.1)]"
              >
                {/* ICON BOX */}
                <div
                  className={`w-16 h-16 rounded-2xl mb-8 flex items-center justify-center 
                                transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3
                                ${f.color}`}
                >
                  <Icon size={32} strokeWidth={1.5} />
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  {f.title}
                  <ArrowUpRight
                    className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all text-slate-300"
                    size={20}
                  />
                </h3>

                <p className="text-slate-600 leading-relaxed text-lg">
                  {f.desc}
                </p>

                {/* Subtle Hover Gradient */}
                <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-orange-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
