"use client";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useSearch } from "../../context/SearchContext";
import { Search, ShoppingCart, User, LogOut, Heart } from "lucide-react";
import Image from "next/image";

export default function DashNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { search, setSearch, userInfo } = useSearch();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  
  // ANIMATION & COUNTER STATE
  const [isCartWiggling, setIsCartWiggling] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Sync initial cart count from Supabase (Optional but recommended)
  useEffect(() => {
    async function fetchCartCount() {
      if (!userInfo?.id) return;
      const { count } = await supabase
        .from("items")
        .select("*", { count: 'exact', head: true })
        .eq("reserved_by", userInfo.id)
        .eq("is_sold", true);
      
      if (count !== null) setCartCount(count);
    }
    fetchCartCount();
  }, [userInfo]);

useEffect(() => {
  const handleCartNotify = (event) => {
    // Determine the source from the event detail
    const source = event.detail?.source || "card";

    // 1. Reset wiggle state
    setIsCartWiggling(false);

    // 2. Trigger wiggle & count update
    setTimeout(() => {
      setIsCartWiggling(true);
      setCartCount(prev => prev + 1);
    }, 10);

    // 3. Stop wiggle after animation
    setTimeout(() => setIsCartWiggling(false), 500);
  };

  window.addEventListener("item-added-to-cart", handleCartNotify);
  return () => window.removeEventListener("item-added-to-cart", handleCartNotify);
}, []);
  
  async function  handleLogout  (){
     await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <div className="px-4 md:px-8 py-3 border-b border-[#fae9d7]/50 bg-white/80 backdrop-blur-md sticky top-0 z-[110]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* LOGO */}
        <div onClick={() => router.push("/dashboard")} className="flex items-center gap-2 cursor-pointer shrink-0">
          <div className="relative w-10 h-10">
            <Image src="/images/logo3d.png" alt="Logo" fill className="object-contain" priority />
          </div>
          <div className="font-black text-2xl tracking-tighter text-[#171210]">
            One<span className="text-[#e7782e]">Hand.</span>
          </div>
        </div>

        {/* SEARCH */}
        <div className="hidden md:flex relative flex-1 max-w-xl group">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#e25e2d]" />
          <input
            type="text"
            placeholder="Search for something special..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#fff7f0] border border-[#fae9d7] focus:border-[#d27229] focus:bg-white outline-none pl-12 pr-4 py-2 rounded-xl transition-all text-sm"
          />
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="flex items-center mr-2">
            
            {/* CART ICON WITH COUNTER */}
            <Link 
              href="/cart" 
              className={`relative p-2 transition-all duration-300 rounded-lg group
                ${isCartWiggling ? "scale-110" : "scale-100"}
                ${pathname === "/cart" ? "bg-[#fae9d7]/50 text-[#e25e2d]" : "hover:bg-[#fae9d7]/50 text-[#e25e2d]"}
              `}
            >
               <ShoppingCart 
              size={20} 
              className={isCartWiggling ? "animate-cart-pop text-[#e7782e]" : "transition-colors"} 
            />
              
              {/* THE COUNTER BADGE */}
              {cartCount > 0 && (
                <span className={`absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#e7782e] text-[10px] font-bold text-white border-2 border-white transition-all duration-300
                  ${isCartWiggling ? "scale-150 bg-orange-400" : "scale-100"}
                `}>
                  {cartCount}
                </span>
              )}
            </Link>

            <Link href="/bookmarks" className={`p-2 hover:bg-[#fae9d7]/50 rounded-lg text-[#e25e2d] ${pathname === "/bookmarks" ? "bg-[#fae9d7]/50" : ""}`}>
              <Heart size={20} />
            </Link>
          </div>

          {/* BUTTONS */}
          <div className="hidden sm:flex items-center gap-2 border-l border-[#fae9d7] pl-4 mr-2">
            <button onClick={() => router.push("/bundle-request")} className="px-3 py-2 text-[11px] font-black uppercase cursor-pointer rounded-lg border border-[#e25e2d] text-[#e25e2d] hover:bg-[#e25e2d]/5 transition-colors">Request Bundle</button>
            <button onClick={() => router.push("/donate")} className="px-3 py-2 text-[11px] font-black uppercase rounded-lg cursor-pointer bg-[#e25e2d] text-white hover:bg-[#d14d1c] transition-colors">+ Add Item</button>
          </div>

          {/* USER MENU */}
          <div className="relative">
            <button onClick={() => setShowUserDropdown(!showUserDropdown)} className="w-9 h-9 rounded-full bg-[#fae9d7] text-[#e25e2d] font-bold flex items-center justify-center border border-white uppercase cursor-pointer">
              {userInfo?.user_metadata?.full_name?.[0] || userInfo?.email?.[0] || "U"}
            </button>
            {showUserDropdown && (
              <div className="absolute right-0 mt-3 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-5 py-4 bg-slate-50 border-b border-slate-100">
                  <p className="text-sm text-slate-900 font-medium truncate">{userInfo?.email}</p>
                </div>
                <div className="py-1">
                  <button onClick={() => { router.push("/profile"); setShowUserDropdown(false); }} className="w-full flex items-center gap-3 px-5 py-3 text-sm text-slate-600 hover:bg-[#fae9d7]/40 hover:text-[#e25e2d] transition-colors">
                    <User size={18} className="opacity-70" />
                    <span>My Profile</span>
                  </button>
                  <div className="border-t border-slate-100 mt-1">
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-5 py-3 text-sm text-red-600 font-semibold hover:bg-red-50 transition-colors">
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