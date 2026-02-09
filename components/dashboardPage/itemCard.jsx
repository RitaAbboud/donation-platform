"use client";
import Image from "next/image";
import { MapPin, Phone, X, Heart, Plus, Check, ShoppingBag, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";

export default function ItemCard({ item }) {
  const [isBookmarked, setIsBookmarked] = useState(item.is_bookmarked || false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [issold, setisSold] = useState(item.is_sold || false);
  const [isAdded, setIsAdded] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    setIsBookmarked(item.is_bookmarked);
    setisSold(item.is_sold);
  }, [item.is_bookmarked, item.is_sold]);

  const formatRelativeTime = (dateString) => {
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

  const formatCost = (amount) => {
    return amount === 0 ? "FREE" : new Intl.NumberFormat("en-US", { 
      style: "currency", currency: "USD", maximumFractionDigits: 0 
    }).format(amount);
  };

  const cleanPhoneNumber = item.phone_number?.replace(/\D/g, "");

  async function handleReserveItem(source = "card") {
    if (issold || isAdded) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { alert("Please login first"); return; }
    setIsAdded(true);
    if (source === "modal") { setShowToast(true); setTimeout(() => setShowToast(false), 3000); }
    window.dispatchEvent(new CustomEvent("item-added-to-cart", { detail: { source, itemName: item.name } }));
    const { error } = await supabase.from("items").update({ is_sold: true, reserved_by: user.id }).eq("id", item.id);
    if (error) { setIsAdded(false); alert("Error reserving item"); } else { setisSold(true); }
  }

  const toggleBookmark = async (e) => {
    if (e) e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    try {
      if (isBookmarked) await supabase.from("bookmarks").delete().eq("item_id", item.id).eq("user_id", user.id);
      else await supabase.from("bookmarks").insert({ item_id: item.id, user_id: user.id });
    } catch (e) { console.error(e); }
  };

  return (
    <>
      {/* --- TOAST --- */}
      <AnimatePresence>
        {showToast && (
          <motion.div initial={{y: -20, opacity: 0}} animate={{y: 0, opacity: 1}} exit={{y: -20, opacity: 0}} className="fixed top-20 left-1/2 -translate-x-1/2 z-[300] w-[80%] max-w-xs">
            <div className="bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center justify-center gap-2 border border-white/10">
              <Check size={14} className="text-emerald-400" strokeWidth={4} />
              <span className="text-[10px] font-black uppercase tracking-wider">Added to cart</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- CARD: Designed for 2-column grid --- */}
      <div
        onClick={() => setIsModalOpen(true)}
        className="group relative flex flex-col bg-white border border-slate-100 rounded-xl overflow-hidden transition-all hover:shadow-lg active:scale-[0.97]"
      >
        <div className="relative aspect-square w-full overflow-hidden bg-slate-50">
          <Image src={item.image_url || "/api/placeholder/400/400"} alt={item.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
          
          <div className="absolute top-1.5 left-1.5">
            <span className="bg-white/90 backdrop-blur px-1.5 py-0.5 rounded md:rounded-md text-[8px] md:text-[10px] font-black uppercase text-slate-700 shadow-sm">
              {item.category || "General"}
            </span>
          </div>

          <button onClick={toggleBookmark} className="absolute top-1.5 right-1.5 p-1.5 rounded-full bg-white/80 backdrop-blur text-slate-400">
            <Heart size={12} className={isBookmarked ? "fill-red-500 text-red-500" : ""} />
          </button>

          {issold && (
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px] flex items-center justify-center z-10">
              <span className="bg-white text-slate-900 px-2 py-1 rounded text-[9px] font-black uppercase tracking-tighter">Claimed</span>
            </div>
          )}
        </div>

        {/* Info Area: Compact for side-by-side */}
        <div className="p-2 md:p-4 flex flex-col flex-1 gap-0.5">
          <div className="flex justify-between items-start gap-1">
            <h3 className="font-bold text-slate-900 line-clamp-1 text-xs md:text-base">{item.name}</h3>
            <span className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase">{formatRelativeTime(item.created_at)}</span>
          </div>
          
          <div className="flex items-center gap-1 text-slate-400 mb-1.5">
            <MapPin size={8} className="md:size-3" />
            <span className="text-[9px] md:text-xs font-medium truncate uppercase">{item.location}</span>
          </div>

          <div className="flex items-center justify-between mt-auto">
            <p className="text-sm md:text-xl font-black text-slate-900">{formatCost(item.cost)}</p>
            
            <button
              disabled={issold || isAdded}
              onClick={(e) => { e.stopPropagation(); handleReserveItem("card"); }}
              className={`flex items-center justify-center rounded-lg transition-all 
                ${isAdded ? 'bg-emerald-500 px-2 py-1' : 'bg-slate-900 p-1.5 md:px-3 md:py-2 hover:bg-orange-600'}
                ${issold && !isAdded ? 'hidden' : 'flex'}`}
            >
              {isAdded ? (
                <Check size={12} strokeWidth={4} className="text-white" />
              ) : (
                <><Plus size={12} strokeWidth={4} className="text-white" /><span className="hidden md:inline ml-1 text-[10px] font-black uppercase text-white">Secure</span></>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* --- MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center bg-slate-950/60 backdrop-blur-sm p-0 md:p-4">
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-4xl bg-white rounded-t-3xl md:rounded-3xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
            >
              <div className="relative w-full md:w-1/2 aspect-square md:aspect-auto bg-slate-50">
                <Image src={item.image_url || "/api/placeholder/400/400"} alt={item.name} fill className="object-cover md:object-contain" />
                <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 p-2 rounded-full bg-black/20 text-white md:hidden"><X size={20}/></button>
              </div>

              <div className="w-full md:w-1/2 flex flex-col p-6 md:p-10 overflow-y-auto">
                <div className="hidden md:flex justify-end mb-4">
                  <button onClick={() => setIsModalOpen(false)} className="text-slate-300 hover:text-slate-600"><X size={24} /></button>
                </div>
                
                <div className="mb-4">
                  <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest block mb-1">Posted {formatRelativeTime(item.created_at)} ago</span>
                  <h2 className="text-2xl md:text-4xl font-black text-slate-900 leading-tight mb-1">{item.name}</h2>
                  <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] md:text-xs uppercase">
                    <MapPin size={14} /> {item.location}
                  </div>
                </div>

                <div className="mb-8 p-4 rounded-xl bg-slate-50 text-slate-600 text-sm font-medium leading-relaxed italic">
                  "{item.description}"
                </div>

                <div className="mt-auto">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-3xl font-black text-slate-900">{formatCost(item.cost)}</p>
                    <a href={`https://wa.me/${cleanPhoneNumber}`} target="_blank" className="p-3 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-all"><Phone size={20} fill="currentColor" /></a>
                  </div>
                  <button onClick={() => handleReserveItem("modal")} disabled={issold || isAdded}
                    className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all 
                      ${(issold || isAdded) ? "bg-slate-100 text-slate-400" : "bg-orange-600 text-white shadow-xl shadow-orange-100"}`}>
                    {(issold || isAdded) ? "Successfully Secured" : "Secure this Item"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}