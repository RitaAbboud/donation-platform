"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { Heart } from "lucide-react";
import DashboardLayout from "../../components/dashboardPage/DashboardLayout"; 
import { useSearch } from "../../context/SearchContext"; 
import BookmarkItemCard from "../../components/bookmarkPage/BookmarkItemCard"; 

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  // Get the global search value
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

    if (error) {
      console.error("Error loading bookmarks:", error);
    } else {
      setBookmarks(data || []);
    }
    setLoading(false);
  }

  /* ================= FILTER LOGIC ================= */
  
  const filteredBookmarks = useMemo(() => {
    return bookmarks.filter((b) => {
      if (!b.items) return false;
      if (!search) return true;
      const searchStr = search.toLowerCase();
      return (
        b.items.title?.toLowerCase().includes(searchStr) ||
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

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#fff7f0] ">
      <div className="w-12 h-12 border-4 border-[#f3a552] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <DashboardLayout> 
      <div className="min-h-screen bg-[#fff6ef] text-slate-900 ">
        <div className="max-w-7xl mx-auto p-6">

          {filteredBookmarks.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center bg-white rounded-3xl shadow-sm p-14 max-w-xl mx-auto mt-10 border border-[#fae9d7]">
              <Heart className="w-12 h-12 text-[#e25e2d] mb-4 opacity-20" />
              <h2 className="text-2xl font-bold mb-2">
                {search ? "No matches found" : "No Bookmarks Yet"}
              </h2>
              <p className="text-slate-500">
                {search ? "Try searching for something else." : "Your saved treasures will appear here."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredBookmarks.map((b) => (
                <BookmarkItemCard 
                  key={b.items.id} 
                  item={b.items} 
                  onUnbookmark={handleRemoveBookmark} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}