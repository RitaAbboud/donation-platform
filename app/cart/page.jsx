"use client";

import { Poppins } from "next/font/google";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import DashboardLayout from "../../components/dashboardPage/DashboardLayout";
import CartItemCard from "../../components/CartPage/CartItemCard";
import { ArrowLeft, ShoppingBag, ShoppingCart, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
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
      const { data: { user } } = await supabase.auth.getUser();
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
      <div className={`min-h-screen bg-white md:bg-[#fff6ef] text-slate-900 ${poppins.className} pb-20`}>
        


        <div className="max-w-7xl mx-auto px-4 py-6 md:p-10 lg:p-16">
          
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
              <div className="w-12 h-12 border-[3px] border-orange-100 border-t-[#e25e2d] rounded-full animate-spin"></div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Cart...</p>
            </div>
          ) : items.length > 0 ? (
            <>
              {/* HEADER SECTION */}
              <div className="flex flex-col gap-1 mb-8">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter">My Cart</h1>
                  <span className="px-3 py-1 rounded-full bg-orange-100 text-[#e25e2d] text-[10px] font-black uppercase">
                    {items.length} {items.length === 1 ? 'Item' : 'Items'}
                  </span>
                </div>
                <p className="hidden md:block text-slate-500 font-medium">Review and manage your reserved community items.</p>
              </div>

              {/* RESPONSIVE GRID */}
              <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                      key={item.id}
                    >
                      <CartItemCard 
                        item={item} 
                        onUnreserve={handleRemoveFromUI} 
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </>
          ) : (
            /* EMPTY STATE */
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center text-center bg-white rounded-[2.5rem] p-8 md:p-20 max-w-2xl mx-auto mt-4 md:mt-10 border border-slate-100 shadow-xl shadow-orange-900/5"
            >
              <div className="w-24 h-24 flex items-center justify-center rounded-3xl bg-orange-50 mb-8 text-[#e25e2d] relative">
                <ShoppingCart className="w-10 h-10" />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full shadow-sm flex items-center justify-center text-xs font-black">0</div>
              </div>

              <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 tracking-tight">
                Your cart is empty
              </h2>
              <p className="text-slate-500 mb-10 text-sm md:text-base max-w-xs mx-auto font-medium leading-relaxed">
                You haven’t reserved any items yet. Start exploring the marketplace to find what you need.
              </p>
              
              <button 
                onClick={() => router.push('/dashboard')}
                className="w-full sm:w-auto px-10 py-5 bg-[#e25e2d] text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-orange-200 hover:bg-slate-900 transition-all active:scale-95"
              >
                Start Browsing
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}