"use client";
import Image from "next/image";
import { MapPin, Phone, X, Heart,ChevronRight,ArrowRight} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function ItemCard({ item }) {
  // 1. Local state initialized from Props
  const [isBookmarked, setIsBookmarked] = useState(item.is_bookmarked || false);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [issold, setisSold] = useState(item.is_sold || false);

  
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
      year: 31536000,
      month: 2592000,
      day: 86400,
      hour: 3600,
      minute: 60,
    };
    for (const [unit, seconds] of Object.entries(intervals)) {
      const value = Math.floor(diffInSeconds / seconds);
      if (value >= 1) return `${value} ${unit}${value > 1 ? "s" : ""} ago`;
    }
    return "Just now";
  };

  const formatCost = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  };

  const cleanPhoneNumber = item.phone_number?.replace(/\D/g, "");

 async function handleReserveItem() {
  const newStatus = !issold;

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError) {
    alert("Please log in to reserve items.");
    return;
  }

 
  const { data: updatedData, error: updateError } = await supabase
    .from("items")
    .update({ 
      is_sold: newStatus, 
      reserved_by: newStatus ? user.id : null 
    })
    .eq("id", item.id)
    .single();

  if (updateError) {
    alert("Error updating item: " + updateError.message);
    return;
  }

  setisSold(newStatus);

  
  if (newStatus && updatedData?.owner?.email) {
    sendReservationEmail(updatedData.owner.email, updatedData.title);
  }
}

  const toggleBookmark = async (e) => {
    if (e) e.stopPropagation(); // Prevents opening the modal
    if (loading) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      alert("Please log in to bookmark items");
      return;
    }

    setLoading(true);
    try {
      if (isBookmarked) {
        const { error } = await supabase
          .from("bookmarks")
          .delete()
          .eq("item_id", item.id)
          .eq("user_id", user.id);
        if (!error) setIsBookmarked(false);
      } else {
        const { error } = await supabase
          .from("bookmarks")
          .insert({ item_id: item.id, user_id: user.id });
        if (!error) setIsBookmarked(true);
      }
    } catch (e) {
      console.error("Bookmark error:", e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
<div
    onClick={() => setIsModalOpen(true)}
    className="group relative flex flex-col bg-white rounded-[1.5rem] p-3 border border-slate-100 shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 cursor-pointer"
  >
    {/* Image Container with Soft Rounded Corners */}
    <div className="relative h-64 w-full overflow-hidden rounded-[1.25rem] bg-slate-50">
      <Image
        src={item.image_url || "/api/placeholder/400/320"}
        alt={item.name || "Marketplace item"}
        fill
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      />

      {/* Modern Status Overlay */}
      {issold && (
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[4px] flex flex-col items-center justify-center animate-in fade-in duration-300">
          <div className="px-5 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
            <span className="text-white font-bold text-xs uppercase tracking-[0.2em]">
              Reserved
            </span>
          </div>
        </div>
      )}

      {/* Elevated Bookmark Button */}
      <button
        onClick={toggleBookmark}
        disabled={loading}
        className={`absolute top-4 right-4 z-10 p-2.5 rounded-full backdrop-blur-xl transition-all duration-300 active:scale-90 ${
          isBookmarked
            ? "bg-[#e25e2d] text-white shadow-[0_8px_20px_-6px_rgba(226,94,45,0.6)]"
            : "bg-white/70 text-slate-900 hover:bg-white border border-white/20"
        }`}
      >
        <Heart size={18} className={isBookmarked ? "fill-current" : ""} />
      </button>

      {/* Floating Price Tag */}
      <div className="absolute bottom-4 left-4 px-4 py-2 bg-slate-900/80 backdrop-blur-lg rounded-2xl border border-white/10 shadow-lg">
        <span className="font-black text-white text-sm tracking-tight">
          {formatCost(item.cost)}
        </span>
      </div>
    </div>

    {/* Info Section */}
    <div className="px-2 pt-5 pb-2">
      <div className="flex justify-between items-start gap-2">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-tight group-hover:text-[#e25e2d] transition-colors">
            {item.name || item.description?.substring(0, 20)}
          </h3>
          <div className="flex items-center gap-1.5 text-slate-500">
            <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">
              <MapPin size={10} className="text-[#f3a552]" />
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-wider">{item.location}</span>
          </div>
        </div>
        
        {/* Subtle 'View Details' indicator visible on hover */}
        <div className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300 bg-[#e25e2d]/10 p-2 rounded-full">
          <ArrowRight size={16} className="text-[#e25e2d]" />
        </div>
      </div>
    </div>
  </div>


{isModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-8 bg-slate-950/60 backdrop-blur-md animate-in fade-in zoom-in-95 duration-300">
    <div className="relative w-full max-w-6xl overflow-hidden rounded-[1rem] bg-white shadow-[0_32px_64px_-15px_rgba(0,0,0,0.3)] flex flex-col md:flex-row h-full max-h-[90vh] md:h-auto">
      
      {/* 1. VISUAL SHOWCASE (Left) */}
      <div className="relative md:w-3/5 bg-[#f8f9fa] flex items-center justify-center overflow-hidden">
        {/* Soft radial gradient to give image depth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/40 to-transparent" />
        
        <div className="relative w-full h-full min-h-[350px] group">
          <Image
            src={item.image_url || "/api/placeholder/400/320"}
            alt={item.name || "item image"}
            fill
            className="object-contain p-6 md:p-12 transition-all duration-700 group-hover:scale-105"
            priority
          />
        </div>

        {/* Floating Contextual Pills */}
        <div className="absolute top-8 left-8 flex flex-col gap-3">
          <div className="px-5 py-2.5 rounded-[1rem] bg-white/90 backdrop-blur-xl shadow-xl shadow-slate-200/50 border border-white flex items-center gap-2">
             <div className="w-2 h-2 rounded-[1rem] bg-[#e25e2d] animate-pulse" />
             <span className="text-[#e25e2d] text-[11px] font-black uppercase tracking-[0.15em]">
                {item.category || "Discovery"}
             </span>
          </div>
        </div>

        {/* High-Impact Status Overlay */}
        {issold && (
          <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[3px] flex items-center justify-center">
             <div className="bg-white px-12 py-5 rounded-[1rem] shadow-2xl transform -rotate-2 border-b-8 border-red-500">
                <span className="text-slate-900 font-black text-2xl tracking-tighter uppercase">Already Claimed</span>
             </div>
          </div>
        )}
      </div>

      {/* 2. PRODUCT INTELLIGENCE (Right) */}
      <div className="md:w-2/5 flex flex-col bg-white">
        {/* Header with improved hierarchy */}
        <div className="px-8 pt-10 pb-6 md:px-12">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
                {item.name}
              </h3>
              <div className="flex items-center gap-3 text-slate-400">
                <div className="flex items-center gap-1">
                  <MapPin size={14} className="text-[#f3a552]" />
                  <span className="text-xs font-bold uppercase tracking-wider">{item.location}</span>
                </div>
                <span className="text-slate-200">•</span>
                <span className="text-xs font-medium">{formatRelativeTime(item.created_at)}</span>
              </div>
            </div>
            
            <button
              onClick={() => setIsModalOpen(false)}
              className="group p-3 rounded-1xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all duration-300"
            >
              <X size={22} className="group-hover:rotate-90 transition-transform" />
            </button>
          </div>
        </div>

        {/* Scrollable details */}
        <div className="flex-1 px-8 md:px-12 overflow-y-auto no-scrollbar space-y-8">
          <div className="p-6 rounded-[1rem] bg-slate-50/50 border border-slate-100 italic text-slate-600 leading-relaxed relative">
            <span className="absolute -top-3 left-6 px-3 bg-white text-[10px] font-black text-slate-300 uppercase tracking-widest">Seller's Note</span>
            "{item.description}"
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="px-6 py-4 rounded-[1rem] bg-white border border-slate-100 shadow-sm flex flex-col justify-center">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Quality</span>
              <span className="font-bold text-slate-800 text-sm">Excellent</span>
            </div>
            <div className="px-6 py-4 rounded-[1rem] bg-white border border-slate-100 shadow-sm flex flex-col justify-center">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Availability</span>
              <span className="font-bold text-slate-800 text-sm">Immediate</span>
            </div>
          </div>
        </div>

        {/* 3. CONSOLIDATED ACTION FOOTER */}
        <div className="p-8 md:p-10 mt-6 bg-gradient-to-t from-slate-50 to-white border-t border-slate-100 rounded-b-[1rem]">
          <div className="flex flex-col gap-6">
            <div className="flex items-end justify-between">
               <div className="space-y-0.5">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Contribution</p>
                 <p className="text-4xl font-black text-slate-900 tracking-tighter">
                   {formatCost(item.cost)}
                 </p>
               </div>
               <div className="text-right">
                  <span className="inline-block px-3 py-1 rounded-lg bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-wider">
                    Verified Item
                  </span>
               </div>
            </div>

            <div className="flex gap-3">
              <a
                href={`https://wa.me/${cleanPhoneNumber}`}
                className="flex items-center justify-center p-5 rounded-[1rem]  border-green-400 text-green-600 hover:border-b-green-600 hover:text-green-800 transition-all shadow-sm active:scale-95"
              >
                <Phone size={22} fill="currentColor"  className="opacity-110 " />
              </a>

              <button
                onClick={handleReserveItem}
                className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-[1rem] font-black text-sm cursor-pointer uppercase tracking-[0.15em] transition-all duration-300 ${
                  issold
                    ? "bg-[#e25e2d] text-white"
                    : "bg-[#e25e2d] text-white hover:bg-[#d14d1c] shadow-[0_15px_30px_-10px_rgba(226,94,45,0.4)] active:scale-[0.98]"
                }`}
              >
                {issold ? "unReserved" : "Secure item"}
                {!issold && <ChevronRight size={18} />}
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
