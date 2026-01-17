"use client";
import Image from "next/image";
import { MapPin, Phone, Clock, X, ExternalLink,Heart } from "lucide-react";
import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function ItemCard({ item }) {
  console.log("Card received item:", item);
  const [isBookmarked, setIsBookmarked] = useState(item.is_bookmarked || false);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [issold, setisSold] = useState(item.is_sold || false);

  const formatRelativeTime = (dateString) => {
    if (!dateString) return "";
    const now = new Date();
    const postedDate = new Date(dateString);
    const diffInSeconds = Math.floor((now - postedDate) / 1000);
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
      second: 1,
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
    const { error } = await supabase
      .from("items")
      .update({ is_sold: newStatus })
      .eq("id", item.id);

    if (error) {
      alert("Error: " + error.message);
    } else {
      setisSold(newStatus);
      setIsModalOpen(false);
    }
  }

  const toggleBookmark = async () => {
    if (loading) return;
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      alert("Please log in");
      return;
    }
    setLoading(true);
    try {
      if (isBookmarked) {
        await supabase
          .from("bookmarks")
          .delete()
          .eq("item_id", item.id)
          .eq("user_id", user.id);
        setIsBookmarked(false);
      } else {
        await supabase
          .from("bookmarks")
          .insert({ item_id: item.id, user_id: user.id });
        setIsBookmarked(true);
      }
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  // inside ItemCard component...
return (
    <>
      {/* --- GRID CARD --- */}
      <div
        onClick={() => setIsModalOpen(true)}
        className="group relative flex flex-col bg-white rounded-xl p-2 border border-[#fae9d7] hover:border-[#e25e2d] hover:shadow-xl transition-all duration-300 cursor-pointer"
      >
        <div className="relative h-60 w-full overflow-hidden rounded-lg bg-[#fff7f0]">
          <Image
            src={item.image_url || "/api/placeholder/400/320"}
            alt="Item"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Floating Bookmark Button */}
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevents opening the modal when clicking the heart
              toggleBookmark();
            }}
            className={`absolute top-3 right-3 z-10 p-2.5 rounded-lg backdrop-blur-md transition-all duration-300 ${
              isBookmarked
                ? "bg-[#e25e2d] text-white shadow-lg"
                : "bg-white/80 text-slate-600 hover:bg-white"
            }`}
          >
            <Heart size={18} className={isBookmarked ? "fill-current" : ""} />
          </button>

          <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-md shadow-sm">
            <span className="font-bold text-[#e25e2d] text-base">
              {formatCost(item.cost)}
            </span>
          </div>
        </div>

        <div className="px-2 py-3">
          <h3 className="text-lg font-bold text-slate-800 line-clamp-1 group-hover:text-[#e25e2d] transition-colors">
            {item.name || item.description?.substring(0, 20)}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-slate-500 text-xs">
            <MapPin size={12} className="text-[#f3a552]" />
            <span>{item.location}</span>
          </div>
        </div>
      </div>

      {/* --- MODERNIZED DETAIL DIALOG --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity">
          <div className="relative w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header Actions (Close & Bookmark) */}
            <div className="absolute top-4 right-4 z-30 flex gap-2">
              <button
                onClick={toggleBookmark}
                className={`rounded-full p-2 transition-all ${
                  isBookmarked 
                  ? "bg-[#e25e2d] text-white" 
                  : "bg-white text-slate-500 hover:text-[#e25e2d] shadow-md"
                }`}
              >
                <Heart size={20} className={isBookmarked ? "fill-current" : ""} />
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-full bg-white p-2 text-slate-500 hover:bg-red-50 hover:text-red-500 shadow-md transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col md:flex-row h-full">
              {/* Image Section */}
              <div className="relative h-72 md:h-[600px] md:w-3/5 bg-slate-100">
                <Image
                  src={item.image_url || "/api/placeholder/400/320"}
                  alt="Detail"
                  fill
                  className="object-cover"
                />
                {issold && (
                  <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center backdrop-blur-[2px]">
                    <span className="bg-white text-slate-900 px-6 py-2 rounded-md font-bold text-sm tracking-widest uppercase border-b-4 border-red-500">
                      Reserved
                    </span>
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="p-8 md:w-2/5 flex flex-col justify-between border-l border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-2 py-1 rounded bg-[#fff7f0] text-[#e25e2d] text-[10px] font-black uppercase tracking-wider">
                      {item.category || "General"}
                    </span>
                    <span className="text-slate-400 text-[10px] font-medium flex items-center gap-1">
                      <Clock size={10} /> {formatRelativeTime(item.created_at)}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 leading-tight mb-4">
                    {item.name || "Hand-picked Item"}
                  </h3>
                  
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    {item.description}
                  </p>

                  <div className="space-y-3 pt-6 border-t border-slate-50">
                     <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-xs font-medium uppercase tracking-tight">Price</span>
                        <span className="text-3xl font-black text-slate-900">
                          {formatCost(item.cost)}
                        </span>
                     </div>
                     <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-xs font-medium uppercase tracking-tight">Location</span>
                        <span className="text-slate-700 text-sm font-semibold flex items-center gap-1">
                          <MapPin size={14} className="text-[#f3a552]" /> {item.location}
                        </span>
                     </div>
                  </div>
                </div>

                <div className="mt-8 space-y-3">
                  <a
                    href={`tel:${cleanPhoneNumber}`}
                    className="flex items-center justify-between bg-slate-50 p-4 rounded-lg hover:bg-[#fae9d7]/30 transition-all border border-transparent hover:border-[#f8d5b8]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-white p-2 rounded-md shadow-sm">
                        <Phone size={18} className="text-[#e25e2d]" />
                      </div>
                      <span className="font-bold text-slate-700 text-sm tracking-tight">
                        {item.phone_number}
                      </span>
                    </div>
                    <ExternalLink size={16} className="text-slate-400" />
                  </a>

                  <button
                    onClick={handleReserveItem}
                    className={`w-full py-4 rounded-lg font-bold text-sm uppercase tracking-widest transition-all ${
                      issold
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                        : "bg-[#e25e2d] text-white hover:bg-[#d14d1c] shadow-lg hover:shadow-[#e25e2d]/20"
                    }`}
                  >
                    {issold ? "Item Reserved" : "Reserve Item"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
