"use client";

import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import ItemCard from "../../components/dashboardPage/itemCard";
import { useEffect, useState, useMemo } from "react";
import {
  Heart,
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

// Map of category IDs to names
const categoriesMap = {
  "697ab681-4fb9-4ee1-adc4-3d8f7d6cdff3": "Clothes",
  "ff364af8-e19e-4e6c-93c7-ca627e40c7f0": "Furniture",
  "0f6bc521-2bf5-4c94-a58d-357d502cb8c6": "Electronics",
  "91935055-4ea0-49d8-a51c-8dedde58fc0c": "Toys",
  "9a4ea99e-c275-44d8-96d0-4be94569d2f2": "Books",
};

// Max prices per category
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
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState("");
  const [activeCategory, setActiveCategory] = useState(""); // optional for name highlighting
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
      {
        id: "697ab681-4fb9-4ee1-adc4-3d8f7d6cdff3",
        name: "Clothes",
        image: "/images/clothes.jpg",
      },
      {
        id: "ff364af8-e19e-4e6c-93c7-ca627e40c7f0",
        name: "Furniture",
        image: "/images/furniture.jpg",
      },
      {
        id: "0f6bc521-2bf5-4c94-a58d-357d502cb8c6",
        name: "Electronics",
        image: "/images/electronics.jpg",
      },
      {
        id: "91935055-4ea0-49d8-a51c-8dedde58fc0c",
        name: "Toys",
        image: "/images/toys.jpg",
      },
      {
        id: "9a4ea99e-c275-44d8-96d0-4be94569d2f2",
        name: "Books",
        image: "/images/books.jpg",
      },
    ],
    []
  );

  /* ================= FILTER FUNCTION ================= */
  function filterItems() {
    let filtered = [...items];

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter((i) =>
        JSON.stringify(i).toLowerCase().includes(q)
      );
    }

    // Filter by activeCategoryId first (icon), fallback to dropdown name
    if (activeCategoryId) {
      filtered = filtered.filter((i) => i.category_id === activeCategoryId);
    } else if (filterCategory) {
      const catEntry = Object.entries(categoriesMap).find(
        ([id, name]) => name === filterCategory
      );
      if (catEntry) {
        const id = catEntry[0];
        filtered = filtered.filter((i) => i.category_id === id);
      }
    }

    if (locationSearch) {
      filtered = filtered.filter((i) =>
        i.location?.toLowerCase().includes(locationSearch.toLowerCase())
      );
    }

    if (priceFrom) {
      filtered = filtered.filter((i) => i.price >= Number(priceFrom));
    }

    if (priceTo) {
      // Determine max price for the category if selected
      let categoryName = filterCategory;
      if (!categoryName && activeCategoryId) {
        categoryName = categoriesMap[activeCategoryId];
      }
      const maxPrice = categoryName ? categoryMaxPrices[categoryName] : Infinity;

      filtered = filtered.filter(
        (i) => i.price <= Math.min(Number(priceTo), maxPrice)
      );
    }

    return filtered;
  }

  /* ================= DATA FETCHING ================= */
  useEffect(() => {
    async function getItems() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/items`,
          { cache: "no-store" }
        );
        const data = await res.json();

        // Add category names to items
        const dataWithCategoryName = data.map((item) => ({
          ...item,
          category: categoriesMap[item.category_id],
        }));

        setItems(dataWithCategoryName);
        setFilteredItems(dataWithCategoryName);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    getItems();
  }, []);

  /* ================= AUTO FILTER ================= */
  useEffect(() => {
    setFilteredItems(filterItems());
  }, [search, activeCategoryId, filterCategory, locationSearch, priceFrom, priceTo, items]);

  /* ================= ACTIONS ================= */
  function applyFilters() {
    setFilteredItems(filterItems());
    setShowFilters(false);
  }

  function resetFilters() {
    setSearch("");
    setActiveCategory("");
    setActiveCategoryId("");
    setFilterCategory("");
    setLocationSearch("");
    setPriceFrom("");
    setPriceTo("");
    setFilteredItems(items);
    setShowFilters(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  /* ================= LOADING ================= */
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fff7f0]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#f3a552] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#e25e2d] font-medium">Finding treasures...</p>
        </div>
      </div>
    );

  /* ================= UI ================= */
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
                className="flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-xl text-slate-600 hover:bg-[#fae9d7] hover:text-red-400 transition-colors"
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
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-end gap-6">
            {/* Category Select */}
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
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
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
                className="w-full rounded-2xl border border-[#fae9d7] bg-[#fae9d7]/30 px-4 py-3 text-sm focus:border-[#e25e2d] outline-none transition-all cursor-pointer"
              >
                <option value="">All Locations</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="flex-1 w-full space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-400 ml-1">
                Price Range
              </label>
              <div className="flex gap-2">
                {/* Min Price */}
                <input
                  type="number"
                  placeholder="Min"
                  value={priceFrom}
                  onChange={(e) => setPriceFrom(e.target.value)}
                  className="w-1/2 rounded-2xl border border-[#fae9d7] px-4 py-3 text-sm focus:border-[#e25e2d] outline-none"
                  min={0}
                  max={filterCategory ? categoryMaxPrices[filterCategory] : undefined}
                />

                {/* Max Price */}
                <input
                  type="number"
                  placeholder="Max"
                  value={priceTo}
                  onChange={(e) => {
                    let categoryName = filterCategory;
                    if (!categoryName && activeCategoryId) {
                      categoryName = categoriesMap[activeCategoryId];
                    }
                    const maxPrice = categoryName ? categoryMaxPrices[categoryName] : Infinity;
                    const value = Number(e.target.value);
                    setPriceTo(value > maxPrice ? maxPrice : value);
                  }}
                  className="w-1/2 rounded-2xl border border-[#fae9d7] px-4 py-3 text-sm focus:border-[#e25e2d] outline-none"
                  min={0}
                  max={filterCategory ? categoryMaxPrices[filterCategory] : undefined}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 w-full md:w-auto -mt-2">
              <button
                onClick={applyFilters}
                className="flex-1 md:flex-none bg-[#e25e2d] text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#d14d1c] transition-all active:scale-95 shadow-md shadow-orange-100 -translate-y-1"
              >
                Apply
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 rounded-xl border border-[#fae9d7] text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all -translate-y-1"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 3. CATEGORY ICONS ================= */}
      <div className="bg-white py-8 flex justify-center gap-16 shadow-sm overflow-x-auto no-scrollbar">
  {categories.map((cat) => {
    const isActive = activeCategoryId === cat.id;

    return (
      <button
        key={cat.id}
        onClick={() => {
          setActiveCategoryId(isActive ? "" : cat.id);
          setFilterCategory("");
          if (!isActive) {
            setPriceTo((prev) => {
              const maxPrice = categoryMaxPrices[cat.name];
              return prev && prev > maxPrice ? maxPrice : prev;
            });
          }
        }}
        className="flex flex-col items-center gap-3 group min-w-[100px] transition-transform duration-300"
      >
        <div
          className={`w-22 h-22 rounded-full overflow-hidden border-4 transition-all duration-300 ${
            isActive
              ? "border-[#e25e2d] scale-115 shadow-lg shadow-orange-100"
              : "border-transparent group-hover:border-[#fae9d7] scale-100"
          }`}
        >
          <img
            src={cat.image}
            alt={cat.name}
            className="w-full h-full object-cover"
          />
        </div>
        <span
          className={`text-sm font-bold transition-colors ${
            isActive
              ? "text-[#e25e2d]"
              : "text-slate-500 group-hover:text-[#e25e2d]"
          }`}
        >
          {cat.name}
        </span>
      </button>
    );
  })}
</div>


      {/* ================= 4. MAIN CONTENT ================= */}
      <main className="max-w-7xl mx-auto p-6 md:p-8">
        
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-14">
  {filteredItems.map((item) => (
    <ItemCard key={item.id} item={item} />
  ))}
</div>

        ) : (
         <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-[#f8d5b8]">
            <p className="text-[#f3a552] font-medium">No items found.</p>
            <button
              onClick={resetFilters}
              className="mt-4 text-[#e25e2d] underline font-bold"
            >
              Show all items
            </button>
          </div>
        )}
      </main>
    </div>
  );
}