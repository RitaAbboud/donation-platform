"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ItemCard from "../../components/dashboardPage/itemCard";
import { supabase } from "../../lib/supabaseClient";
import {Heart} from "lucide-react";

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchBookmarks() {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        alert("Please log in to view your bookmarks");
        router.push("/login");
        return;
      }

      //  fetch bookmarks for the logged-in user
      const { data, error } = await supabase
        .from("bookmarks")
        .select(`items (*)`)
        .eq("user_id", user.id);

      if (error) {
        console.error("Error loading bookmarks:", error);
      } else {
        setBookmarks(data || []);
      }

      setLoading(false);
    }

    fetchBookmarks();
  }, [router]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fff7f0]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#f3a552] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#e25e2d] font-medium">
            Loading your bookmarks...
          </p>
        </div>
      </div>
    );

  return (
    <div className={`min-h-screen bg-[#fff6ef] text-slate-900 `}>
      <div className="max-w-7xl mx-auto p-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 mb-10 text-slate-400 hover:text-[#e25e2d] transition-colors text-sm font-bold uppercase tracking-widest"
        >
          ← Back to Shop
        </button>
        <h1 className="text-3xl font-bold mb-9 text-[#e25e2d]">My Bookmarks</h1>


        {bookmarks.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center bg-white rounded-3xl shadow-xl p-14 max-w-xl mx-auto mt-20 relative overflow-hidden">
            {/* Floating subtle decoration */}
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[#f3a552]/10 animate-pulse-slow" />

    <div className="max-w-7xl mx-auto p-6" >
       <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 mb-10 text-slate-400 hover:text-[#e25e2d] transition-colors text-sm font-bold uppercase tracking-widest"
          >
            ← Back to shop
          </button>
      <h1 className="text-3xl font-bold mb-9 text-[#e25e2d]">My Bookmarks</h1>


            {/* Icon */}
            <div className="w-24 h-24 flex items-center justify-center rounded-full bg-[#fff0e0] mb-6 shadow-inner animate-bounce-slow">
              <Heart className="w-12 h-12 text-[#e25e2d]" />
            </div>

            {/* Heading */}
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-slate-900">
              No Bookmarks Yet
            </h2>

            {/* Description */}
            <p className="text-slate-500 mb-10 text-sm sm:text-base leading-relaxed px-4 sm:px-0">
              You haven’t bookmaked any items yet. Browse items, find treasures,
              and bookmark them to revisit later!
            </p>
          </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarks.map(
              (b) =>
                // Ensure b.items exists before rendering to avoid crashes
                b.items && (
                  <ItemCard
                    key={b.items.id}
                    item={{ ...b.items, is_bookmarked: true }}
                  />
                ),
            )}
          </div>
          
        )}
      </div>
    </div>
    
  );
}
