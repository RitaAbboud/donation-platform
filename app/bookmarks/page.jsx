"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; 
import ItemCard from "../../components/dashboardPage/itemCard";
import { supabase } from "../../lib/supabaseClient";

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

  if (loading) {
    return <div className="p-6 text-center">Loading your bookmarks...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-slate-800">My Bookmarks</h1>

      {bookmarks.length === 0 ? (
        <p className="text-slate-500">You haven't bookmarked any items yet.</p>
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
              )
          )}
        </div>
      )}
    </div>
  );
}
