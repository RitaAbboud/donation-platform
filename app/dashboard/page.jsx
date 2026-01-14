"use client";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import ItemCard from "../../components/dashboardPage/itemCard";
import { useEffect, useState } from "react"; 

export default function DashboardPage() {
  const router = useRouter();
  
  // 2. Create state to hold the items
  const [items, setItems] = useState([]); 
  const [loading, setLoading] = useState(true);

  // 3. Use useEffect to fetch data when the page loads
  useEffect(() => {
    async function getItems() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/items`, { 
          cache: 'no-store' 
        });
        
        if (!res.ok) throw new Error("Failed to fetch items");
        
        const data = await res.json();
        setItems(data); // Put the array into state
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    }

    getItems();
  }, []); // Empty array means "run this only once on mount"

  async function handleLogoutButton() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert("Error logging out: " + error.message);
      return;
    }
    router.push("/");
  }


  if (loading) return <p className="p-6">Loading items...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard page</h1>
      
     
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {items.length > 0 ? (
          items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))
        ) : (
          <p>No items found.</p>
        )}
      </div>

      <button 
        onClick={handleLogoutButton}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
      >
        Logout Button
      </button>
    </div>
  );
}