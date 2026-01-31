"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { usePathname  } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { useSearch } from "../../context/SearchContext";
import { Search, ShoppingCart, User,LogOut, Heart } from "lucide-react";
import Image from "next/image";


export default function DashNav() {
  const router = useRouter();
  const pathname = usePathname();
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
        {/* <Link href="/dashboard">
        <div className= "font-black text-2xl tracking-tighter text-[#e25e2d] cursor-pointer shrink-0" >
           OneHand<span className="text-[#f3a552]">.</span>
          </div>
          </Link> */}

        <div
          onClick={() => router.push("/dashboard")}
          className="relative w-16 h-10 ml-4 cursor-pointer shrink-0"
        >
          <Image
            src="/images/logo3a.png"
            alt="Logo"
            fill
            className="object-contain scale-150"
            priority
          />
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
            <Link href="/cart" className={`p-2 hover:bg-[#fae9d7]/50 cursor-pointer rounded-lg text-[#e25e2d] ${pathname === "/cart" ? "bg-[#fae9d7]/50 cursor-pointer rounded-lg text-[#e25e2d]" : null} `}><ShoppingCart size={20} /></Link>
           
            <Link href="/bookmarks" className={`p-2 hover:bg-[#fae9d7]/50 cursor-pointer rounded-lg text-[#e25e2d] ${pathname === "/bookmarks" ? "bg-[#fae9d7]/50 cursor-pointer rounded-lg text-[#e25e2d]": null }`}><Heart size={20} /></Link>
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
  <div className="absolute right-0 mt-3 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
    {/* User Header */}
    <div className="px-5 py-4 bg-slate-50/80 border-b border-slate-100">
      <p className="text-sm text-slate-900 font-medium truncate">{userInfo?.email}</p>
    </div>

    {/* Navigation Options */}
    <div className="py-1">
      <button 
        onClick={() => router.push("/profile")} 
        className="w-full flex items-center gap-3 px-5 py-3 text-sm text-slate-600 hover:bg-[#fae9d7]/40 hover:text-[#e25e2d] transition-colors"
      > 
        <User size={18} className="opacity-70" />
        <span>My Profile</span>
      </button>

      <div className="border-t border-slate-100 mt-1">
        <button 
          onClick={handleLogout} 
          className="w-full flex items-center gap-3 px-5 py-3 text-sm text-red-600 font-semibold hover:bg-red-50 transition-colors"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  </div>
)}
          </div>
        </div>
      </div>
    </div>
  );
}