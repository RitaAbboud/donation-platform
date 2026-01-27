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
  <section id="features" className="py-32 bg-white relative overflow-hidden">
    {/* SOFT BACKGROUND ACCENTS - Matches Hero/Mission Style */}
    <div className="absolute top-1/2 left-0 w-96 h-96 bg-orange-50/50 rounded-full blur-[120px] -z-0" />
    <div className="absolute top-1/4 right-0 w-64 h-64 bg-slate-50 rounded-full blur-[100px] -z-0" />

    <div className="relative z-10 max-w-7xl mx-auto px-6">
      {/* HEADER: Refined for better visual hierarchy */}
      <div className="text-center max-w-3xl mx-auto mb-24">
        <div className="inline-flex items-center gap-2 bg-orange-50 text-[#e25e2d] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-orange-100/50">
          <span className="w-2 h-2 rounded-full bg-[#e25e2d] animate-pulse" />
          The OneHand Experience
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-tight">
          Small acts, <span className="relative inline-block">
            <span className="relative z-10 text-[#e25e2d]">big impact.</span>
            <span className="absolute bottom-2 left-0 w-full h-3 bg-orange-100 -z-10 rounded-sm" />
          </span>
        </h2>
        <p className="mt-6 text-slate-500 text-lg md:text-xl leading-relaxed">
          We’ve stripped away the complexity of traditional charity to focus on what matters: 
          direct, dignified, and transparent support.
        </p>
      </div>

      {/* FEATURE CARDS: Smoother and more integrated */}
      <div className="grid gap-10 md:grid-cols-3">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <div
              key={i}
              className="group relative"
            >
              {/* Card Container */}
              <div className="relative h-full p-10 rounded-[3rem] bg-white border border-slate-100 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_40px_80px_-20px_rgba(15,23,42,0.08)] hover:border-orange-100/50 overflow-hidden">
                
                {/* ICON BOX: Now softer and integrated */}
                <div
                  className={`w-16 h-16 rounded-2xl mb-8 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-sm ${f.color} bg-opacity-10 text-slate-800`}
                  style={{ backgroundColor: `${f.hexColor}20`, color: f.hexColor }} // Optional: Dynamic colors
                >
                  <Icon size={32} strokeWidth={1.5} className="text-[#e25e2d]" />
                </div>

                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">
                    {f.title}
                  </h3>

                  <p className="text-slate-600/90 leading-relaxed text-lg">
                    {f.desc}
                  </p>
                </div>

                {/* Subtle Progress Indicator (Visual flair) */}
                <div className="absolute bottom-0 left-0 h-1.5 w-0 bg-gradient-to-r from-orange-200 to-[#e25e2d] group-hover:w-full transition-all duration-700 ease-in-out" />
                
                {/* Melted Background Glow inside card */}
                <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-orange-50/30 rounded-full blur-2xl group-hover:bg-orange-100/50 transition-colors" />
              </div>

              {/* Decorative Numbering */}
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 text-sm font-bold border border-white shadow-sm group-hover:text-orange-300 transition-colors">
                {i + 1}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);
}
