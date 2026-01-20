"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

import ItemCard from "../../components/dashboardPage/itemCard";
import { ArrowLeft, ShoppingCart } from "lucide-react";

export default function CartPage() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCart() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("items")
        .select("*")
        .eq("reserved_by", user.id);

      setItems(data || []);
      setLoading(false);
    }

    loadCart();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fff6ef] to-[#fff2e5] p-6 md:p-10 lg:p-16">

      {/* Back to Home Top Left */}
      <div className="mb-8">
        <button
          onClick={() => router.push("/dashboard")}
          className="group flex items-center gap-2 text-sm sm:text-base text-gray-500 hover:text-[#e25e2d] transition-all font-semibold"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
          Back to home
        </button>
      </div>

      <h1 className="text-3xl md:text-4xl font-black mb-12 text-[#e25e2d]">
        My Reserved Items
      </h1>

      {/* LOADING STATE */}
      {loading && (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-14 h-14 border-4 border-[#f3a552] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* ITEMS GRID */}
      {!loading && items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}

      {/* EMPTY CART */}
      {!loading && items.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center bg-white rounded-3xl shadow-xl p-14 max-w-xl mx-auto mt-20 relative overflow-hidden">

          {/* Floating subtle decoration */}
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[#f3a552]/10 animate-pulse-slow" />

          {/* Icon */}
          <div className="w-24 h-24 flex items-center justify-center rounded-full bg-[#fff0e0] mb-6 shadow-inner animate-bounce-slow">
            <ShoppingCart className="w-12 h-12 text-[#e25e2d]" />
          </div>

          {/* Heading */}
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-slate-900">
            Your cart is empty
          </h2>

          {/* Description */}
          <p className="text-slate-500 mb-10 text-sm sm:text-base leading-relaxed px-4 sm:px-0">
            You haven’t reserved any items yet. Browse items, find treasures, and start reserving now to fill your collection!
          </p>


        </div>
      )}
    </div>
  );
}
