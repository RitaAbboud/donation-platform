"use client";

import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import ItemCard from "../../components/dashboardPage/itemCard";
import RequestCard from "../../components/dashboardPage/requestCard";
import DashboardLayout from "../../components/dashboardPage/DashboardLayout";
import { useSearch } from "../../context/SearchContext";
import { useEffect, useState, useMemo } from "react";
import { SlidersHorizontal, ChevronDown, X } from "lucide-react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const categoriesMap = {
  "697ab681-4fb9-4ee1-adc4-3d8f7d6cdff3": "Clothes",
  "ff364af8-e19e-4e6c-93c7-ca627e40c7f0": "Furniture",
  "0f6bc521-2bf5-4c94-a58d-357d502cb8c6": "Electronics",
  "91935055-4ea0-49d8-a51c-8dedde58fc0e": "Toys",
  "9a4ea99e-c275-44d8-96d0-4be94569d276": "Books",
};

const categoryMaxPrices = {
  Clothes: 10, Furniture: 100, Electronics: 50, Toys: 15, Books: 5,
};

export default function DashboardPage() {
  const router = useRouter();
  
  // Pulling global state from our new SearchContext
  const { search, setSearch, setUserInfo } = useSearch();

  /* ================= STATE ================= */
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeCategoryId, setActiveCategoryId] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
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

      setItems((prev) => (isInitial ? mergedData : [...prev, ...mergedData]));
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
  // Effect for Items
  useEffect(() => {
    let filtered = [...items];
    if (search) filtered = filtered.filter((i) => JSON.stringify(i).toLowerCase().includes(search.toLowerCase()));
    if (activeCategoryId) filtered = filtered.filter((i) => i.category_id === activeCategoryId);
    if (locationSearch) filtered = filtered.filter((i) => i.location?.toLowerCase().includes(locationSearch.toLowerCase()));
    if (priceFrom) filtered = filtered.filter((i) => i.cost >= Number(priceFrom));
    if (priceTo) filtered = filtered.filter((i) => i.cost <= Number(priceTo));
    setFilteredItems(filtered);
  }, [search, activeCategoryId, filterCategory, locationSearch, priceFrom, priceTo, items]);

  // Effect for Requests
  useEffect(() => {
    let filtered = [...requests];
    if (activeCategoryId) filtered = filtered.filter((r) => r.category_id === activeCategoryId);
    if (search) filtered = filtered.filter((r) => r.description?.toLowerCase().includes(search.toLowerCase()) || r.location?.toLowerCase().includes(search.toLowerCase()));
    setFilteredRequests(filtered);
  }, [activeTab, activeCategoryId, requests, search]);

  const resetFilters = () => {
    setSearch("");
    setActiveCategoryId("");
    setFilterCategory("");
    setLocationSearch("");
    setPriceFrom("");
    setPriceTo("");
  };

  /* ================= LOADING VIEW ================= */
  if (loading && items.length === 0 && requests.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fff7f0]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#f3a552] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#e25e2d] font-medium">Finding treasures...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className={`min-h-screen text-slate-800 ${poppins.className}`}>
        
        {/* ================= SECONDARY NAV (Filters) ================= */}
        <div className="px-4 md:px-8 py-2 bg-white/50 border-b border-[#fae9d7]">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCategories(!showCategories)}
                className="flex items-center gap-2 px-4 py-1.5 bg-white border border-[#fae9d7] rounded-full text-xs font-bold hover:border-[#f3a552] shadow-sm"
              >
                CATEGORIES <ChevronDown size={14} />
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-1.5 border rounded-full text-xs font-bold transition-all ${
                  showFilters ? "bg-[#e25e2d] text-white" : "bg-white text-[#e25e2d]"
                }`}
              >
                <SlidersHorizontal size={14} /> FILTERS
              </button>
            </div>
            <button onClick={resetFilters} className="text-[11px] font-black uppercase text-slate-400 hover:text-red-500">
              Reset
            </button>
          </div>
        </div>

        {/* ================= FILTERS PANEL ================= */}
        <div className={`overflow-hidden transition-all duration-500 bg-white border-b border-[#fae9d7] ${showFilters ? "max-h-[500px] py-8" : "max-h-0 py-0"}`}>
          <div className="max-w-6xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-400">Location</label>
              <input type="text" value={locationSearch} onChange={(e) => setLocationSearch(e.target.value)} className="w-full rounded-2xl border border-[#fae9d7] bg-[#fae9d7]/30 px-4 py-3 text-sm outline-none" placeholder="Beirut, Tripoli..." />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-400">Price Range</label>
              <div className="flex gap-2">
                <input type="number" placeholder="Min" value={priceFrom} onChange={(e) => setPriceFrom(e.target.value)} className="w-1/2 rounded-2xl border border-[#fae9d7] px-4 py-3 text-sm outline-none" />
                <input type="number" placeholder="Max" value={priceTo} onChange={(e) => setPriceTo(e.target.value)} className="w-1/2 rounded-2xl border border-[#fae9d7] px-4 py-3 text-sm outline-none" />
              </div>
            </div>
            <div className="flex items-end pb-1">
              <button onClick={() => setShowFilters(false)} className="w-full bg-[#e25e2d] text-white py-3 rounded-xl font-bold shadow-md hover:bg-[#d14d1c]">Apply Filters</button>
            </div>
          </div>
        </div>

        {/* ================= CATEGORY ICONS ================= */}
        <div className="bg-white py-8 flex justify-center gap-8 md:gap-16 shadow-sm overflow-x-auto no-scrollbar px-6">
          {categories.map((cat) => (
            <button key={cat.id} onClick={() => setActiveCategoryId(activeCategoryId === cat.id ? "" : cat.id)} className="flex flex-col items-center gap-3 min-w-[90px] group">
              <div className={`w-16 h-16 md:w-22 md:h-22 rounded-full overflow-hidden border-4 transition-all duration-300 ${activeCategoryId === cat.id ? "border-[#e25e2d] scale-110 shadow-lg shadow-orange-100" : "border-transparent group-hover:border-[#fae9d7]"}`}>
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
              </div>
              <span className={`text-sm font-bold ${activeCategoryId === cat.id ? "text-[#e25e2d]" : "text-slate-500"}`}>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* ================= TABS ================= */}
        <div className="flex justify-center my-8">
          <div className="inline-flex p-1.5 bg-slate-100 rounded-2xl border border-slate-200 shadow-inner">
            {Tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === tab.id ? "bg-white text-[#e25e2d] shadow-md scale-105" : "text-slate-500 hover:text-slate-700"}`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* ================= MAIN CONTENT ================= */}
        <main className="relative bg-slate-50/50 min-h-screen pb-20">
          <header className="relative pt-16 pb-8 text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
              {activeTab === "donations" ? "Community " : "Help "}
              <span className="text-[#e25e2d]">{activeTab === "donations" ? "Marketplace" : "Requests"}</span>
            </h1>
            <p className="text-slate-600 text-lg">{activeTab === "donations" ? "Find what you need, for free." : "See what your community needs today."}</p>
          </header>

          {/* DONATIONS CONTENT */}
          {activeTab === "donations" && (
            <div className="max-w-7xl mx-auto px-6">
              {filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {filteredItems.map((item) => <ItemCard key={item.id} item={item} />)}
                </div>
              ) : (
                <div className="flex flex-col items-center py-24 bg-white/60 rounded-[3rem] border-2 border-dashed border-orange-200">
                  <div className="text-4xl mb-4">📦</div>
                  <p className="text-[#f3a552] font-semibold text-xl">No items found.</p>
                  <button onClick={resetFilters} className="mt-4 text-[#e25e2d] font-bold">Show all items</button>
                </div>
              )}
              {hasMore && (
                <div className="flex flex-col items-center mt-12">
                  <button onClick={() => fetchItems(false)} disabled={loading} className="group flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full border-2 border-slate-200 flex items-center justify-center group-hover:border-[#e25e2d] transition-all">
                      {loading ? <div className="w-5 h-5 border-2 border-[#e25e2d] border-t-transparent rounded-full animate-spin" /> : "↓"}
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400">View More</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* REQUESTS CONTENT */}
          {activeTab === "requests" && (
            <div className="max-w-7xl mx-auto px-6">
              {filteredRequests.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {filteredRequests.map((request) => <RequestCard key={request.id} request={request} />)}
                </div>
              ) : (
                <div className="text-center py-24 bg-white/60 rounded-[3rem] border border-slate-100 shadow-sm">
                  <div className="text-4xl mb-4">🔍</div>
                  <p className="font-medium text-lg text-slate-500">No requests found in this category.</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </DashboardLayout>
  );
}