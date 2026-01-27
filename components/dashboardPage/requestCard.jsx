import React from "react";
import { Phone, MapPin, Tag, Package, Clock } from "lucide-react";

const RequestCard = ({ request }) => {
  const { categories, description, phone, location, created_at } = request;

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
  const myphone = phone?.replace(/\D/g, "");

  return (
    <div className="group relative bg-white border border-slate-200 rounded-3xl p-5 transition-all duration-300 hover:border-[#e25e2d]/30 hover:shadow-xl hover:shadow-slate-200/50">
      
      {/* Header: Category & Status */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 text-[#e25e2d] bg-orange-50 px-3 py-1.5 rounded-full">
          <Tag size={14} className="fill-current" />
          <span className="text-[11px] font-bold uppercase tracking-wider">
            {categories?.name || "General"}
          </span>
        </div>
        <div className="flex items-center text-slate-400 text-[11px] font-medium">
          <Clock size={12} className="mr-1" />
          {formatRelativeTime(created_at) || "Just now"}
        </div>
      </div>

      {/* Item Title & Description */}
      <div className="mb-5">
        <h2 className="text-lg font-bold text-slate-800 group-hover:text-[#e25e2d] transition-colors mb-2 flex items-center gap-2">
          <Package size={18} className="text-slate-400" />
          {description || "No further details provided for this request."}
        </h2>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 gap-3 mb-6">
        <div className="flex items-center p-2.5 rounded-2xl bg-slate-50 border border-transparent transition-colors group-hover:bg-white group-hover:border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center mr-3 text-red-500">
            <MapPin size={18} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-slate-400 leading-none mb-1">Location</span>
            <span className="text-sm font-semibold text-slate-700">{location}</span>
          </div>
        </div>

        <div className="flex items-center p-2.5 rounded-2xl bg-slate-50 border border-transparent transition-colors group-hover:bg-white group-hover:border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center mr-3 text-green-500">
            <Phone size={18} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-slate-400 leading-none mb-1">Contact</span>
            <span className="text-sm font-mono font-medium text-slate-700">{myphone}</span>
          </div>
        </div>
      </div>

<a
  href={`https://wa.me/${myphone}`}
  className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full font-bold text-sm transition-all hover:bg-emerald-600 hover:text-white shadow-sm"
>
  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
  Help with this Item
  <Phone size={16} />
</a>
    
    </div>
  );
};

export default RequestCard;