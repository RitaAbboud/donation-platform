"use client";
import Image from "next/image";
import { MapPin, Phone, X, Heart, Plus, Check, ShoppingBag, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function ItemCard({ item }) {
  const [isBookmarked, setIsBookmarked] = useState(item.is_bookmarked || false);
  const [loading, setLoading] = useState(false);
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
    const intervals = {
      year: 31536000, month: 2592000, day: 86400, hour: 3600, minute: 60,
    };
    for (const [unit, seconds] of Object.entries(intervals)) {
      const value = Math.floor(diffInSeconds / seconds);
      if (value >= 1) return `${value} ${unit}${value > 1 ? "s" : ""} ago`;
    }
    return "Just now";
  };

  const formatCost = (amount) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount || 0);
  };

  const cleanPhoneNumber = item.phone_number?.replace(/\D/g, "");

  async function handleReserveItem(source = "card") {
    if (issold || isAdded) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { alert("Please login first"); return; }

    setIsAdded(true);
    if (source === "modal") {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }

    const event = new CustomEvent("item-added-to-cart", { 
      detail: { source, itemName: item.name } 
    });
    window.dispatchEvent(event);

    const { error } = await supabase
      .from("items")
      .update({ is_sold: true, reserved_by: user.id })
      .eq("id", item.id);

    if (error) {
      setIsAdded(false);
      setShowToast(false);
      alert("Error reserving item");
    } else {
      setisSold(true);
    }
  }

  const toggleBookmark = async (e) => {
    if (e) e.stopPropagation();
    if (loading) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert("Please log in to bookmark items");
    setLoading(true);
    try {
      if (isBookmarked) {
        await supabase.from("bookmarks").delete().eq("item_id", item.id).eq("user_id", user.id);
        setIsBookmarked(false);
      } else {
        await supabase.from("bookmarks").insert({ item_id: item.id, user_id: user.id });
        setIsBookmarked(true);
      }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  return (
    <>
      {/* TOASTER */}
      {showToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-top-full duration-500">
          <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10">
            <div className="bg-emerald-500 p-1 rounded-full"><Check size={14} strokeWidth={4} /></div>
            <span className="text-sm font-bold"> added to cart!</span>
          </div>
        </div>
      )}

      {/* ITEM CARD */}
      <div
        onClick={() => setIsModalOpen(true)}
        className="group relative flex flex-col cursor-pointer bg-white border border-slate-200 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:border-orange-200"
      >
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-100">
          <Image src={item.image_url || "/api/placeholder/400/320"} alt={item.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
          
          <div className="absolute top-3 left-5 flex flex-col gap-2">
            <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider text-slate-700 shadow-sm border border-slate-100">
              {item.category || "General"}
            </span>

          </div>

          <button onClick={toggleBookmark} className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur shadow-sm border border-slate-100 text-slate-400 hover:text-orange-600 transition-all active:scale-90">
            <Heart size={14} className={isBookmarked ? "fill-orange-600 text-orange-600" : ""} />
          </button>
          {issold && (
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center z-10">
              <span className="bg-white text-slate-900 px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest shadow-xl">Claimed</span>
            </div>
          )}
        </div>

        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-bold text-slate-900 line-clamp-1 text-lg group-hover:text-orange-600 transition-colors mb-1">{item.name}</h3>
          <div className="flex items-center gap-1 text-slate-500 mb-4">
            <MapPin size={12} /> <span className="text-xs font-medium">{item.location}</span>
          </div>
          <div className="mt-auto flex items-center justify-between gap-2">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Value</p>
              <p className="text-xl font-black text-slate-900 leading-none">{item.cost === 0 ? "FREE" : formatCost(item.cost)}</p>
            </div>
            <button 
              disabled={issold || isAdded} 
              onClick={(e) => { e.stopPropagation(); handleReserveItem("card"); }} 
              className={`relative h-7 transition-all duration-500 rounded-2xl flex items-center justify-center shadow-lg active:scale-95
                ${isAdded ? 'w-28 bg-emerald-500 shadow-emerald-200 cursor-default' : 'w-8 bg-orange-600 hover:bg-orange-500 cursor-pointer shadow-slate-200'}
                ${issold && !isAdded ? 'opacity-0 scale-50 pointer-events-none' : 'opacity-100'}`}
            >
              <div className={`flex items-center gap-2 transition-all duration-300 ${isAdded ? 'opacity-100 scale-100' : 'opacity-0 scale-50 absolute'}`}>
                <Check size={16} strokeWidth={4} className="text-white" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white">Secure</span>
              </div>
              <div className={`transition-all duration-300 ${!isAdded ? 'opacity-100 scale-100' : 'opacity-0 scale-150 absolute'}`}>
                <Plus size={17} strokeWidth={4} className="text-white" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* MODAL SECTION */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 md:p-8 bg-slate-950/60 backdrop-blur-md animate-in fade-in zoom-in-95 duration-300">
          <div className="relative w-full max-w-6xl overflow-hidden rounded-[2rem] bg-white shadow-2xl flex flex-col md:flex-row h-full max-h-[90vh] md:h-auto">
            <div className="relative md:w-3/5 bg-slate-50 flex items-center justify-center overflow-hidden">
              <Image src={item.image_url || "/api/placeholder/400/320"} alt={item.name} fill className="object-contain p-6 md:p-12" />
              {issold && (
                <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[3px] flex items-center justify-center">
                  <div className="bg-white px-12 py-5 rounded-2xl shadow-2xl transform -rotate-2 border-b-8 border-orange-500">
                    <span className="text-slate-900 font-black text-2xl tracking-tighter uppercase">Already Claimed</span>
                  </div>
                </div>
              )}
            </div>

            <div className="md:w-2/5 flex flex-col bg-white">
              <div className="px-8 pt-10 pb-6 md:px-12 flex justify-between items-start">
                <div className="space-y-1">
                  {/* MODAL DATE POSTED */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-3 ">
                        <Clock size={12} className="text-orange-500" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                           {formatRelativeTime(item.created_at)}
                        </span>
                    </div>
                  </div>
                  <h3 className="text-4xl font-black text-slate-900 tracking-tight leading-none">{item.name}</h3>
                  <div className="flex items-center gap-3 text-slate-400">
                    <MapPin size={14} className="text-orange-400" /> <span className="text-xs font-bold uppercase tracking-wider">{item.location}</span>
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-3 rounded-2xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all"><X size={22} /></button>
              </div>

              <div className="flex-1 px-8 md:px-12 overflow-y-auto space-y-8">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Description</p>
                <div className="p-6 rounded-2xl bg-slate-50/50 font-bold text-slate-800">{item.description}</div>
              </div>

              <div className="p-8 md:p-10 mt-6 bg-slate-50/50 border-t border-slate-100">
                <div className="flex flex-col gap-6">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Contribution</p>
                    <p className="text-4xl font-black text-slate-900 tracking-tighter">{formatCost(item.cost)}</p>
                  </div>
                  <div className="flex gap-3">
                    <a href={`https://wa.me/${cleanPhoneNumber}`} target="_blank" className="p-5 rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-all active:scale-95"><Phone size={22} fill="currentColor" /></a>
                    <button
                      onClick={() => handleReserveItem("modal")}
                      disabled={issold || isAdded}
                      className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300 ${
                        (issold || isAdded) ? "bg-emerald-500 text-white cursor-default" : "bg-orange-600 text-white hover:bg-orange-700 shadow-xl"
                      }`}
                    >
                      { (issold || isAdded) ? <><Check size={18} /> Secure Item</> : <><ShoppingBag size={18} /> Secure Item</> }
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}