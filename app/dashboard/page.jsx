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

const categoriesMap = {
  "697ab681-4fb9-4ee1-adc4-3d8f7d6cdff3": "Clothes",
  "ff364af8-e19e-4e6c-93c7-ca627e40c7f0": "Furniture",
  "0f6bc521-2bf5-4c94-a58d-357d502cb8c6": "Electronics",
  "91935055-4ea0-49d8-a51c-8dedde58fc0c": "Toys",
  "9a4ea99e-c275-44d8-96d0-4be94569d2f2": "Books",
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
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  const [search, setSearch] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  const locations = useMemo(
    () => ["Beirut", "Tripoli", "Saida", "Jbeil", "Zahle"].sort(),
    [],
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
    [],
  );

  /* ================= DATA FETCHING (FIXED) ================= */
  useEffect(() => {
    async function getData() {
      try {
        setLoading(true);

        // 1. Get the current user
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setCurrentUser(user);

        // 2. Fetch items
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/items`,
          { cache: "no-store" },
        );
        const itemsData = await res.json();

        // 3. Fetch user's bookmarks from Supabase
        let bookmarkedItemIds = [];
        if (user) {
          const { data: bookmarks } = await supabase
            .from("bookmarks")
            .select("item_id")
            .eq("user_id", user.id);
          bookmarkedItemIds = bookmarks?.map((b) => b.item_id) || [];
        }

        // 4. Merge: Map the bookmark status onto the items array
        const mergedData = itemsData.map((item) => ({
          ...item,
          category: categoriesMap[item.category_id],
          is_bookmarked: bookmarkedItemIds.includes(item.id), // This fixes the reset issue
        }));

        setItems(mergedData);
        setFilteredItems(mergedData);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, []);

  /* ================= FILTER LOGIC ================= */
  function filterItems() {
    let filtered = [...items];

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter((i) =>
        JSON.stringify(i).toLowerCase().includes(q),
      );
    }

    if (activeCategoryId) {
      filtered = filtered.filter((i) => i.category_id === activeCategoryId);
    } else if (filterCategory) {
      const catEntry = Object.entries(categoriesMap).find(
        ([id, name]) => name === filterCategory,
      );
      if (catEntry)
        filtered = filtered.filter((i) => i.category_id === catEntry[0]);
    }

    if (locationSearch) {
      filtered = filtered.filter((i) =>
        i.location?.toLowerCase().includes(locationSearch.toLowerCase()),
      );
    }

    if (priceFrom)
      filtered = filtered.filter((i) => i.cost >= Number(priceFrom));
    if (priceTo) filtered = filtered.filter((i) => i.cost <= Number(priceTo));

    return filtered;
  }

  useEffect(() => {
    setFilteredItems(filterItems());
  }, [
    search,
    activeCategoryId,
    filterCategory,
    locationSearch,
    priceFrom,
    priceTo,
    items,
  ]);

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

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fff7f0]">
        <div className="w-12 h-12 border-4 border-[#f3a552] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div
      className={`min-h-screen bg-[#fff6ef] text-slate-800 ${poppins.className}`}
    >
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-[#fae9d7] px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div
            className="font-black text-2xl tracking-tighter text-[#e25e2d] cursor-pointer"
            onClick={() => router.push("/dashboard")}
          >
            OneHand<span className="text-[#f3a552]">.</span>
          </div>

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

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/bookmarks")}
              className="p-2.5 hover:bg-[#fae9d7] rounded-xl transition-colors text-[#e25e2d]"
            >
              <Heart size={22} />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-xl text-slate-600 hover:bg-[#fae9d7] transition-colors"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
            <button
              onClick={() => router.push("/donate")}
              className="bg-[#e25e2d] hover:bg-[#d14d1c] text-white px-6 py-2.5 rounded-xl font-bold shadow-lg transition-all"
            >
              + Donate
            </button>
          </div>
        </div>
      </nav>

      <div className="bg-white py-8 flex justify-center gap-16 shadow-sm overflow-x-auto no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() =>
              setActiveCategoryId(activeCategoryId === cat.id ? "" : cat.id)
            }
            className="flex flex-col items-center gap-3 group min-w-[100px]"
          >
            <div
              className={`w-22 h-22 rounded-full overflow-hidden border-4 transition-all ${activeCategoryId === cat.id ? "border-[#e25e2d] scale-110 shadow-lg" : "border-transparent"}`}
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span
              className={`text-sm font-bold ${activeCategoryId === cat.id ? "text-[#e25e2d]" : "text-slate-500"}`}
            >
              {cat.name}
            </span>
          </button>
        ))}
      </div>

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
