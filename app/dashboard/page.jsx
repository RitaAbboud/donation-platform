"use client";

import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import ItemCard from "../../components/dashboardPage/itemCard";
import RequestCard from "../../components/dashboardPage/requestCard";

import { useEffect, useState, useMemo } from "react";
import {
  Heart,
  ShoppingCart,
  SlidersHorizontal,
  Search,
  ChevronDown,
  X,
} from "lucide-react";

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
  Clothes: 10,
  Furniture: 100,
  Electronics: 50,
  Toys: 15,
  Books: 5,
};

export default function DashboardPage() {
  const router = useRouter();

  /* ================= STATE ================= */
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [activeTab, setActiveTab] = useState("donations");

  const [userInfo, setUserInfo] = useState(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  /* ================= CONSTANTS ================= */
  const locations = useMemo(
    () => ["Beirut", "Tripoli", "Saida", "Jbeil", "Zahle"].sort(),
    []
  );

  const Tabs = [
    { id: "donations", name: "Donations" },
    { id: "requests", name: "Requests" },
  ];

  const categories = useMemo(
    () => [
      { id: "697ab681-4fb9-4ee1-adc4-3d8f7d6cdff3", name: "Clothes", image: "/images/clothes.png" },
      { id: "ff364af8-e19e-4e6c-93c7-ca627e40c7f0", name: "Furniture", image: "/images/furniture.png" },
      { id: "0f6bc521-2bf5-4c94-a58d-357d502cb8c6", name: "Electronics", image: "/images/electronics.png" },
      { id: "91935055-4ea0-49d8-a51c-8dedde58fc0e", name: "Toys", image: "/images/toys.png" },
      { id: "9a4ea99e-c275-44d8-96d0-4be94569d276", name: "Books", image: "/images/books.png" },
    ],
    []
  );

  const LIMIT = 8;

  /* ================= FETCH ITEMS ================= */
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
        const { data: bookmarks } = await supabase
          .from("bookmarks")
          .select("item_id")
          .eq("user_id", user.id);
        bookmarkedIds = bookmarks?.map((b) => b.item_id) || [];
      }

      const mergedData = itemsData.map((item) => ({
        ...item,
        category: categoriesMap[item.category_id],
        is_bookmarked: bookmarkedIds.includes(item.id),
      }));

      if (isInitial) {
        setItems(mergedData);
        setFilteredItems(mergedData);
      } else {
        setItems((prev) => [...prev, ...mergedData]);
        setFilteredItems((prev) => [...prev, ...mergedData]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchItems(true);
  }, []);

  /* ================= FETCH REQUESTS ================= */
  useEffect(() => {
    async function fetchRequests() {
      setLoading(true);
      const { data, error } = await supabase.from("bundle_requests").select(`
        id,
        user_id,
        category_id,
        description,
        phone,
        location,
        created_at,
        categories (name)
      `);

      if (error) console.error("Error fetching requests:", error);
      else setRequests(data);

      setLoading(false);
    }

    fetchRequests();
  }, []);

  /* ================= FILTER FUNCTIONS ================= */
  function filterItems() {
    let filtered = [...items];

    if (search) filtered = filtered.filter((i) => JSON.stringify(i).toLowerCase().includes(search.toLowerCase()));

    if (activeCategoryId) filtered = filtered.filter((i) => i.category_id === activeCategoryId);
    else if (filterCategory) {
      const catEntry = Object.entries(categoriesMap).find(([id, name]) => name === filterCategory);
      if (catEntry) filtered = filtered.filter((i) => i.category_id === catEntry[0]);
    }

    if (locationSearch) filtered = filtered.filter((i) => i.location?.toLowerCase().includes(locationSearch.toLowerCase()));
    if (priceFrom) filtered = filtered.filter((i) => i.cost >= Number(priceFrom));
    if (priceTo) {
      const catName = filterCategory || categoriesMap[activeCategoryId];
      const maxPrice = catName ? categoryMaxPrices[catName] : Infinity;
      filtered = filtered.filter((i) => i.cost <= Math.min(Number(priceTo), maxPrice));
    }

    return filtered;
  }

  useEffect(() => {
    setFilteredItems(filterItems());
  }, [search, activeCategoryId, filterCategory, locationSearch, priceFrom, priceTo, items]);

  /* ================= FILTER REQUESTS ================= */
  useEffect(() => {
    if (activeTab === "requests") {
      let filtered = [...requests];

      if (activeCategoryId) filtered = filtered.filter((r) => r.category_id === activeCategoryId);
      else if (filterCategory) {
        const catEntry = Object.entries(categoriesMap).find(([id, name]) => name === filterCategory);
        if (catEntry) filtered = filtered.filter((r) => r.category_id === catEntry[0]);
      }

      setFilteredRequests(filtered);
    }
  }, [activeTab, activeCategoryId, filterCategory, requests]);

  /* ================= ACTIONS ================= */
  function applyFilters() { setShowFilters(false); }
  function resetFilters() {
    setSearch("");
    setActiveCategoryId("");
    setFilterCategory("");
    setLocationSearch("");
    setPriceFrom("");
    setPriceTo("");
  }
  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  /* ================= LOADING ================= */
  if (loading && filteredItems.length === 0 && requests.length === 0) {
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
    <div className={`min-h-screen bg-[#fff6ef] text-slate-800 ${poppins.className}`}>
      {/* ================= 1. NAVBAR ================= */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-[#fae9d7] px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div
            className="font-black text-2xl tracking-tighter text-[#e25e2d] cursor-pointer"
            onClick={() => router.push("/dashboard")}
          >
            OneHand<span className="text-[#f3a552]">.</span>
          </div>

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

          <div className="flex items-center gap-3">
            {/* Cart & Bookmarks */}
            <button onClick={() => router.push("/cart")} className="p-2.5 hover:bg-[#fae9d7] rounded-xl transition-colors text-[#e25e2d]">
              <ShoppingCart size={22} />
            </button>
            <button onClick={() => router.push("/bookmarks")} className="p-2.5 hover:bg-[#fae9d7] rounded-xl transition-colors text-[#e25e2d]">
              <Heart size={22} />
            </button>

            {/* User Avatar */}
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown((prev) => !prev)}
                className="w-10 h-10 rounded-full bg-[#fae9d7] text-[#e25e2d] font-bold flex items-center justify-center uppercase shadow-md hover:scale-110 transition-transform duration-200"
              >
                {userInfo?.user_metadata?.full_name?.[0] || userInfo?.email?.[0] || "U"}
              </button>

              <div className={`absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden transition-all duration-300 transform ${showUserDropdown ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-2 scale-95 pointer-events-none"}`}>
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-sm text-slate-700 font-semibold truncate">
                    {userInfo?.user_metadata?.full_name || userInfo?.email || "No Name"}
                  </p>
                </div>
                <button onClick={() => router.push("/profile")} className="w-full text-left px-4 py-3 text-sm text-slate-700 font-bold hover:bg-slate-50 transition-colors duration-200">
                  My Profile
                </button>
                <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm text-red-500 font-bold hover:bg-red-50 transition-colors duration-200">
                  Logout
                </button>
              </div>
            </div>

            {/* Add Item & Bundle Request */}
            <button onClick={() => router.push("/donate")} className="px-4 py-2 text-sm font-semibold rounded-lg bg-[#e25e2d] text-white hover:bg-[#d14d1c] transition-all duration-200 shadow-sm">
              + Add Item
            </button>
            <button onClick={() => router.push("/bundle-request")} className="px-4 py-2 text-sm font-semibold rounded-lg border border-[#e25e2d] text-[#e25e2d] hover:bg-[#e25e2d] hover:text-white transition-all duration-200">
              + Bundle Request
            </button>
          </div>
        </div>

        {/* Filters & Categories Buttons */}
        <div className="flex items-center gap-4 mt-4 overflow-x-auto pb-1 no-scrollbar text-sm">
          <button
            onClick={() => setShowCategories(!showCategories)}
            className="flex items-center gap-2 px-4 py-1.5 bg-white border border-[#fae9d7] rounded-full font-semibold whitespace-nowrap hover:border-[#f3a552]"
          >
            All Categories <ChevronDown size={14} />
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-1.5 border rounded-full font-semibold transition-all ${showFilters ? "bg-[#e25e2d] border-[#e25e2d] text-white" : "bg-white border-[#fae9d7] text-[#e25e2d]"}`}
          >
            <SlidersHorizontal size={14} /> Filters
          </button>
          <button onClick={resetFilters} className="text-gray-400 hover:text-red-500 font-medium transition-colors">
            Reset
          </button>
        </div>
      </nav>

      {/* ================= FILTERS PANEL ================= */}
      <div className={`overflow-hidden transition-all duration-500 ease-in-out bg-white border-b border-[#fae9d7] ${showFilters ? "max-h-[500px] opacity-100 py-8" : "max-h-0 opacity-0 py-0"}`}>
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-end gap-6">
            <div className="flex-1 w-full space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-400 ml-1">
                Category
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full rounded-2xl border border-[#fae9d7] bg-[#fae9d7]/30 px-4 py-3 text-sm focus:border-[#e25e2d] outline-none transition-all cursor-pointer"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="flex-1 w-full space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-400 ml-1">
                Location
              </label>
              <input
                type="text"
                placeholder="Type location"
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
                className="w-full rounded-2xl border border-[#fae9d7] bg-[#fae9d7]/30 px-4 py-3 text-sm focus:border-[#e25e2d] outline-none transition-all"
              />
            </div>

            <div className="flex-1 w-full space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-400 ml-1">
                Price Range
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceFrom}
                  onChange={(e) => setPriceFrom(e.target.value)}
                  className="w-1/2 rounded-2xl border border-[#fae9d7] px-4 py-3 text-sm focus:border-[#e25e2d] outline-none"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={priceTo}
                  onChange={(e) => setPriceTo(e.target.value)}
                  className="w-1/2 rounded-2xl border border-[#fae9d7] px-4 py-3 text-sm focus:border-[#e25e2d] outline-none"
                />
              </div>
            </div>

            <div className="flex gap-2 w-full md:w-auto -mt-2">
              <button onClick={applyFilters} className="flex-1 md:flex-none bg-[#e25e2d] text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#d14d1c] transition-all shadow-md">
                Apply
              </button>
              <button onClick={() => setShowFilters(false)} className="p-2 rounded-xl border border-[#fae9d7] text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all">
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= CATEGORY ICONS ================= */}
      <div className="bg-white py-8 flex justify-center gap-16 shadow-sm overflow-x-auto no-scrollbar">
        {categories.map((cat) => {
          const isActive = activeCategoryId === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategoryId(isActive ? "" : cat.id);
                setFilterCategory("");
              }}
              className="flex flex-col items-center gap-3 group min-w-[100px] transition-transform duration-300"
            >
              <div className={`w-22 h-22 rounded-full overflow-hidden border-4 transition-all duration-300 ${isActive ? "border-[#e25e2d] scale-110 shadow-lg shadow-orange-100" : "border-transparent group-hover:border-[#fae9d7] scale-100"}`}>
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
              </div>
              <span className={`text-sm font-bold transition-colors ${isActive ? "text-[#e25e2d]" : "text-slate-500 group-hover:text-[#e25e2d]"}`}>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* ================= TABS ================= */}
      <div className="flex justify-center w-full my-8">
        <div className="inline-flex p-1.5 bg-slate-100 rounded-[1rem] shadow-inner border border-slate-200">
          {Tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-8 py-3 rounded-[1rem] text-sm font-bold transition-all duration-300 ${isActive ? "bg-white text-[#e25e2d] shadow-md shadow-slate-200 scale-105" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"}`}
              >
                <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-[#e25e2d]' : 'bg-slate-300'}`} />
                {tab.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="relative overflow-hidden bg-slate-50/50 min-h-screen">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] rounded-full bg-orange-100/50 blur-[120px]" />
          <div className="absolute top-[-5%] right-[-5%] w-[30%] h-[50%] rounded-full bg-indigo-100/40 blur-[100px]" />
        </div>

        <header className="relative pt-16 pb-8 px-6 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            {activeTab === "donations" ? "Community " : "Help "}
            <span className="text-[#e25e2d]">{activeTab === "donations" ? "Marketplace" : "Requests"}</span>
          </h1>
          <p className="text-slate-600 text-lg font-medium">
            {activeTab === "donations" ? "Explore items shared by your neighbors. Find what you need, for free." : "Small asks, big impact. See what your community needs today."}
          </p>
        </header>

        {activeTab === "donations" && (
          <main className="max-w-7xl mx-auto p-6 md:p-8">
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredItems.map((item) => <ItemCard key={item.id} item={item} />)}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 bg-white/60 backdrop-blur-sm rounded-[3rem] border-2 border-dashed border-orange-200">
                <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">📦</span>
                </div>
                <p className="text-[#f3a552] font-semibold text-xl">No items found.</p>
                <button onClick={resetFilters} className="mt-4 text-[#e25e2d] hover:text-[#d14d1c] font-bold transition-colors">
                  Show all items
                </button>
              </div>
            )}
          </main>
        )}

        {activeTab === "requests" && (
          <div className="max-w-7xl mx-auto p-6 md:p-8">
            {filteredRequests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 transition-all duration-500">
                {filteredRequests.map((request) => <RequestCard key={request.id} request={request} />)}
              </div>
            ) : (
              <div className="text-center py-24 text-slate-400 bg-white/60 backdrop-blur-sm rounded-[3rem] border border-slate-100 shadow-sm">
                <div className="text-4xl mb-4">🔍</div>
                <p className="font-medium text-lg text-slate-500">No requests found in this category.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
