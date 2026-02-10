"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import NavBar from "../../components/NavBar";
import { Package, CheckCircle, Clock, Phone, Edit, Trash2, Hash, X, Tag, MapPin, Save, FileText, Plus } from "lucide-react";

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
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      const { error } = await supabase.from("items").delete().eq("id", id).eq("owner_id", user.id);
      if (error) throw error;
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      alert("Failed to delete: " + err.message);
    }
  };

  const deleteRequest = async (id) => {
    if (!confirm("Are you sure you want to delete this request?")) return;
    try {
      const { error } = await supabase.from("bundle_requests").delete().eq("id", id).eq("user_id", user.id);
      if (error) throw error;
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert("Failed to delete: " + err.message);
    }
  };

  const openEditModal = (itemOrRequest, type) => {
    setEditing({ ...itemOrRequest, type });
    setEditForm({
      category_id: itemOrRequest.category_id || "",
      description: itemOrRequest.description || "",
      phone: type === "item" ? itemOrRequest.phone_number || "" : itemOrRequest.phone || "",
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
      const updateData = editing.type === "item" 
        ? { category_id: editForm.category_id, description: editForm.description, phone_number: editForm.phone, location: editForm.location }
        : { category_id: editForm.category_id, description: editForm.description, phone: editForm.phone, location: editForm.location };

      const { error } = await supabase.from(table).update(updateData).eq("id", id);
      if (error) throw error;

      if (editing.type === "item") {
        setItems((prev) => prev.map((i) => i.id === id ? { ...i, ...updateData } : i));
      } else {
        setRequests((prev) => prev.map((r) => r.id === id ? { ...r, ...updateData } : r));
      }
      setEditing(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff7f0] text-slate-900 selection:bg-orange-100 pb-20">
      <NavBar variant="profile" title="My Profile" subtitle={user?.email || ""} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-24">
        {/* HEADER SECTION */}
        <header className="mb-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Dashboard</h1>
              <p className="text-slate-500 font-medium text-sm sm:text-base">Manage your contributions.</p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:flex">
              <button
                onClick={() => router.push("/bundle-request")}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-[11px] sm:text-sm font-bold text-[#e25e2d] bg-orange-50 border border-orange-100 active:scale-95 transition-all"
              >
                <Plus size={16} /> Request
              </button>
              <button
                onClick={() => router.push("/donate")}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-[11px] sm:text-sm font-bold text-white bg-[#e25e2d] shadow-lg shadow-orange-200 active:scale-95 transition-all"
              >
                <Plus size={16} /> Add Item
              </button>
            </div>
          </div>

          {/* STATS - Scrollable on very small screens */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-8">
            <StatCard icon={<Package className="text-orange-600" size={20} />} label="Total" value={items.length} />
            <StatCard icon={<Clock className="text-blue-600" size={20} />} label="Open" value={items.filter(i => !i.is_sold).length} />
            <StatCard icon={<CheckCircle className="text-emerald-600" size={20} />} label="Reserved" value={items.filter(i => i.is_sold).length} />
            <StatCard icon={<FileText className="text-purple-600" size={20} />} label="Needs" value={requests.length} />
          </div>
        </header>

        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-10">
          {/* MY ITEMS */}
          <section className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
              <h2 className="text-lg font-bold">My Collection</h2>
              <span className="bg-orange-100 text-[#e25e2d] px-2 py-0.5 rounded-lg text-[10px] font-black">{items.length}</span>
            </div>

            {items.length === 0 ? (
              <EmptyState message="No items shared yet." action={() => router.push("/donate")} />
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="bg-white border border-slate-100 p-3 sm:p-4 rounded-3xl flex gap-4 transition-all hover:shadow-xl hover:shadow-orange-500/5">
                    <div className="h-20 w-20 sm:h-24 sm:w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-slate-100">
                      <img src={item.image_url || "/images/placeholder.png"} alt="" className="h-full w-full object-cover" />
                    </div>

                    <div className="flex flex-1 flex-col justify-between min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-bold text-slate-800 text-sm sm:text-base leading-tight truncate">{item.description}</h3>
                        <div className="flex gap-1">
                          <button onClick={() => openEditModal(item, "item")} className="p-2 text-slate-400 hover:text-orange-500 active:bg-orange-50 rounded-full">
                            <Edit size={16} />
                          </button>
                          <button onClick={() => deleteItem(item.id)} className="p-2 text-slate-400 hover:text-red-500 active:bg-red-50 rounded-full">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-auto">
                        <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1 truncate max-w-[100px] sm:max-w-none">
                          <MapPin size={10} /> {item.location}
                        </p>
                        <StatusBadge isSold={item.is_sold} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* REQUESTS */}
          <section className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
              <h2 className="text-lg font-bold">Active Requests</h2>
            </div>
            <div className="space-y-3">
              {requests.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs italic bg-white rounded-[2rem] border border-slate-100">No active requests</div>
              ) : (
                requests.map((req) => (
                  <div key={req.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between group">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-9 w-9 rounded-xl bg-orange-50 text-[#e25e2d] flex items-center justify-center flex-shrink-0">
                        <Hash size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-xs sm:text-sm text-slate-800 truncate">{req.description}</p>
                        <p className="text-[9px] uppercase font-black text-slate-300">{new Date(req.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex gap-1 ml-2">
                      <button onClick={() => openEditModal(req, "request")} className="p-2 text-slate-400 active:bg-orange-50 rounded-lg">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => deleteRequest(req.id)} className="p-2 text-slate-400 active:bg-red-50 rounded-lg">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* MODAL */}
        {editing && (
          <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-sm p-0 sm:p-4">
             <EditModal {...{ editing, editForm, setEditForm, handleUpdate, setEditing, categories, loading }} />
          </div>
        )}
      </main>
    </div>
  );
}

function EditModal({ editing, editForm, setEditForm, handleUpdate, setEditing, categories, loading }) {
  return (
    <div className="w-full max-w-lg bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom sm:zoom-in duration-300">
      <div className="h-1.5 bg-[#e25e2d] w-full" />
      <div className="p-6 sm:p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black">Edit <span className="text-[#e25e2d]">{editing.type}</span></h2>
          <button onClick={() => setEditing(null)} className="p-2 bg-slate-50 text-slate-400 rounded-full"><X size={18} /></button>
        </div>
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400">Category</label>
            <select
              value={editForm.category_id}
              onChange={(e) => setEditForm({ ...editForm, category_id: e.target.value })}
              className="w-full rounded-xl border-slate-100 bg-slate-50 p-3.5 text-sm outline-none focus:ring-2 focus:ring-orange-500/20"
            >
              {categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400">Description</label>
            <textarea
              rows={3}
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              className="w-full rounded-xl border-slate-100 bg-slate-50 p-3.5 text-sm outline-none resize-none"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400">Location</label>
              <input value={editForm.location} onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} className="w-full rounded-xl bg-slate-50 p-3.5 text-sm outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400">Contact</label>
              <input value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} className="w-full rounded-xl bg-slate-50 p-3.5 text-sm outline-none" />
            </div>
          </div>
          <button
            onClick={() => handleUpdate(editing.id)}
            disabled={loading}
            className="w-full bg-[#e25e2d] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest mt-4 active:scale-95 transition-all"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="p-4 rounded-[1.5rem] bg-white border border-slate-100 shadow-sm">
      <div className="flex flex-col gap-2">
        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">{icon}</div>
        <div>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{label}</p>
          <p className="text-xl font-black text-slate-900 leading-none">{value}</p>
        </div>
      </div>
    </div>
  );
}

const EmptyState = ({ message, action }) => (
  <div className="flex flex-col items-center justify-center p-8 rounded-[2rem] border-2 border-dashed border-slate-100 bg-white/50 text-center">
    <Package className="text-slate-200 mb-2" size={32} />
    <p className="text-slate-400 text-xs font-bold mb-4">{message}</p>
    <button onClick={action} className="px-5 py-2 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase">Start</button>
  </div>
);

function StatusBadge({ isSold }) {
  return (
    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase ${isSold ? "bg-orange-50 text-orange-600" : "bg-emerald-50 text-emerald-600"}`}>
      {isSold ? "Reserved" : "Open"}
    </span>
  );
}