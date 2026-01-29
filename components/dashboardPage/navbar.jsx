"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useSearch } from "../../context/SearchContext";
import { Search, ShoppingCart, Heart } from "lucide-react";

export default function DashNav() {
  const router = useRouter();
  const { search, setSearch, userInfo } = useSearch();
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="px-4 md:px-8 py-3 border-b border-[#fae9d7]/50 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="font-black text-2xl tracking-tighter text-[#e25e2d] cursor-pointer shrink-0" onClick={() => router.push("/dashboard")}>
          OneHand<span className="text-[#f3a552]">.</span>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex relative flex-1 max-w-xl group">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#f3a552]" />
          <input
            type="text"
            placeholder="Search for something special..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#fae9d7]/20 border border-[#fae9d7] focus:border-[#f3a552] focus:bg-white outline-none pl-12 pr-4 py-2 rounded-xl transition-all text-sm"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="flex items-center mr-2">
            <button onClick={() => router.push("/cart")} className="p-2 hover:bg-[#fae9d7]/50 cursor-pointer rounded-lg text-[#e25e2d]"><ShoppingCart size={20} /></button>
            <button onClick={() => router.push("/bookmarks")} className="p-2 hover:bg-[#fae9d7]/50 cursor-pointer rounded-lg text-[#e25e2d]"><Heart size={20} /></button>
          </div>

          <div className="hidden sm:flex items-center gap-2 border-l border-[#fae9d7] pl-4 mr-2">
            <button onClick={() => router.push("/bundle-request")} className="px-3 py-2 text-[11px] font-black uppercase cursor-pointer rounded-lg border border-[#e25e2d] text-[#e25e2d]">Request Bundle</button>
            <button onClick={() => router.push("/donate")} className="px-3 py-2 text-[11px] font-black uppercase rounded-lg cursor-pointer bg-[#e25e2d] text-white">+ Add Item</button>
          </div>

          {/* User Dropdown */}
          <div className="relative">
            <button onClick={() => setShowUserDropdown(!showUserDropdown)} className="w-9 h-9 rounded-full bg-[#fae9d7] text-[#e25e2d] cursor-pointer font-bold flex items-center justify-center border border-white uppercase">
              {userInfo?.user_metadata?.full_name?.[0] || userInfo?.email?.[0] || "U"}
            </button>
            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-60 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
                <div className="px-4 py-3 bg-slate-50/50 border-b border-slate-100">
                  <p className="text-sm text-slate-700 font-semibold truncate">{userInfo?.email}</p>
                </div>
                <button onClick={() => router.push("/profile")} className="w-full text-left px-4 py-2.5 text-sm hover:bg-[#fae9d7]/30">My Profile</button>
                <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-red-500 font-bold border-t">Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}