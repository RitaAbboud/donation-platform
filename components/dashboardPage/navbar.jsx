"use client";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useSearch } from "../../context/SearchContext";
import { Search, ShoppingCart, Heart, User, LogOut, Package, X, Plus, ChevronDown } from "lucide-react";
import Image from "next/image";

export default function DashNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { search, setSearch, userInfo } = useSearch();
  
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showAddDropdown, setShowAddDropdown] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartWiggling, setIsCartWiggling] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowUserDropdown(false);
      setShowAddDropdown(false);
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  // Fetch Cart Count
  useEffect(() => {
    async function fetchCartCount() {
      if (!userInfo?.id) return;
      const { count } = await supabase
        .from("items").select("*", { count: 'exact', head: true })
        .eq("reserved_by", userInfo.id).eq("is_sold", true);
      if (count !== null) setCartCount(count);
    }
    fetchCartCount();
  }, [userInfo]);

  // Listen for Cart Events
  useEffect(() => {
    const handleCartNotify = () => {
      setIsCartWiggling(false);
      setTimeout(() => { setIsCartWiggling(true); setCartCount(prev => prev + 1); }, 10);
      setTimeout(() => setIsCartWiggling(false), 500);
    };
    window.addEventListener("item-added-to-cart", handleCartNotify);
    return () => window.removeEventListener("item-added-to-cart", handleCartNotify);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-[110] w-full border-b border-[#fae9d7]/50 bg-white/90 backdrop-blur-md px-3 md:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 md:gap-4">
        
        {/* LOGO */}
        <div onClick={() => router.push("/dashboard")} className="flex items-center gap-2 cursor-pointer shrink-0">
          <div className="relative w-8 h-8 md:w-9 md:h-9">
            <Image src="/images/logo3c.png" alt="Logo" fill className="object-contain" priority />
          </div>
          <div className="font-black text-lg md:text-xl tracking-tighter text-[#171210]">
            One<span className="text-[#e25e2d]">Hand.</span>
          </div>
        </div>

        {/* DESKTOP SEARCH */}
        <div className="hidden md:flex relative flex-1 max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#e25e2d]" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#fff7f0] border border-[#fae9d7] focus:border-[#d27229] focus:bg-white outline-none pl-12 pr-4 py-2.5 rounded-2xl text-sm"
          />
        </div>

        {/* ACTION AREA */}
        <div className="flex items-center gap-1 md:gap-4">
          
          <button onClick={(e) => { e.stopPropagation(); setIsSearchOpen(true); }} className="md:hidden p-2 text-[#e25e2d]">
            <Search size={20} />
          </button>

          {/* --- NEW INTEGRATED ADD DROPDOWN --- */}
          <div className="relative">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowAddDropdown(!showAddDropdown);
                setShowUserDropdown(false);
              }}
              className="flex items-center gap-1 bg-[#e25e2d] text-white px-3 py-2 md:px-4 md:py-2.5 rounded-xl text-[11px] md:text-xs font-bold uppercase tracking-widest hover:bg-[#c94d1f] shadow-md shadow-orange-200 transition-all active:scale-95"
            >
              <Plus size={18} strokeWidth={3} className={showAddDropdown ? "rotate-45 transition-transform" : "transition-transform"} />
              <span className="hidden sm:inline">Create</span>
              <ChevronDown size={14} className={`ml-1 hidden md:block transition-transform ${showAddDropdown ? "rotate-180" : ""}`} />
            </button>

            {showAddDropdown && (
              <div className="absolute right-0 mt-3 w-48 md:w-56 bg-white border border-orange-100 rounded-2xl shadow-2xl py-2 z-[150] animate-in fade-in zoom-in-95 duration-200">
                <button 
                  onClick={() => router.push("/donate")}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#e25e2d] transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-[#e25e2d]">
                    <Plus size={18} />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="font-bold text-xs uppercase tracking-tight">Add Item</span>
                    <span className="text-[10px] text-gray-400">List something new</span>
                  </div>
                </button>
                
                <button 
                  onClick={() => router.push("/bundle-request")}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#e25e2d] transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                    <Package size={18} />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="font-bold text-xs uppercase tracking-tight">Request</span>
                    <span className="text-[10px] text-gray-400">Ask for a bundle</span>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* ICONS GROUP */}
          <div className="flex items-center border-l border-gray-100 pl-1 md:pl-2">
            <Link href="/bookmarks" className="p-2 text-gray-400 hover:text-[#e25e2d]">
              <Heart size={20} />
            </Link>

            <Link href="/cart" className="relative p-2 text-gray-400 hover:text-[#e25e2d]">
              <ShoppingCart size={20} className={isCartWiggling ? "animate-bounce text-[#e25e2d]" : ""} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#e25e2d] text-[8px] font-bold text-white border-2 border-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* USER PROFILE */}
          <div className="relative">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowUserDropdown(!showUserDropdown);
                setShowAddDropdown(false);
              }}
              className="w-8 h-8 md:w-10 md:h-10 rounded-full md:rounded-xl bg-[#fff7f0] text-[#e25e2d] text-xs font-bold flex items-center justify-center border-2 border-bg-[#e25e2d] shadow-sm"
            >
              {userInfo?.email?.[0].toUpperCase() || "U"}
            </button>
            
            {showUserDropdown && (
              <div className="absolute right-0 mt-3 w-48 md:w-56 bg-white border border-gray-100 rounded-2xl shadow-2xl py-2 z-[150] animate-in fade-in zoom-in-95 duration-200">
                <div className="px-4 py-2 bg-gray-50/50 border-b mb-1">
                  <p className="text-[9px] font-bold text-gray-400 uppercase">Account</p>
                  <p className="text-xs font-semibold text-gray-700 truncate">{userInfo?.email}</p>
                </div>
                <button onClick={() => router.push("/profile")} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-orange-50">
                  <User size={16} /> Profile
                </button>
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 font-bold hover:bg-red-50">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE SEARCH OVERLAY */}
      {isSearchOpen && (
        <div className="absolute inset-0 bg-white z-[130] flex items-center px-4 md:hidden animate-in slide-in-from-top duration-300">
          <Search size={20} className="text-[#e25e2d]" />
          <input 
            autoFocus
            type="text" 
            placeholder="Search items..."
            className="flex-1 px-3 outline-none text-base font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={() => setIsSearchOpen(false)} className="p-2 text-gray-400">
            <X size={24} />
          </button>
        </div>
      )}
    </nav>
  );
}