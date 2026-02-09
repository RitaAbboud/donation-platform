"use client";
import Image from "next/image";
import { MapPin, Phone, X, Tag, Info, MessageCircle } from "lucide-react";
import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function CartItemCard({ item, onUnreserve }) {
  const [loading, setLoading] = useState(false);

  const cleanPhoneNumber = item.phone_number?.replace(/\D/g, "");

  // This function now handles both the Database update and the UI removal
  async function handleUnreserve() {
    setLoading(true);

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      alert("Please log in to manage your cart.");
      setLoading(false);
      return;
    }

    // Applying your logic: setting is_sold to false and removing the user ID
    const { error: updateError } = await supabase
      .from("items")
      .update({ 
        is_sold: false, 
        reserved_by: null 
      })
      .eq("id", item.id);

    if (updateError) {
      alert("Error updating database: " + updateError.message);
      setLoading(false);
      return;
    }

    // 2. Only after DB success, remove it from the UI list
    if (onUnreserve) {
      onUnreserve(item.id);
    }
    
    setLoading(false);
  }


  return (
    <div className={`group relative flex flex-col bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden ${loading ? 'opacity-60 pointer-events-none' : ''}`}>
      
      {/* IMAGE SECTION */}
      <div className="relative h-48 w-full bg-slate-50">
        <Image
          src={item.image_url || "/api/placeholder/400/320"}
                  alt={item.name || "item image"}
          fill
          className="object-cover"
        />
        <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg shadow-sm border border-white/50">
          <span className="font-bold text-[#e25e2d] text-sm">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(item.cost || 0)}
          </span>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="p-5 flex flex-col flex-1">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <Tag size={12} className="text-[#f3a552]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              {item.category || "Reserved Item"}
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 leading-tight">
            {item.name}
          </h3>
        </div>

        {/* Description */}
        <div className="flex gap-2 mb-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
          <Info size={14} className="text-[#f3a552] shrink-0 mt-0.5" />
          <p className="text-l font-bold text-slate-800 line-clamp-2  leading-relaxed">
            {item.description || "No description provided."}
          </p>
        </div>

        {/* Contact & Location */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-slate-600">
            <div className="p-2 bg-slate-100 rounded-lg">
              <MapPin size={14} className="text-slate-500" />
            </div>
            <span className="text-xs font-medium">{item.location}</span>
          </div>
          
          <a 
            href={`https://wa.me/${cleanPhoneNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-slate-700 hover:text-[#e25e2d] transition-colors group/link"
          >
            <div className="p-2 bg-green-50 rounded-lg group-hover/link:bg-green-100 transition-colors">
              <MessageCircle size={14} className="text-green-600" />
            </div>
            <span className="text-xs font-bold">{item.phone_number || "No contact info"}</span>
          </a>
        </div>

        {/* UNRESERVE BUTTON */}
        <button
          onClick={handleUnreserve}
          disabled={loading}
          className="mt-auto w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 border-red-50 text-red-500 hover:bg-red-600 font-black text-[11px] uppercase tracking-[0.1em] bg-red-500 text-white hover:border-red-00 transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <X size={16} strokeWidth={4}/>
              Cancel Reservation
            </>
          )}
        </button>
      </div>
    </div>
  );
}