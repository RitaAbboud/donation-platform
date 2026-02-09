"use client";

import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import ItemCard from "../../components/dashboardPage/itemCard";
import RequestCard from "../../components/dashboardPage/requestCard";
import DashboardLayout from "../../components/dashboardPage/DashboardLayout";
import { useSearch } from "../../context/SearchContext";
import { useEffect, useState, useMemo } from "react";
import { SlidersHorizontal, ChevronDown, X, Package, MapPin, Search as SearchIcon } from "lucide-react";
import { Poppins } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
});

const categoriesMap = {
  "697ab681-4fb9-4ee1-adc4-3d8f7d6cdff3": "Clothes",
  "ff364af8-e19e-4e6c-93c7-ca627e40c7f0": "Furniture",
  "0f6bc521-2bf5-4c94-a58d-357d502cb8c6": "Electronics",
  "91935055-4ea0-49d8-a51c-8dedde58fc0e": "Toys",
  "9a4ea99e-c275-44d8-96d0-4be94569d276": "Books",
};

export default function DashboardPage() {
  const router = useRouter();
  const { search, setSearch, setUserInfo } = useSearch();

  /* ================= STATE ================= */
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeCategoryId, setActiveCategoryId] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  
  const [showFilters, setShowFilters] = useState(false);
  const [showCategories, setShowCategories] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [activeTab, setActiveTab] = useState("donations");

  /* ================= CONSTANTS ================= */
  const Tabs = [
    { id: "donations", name: "Donations" },
    { id: "requests", name: "Requests" },
  ];

  const categories = useMemo(() => [
    { id: "697ab681-4fb9-4ee1-adc4-3d8f7d6cdff3", name: "Clothes", image: "/images/clothes.png" },
    { id: "ff364af8-e19e-4e6c-93c7-ca627e40c7f0", name: "Furniture", image: "/images/furniture.png" },
    { id: "0f6bc521-2bf5-4c94-a58d-357d502cb8c6", name: "Electronics", image: "/images/electronics.png" },
    { id: "91935055-4ea0-49d8-a51c-8dedde58fc0e", name: "Toys", image: "/images/toys.png" },
    { id: "9a4ea99e-c275-44d8-96d0-4be94569d276", name: "Books", image: "/images/books.png" },
  ], []);

  const LIMIT = 8;

  /* ================= FETCH LOGIC ================= */
  async function fetchItems(isInitial = false) {
    try {
      setLoading(true);
      const skip = isInitial ? 0 : items.length;
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserInfo(user);

      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/items?skip=${skip}&limit=${LIMIT}`, { cache: "no-store" });
      const itemsData = await res.json();

      if (itemsData.length < LIMIT) setHasMore(false);

      let bookmarkedIds = [];
      if (user) {
        const { data: bookmarks } = await supabase.from("bookmarks").select("item_id").eq("user_id", user.id);
        bookmarkedIds = bookmarks?.map((b) => b.item_id) || [];
      }

      const mergedData = itemsData.map((item) => ({
        ...item,
        category: categoriesMap[item.category_id],
        is_bookmarked: bookmarkedIds.includes(item.id),
      }));

      setItems(isInitial ? mergedData : [...items, ...mergedData]);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchItems(true);
    const fetchRequests = async () => {
      const { data } = await supabase.from("bundle_requests").select("*, categories(name)");
      if (data) setRequests(data);
    };
    fetchRequests();
  }, []);

  /* ================= FILTER LOGIC ================= */
  useEffect(() => {
    let filtered = [...items];
    if (search) {
      const query = search.toLowerCase();
      filtered = filtered.filter((i) => i.description?.toLowerCase().includes(query));
    }
    if (activeCategoryId) filtered = filtered.filter((i) => i.category_id === activeCategoryId);
    if (locationSearch) filtered = filtered.filter((i) => i.location?.toLowerCase().includes(locationSearch.toLowerCase()));
    if (priceFrom) filtered = filtered.filter((i) => i.cost >= Number(priceFrom));
    if (priceTo) filtered = filtered.filter((i) => i.cost <= Number(priceTo));
    setFilteredItems(filtered);
  }, [items, search, activeCategoryId, locationSearch, priceFrom, priceTo]);

  useEffect(() => {
    let filtered = [...requests];
    if (search) {
      const query = search.toLowerCase();
      filtered = filtered.filter((r) => 
        r.description?.toLowerCase().includes(query) || 
        r.location?.toLowerCase().includes(query)
      );
    }
    if (activeCategoryId) filtered = filtered.filter((r) => r.category_id === activeCategoryId);
    setFilteredRequests(filtered);
  }, [requests, search, activeCategoryId]);

  const resetFilters = () => {
    setSearch("");
    setActiveCategoryId("");
    setLocationSearch("");
    setPriceFrom("");
    setPriceTo("");
  };

  return (
    <DashboardLayout>
      {/* 1. LOADING SCREEN */}
      {loading && items.length === 0 && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#fffcf9]/90 backdrop-blur-md">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-[#e25e2d] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[#e25e2d] font-bold tracking-tight">Loading treasures...</p>
          </div>
        </div>
      )}

      <div className={`min-h-screen bg-[#fffcf9] text-slate-800 ${poppins.className}`}>
        
        {/* 2. STICKY FILTER BAR */}
        {/* ================= SECONDARY NAV (Controls) ================= */}
<div className=" top-[64px] z-[110] bg-white/90 backdrop-blur-md border-b border-[#fae9d7]/50 px-4 py-2">
  <div className="max-w-7xl mx-auto flex items-center justify-between">
    <div className="flex gap-2">
      <button 
        onClick={() => { setShowCategories(!showCategories); if(!showCategories) setShowFilters(false); }}
        className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border transition-all ${showCategories ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-500 border-slate-200"}`}
      >
        Categories
      </button>
      <button 
        onClick={() => { setShowFilters(!showFilters); if(!showFilters) setShowCategories(false); }}
        className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase border transition-all ${showFilters ? "bg-[#e25e2d] text-white border-[#e25e2d]" : "bg-white text-[#e25e2d] border-[#fae9d7]"}`}
      >
        <SlidersHorizontal size={12} /> Filters
      </button>
    </div>
    <button onClick={resetFilters} className="text-[10px] font-bold text-slate-400 uppercase hover:text-red-500 transition-colors">
      Reset
    </button>
  </div>
</div>

{/* ================= COMPACT FILTERS PANEL ================= */}
<AnimatePresence>
  {showFilters && (
    <motion.div 
      initial={{ height: 0, opacity: 0 }} 
      animate={{ height: "auto", opacity: 1 }} 
      exit={{ height: 0, opacity: 0 }}
      className="bg-white border-b border-[#fae9d7] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 py-3">
        {/* Using a flex-wrap approach to keep height minimal */}
        <div className="flex flex-wrap items-center gap-2 md:gap-4">
          
          {/* Compact Location */}
          <div className="flex-[2] min-w-[140px] relative">
            <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#e25e2d]" size={12} />
            <input 
              type="text" 
              placeholder="Location..." 
              value={locationSearch}
              onChange={(e) => setLocationSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-slate-50 rounded-lg text-xs outline-none border border-transparent focus:bg-white focus:border-[#e25e2d]/20 transition-all"
            />
          </div>

          {/* Compact Price Range */}
          <div className="flex-[3] min-w-[160px] flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg border border-transparent">
            <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">$</span>
            <input 
              type="number" 
              placeholder="Min" 
              value={priceFrom}
              onChange={(e) => setPriceFrom(e.target.value)}
              className="w-full bg-transparent text-xs outline-none"
            />
            <span className="text-slate-300">-</span>
            <input 
              type="number" 
              placeholder="Max" 
              value={priceTo}
              onChange={(e) => setPriceTo(e.target.value)}
              className="w-full bg-transparent text-xs outline-none"
            />
          </div>

          {/* Minimal Apply Button */}
          <button 
            onClick={() => setShowFilters(false)} 
            className="flex-1 min-w-[60px] py-2 bg-[#e25e2d] text-white text-[10px] font-black uppercase rounded-lg shadow-sm active:scale-95 transition-all"
          >
            Apply
          </button>
        </div>
      </div>
    </motion.div>
  )}
</AnimatePresence>

        {/* 4. CATEGORY HORIZONTAL SCROLLER */}
        <AnimatePresence>
          {showCategories && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="py-10"
            >
              <div className="w-full overflow-x-auto no-scrollbar px-4 md:px-0">
                <div className="flex sm:justify-center gap-8 md:gap-14 min-w-max pb-4">
                  {categories.map((cat) => {
                    const isActive = activeCategoryId === cat.id;
                    return (
                      <button key={cat.id} onClick={() => setActiveCategoryId(isActive ? "" : cat.id)} className="flex flex-col items-center gap-3 group">
                        <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 transition-all duration-300 ${isActive ? "border-[#e25e2d] shadow-lg scale-110" : "border-transparent opacity-60 group-hover:opacity-100"}`}>
                          <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                        </div>
                        <span className={`text-[11px] font-bold tracking-tight transition-colors ${isActive ? "text-slate-900" : "text-slate-400"}`}>{cat.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

       {/* ================= REFINED CONTENT AREA ================= */}
<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
  
  {/* COMPACT TAB SWITCHER */}
  <div className="flex justify-center mb-8 md:mb-12">
    <div className="inline-flex w-full max-w-[350px] p-1 bg-white/80 backdrop-blur-sm rounded-2xl border border-orange-100/50 shadow-sm">
      {Tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2.5 md:py-3 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all duration-300 ${
              isActive 
                ? "bg-[#e25e2d] text-white shadow-md shadow-orange-100" 
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {tab.name}
          </button>
        );
      })}
    </div>
  </div>

  {/* RESPONSIVE HEADER */}
  <header className="text-center mb-8 md:mb-16 px-2">
    <h1 className="text-3xl md:text-6xl font-black text-slate-900 mb-2 md:mb-4 tracking-tighter leading-none">
      {activeTab === "donations" ? "Community " : "Help "}
      <span className="text-[#e25e2d]">
        {activeTab === "donations" ? "Marketplace" : "Requests"}
      </span>
    </h1>
    <p className="text-slate-500 text-xs md:text-lg max-w-[280px] md:max-w-lg mx-auto leading-relaxed">
      {activeTab === "donations" 
        ? "Find what you need or give what you can." 
        : "See what your community is looking for today."}
    </p>
  </header>

 {/* --- ADAPTIVE GRID (Marketplace Style) --- */}
<div className="min-h-[300px]">
  {activeTab === "donations" ? (
    filteredItems.length > 0 ? (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-8">
        {filteredItems.map((item) => (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            key={item.id}
            className="w-full"
          >
            <ItemCard item={item} />
          </motion.div>
        ))}
      </div>
    ) : (
      <EmptyState onReset={resetFilters} message="No items found." />
    )
  ) : (
    filteredRequests.length > 0 ? (
      /* Requests usually have more text, so 1 col on mobile is better, but 2 col works too */
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-8">
        {filteredRequests.map((request) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }} 
            animate={{ opacity: 1, scale: 1 }} 
            key={request.id}
          >
            <RequestCard request={request} />
          </motion.div>
        ))}
      </div>
    ) : (
      <EmptyState onReset={resetFilters} message="No requests found." />
    )
  )}
