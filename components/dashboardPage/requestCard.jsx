"use client";
import React, { useState } from "react";
import { Phone, MapPin, Tag, Clock, MessageSquare, X, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const RequestCard = ({ request }) => {
  const { categories, description, phone, location, created_at } = request;
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Compact relative time (e.g., 2d instead of 2 days ago)
  const formatRelativeTimeShort = (dateString) => {
    if (!dateString) return "";
    const now = new Date();
    const postedDate = new Date(dateString);
    const diffInSeconds = Math.floor((now - postedDate) / 1000);
    const intervals = { y: 31536000, m: 2592000, d: 86400, h: 3600, min: 60 };
    for (const [unit, seconds] of Object.entries(intervals)) {
      const value = Math.floor(diffInSeconds / seconds);
      if (value >= 1) return `${value}${unit}`;
    }
    return "now";
  };

  const myphone = phone?.replace(/\D/g, "");

  return (
    <>
      {/* --- COMPACT GRID CARD --- */}
      <div
        onClick={() => setIsModalOpen(true)}
        className="group relative flex flex-col bg-white border border-slate-100 rounded-2xl p-3 md:p-4 h-full transition-all hover:shadow-lg active:scale-[0.97] cursor-pointer"
      >
        {/* Top Meta */}
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-1 text-[#e25e2d] bg-orange-50 px-2 py-0.5 rounded-md">
            <Tag size={10} />
            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-tight">
              {categories?.name || "General"}
            </span>
          </div>
          <span className="text-[9px] font-bold text-slate-400 uppercase">
            {formatRelativeTimeShort(created_at)}
          </span>
        </div>

        {/* Content Section */}
        <div className="flex-1 mb-3">
          <p className="text-xs md:text-sm font-bold text-slate-800 line-clamp-3 leading-snug">
            {description || "No further details provided."}
          </p>
        </div>

        {/* Bottom Info Area */}
        <div className="mt-auto space-y-2 pt-2 border-t border-slate-50">
          <div className="flex items-center gap-1 text-slate-500">
            <MapPin size={10} className="text-red-400 shrink-0" />
            <span className="text-[9px] md:text-xs font-semibold truncate uppercase tracking-tighter">
              {location}
            </span>
          </div>

          <button
            className="w-full py-2 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 transition-colors group-hover:bg-emerald-600 group-hover:text-white"
          >
            <MessageSquare size={12} strokeWidth={3} />
            Offer Help
          </button>
        </div>
      </div>

      {/* --- RESPONSIVE MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[250] flex items-end md:items-center justify-center bg-slate-950/60 backdrop-blur-sm p-0 md:p-4">
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-lg bg-white rounded-t-3xl md:rounded-3xl overflow-hidden p-6 md:p-8"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="bg-orange-50 text-[#e25e2d] px-4 py-1.5 rounded-full flex items-center gap-2">
                  <Tag size={14} fill="currentColor" />
                  <span className="text-[11px] font-black uppercase tracking-widest">{categories?.name}</span>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-50 rounded-full text-slate-400">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4 mb-8">
                <h2 className="text-2xl font-black text-slate-900 leading-tight tracking-tight">
                  Help Request
                </h2>
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 italic font-medium text-slate-700 leading-relaxed">
                  "{description}"
                </div>
                
                <div className="flex items-center gap-4 text-slate-500 font-bold text-xs uppercase tracking-widest">
                  <div className="flex items-center gap-1.5"><MapPin size={14} className="text-red-400" /> {location}</div>
                  <div className="flex items-center gap-1.5"><Clock size={14} className="text-slate-400" /> {formatRelativeTimeShort(created_at)} ago</div>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <a
                  href={`https://wa.me/${myphone}`}
                  target="_blank"
                  className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all"
                >
                  <Phone size={18} fill="currentColor" />
                  Chat via WhatsApp
                </a>
                <div className="flex items-center justify-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                  <ShieldCheck size={12} /> Secure communication
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default RequestCard;