"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import NavBar from "../../components/NavBar";
import { Package, CheckCircle, Clock, Phone ,Edit, Trash} from "lucide-react";
import { X, Tag, AlignLeft, MapPin, Save } from "lucide-react";



export default function MyProfile() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [categories, setCategories] = useState([]);
  const [editForm, setEditForm] = useState({
    category_id: "",
    description: "",
    phone: "",
    location: "",
    lat: null,
    lng: null,
  });

  useEffect(() => {
    const loadInitialData = async () => {
      const { data: catData } = await supabase.from("categories").select("id, name");
      setCategories(catData || []);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      setUser(user);

      const [itemsRes, requestsRes] = await Promise.all([
        supabase.from("items").select("*").eq("owner_id", user.id).order("created_at", { ascending: false }),
        supabase.from("bundle_requests").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      ]);

      setItems(itemsRes.data || []);
      setRequests(requestsRes.data || []);
      setLoading(false);
    };

    loadInitialData();
  }, [router]);

  const deleteItem = async (id) => {
  if (!user) {
    alert("User not logged in.");
    return;
  }

  if (!confirm("Are you sure you want to delete this item?")) return;

  try {
    const { error } = await supabase
      .from("items")
      .delete()
      .eq("id", id)
      .eq("owner_id", user.id);

    if (error) throw error;

    // ✅ Update local state immediately
    setItems((prev) => prev.filter((i) => i.id !== id));

  } catch (err) {
    console.error("Delete item error:", err);
    alert("Failed to delete item: " + err.message);
  }
};