</div>

  {/* RESPONSIVE LOAD MORE */}
  {hasMore && activeTab === "donations" && (
    <div className="flex flex-col items-center mt-12 md:mt-20">
      <button 
        onClick={() => fetchItems(false)} 
        disabled={loading} 
        className="group flex flex-col items-center gap-2 transition-transform active:scale-90"
      >
        <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-slate-100 flex items-center justify-center group-hover:border-[#e25e2d] group-hover:shadow-lg transition-all">
          {loading ? (
            <div className="w-5 h-5 border-2 border-[#e25e2d] border-t-transparent rounded-full animate-spin" />
          ) : (
            <span className="text-xl text-slate-300 group-hover:text-[#e25e2d]">↓</span>
          )}
        </div>
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-[#e25e2d]">
          View More
        </span>
      </button>
    </div>
  )}
</main>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </DashboardLayout>
  );
}

function EmptyState({ onReset, message }) {
  return (
    <div className="flex flex-col items-center py-24 bg-white/60 rounded-[3rem] border-2 border-dashed border-orange-100">
      <div className="text-5xl mb-6 opacity-40">📦</div>
      <p className="text-slate-500 font-bold text-xl mb-4">{message}</p>
      <button onClick={onReset} className="text-[#e25e2d] font-black uppercase tracking-widest text-sm hover:underline">Show all items</button>
    </div>
  );
}