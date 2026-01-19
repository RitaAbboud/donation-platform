"use client";
import Image from "next/image";
import { MapPin, Phone, Clock, X, ExternalLink, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function ItemCard({ item }) {
  // 1. Local state initialized from Props
  const [isBookmarked, setIsBookmarked] = useState(item.is_bookmarked || false);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [issold, setisSold] = useState(item.is_sold || false);

  // 2. CRITICAL: Update local state if the Dashboard re-fetches data
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
  const {
    data: { user },
  } = await supabase.auth.getUser();

    if (error) {
      alert("Error: " + error.message);
    } else {
      setisSold(newStatus);
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
        className="group relative flex flex-col bg-white rounded-xl p-2 border border-[#fae9d7] hover:border-[#e25e2d] hover:shadow-xl transition-all duration-300 cursor-pointer"
      >
        <div className="relative h-60 w-full overflow-hidden rounded-lg bg-[#fff7f0]">
          <Image
            src={item.image_url || "/api/placeholder/400/320"}
            alt="Item"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {issold && (
            <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center backdrop-blur-[2px]">
              <span className="bg-white text-slate-900 px-6 py-2 rounded-md font-bold text-sm uppercase border-b-4 border-red-500">
                Reserved
              </span>
            </div>
          )}

          <button
            onClick={toggleBookmark}
            disabled={loading}
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-2xl flex flex-col md:flex-row">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 z-30 bg-white p-2 rounded-full text-slate-500 hover:text-red-500 shadow-md"
            >
              <X size={20} />
            </button>

            <div className="relative h-72 md:h-[600px] md:w-3/5">
              <Image
                src={item.image_url || "/api/placeholder/400/320"}
                alt="Detail"
                fill
                className="object-cover"
              />
            </div>

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
                  {item.name}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  {item.description}
                </p>

                <div className="space-y-3 pt-6 border-t border-slate-50">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-xs font-medium uppercase">
                      Price
                    </span>
                    <span className="text-3xl font-black text-slate-900">
                      {formatCost(item.cost)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <a
                  href={`tel:${cleanPhoneNumber}`}
                  className="flex items-center justify-between bg-slate-50 p-4 rounded-lg hover:border-[#f8d5b8] border border-transparent transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Phone size={18} className="text-[#e25e2d]" />
                    <span className="font-bold text-slate-700 text-sm">
                      {item.phone_number}
                    </span>
                  </div>
                  <ExternalLink size={16} className="text-slate-400" />
                </a>

                <button
                  onClick={handleReserveItem}
                  className={`w-full py-4 rounded-lg font-bold text-sm uppercase tracking-widest transition-all ${
                    issold
                      ? "bg-red-600 text-white shadow-lg"
                      : "bg-[#e25e2d] text-white shadow-lg"
                  }`}
                >
                  {issold ? "UnReserve" : "Reserve Item"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
