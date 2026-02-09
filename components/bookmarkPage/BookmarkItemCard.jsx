"use client";
import Image from "next/image";
import { Heart } from "lucide-react";

export default function BookmarkItemCard({ item, onUnbookmark }) {
  const formatCost = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  return (
    <div className="group relative flex bg-white rounded-xl overflow-hidden border border-[#fae9d7] hover:shadow-md transition-all duration-300 w-full max-w-md">
      {/* 1. Image on the Left */}
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 bg-[#fff7f0]">
        <Image
          src={item.image_url || "/api/placeholder/150/150"}
          alt={item.name || "Item"}
          fill
          className="object-cover"
        />
      </div>

      {/* 2. Content on the Right */}
      <div className="flex flex-col justify-between p-3 flex-1 min-w-0">
        <div>
          <div className="flex justify-between items-start gap-2">
            <span className="text-[#e25e2d] font-black text-[13px]">
              {formatCost(item.cost)}
            </span>
          </div>
          
          <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-tight">
            {item.description}
          </p>
        </div>

        {/* Footer info within the right side */}
        <div className="flex justify-between items-center mt-2">
          {item.is_sold ? (
            <span className="text-[9px] font-bold uppercase tracking-tighter text-red-500 bg-red-50 px-1.5 py-0.5 rounded">
              Reserved
            </span>
          ) : (
            <div /> // Spacer
          )}
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUnbookmark(item.id);
            }}
            className="text-[#e25e2d] opacity-60 hover:opacity-100 transition-opacity p-1"
            title="Remove Bookmark"
          >
            <Heart size={14} fill="currentColor" />
          </button>
        </div>
      </div>
    </div>
  );
}