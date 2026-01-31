"use client";
import { Poppins } from "next/font/google";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import DashboardLayout from "../../components/dashboardPage/DashboardLayout";
import { useSearch } from "../../context/SearchContext";
import CartItemCard from "../../components/CartPage/CartItemCard";
import { ArrowLeft, ShoppingCart } from "lucide-react";


  const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "600", "700"],
  });
  
export default function CartPage() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

    const handleRemoveFromUI = (id) => {
  setItems((prev) => prev.filter((item) => item.id !== id));
};

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
    <DashboardLayout>
      {loading && (
    <div className="flex items-center justify-center min-h-screen bg-[#fff7f0] ">
      <div className="w-12 h-12 border-4 border-[#e25e2d] border-t-transparent rounded-full animate-spin"></div>
    </div>
  ) } 
      <div className={`min-h-screen bg-gradient-to-b from-[#fff6ef] to-[#fff2e5] p-6 md:p-10 lg:p-16 ${poppins.className}`}>

        {/* ITEMS GRID */}
        {!loading && items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {items.map((item) => (
              <CartItemCard 
   key={item.id} 
   item={item} 
   onUnreserve={handleRemoveFromUI} 
/>
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
    </DashboardLayout>

  );
}