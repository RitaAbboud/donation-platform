"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import NavBar from "../../components/NavBar";
import { Package, CheckCircle, Clock, Phone ,Edit, Trash2,Hash} from "lucide-react";
import { X, Tag, AlignLeft, MapPin, Save,FileText} from "lucide-react";



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
  <div className="min-h-screen bg-[#fff7f0] text-slate-900 selection:bg-orange-100">
    <NavBar variant="profile" title="My Profile" subtitle={user.email} />

    <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-20">
      
      {/* 1. HEADER SECTION & QUICK STATS */}
      <header className="mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tight text-slate-900">
              Dashboard
            </h1>
            <p className="text-slate-500 font-medium">Manage your community contributions.</p>
          </div>
          
          <div className="flex gap-3">
             <button
              onClick={() => router.push("/bundle-request")}
              className="px-5 py-2.5 rounded-2xl text-sm font-semibold text-orange-700 hover:bg-orange-100 border border-orange-100 bg-orange-200 transition-all"
            >
              + Request Item
            </button>
            <button
              onClick={() => router.push("/donate")}
              className="px-5 py-2.5 rounded-2xl text-sm font-semibold text-white bg-[#e25e2d] hover:bg-[#ef6837] shadow-lg  transition-all active:scale-95"
            >
              + Add New Item
            </button>
          </div>
        </div>

        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
          <StatCard icon={<Package className="text-orange-600" />} label="Total Items" value={totalItems} />
          <StatCard icon={<Clock className="text-blue-600" />} label="Available Items" value={availableItems} />
          <StatCard icon={<CheckCircle className="text-emerald-600" />} label="Reserved Items" value={reservedItems} />
          <StatCard icon={<FileText className="text-purple-600" />} label="Requests" value={requests.length} />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* 2. MAIN CONTENT - MY ITEMS (LHS) */}
        <section className="lg:col-span-7 space-y-8">
          <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
            <h2 className="text-xl font-bold">My Collection</h2>
            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-xs font-bold">{items.length}</span>
          </div>

          {items.length === 0 ? (
            <EmptyState message="You haven't shared anything yet." action={() => router.push("/donate")} />
          ) : (
            <div className="grid gap-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="group bg-white border border-slate-100 p-4 rounded-3xl flex gap-5 transition-all hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/5"
                >
                  <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-slate-100">
                    <img
                      src={item.image_url || "/images/placeholder.png"}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  <div className="flex flex-1 flex-col justify-between py-1">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-slate-800 leading-tight group-hover:text-[#e25e2d] transition-colors">
                          {item.description}
                        </h3>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {/* EDIT ITEM */}
                          <button onClick={() => openEditModal(item, "item")} className="p-2 hover:bg-orange-50 rounded-full text-slate-400 hover:text-orange-600 transition-colors">
                            <Edit size={18} />
                          </button>
                          {/* DELETE ITEM */}
                          <button onClick={() => deleteItem(item.id)} className="p-2 hover:bg-red-50 rounded-full text-slate-400 hover:text-red-500 transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs font-medium text-slate-400 mt-1 flex items-center gap-1">
                        <MapPin size={12} /> {item.location}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-700">{item.cost || 'Free'}</span>
                      <StatusBadge isSold={item.is_sold} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 3. SIDEBAR - REQUESTS (RHS) */}
        <section className="lg:col-span-5 space-y-8">
           <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
            <h2 className="text-xl font-bold">Open Requests</h2>
          </div>

          <div className="bg-slate-50/50 rounded-[2rem] p-2 space-y-2 border border-slate-100">
            {requests.length === 0 ? (
              <div className="p-10 text-center text-slate-400 text-sm italic">No active requests</div>
            ) : (
              requests.map((req) => (
                <div 
                  key={req.id} 
                  className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                      <Hash size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-800">{req.description}</p>
                      <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mt-0.5">
                        {new Date(req.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* EDIT REQUEST */}
                    <button 
                      onClick={() => openEditModal(req, "request")}
                      className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all"
                    >
                      <Edit size={18} />
                    </button>
                    {/* DELETE REQUEST */}
                    <button 
                      onClick={() => deleteRequest(req.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* MODAL LAYER */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
           <EditModal {...{ editing, editForm, setEditForm, handleUpdate, setEditing, categories, loading }} />
        </div>
      )}
    </main>
  </div>
);
}

// ================= EDIT MODAL COMPONENT =================
function EditModal({ editing, editForm, setEditForm, handleUpdate, setEditing, categories, loading }) {
  return (
  <>
    {/* FIXED BACKDROP: Clean glassmorphism */}
    <div 
      className="fixed inset-0 w-full h-full  backdrop-blur-sm z-[100] flex items-center justify-center p-4 transition-all" 
      onClick={() => setEditing(null)} 
    />
    
    {/* MODAL DIALOG: Centered and sleek */}
    <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl z-[110] overflow-hidden animate-in fade-in zoom-in duration-300">
      
      {/* Visual Accent Header */}
      <div className="h-2 bg-gradient-to-r from-orange-500 to-orange-300 w-full" />

      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Edit <span className="text-[#e25e2d]">{editing.type === "item" ? "Item" : "Request"}</span>
            </h2>
            <p className="text-sm text-slate-500 font-medium">Update your listing details below.</p>
          </div>
          <button 
            onClick={() => setEditing(null)} 
            className="bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all rounded-full p-2.5"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Form Container */}
        <div className="space-y-5">
          
          {/* Category Selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">
              Category
            </label>
            <div className="relative group">
              <Tag size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
              <select 
                value={editForm.category_id} 
                onChange={(e) => setEditForm({ ...editForm, category_id: e.target.value })} 
                className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 pl-11 pr-4 py-3.5 text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all cursor-pointer appearance-none"
              >
                {categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
              </select>
            </div>
          </div>

          {/* Description Input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">
              Description
            </label>
            <textarea 
              rows={3} 
              value={editForm.description} 
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} 
              placeholder="What are you sharing?" 
              className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 px-4 py-3.5 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all resize-none" 
            />
          </div>

          {/* Two-Column Layout for Location & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">
                Location
              </label>
              <div className="relative group">
                <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                <input 
                  type="text" 
                  value={editForm.location} 
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} 
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 pl-11 pr-4 py-3.5 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all" 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 ml-1">
                Contact Phone
              </label>
              <div className="relative group">
                <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                <input 
                  type="text" 
                  value={editForm.phone} 
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} 
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 pl-11 pr-4 py-3.5 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all" 
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-6 flex gap-3">

            <button 
              onClick={() => handleUpdate(editing.id)} 
              disabled={loading} 
              className="flex-[2] flex items-center justify-center gap-2 bg-[#e25e2d] text-white px-6 py-4 rounded-2xl font-bold hover:bg-[#d86b44] transition-all shadow-xl shadow-slate-200 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  </>
);
}

// ================= STAT CARD =================
function StatCard({ icon, label, value }) {
  return (
    <div className="group relative overflow-hidden p-6 rounded-[2rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-orange-500/5 hover:-translate-y-1 transition-all duration-300">
      {/* Decorative background glow on hover */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-orange-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative flex items-center gap-5">
        {/* Icon Container */}
        <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-orange-50 group-hover:text-orange-600 transition-colors duration-300">
          {/* Scaling the icon slightly on hover */}
          <div className="group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
        </div>

        {/* Text Content */}
        <div className="flex flex-col">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] leading-none mb-1.5">
            {label}
          </span>
          <span className="text-3xl font-black text-slate-900 tabular-nums leading-none">
            {value}
          </span>
        </div>
      </div>
    </div>
  );
}
const EmptyState = ({ message, action }) => (
  <div className="flex flex-col items-center justify-center p-12 rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-white/50 text-center">
    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
      <Package className="text-slate-400" size={32} />
    </div>
    <p className="text-slate-500 font-medium mb-6">{message}</p>
    <button
      onClick={action}
      className="px-6 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all"
    >
      Get Started
    </button>
  </div>
);
// ================= STATUS BADGE =================
function StatusBadge({ isSold }) {
  return isSold ? (
    <span className="inline-flex px-4 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">Reserved</span>
  ) : (
    <span className="inline-flex px-4 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">Available</span>
  );
}
