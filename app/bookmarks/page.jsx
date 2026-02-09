"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { Heart, Search, ArrowLeft } from "lucide-react";
import DashboardLayout from "../../components/dashboardPage/DashboardLayout"; 
import { useSearch } from "../../context/SearchContext"; 
import BookmarkItemCard from "../../components/bookmarkPage/BookmarkItemCard"; 
import { motion, AnimatePresence } from "framer-motion";

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { search } = useSearch();

  useEffect(() => {
    fetchBookmarks();
  }, [router]);

  async function fetchBookmarks() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    const { data, error } = await supabase
      .from("bookmarks")
      .select(`item_id, items (*)`)
      .eq("user_id", user.id);

    if (error) console.error("Error loading bookmarks:", error);
    else setBookmarks(data || []);
    setLoading(false);
  }

  const filteredBookmarks = useMemo(() => {
    return bookmarks.filter((b) => {
      if (!b.items) return false;
      if (!search) return true;
      const searchStr = search.toLowerCase();
      return (
        b.items.name?.toLowerCase().includes(searchStr) ||
        b.items.description?.toLowerCase().includes(searchStr) ||
        b.items.location?.toLowerCase().includes(searchStr)
      );
    });
  }, [bookmarks, search]);

  const handleRemoveBookmark = async (itemId) => {
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("item_id", itemId)
      .eq("user_id", user.id);

    if (!error) {
      setBookmarks(prev => prev.filter(b => b.items.id !== itemId));
    }
  };

  return (
    <DashboardLayout>
      {loading && (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div className="min-h-screen bg-white md:bg-[#fff6ef] text-slate-900">
        <div className="max-w-7xl mx-auto px-4 py-6 md:p-8">
          
          {/* --- MARKETPLACE HEADER --- */}
          {!loading && (
            <div className="flex flex-col gap-1 mb-8">
              
               <div className="flex items-baseline gap-3">
                 <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Bookmarks</h1>
                 <span className="text-sm font-bold text-slate-400">{filteredBookmarks.length} Items</span>
               </div>
            </div>
          )}

          {/* --- GRID SECTION --- */}
          {!loading && (
            <AnimatePresence mode="popLayout">
              {filteredBookmarks.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center text-center py-20 px-6 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200"
                >
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 text-slate-300">
                    <Search size={32} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">
                    {search ? "No matches found" : "Nothing saved yet"}
                  </h2>
                  <p className="text-sm text-slate-500 max-w-[200px] mt-2">
                    {search ? "Try adjusting your search terms." : "Tap the heart on items you want to keep track of."}
                  </p>
                </motion.div>
              ) : (
                /* grid-cols-2: Side-by-side on mobile
                   gap-3: Tight marketplace spacing
                */
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
                  {filteredBookmarks.map((b) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      key={b.items.id}
                    >
                      <BookmarkItemCard 
                        item={b.items} 
                        onUnbookmark={handleRemoveBookmark} 
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}