"use client";

import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import ItemCard from "../../components/dashboardPage/itemCard";
import { useEffect, useState } from "react";
import { Heart, Search, SlidersHorizontal, LogOut, X } from "lucide-react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export default function DashboardPage() {
  const router = useRouter();

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

  const categories = [
    { name: "Clothes", image: "/images/clothes.jpg" },
    { name: "Furniture", image: "/images/furniture.jpg" },
    { name: "Electronics", image: "/images/electronics.jpg" },
    { name: "Toys", image: "/images/toys.jpg" },
    { name: "Books", image: "/images/books.jpg" },
  ];

  const locations = ["Beirut", "Tripoli", "Saida", "Jbeil", "Zahle"].sort();

  const categoryMaxPrices = {
    Clothes: 100,
    Furniture: 500,
    Electronics: 1000,
    Toys: 50,
    Books: 30,
  };

  /* ================= FETCH ITEMS ================= */
  useEffect(() => {
    async function getItems() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/items`,
          { cache: "no-store" }
        );
        const data = await res.json();
        setItems(data);
        setFilteredItems(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    getItems();
  }, []);

  /* ================= SEARCH + CATEGORY BUTTON FILTER ================= */
  useEffect(() => {
    let filtered = [...items];

    if (search)
      filtered = filtered.filter((i) =>
        i.name.toLowerCase().includes(search.toLowerCase())
      );

    if (activeCategory)
      filtered = filtered.filter((i) => i.category === activeCategory);

    setFilteredItems(filtered);
  }, [search, activeCategory, items]);

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
  }

  function applyFilters() {
    let filtered = [...items];

    if (search)
      filtered = filtered.filter((i) =>
        i.name.toLowerCase().includes(search.toLowerCase())
      );

    if (filterCategory)
      filtered = filtered.filter((i) => i.category === filterCategory);

    if (locationSearch)
      filtered = filtered.filter((i) =>
        i.location.toLowerCase().includes(locationSearch.toLowerCase())
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

  if (loading) return <p className="p-6">Loading items...</p>;

  return (
    <div className={`min-h-screen bg-[#fff6ef] ${poppins.className}`}>
      {/* ================= NAVBAR ================= */}
      <nav className="bg-white shadow px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="font-bold text-2xl text-[#e25e2d]">OneHand</div>

          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Heart size={18} />
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1 px-3 py-2 text-sm rounded-full hover:bg-gray-100"
            >
              <LogOut size={16} /> Logout
            </button>

            <button
              onClick={() => router.push("/donate")}
              className="bg-[#e25e2d] text-white px-5 py-2 rounded-full hover:bg-[#ff7b50]"
            >
              + Donate
            </button>
          </div>
        </div>

        {/* SEARCH */}
        <div className="flex justify-center mb-3">
          <div className="relative w-full max-w-2xl">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border pl-11 pr-4 py-3 rounded-xl text-sm focus:ring-2 focus:ring-[#e25e2d]/30 outline-none"
            />
          </div>
        </div>

        {/* FILTER + RESET */}
        <div className="flex justify-center gap-6 text-sm">
          <button
            onClick={() => setShowFilters(true)}
            className="flex items-center gap-1 font-medium hover:text-[#e25e2d]"
          >
            <SlidersHorizontal size={16} /> Filter
          </button>

          <button
            onClick={resetFilters}
            className="text-gray-500 hover:text-red-500"
          >
            Reset
          </button>
        </div>
      </nav>

      {/* ================= CATEGORY BUTTONS ================= */}
      <div className="bg-white py-4 flex justify-center gap-6 shadow-sm">
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() =>
              setActiveCategory(activeCategory === cat.name ? "" : cat.name)
            }
            className="flex flex-col items-center gap-1"
          >
            <div
              className={`w-16 h-16 rounded-full overflow-hidden border-2 ${
                activeCategory === cat.name
                  ? "border-[#e25e2d]"
                  : "border-transparent"
              }`}
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs font-medium">{cat.name}</span>
          </button>
        ))}
      </div>

      {/* ================= ITEMS GRID ================= */}
      <div
        className={`p-6 grid grid-cols-1 md:grid-cols-3 gap-4 ${
          showFilters ? "blur-sm pointer-events-none" : ""
        }`}
      >
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))
        ) : (
          <p>No items found.</p>
        )}
      </div>

      {/* ================= FILTER MODAL ================= */}
      {showFilters && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 md:p-10 relative">

            {/* CLOSE */}
            <button
              onClick={() => setShowFilters(false)}
              className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full"
            >
              <X size={20} />
            </button>

            {/* TITLE */}
            <h2 className="text-3xl font-bold text-center text-[#e25e2d]">
              Filter Items
            </h2>
            <p className="text-center text-gray-500 text-sm mt-2 mb-8">
              Narrow results to find what you need faster
            </p>

            <div className="space-y-5">

              {/* CATEGORY */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm
                             focus:border-[#e25e2d] focus:ring-2 focus:ring-orange-100 outline-none"
                >
                  <option value="">Select a category</option>
                  {categories.map((c) => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* LOCATION */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Location
                </label>
                <select
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm
                             focus:border-[#e25e2d] focus:ring-2 focus:ring-orange-100 outline-none"
                >
                  <option value="">Select location</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* PRICE */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">
                  Price range
                </label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    placeholder="From"
                    value={priceFrom}
                    onChange={(e) => setPriceFrom(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm
                               focus:border-[#e25e2d] focus:ring-2 focus:ring-orange-100 outline-none"
                  />
                  <input
                    type="number"
                    placeholder={
                      filterCategory
                        ? `Max ${categoryMaxPrices[filterCategory]}`
                        : "To"
                    }
                    value={priceTo}
                    onChange={(e) => setPriceTo(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm
                               focus:border-[#e25e2d] focus:ring-2 focus:ring-orange-100 outline-none"
                  />
                </div>
              </div>

              {/* APPLY */}
              <button
                onClick={applyFilters}
                className="w-full mt-4 bg-[#e25e2d] text-white py-3 rounded-full
                           font-semibold tracking-wide hover:bg-[#ff7b50] transition"
              >
                Apply Filters
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
