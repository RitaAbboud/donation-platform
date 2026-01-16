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
        className="group relative flex flex-col bg-white rounded-[2.5rem] p-3 border border-transparent hover:border-[#f8d5b8] hover:shadow-2xl hover:shadow-[#e25e2d]/10 transition-all duration-500 cursor-pointer"
      >
        {/* Image Section */}
        <div className="relative h-64 w-full overflow-hidden rounded-[2rem] bg-[#fff7f0]">
          <Image
            src={item.image_url || "/api/placeholder/400/320"}
            alt="Item"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Glass Price Tag */}
          <div className="absolute bottom-4 left-4 px-4 py-2 bg-white/70 backdrop-blur-md rounded-2xl shadow-sm border border-white/50">
            <span className="font-black text-[#e25e2d] text-lg">
              {formatCost(item.cost)}
            </span>
          </div>

          {/* Floating Bookmark Button */}
          <button
            onClick={toggleBookmark}
            className={`absolute top-4 right-4 z-10 rounded-2xl p-3 transition-all duration-300 ${
              isBookmarked
                ? "bg-[#e25e2d] text-white shadow-lg shadow-orange-200"
                : "bg-white/80 text-slate-600 hover:bg-white backdrop-blur-sm"
            }`}
          >
            <Heart size={20} className={isBookmarked ? "fill-current" : ""} />
          </button>

          {/* Sold Overlay */}
          {issold && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#fff7f0]/60 backdrop-blur-[2px]">
              <span className="bg-white/90 text-red-500 px-6 py-2 rounded-2xl font-black tracking-widest border-2 border-red-500 -rotate-12 shadow-xl">
                RESERVED
              </span>
            </div>
          )}
        </div>

        {/* Text Section */}
        <div className="px-3 py-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-slate-800 line-clamp-1 group-hover:text-[#e25e2d] transition-colors duration-300">
              {item.name || item.description?.substring(0, 20)}
            </h3>
          </div>

          <div className="flex items-center justify-between text-slate-500">
            <div className="flex items-center gap-1.5 bg-[#fae9d7]/50 px-3 py-1 rounded-full text-xs font-semibold text-[#e25e2d]">
              <MapPin size={14} />
              {item.location}
            </div>
            <div className="flex items-center gap-1 text-xs font-medium">
              <Clock size={14} className="text-[#f3a552]" />
              {formatRelativeTime(item.created_at)}
            </div>
          </div>
        </div>
      </div>

      {/* --- DETAIL MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#e25e2d]/10 backdrop-blur-md transition-all">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-[3rem] bg-white shadow-2xl border border-[#fae9d7] animate-in zoom-in-95 duration-300">
            {/* Close */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 z-30 rounded-2xl bg-white/90 p-3 text-slate-600 shadow-xl hover:text-red-500 transition-all hover:rotate-90"
            >
              <X size={24} />
            </button>

            <div className="flex flex-col md:flex-row">
              {/* Left side: Image */}
              <div className="relative h-80 md:h-[500px] md:w-1/2">
                <Image
                  src={item.image_url || "/api/placeholder/400/320"}
                  alt="Detail"
                  fill
                  className="object-cover"
                />
                {issold && (
                  <div className="absolute inset-0 bg-red-500/10 flex items-center justify-center">
                    <span className="bg-red-500 text-white px-8 py-3 rounded-2xl font-black text-xl shadow-2xl">
                      RESERVED
                    </span>
                  </div>
                )}
              </div>

              {/* Right side: Info */}
              <div className="p-8 md:w-1/2 flex flex-col bg-[#fff7f0]/30">
                <div className="mb-6">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#f3a552] mb-2 block">
                    {item.category || "Item Details"}
                  </span>
                  <h3 className="text-3xl font-black text-slate-800 leading-tight mb-2">
                    {item.name || "Hand-picked Item"}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-auto space-y-4">
                  <div className="flex items-end justify-between mb-4">
                    <span className="text-4xl font-black text-[#e25e2d]">
                      {formatCost(item.cost)}
                    </span>
                    <div className="flex items-center text-slate-500 text-sm italic">
                      <MapPin size={16} className="mr-1 text-[#f3a552]" />
                      {item.location}
                    </div>
                  </div>

                  <a
                    href={`tel:${cleanPhoneNumber}`}
                    className="flex items-center justify-between bg-white border-2 border-[#f8d5b8] p-4 rounded-[1.5rem] hover:bg-[#fae9d7] transition-all group"
                  >
                    <div className="flex items-center">
                      <div className="bg-[#f3a552]/20 p-2 rounded-xl mr-3 group-hover:scale-110 transition-transform">
                        <Phone size={20} className="text-[#e25e2d]" />
                      </div>
                      <span className="font-bold text-slate-700">
                        {item.phone_number}
                      </span>
                    </div>
                    <ExternalLink size={18} className="text-[#f3a552]" />
                  </a>

                  <button
                    onClick={handleReserveItem}
                    className={`w-full py-5 rounded-[1.5rem] font-black text-lg transition-all transform active:scale-95 shadow-xl ${
                      issold
                        ? "bg-slate-200 text-slate-500 hover:bg-red-50 hover:text-red-500"
                        : "bg-[#e25e2d] text-white hover:bg-[#d14d1c] shadow-orange-200"
                    }`}
                  >
                    {issold ? "Release Item" : "Reserve with Love"}
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
