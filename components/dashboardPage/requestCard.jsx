import React from "react";
import { Phone, MapPin, Tag, ExternalLink, Package, Clock } from "lucide-react";

const RequestCard = ({ request }) => {
  const { categories, title, description, phone, location, created_at } = request;
console.log("Full Request Object:", request);

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
        <h3 className="text-lg font-bold text-slate-800 group-hover:text-[#e25e2d] transition-colors mb-2 flex items-center gap-2">
          <Package size={18} className="text-slate-400" />
          {title || "Item Requested"}
        </h3>
        <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
          {description || "No further details provided for this request."}
        </p>
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
            <span className="text-sm font-mono font-medium text-slate-700">{phone}</span>
          </div>
        </div>
      </div>

      {/* Primary Action */}
      <button
        onClick={() => (window.location.href = `https://wa.me/${phone}`)}
        className="w-full bg-[#e25e2d] text-white py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#d14d1c] active:scale-[0.98] transition-all shadow-md shadow-slate-200"
      >
        Help with this Item
        <ExternalLink size={16} />
      </button>
    </div>
  );
};

export default RequestCard;