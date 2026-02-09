"use client";

import { HeartHandshake, Recycle, Users, Icon } from "lucide-react";

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
  <section id="features" className="py-16 md:py-32 bg-white relative overflow-hidden">
    {/* SOFT BACKGROUND ACCENTS */}
    {/* Reduced size for mobile to prevent horizontal overflow */}
    <div className="absolute top-1/2 left-0 w-64 h-64 md:w-96 md:h-96 bg-orange-50/50 rounded-full blur-[80px] md:blur-[120px] -z-0" />
    <div className="absolute top-1/4 right-0 w-48 h-48 md:w-64 md:h-64 bg-slate-50 rounded-full blur-[70px] md:blur-[100px] -z-0" />

    <div className="relative z-10 max-w-7xl mx-auto px-6">
      {/* HEADER */}
      <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
        <div className="inline-flex items-center gap-2 bg-orange-50 text-[#e25e2d] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-orange-100/50">
          <span className="w-2 h-2 rounded-full bg-[#e25e2d] animate-pulse" />
          The OneHand Experience
        </div>
        
        {/* Responsive Heading: smaller on mobile, original size on desktop */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-tight">
          Small acts, <span className="relative inline-block">
            <span className="relative z-10 text-[#e25e2d]">big impact.</span>
            <span className="absolute bottom-1 md:bottom-2 left-0 w-full h-2 md:h-3 bg-orange-100 -z-10 rounded-sm" />
          </span>
        </h2>
        
        <p className="mt-6 text-slate-500 text-base md:text-xl leading-relaxed">
          We’ve stripped away the complexity of traditional charity to focus on what matters: 
          direct, dignified, and transparent support.
        </p>
      </div>

      {/* FEATURE CARDS */}
      {/* Defaults to 1 column, switches to 3 columns at md breakpoint */}
      <div className="grid gap-8 md:gap-10 md:grid-cols-3">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <div
              key={i}
              className="group relative"
            >
              {/* Card Container - Adjusted padding for mobile (p-8 vs p-10) */}
              <div className="relative h-full p-8 md:p-10 rounded-[2.5rem] md:rounded-[3rem] bg-white border border-slate-100 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_40px_80px_-20px_rgba(15,23,42,0.08)] hover:border-orange-100/50 overflow-hidden">
                
                {/* ICON BOX */}
{/* ICON BOX */}
<div
  className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl mb-6 md:mb-8 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-sm bg-opacity-10 text-slate-800`}
  style={{ backgroundColor: `${f.hexColor}20`, color: f.hexColor }}
>
  {/* We use a class to control size or a single size prop that works for both */}
  <Icon size={32} strokeWidth={1.5} className="text-[#e25e2d] w-7 h-7 md:w-8 md:h-8" />
</div>

                <div className="relative z-10">
                  <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-4 tracking-tight">
                    {f.title}
                  </h3>

                  <p className="text-slate-600/90 leading-relaxed text-base md:text-lg">
                    {f.desc}
                  </p>
                </div>

                {/* Subtle Progress Indicator */}
                <div className="absolute bottom-0 left-0 h-1.5 w-0 bg-gradient-to-r from-orange-200 to-[#e25e2d] group-hover:w-full transition-all duration-700 ease-in-out" />
                
                {/* Melted Background Glow */}
                <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-orange-50/30 rounded-full blur-2xl group-hover:bg-orange-100/50 transition-colors" />
              </div>

              {/* Decorative Numbering */}
              <div className="absolute -top-3 -left-3 md:-top-4 md:-left-4 w-8 h-8 md:w-10 md:h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 text-xs md:text-sm font-bold border border-white shadow-sm group-hover:text-orange-300 transition-colors">
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
