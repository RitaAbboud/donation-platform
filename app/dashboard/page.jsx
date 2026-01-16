"use client";

import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import ItemCard from "../../components/dashboardPage/itemCard";
import { useEffect, useState } from "react";
import { Heart, User, MapPin, SlidersHorizontal, Search, LogOut } from "lucide-react";


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
  // Function to fetch items 
  async function getItems() {
    try {
      setLoading(true);
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
        }/api/items`,
        {
          cache: "no-store", // Tells Next.js not to cache the result
          headers: {
            Pragma: "no-cache",
            "Cache-Control": "no-cache",
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch items");

      const result = await res.json();

     
      const actualData = Array.isArray(result) ? result : result.data || [];

      console.log("Fetched items successfully:", actualData);
      setItems(actualData);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }



  useEffect(() => {
    async function getItems() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/items`,
          { cache: "no-store" }
        );
        if (!res.ok) throw new Error("Failed to fetch items");

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

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert("Error logging out: " + error.message);
      return;
    }
    router.push("/");
  }
  function resetFilters() {
    setSearch("");
    setLocationSearch("");
    setFilteredItems(items);
    setFilterCategory("");
    setPriceFrom("");
    setPriceTo("");
  }

  function applyFilters() {
    let filtered = [...items];
    if (search) {
      filtered = filtered.filter((i) =>
        i.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (locationSearch) {
      filtered = filtered.filter((i) =>
        i.location.toLowerCase().includes(locationSearch.toLowerCase())
      );
    }
    if (filterCategory) {
      filtered = filtered.filter((i) => i.category === filterCategory);
    }
    if (priceFrom) {
      filtered = filtered.filter((i) => i.price >= Number(priceFrom));
    }
    if (priceTo) {
      filtered = filtered.filter((i) => i.price <= Number(priceTo));
    }
    setFilteredItems(filtered);
  }


  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-slate-500 animate-pulse font-medium">
          Loading items...
        </p>
      </div>
    );

  
  

  return (
    <>
    <div className="min-h-screen bg-gray-50">

      {/* ================= NAVBAR ================= */}
      <nav className="bg-white shadow px-6 py-4">

        {/* ===== TOP ROW ===== */}
        <div className="flex items-center justify-between">
          {/* LOGO + SEARCH */}
          <div className="flex items-center gap-4 flex-1">
            <div className="font-bold text-xl text-[#e25e2d]">OneHand</div>
            <div className="relative flex-1 max-w-xl">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search items..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border pl-11 pr-4 py-3 rounded-full text-sm"
              />
            </div>
          </div>

          {/* ICONS */}
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Heart size={20} />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <User size={20} />
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

        {/* ===== SECOND ROW: FILTERS & CATEGORIES ===== */}
        <div className="flex items-center gap-6 mt-4 text-sm justify-start">
          {/* ALL CATEGORIES */}
          <button
            onClick={() => setShowCategories(!showCategories)}
            className="font-medium hover:text-[#e25e2d]"
          >
            All Categories
          </button>

          {/* LOCATION */}
          <div className="relative w-56">
            <MapPin
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Location"
              value={locationSearch}
              onChange={(e) => setLocationSearch(e.target.value)}
              className="w-full border pl-9 pr-3 py-1.5 rounded-full text-sm"
              onFocus={() => setLocationOpen(true)}
              onBlur={() => setTimeout(() => setLocationOpen(false), 100)}
            />

            {locationOpen && locationSearch && (
              <div className="absolute top-10 left-0 right-0 bg-white border shadow rounded-md z-10">
                {locations
                  .filter((loc) =>
                    loc.toLowerCase().includes(locationSearch.toLowerCase())
                  )
                  .map((loc) => (
                    <button
                      key={loc}
                      onClick={() => setLocationSearch(loc)}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      {loc}
                    </button>
                  ))}
              </div>
            )}
          </div>

          {/* FILTER */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1 hover:text-[#e25e2d]"
          >
            <SlidersHorizontal size={16} /> Filter
          </button>

          {/* RESET */}
          <button
            onClick={resetFilters}
            className="text-gray-500 hover:text-red-500"
          >
            Reset
          </button>
        </div>

        {/* ===== FILTER FORM ===== */}
        {showFilters && (
          <div className="bg-white border shadow px-6 py-4 mt-2 w-full md:w-[500px] rounded">
            <h4 className="font-semibold mb-2">Filter Items</h4>
            <div className="flex flex-col gap-2">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="border px-3 py-2 rounded"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Price from"
                  value={priceFrom}
                  onChange={(e) => setPriceFrom(e.target.value)}
                  className="border px-3 py-2 rounded flex-1"
                />
                <input
                  type="number"
                  placeholder="Price to"
                  value={priceTo}
                  onChange={(e) => setPriceTo(e.target.value)}
                  className="border px-3 py-2 rounded flex-1"
                />
              </div>
              <button
                onClick={applyFilters}
                className="bg-[#e25e2d] text-white px-4 py-2 rounded hover:bg-[#ff7b50]"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ================= CATEGORIES MENU ================= */}
      {showCategories && (
        <div className="bg-white border shadow px-6 py-6 mt-2">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-sm">
            {[
              { name: "Clothes", subs: ["Men", "Women", "Kids"] },
              { name: "Furniture", subs: ["Beds", "Tables", "Chairs"] },
              { name: "Electronics", subs: ["Phones", "Laptops", "Accessories"] },
              { name: "Toys", subs: ["Educational", "Outdoor"] },
              { name: "Books", subs: ["School", "Novels", "Children"] },
            ].map((cat) => (
              <div key={cat.name}>
                <h4 className="font-semibold mb-2">{cat.name}</h4>
                {cat.subs.map((sub) => (
                  <button key={sub} className="block hover:text-[#e25e2d]">
                    {sub}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= ITEMS ================= */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => <ItemCard key={item.id} item={item} />)
        ) : (
          <p>No items found.</p>
        )}
      </div>

    </div>
  <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div className="flex gap-4">
          <a
            href="/bookmarks"
            className="px-4 py-2 text-slate-600 hover:text-blue-600 font-medium transition-colors"
          >
            Saved Items
          </a>
        </div>
      </div>
      

      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
        {items.length > 0 ? (
          items.map((item) => <ItemCard key={item.id} item={item} />)
        ) : (
          <div className="col-span-full py-20 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400">No items found in the database.</p>
          </div>
        )}
      </div> */}
      </div>
    </>
  );
}
