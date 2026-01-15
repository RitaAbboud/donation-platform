"use client";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import ItemCard from "../../components/dashboardPage/itemCard";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

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
    getItems();
  }, []);

  async function handleLogoutButton() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert("Error logging out: " + error.message);
      return;
    }
    router.push("/");
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
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Marketplace
        </h1>
        <div className="flex gap-4">
          <a
            href="/bookmarks"
            className="px-4 py-2 text-slate-600 hover:text-blue-600 font-medium transition-colors"
          >
            Saved Items
          </a>
          <button
            onClick={handleLogoutButton}
            className="px-4 py-2 bg-red-50 text-red-600 font-semibold rounded-lg hover:bg-red-100 transition"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
        {items.length > 0 ? (
          items.map((item) => <ItemCard key={item.id} item={item} />)
        ) : (
          <div className="col-span-full py-20 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400">No items found in the database.</p>
          </div>
        )}
      </div>
    </div>
  );
}
