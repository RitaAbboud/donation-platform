"use client";

import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import ItemCard from "../../components/dashboardPage/itemCard";
import { useEffect, useState, useMemo } from "react";
import {
  Heart,
  User,
  MapPin,
  SlidersHorizontal,
  Search,
  LogOut,
  ChevronDown,
  X,
} from "lucide-react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export default function DashboardPage() {
  const router = useRouter();

  /* ================= STATE ================= */
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  /* ================= CONSTANTS ================= */
  const locations = useMemo(
    () => ["Beirut", "Tripoli", "Saida", "Jbeil", "Zahle"].sort(),
    []
  );

  const categories = useMemo(
    () => [
      { name: "Clothes", image: "/images/clothes.jpg" },
      { name: "Furniture", image: "/images/furniture.jpg" },
      { name: "Electronics", image: "/images/electronics.jpg" },
      { name: "Toys", image: "/images/toys.jpg" },
      { name: "Books", image: "/images/books.jpg" },
    ],
    []
  );

  const categoryMaxPrices = {
    Clothes: 100,
    Furniture: 500,
    Electronics: 1000,
    Toys: 50,
    Books: 30,
  };

  /* ================= DATA FETCHING ================= */
  useEffect(() => {
    async function getItems() {
      try {
        const res = await fetch(
          `${
            process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
          }/api/items`,
          { cache: "no-store" }
        );
        const data = await res.json();
        setItems(data);
        setFilteredItems(data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    getItems();
  }, []);

  /* ================= FILTER LOGIC ================= */
  // Handles the search bar and the round category icons
  useEffect(() => {
    let filtered = [...items];

    if (search) {
      filtered = filtered.filter((i) =>
        i.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (activeCategory) {
      filtered = filtered.filter((i) => i.category === activeCategory);
    }

    setFilteredItems(filtered);
  }, [search, activeCategory, items]);

  // Handles the Modal filters
  function applyFilters() {
    let filtered = [...items];

    if (search)
      filtered = filtered.filter((i) =>
        i.name?.toLowerCase().includes(search.toLowerCase())
      );

    if (filterCategory)
      filtered = filtered.filter((i) => i.category === filterCategory);

    if (locationSearch)
      filtered = filtered.filter((i) =>
        i.location?.toLowerCase().includes(locationSearch.toLowerCase())
      );

    if (priceFrom)
      filtered = filtered.filter((i) => i.price >= Number(priceFrom));

    if (priceTo) {
      const maxPrice = filterCategory
        ? categoryMaxPrices[filterCategory]
        : Infinity;
      const priceLimit = Math.min(Number(priceTo), maxPrice);
      filtered = filtered.filter((i) => i.price <= priceLimit);
    }

    setFilteredItems(filtered);
    setShowFilters(false);
  }

  /* ================= ACTIONS ================= */
  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  function resetFilters() {
    setSearch("");
    setActiveCategory("");
    setFilterCategory("");
    setLocationSearch("");
    setPriceFrom("");
    setPriceTo("");
    setFilteredItems(items);
    setShowFilters(false);
  }

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fff7f0]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#f3a552] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#e25e2d] font-medium">Finding treasures...</p>
        </div>
      </div>
    );

return (
    <div className={`min-h-screen bg-[#fff6ef] text-slate-800 ${poppins.className}`}>
      
      {/* ================= 1. NAVBAR ================= */}
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

            {/* Modern Search Bar */}
            <div className="hidden md:flex relative flex-1 max-w-2xl group">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#f3a552]"
              />
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
              <button
                onClick={() => router.push("/bookmarks")}
                className="p-2.5 hover:bg-[#fae9d7] rounded-xl transition-colors text-[#e25e2d]"
              >
                <Heart size={22} />
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-xl text-slate-600 hover:bg-gray-100 transition-colors"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Logout</span>
              </button>

              <button
                onClick={() => router.push("/donate")}
                className="bg-[#e25e2d] hover:bg-[#d14d1c] text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-orange-200 transition-all"
              >
                + Donate
              </button>
            </div>
          </div>

          {/* Sub-Nav Controls */}
          <div className="flex items-center gap-4 mt-4 overflow-x-auto pb-1 no-scrollbar text-sm">
            <button
              onClick={() => setShowCategories(!showCategories)}
              className="flex items-center gap-2 px-4 py-1.5 bg-white border border-[#fae9d7] rounded-full font-semibold whitespace-nowrap hover:border-[#f3a552]"
            >
              All Categories <ChevronDown size={14} />
            </button>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-1.5 border rounded-full font-semibold transition-all ${
                showFilters 
                ? "bg-[#e25e2d] border-[#e25e2d] text-white" 
                : "bg-white border-[#fae9d7] text-slate-600"
              }`}
            >
              <SlidersHorizontal size={14} /> Filters
            </button>

            <button
              onClick={resetFilters}
              className="text-gray-400 hover:text-red-500 font-medium transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </nav>

      {/* ================= 2. INLINE FILTERS (EXPANDABLE) ================= */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out bg-white border-b border-[#fae9d7] ${
          showFilters ? "max-h-[500px] opacity-100 py-8" : "max-h-0 opacity-0 py-0"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex flex-col md:flex-row items-end gap-6">
            {/* Category Select */}
            <div className="flex-1 w-full space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-400 ml-1">
                Category
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full rounded-2xl border border-[#fae9d7] bg-[#fffcf9] px-4 py-3 text-sm focus:border-[#e25e2d] outline-none transition-all cursor-pointer"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Location Select */}
            <div className="flex-1 w-full space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-400 ml-1">
                Location
              </label>
              <select
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
                className="w-full rounded-2xl border border-[#fae9d7] bg-[#fffcf9] px-4 py-3 text-sm focus:border-[#e25e2d] outline-none transition-all cursor-pointer"
              >
                <option value="">All Locations</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
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

            {/* Action Buttons */}
            <div className="flex gap-2 w-full md:w-auto">
              <button
                onClick={applyFilters}
                className="flex-1 md:flex-none bg-[#e25e2d] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#d14d1c] transition-all active:scale-95 shadow-lg shadow-orange-100"
              >
                Apply
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="p-3 rounded-2xl border border-[#fae9d7] text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 3. CATEGORY ICONS ================= */}
      <div className="bg-white py-6 flex justify-center gap-8 shadow-sm overflow-x-auto no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setActiveCategory(activeCategory === cat.name ? "" : cat.name)}
            className="flex flex-col items-center gap-2 group min-w-[70px]"
          >
            <div
              className={`w-16 h-16 rounded-full overflow-hidden border-4 transition-all duration-300 ${
                activeCategory === cat.name
                  ? "border-[#e25e2d] scale-110 shadow-lg shadow-orange-100"
                  : "border-transparent group-hover:border-[#fae9d7]"
              }`}
            >
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
            </div>
            <span className={`text-xs font-bold ${activeCategory === cat.name ? "text-[#e25e2d]" : "text-slate-500"}`}>
              {cat.name}
            </span>
          </button>
        ))}
      </div>

      {/* ================= 4. MAIN CONTENT ================= */}
      <main className="max-w-7xl mx-auto p-6 md:p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            Discover <span className="text-[#e25e2d]">Nearby</span> Treasures
          </h1>
          <p className="text-slate-500">Hand-picked items shared with love.</p>
        </header>

        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-[#f8d5b8]">
            <p className="text-[#f3a552] font-medium">No items found.</p>
            <button onClick={resetFilters} className="mt-4 text-[#e25e2d] underline font-bold">
              Show all items
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
