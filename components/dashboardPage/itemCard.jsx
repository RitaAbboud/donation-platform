"use client";
import Image from "next/image";
import { MapPin, Phone, Clock, Bookmark, X } from "lucide-react";
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

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="group relative cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md"
      >
        {/* SOLD OVERLAY */}
        {issold && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/60 backdrop-blur-[1px]">
            <span className="rotate-12 border-4 border-red-600 px-4 py-1 text-2xl font-black text-red-600">
              SOLD
            </span>
          </div>
        )}

        <div className="relative h-48 w-full overflow-hidden bg-slate-100">
          <Image
            src={item.image_url || "/api/placeholder/400/320"}
            alt="Item image"
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleBookmark();
            }}
            className={`absolute top-2 right-2 z-30 rounded-full p-2 backdrop-blur-sm ${
              isBookmarked
                ? "bg-blue-600 text-white"
                : "bg-white/80 text-slate-600"
            }`}
          >
            <Bookmark
              className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`}
            />
          </button>
        </div>

        <div className="p-3">
          <div className="flex items-center justify-between">
            <span
              className={`text-lg font-bold ${
                issold ? "text-slate-400" : "text-green-700"
              }`}
            >
              {formatCost(item.cost)}
            </span>
            <div className="flex items-center text-[10px] text-slate-500">
              <Clock className="mr-1 h-3 w-3" />
              <span>{formatRelativeTime(item.created_at)}</span>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 z-20 rounded-full bg-white/90 p-2 text-slate-600 shadow-md hover:bg-white hover:text-red-500 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Image Section */}
            <div className="relative h-72 w-full">
              <Image
                src={item.image_url || "/api/placeholder/400/320"}
                alt="Detail"
                fill
                className="object-cover"
              />
              {issold && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="bg-white text-red-600 px-6 py-2 rounded-full font-black text-xl tracking-widest shadow-xl uppercase">
                    Reserved
                  </span>
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="p-8">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold text-slate-800 leading-tight">
                  {item.description}
                </h3>
                <span className="text-2xl font-black text-green-600">
                  {formatCost(item.cost)}
                </span>
              </div>

              {/* Info Rows */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center text-slate-600 bg-slate-50 p-3 rounded-xl">
                  <MapPin className="mr-3 h-5 w-5 text-blue-500" />
                  <span className="font-medium">{item.location}</span>
                </div>

                {/* PHONE NUMBER SECTION */}
                <a
                  href={`tel:${cleanPhoneNumber}`}
                  className="flex items-center text-blue-700 bg-blue-50 p-4 rounded-xl hover:bg-blue-100 transition-colors group"
                >
                  <Phone className="mr-3 h-5 w-5 text-blue-500 group-hover:scale-110 transition-transform" />
                  <div className="flex flex-col">
                    <span className="text-xs text-blue-500 font-semibold uppercase tracking-wider">
                      Contact Seller
                    </span>
                    <span className="text-lg font-bold">
                      {item.phone_number}
                    </span>
                  </div>
                </a>
              </div>

              {/* Action Button */}
              <button
                onClick={handleReserveItem}
                className={`w-full py-4 rounded-2xl font-bold text-lg transition-all transform active:scale-95 shadow-lg ${
                  issold
                    ? "bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-600 border-2 border-transparent hover:border-red-200"
                    : "bg-[#e25e2d] text-white hover:bg-green-700 hover:shadow-green-200"
                }`}
              >
                {issold ? "Release Reservation" : "Reserve This Item"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