const deleteRequest = async (id) => {
  if (!user) {
    alert("User not logged in.");
    return;
  }

  if (!confirm("Are you sure you want to delete this request?")) return;

  try {
    const { error } = await supabase
      .from("bundle_requests")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw error;

    setRequests((prev) => prev.filter((r) => r.id !== id));

  } catch (err) {
    console.error("Delete request error:", err);
    alert("Failed to delete request: " + err.message);
  }
};


  // ================= EDIT FUNCTIONS =================
  const openEditModal = (itemOrRequest, type) => {
    setEditing({ ...itemOrRequest, type });
    setEditForm({
      category_id: itemOrRequest.category_id || "",
      description: itemOrRequest.description || "",
      phone: itemOrRequest.phone || "",
      location: itemOrRequest.location || "",
      lat: itemOrRequest.lat || null,
      lng: itemOrRequest.lng || null,
    });
  };

  const handleUpdate = async (id) => {
    if (!editing) return;
    setLoading(true);

    try {
      const table = editing.type === "item" ? "items" : "bundle_requests";

      const { error } = await supabase.from(table).update({ ...editForm }).eq("id", id);
      if (error) throw error;

      if (editing.type === "item") {
        setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...editForm } : i)));
      } else {
        setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, ...editForm } : r)));
      }

      setEditing(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
                <div className="flex items-center justify-center min-h-screen bg-[#fff7f0] ">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#e25e2d] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#e25e2d] font-medium">Loading Profile...</p>
        </div>
      </div>
    );
  }

  const totalItems = items.length;
  const availableItems = items.filter((i) => !i.is_sold).length;
  const reservedItems = items.filter((i) => i.is_sold).length;

  return (
    <div className="min-h-screen bg-[#fff7f0]">
      <NavBar variant="profile" title="My Profile" subtitle={user.email} />

      <div className="max-w-6xl mx-auto px-6 pt-32 pb-32 space-y-20">
        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <StatCard icon={<Package />} label="Total Items" value={totalItems} />
          <StatCard icon={<Clock />} label="Available" value={availableItems} />
          <StatCard icon={<CheckCircle />} label="Reserved" value={reservedItems} />
        </div>

        {/* MY ITEMS */}
        <div>
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-extrabold tracking-tight text-[#e25e2d]">My Items</h2>
            <button
              onClick={() => router.push("/donate")}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-[#e25e2d] shadow hover:scale-[1.03] transition"
            >
              + Add Item
            </button>
          </div>

          {items.length === 0 ? (
            <div className="rounded-3xl bg-white/80 backdrop-blur-xl p-14 text-center shadow">
              <p className="text-slate-500 mb-6">You haven’t added any items yet.</p>
              <button
                onClick={() => router.push("/donate")}
                className="px-8 py-3 rounded-xl text-white font-semibold bg-gradient-to-br from-[#e25e2d] to-[#f3a552] hover:scale-[1.03] transition"
              >
                Add your first item
              </button>
            </div>
          ) : (
            <div className="grid gap-8">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="group relative flex gap-6 p-6 rounded-3xl bg-white/85 backdrop-blur-xl shadow hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="absolute left-0 top-6 bottom-6 w-1.5 rounded-full bg-gradient-to-b from-[#e25e2d] to-[#f3a552]" />
                  <img
                    src={item.image_url || "/images/placeholder.png"}
                    alt=""
                    className="w-28 h-28 rounded-2xl object-cover shadow"
                  />
                  <div className="flex-1">
                    <p className="font-bold text-lg text-slate-900 line-clamp-1">{item.description}</p>
                    <p className="text-sm text-slate-500 mt-2">{item.location}</p>
                    <p className="text-sm text-slate-500">{item.cost}</p>
                    <div className="mt-4">
                      <StatusBadge isSold={item.is_sold} />
                    </div>
                  </div>

                  {/* Delete & Edit */}
                  <div className="flex items-center gap-3">
                      <button
                      onClick={() => openEditModal(item, "item")}
                      className="p-2 rounded-lg bg-slate-50 text-slate-700 cursor-pointer hover:bg-orange-300 hover:text-white transition-colors"
                    >
                      <Edit/>
                    </button>

                    <button
                      onClick={() => deleteItem(item.id)}
                      className="p-2 rounded-lg bg-slate-50 text-slate-700 cursor-pointer hover:bg-red-400 hover:text-white transition-colors"
                    >
                       <Trash />
                    </button>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* MY REQUESTS */}
        <div>
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-extrabold tracking-tight text-[#e25e2d]">My Requests</h2>
            <button
              onClick={() => router.push("/bundle-request")}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-[#e25e2d] shadow hover:scale-[1.03] transition"
            >
              + Request Item
            </button>
          </div>

          {requests.length === 0 ? (
            <div className="rounded-3xl bg-white/80 backdrop-blur-xl p-10 text-center border-2 border-dashed border-orange-100">
              <p className="text-slate-500 italic">No bundle requests found.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="group relative flex items-center justify-between p-6 rounded-3xl bg-white/85 backdrop-blur-xl shadow border border-white transition-all"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-[#e25e2d]">
                      <Package size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{req.description}</h3>
                      <p className="text-xs text-slate-400 font-mono">{new Date(req.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">

                   

                  <button onClick={() => openEditModal(req)} className="p-2 rounded-lg bg-slate-50 text-slate-700 cursor-pointer hover:bg-orange-300 hover:text-white transition-colors">
                           <Edit/>
                  </button>
                <button 
                    onClick={() => deleteRequest(req.id)} 
                    className="p-2 rounded-lg bg-slate-50 text-slate-700 cursor-pointer hover:bg-red-400 hover:text-white transition-colors"
                  >
                    <Trash />
                </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* EDIT MODAL */}
        {editing && (
          <EditModal editing={editing} editForm={editForm} setEditForm={setEditForm} handleUpdate={handleUpdate} setEditing={setEditing} categories={categories} loading={loading} />
        )}
      </div>
    </div>
  );
}

// ================= EDIT MODAL COMPONENT =================
function EditModal({ editing, editForm, setEditForm, handleUpdate, setEditing, categories, loading }) {
  return (
    <>
      {/* FIXED BACKDROP: This now covers 100% of the viewport regardless of page length */}
      <div 
        className="fixed inset-0 w-screen h-screen bg-slate-900/40 backdrop-blur-md z-[100] overflow-hidden" 
        onClick={() => setEditing(null)} 
      />
      
      {/* MODAL PANEL */}
      <div className="fixed right-0 top-0 h-full w-full max-w-xl bg-[#fff6ef] shadow-2xl z-[110] overflow-y-auto p-8 animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-black text-slate-900">
            Edit <span className="text-[#e25e2d]">{editing.type === "item" ? "Item" : "Request"}</span>
          </h2>
          <button 
            onClick={() => setEditing(null)} 
            className="text-slate-400 hover:text-red-500 transition-colors p-2"
          >
            <X size={28} strokeWidth={3} />
          </button>
        </div>

        {/* Form Container */}
        <div className="space-y-6 bg-white p-6 rounded-2xl border border-[#fae9d7] shadow-sm">
          
          {/* Category */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
              <Tag size={14} className="text-[#f3a552]" />
              Category
            </label>
            <select 
              value={editForm.category_id} 
              onChange={(e) => setEditForm({ ...editForm, category_id: e.target.value })} 
              className="w-full rounded-xl border border-[#fae9d7] bg-[#fff6ef] px-4 py-3 text-sm focus:border-[#e25e2d] outline-none transition-all cursor-pointer"
            >
              {categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
            </select>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
              <AlignLeft size={14} className="text-[#f3a552]" />
              Description
            </label>
            <textarea 
              rows={3} 
              value={editForm.description} 
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} 
              placeholder="Describe..." 
              className="rounded-xl border border-[#fae9d7] bg-[#fff6ef] px-4 py-3 text-sm focus:border-[#e25e2d] outline-none transition-all resize-none" 
            />
          </div>

          {/* Location */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
              <MapPin size={14} className="text-[#f3a552]" />
              Location
            </label>
            <input 
              type="text" 
              value={editForm.location} 
              onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} 
              placeholder="Enter street or neighborhood" 
              className="w-full rounded-xl border border-[#fae9d7] bg-[#fff6ef] px-4 py-3 text-sm focus:border-[#e25e2d] outline-none transition-all" 
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
              <Phone size={14} className="text-[#f3a552]" />
              Contact Number
            </label>
            <div className="relative">
              <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#f3a552] opacity-50" />
              <input 
                type="text" 
                value={editForm.phone} 
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} 
                placeholder="71 234 567" 
                className="w-full rounded-xl border border-[#fae9d7] bg-[#fff6ef] pl-10 pr-4 py-3 text-sm focus:border-[#e25e2d] outline-none transition-all" 
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 flex gap-4">
            <button 
              onClick={() => setEditing(null)} 
              className="flex-1 px-6 py-3 rounded-xl font-bold text-slate-400 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={() => handleUpdate(editing.id)} 
              disabled={loading} 
              className="flex-1 flex items-center justify-center gap-2 bg-[#e25e2d] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#d14d1c] transition-all shadow-lg shadow-orange-200 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save size={18} />
                  Update
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ================= STAT CARD =================
function StatCard({ icon, label, value }) {
  return (
    <div className="p-8 rounded-3xl bg-white/80 backdrop-blur-xl shadow hover:-translate-y-1 transition-all">
      <div className="flex items-center gap-3 text-[#e25e2d] text-sm font-semibold uppercase tracking-wide">{icon} {label}</div>
      <p className="text-4xl font-extrabold mt-6 text-slate-900">{value}</p>
    </div>
  );
}

// ================= STATUS BADGE =================
function StatusBadge({ isSold }) {
  return isSold ? (
    <span className="inline-flex px-4 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">Reserved</span>
  ) : (
    <span className="inline-flex px-4 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">Available</span>
  );
}
