"use client";

import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import ItemCard from "../../components/dashboardPage/itemCard";
import { useEffect, useState } from "react";
import { Heart, User, MapPin, SlidersHorizontal, Search, LogOut, ChevronDown } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredItems, setFilteredItems] = useState([]);
  const [search, setSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [showCategories, setShowCategories] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState("");
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");

  const locations = ["Beirut", "Tripoli", "Saida", "Jbeil", "Zahle"];
  const categories = ["Clothes", "Furniture", "Electronics", "Toys", "Books"];

  useEffect(() => {
    async function getItems() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/items`, { cache: "no-store" });
        const data = await res.json();
        setItems(data);
        setFilteredItems(data);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    }
    getItems();
  }, []);

  function applyFilters() {
    let filtered = items.filter(i => 
      (!search || i.name?.toLowerCase().includes(search.toLowerCase())) &&
      (!locationSearch || i.location?.toLowerCase().includes(locationSearch.toLowerCase())) &&
      (!filterCategory || i.category === filterCategory) &&
      (!priceFrom || i.price >= Number(priceFrom)) &&
      (!priceTo || i.price <= Number(priceTo))
    );
    setFilteredItems(filtered);
    setShowFilters(false);
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#fff7f0]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#f3a552] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[#e25e2d] font-medium">Finding treasures...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fff7f0] text-slate-800">
      {/* --- MODERN NAVBAR --- */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-[#fae9d7] px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <div 
              className="font-black text-2xl tracking-tighter text-[#e25e2d] cursor-pointer" 
              onClick={() => router.push("/dashboard")}
            >
              OneHand<span className="text-[#f3a552]">.</span>
            </div>

            {/* Search Bar - Expanded for Modern Look */}
            <div className="hidden md:flex relative flex-1 max-w-2xl group">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#f3a552]" />
              <input
                type="text"
                placeholder="Search for something special..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#fae9d7]/30 border-2 border-transparent focus:border-[#f8d5b8] focus:bg-white outline-none pl-12 pr-4 py-2.5 rounded-2xl transition-all"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button onClick={() => router.push("/bookmarks")} className="p-2.5 hover:bg-[#fae9d7] rounded-xl transition-colors text-[#e25e2d]">
                <Heart size={22} />
              </button>
              <button className="p-2.5 hover:bg-[#fae9d7] rounded-xl transition-colors text-[#e25e2d]">
                <User size={22} />
              </button>
              <button
                onClick={() => router.push("/donate")}
                className="hidden sm:block bg-[#e25e2d] hover:bg-[#d14d1c] text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-orange-200 transition-all"
              >
                + Donate Item
              </button>
            </div>
          </div>

          {/* Sub-Nav: Filters & Secondary Controls */}
          <div className="flex items-center gap-4 mt-4 overflow-x-auto pb-1 no-scrollbar">
            <button 
              onClick={() => setShowCategories(!showCategories)}
              className="flex items-center gap-2 px-4 py-1.5 bg-white border border-[#fae9d7] rounded-full text-sm font-semibold whitespace-nowrap hover:border-[#f3a552]"
            >
              Categories <ChevronDown size={14} />
            </button>

            <div className="h-4 w-[1px] bg-slate-200"></div>

            <div className="relative">
               <div className="flex items-center gap-2 px-4 py-1.5 bg-white border border-[#fae9d7] rounded-full text-sm">
                  <MapPin size={14} className="text-[#f3a552]" />
                  <input 
                    placeholder="Location..." 
                    className="outline-none w-24"
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                  />
               </div>
            </div>

            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-1.5 bg-white border border-[#fae9d7] rounded-full text-sm font-semibold text-slate-600"
            >
              <SlidersHorizontal size={14} /> Filters
            </button>
          </div>
        </div>
      </nav>

      {/* --- CATEGORY MEGA MENU --- */}
      {showCategories && (
        <div className="absolute left-0 right-0 z-30 bg-white border-b border-[#fae9d7] shadow-xl animate-in slide-in-from-top-2">
          <div className="max-w-7xl mx-auto p-8 grid grid-cols-2 md:grid-cols-5 gap-8">
            {/* Category columns like you had before, but styled cleaner */}
            {categories.map(cat => (
              <div key={cat} className="group cursor-pointer">
                <h4 className="font-bold text-[#e25e2d] mb-2">{cat}</h4>
                <div className="space-y-1 text-sm text-slate-500">
                  <p className="hover:text-[#f3a552]">New Arrivals</p>
                  <p className="hover:text-[#f3a552]">Popular Items</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-7xl mx-auto p-6 md:p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            Discover <span className="text-[#e25e2d]">Nearby</span> Treasures
          </h1>
          <p className="text-slate-500">Every item has a story, find yours today.</p>
        </header>

        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-[#f8d5b8]">
            <p className="text-[#f3a552] font-medium">No items found in this area.</p>
            <button onClick={() => {setSearch(""); setLocationSearch(""); setFilteredItems(items);}} className="mt-4 text-[#e25e2d] underline">Clear all filters</button>
          </div>
        )}
      </main>
    </div>
  );
}