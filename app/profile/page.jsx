"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import NavBar from "../../components/NavBar";
import { Package, CheckCircle, Clock, Phone } from "lucide-react";
import BundleRequestMap from "../bundle-request/BundleRequestMap";

export default function MyProfile() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRequest, setEditingRequest] = useState(null);
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
      supabase.from("bundle_requests").select("*").eq("user_id", user.id).order("created_at", { ascending: false })
    ]);

    setItems(itemsRes.data || []);
    setRequests(requestsRes.data || []);
    setLoading(false);
  };

  loadInitialData();
}, [router]);
  
  async function deleteRequest(id) {
    const { error } = await supabase.from("bundle_requests").delete("id", id).eq("user_id ", user.id);
    if (error) {
      alert(error);
      return;
    }
  }



const openEditModal = (req) => {
  setEditingRequest(req);
  setEditForm({
    category_id: req.category_id || "",
    description: req.description || "",
    phone: req.phone || "",
    location: req.location || "",
    lat: req.lat || null,
    lng: req.lng || null,
  });
  };
  
const handleUpdate = async (id) => {
  setLoading(true);
  try {
    const { error } = await supabase
      .from("bundle_requests")
      .update({
        category_id: editForm.category_id,
        description: editForm.description,
        phone: editForm.phone,
        location: editForm.location,
        lat: editForm.lat,
        lng: editForm.lng,
      })
      .eq("id", id);

    if (error) throw error;

    // Refresh local state so UI updates
    setRequests(prev => prev.map(r => r.id === id ? { ...r, ...editForm } : r));
    setEditingRequest(null);
  } catch (err) {
    alert(err.message);
  } finally {
    setLoading(false);
  }
};

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-slate-500
                      bg-[#fff7f0]">
        Loading profile…
      </div>
    );
  }

  const totalItems = items.length;
  const availableItems = items.filter((i) => !i.is_sold).length;
  const reservedItems = items.filter((i) => i.is_sold).length;

  return (
    <div className="min-h-screen bg-[#fff7f0]">
      {/* ================= NAVBAR ================= */}
      <NavBar variant="profile" title="My Profile" subtitle={user.email} />

      {/* ================= PAGE ================= */}
      <div className="max-w-6xl mx-auto px-6 pt-32 pb-32 space-y-20">

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <StatCard icon={<Package />} label="Total Items" value={totalItems} />
          <StatCard icon={<Clock />} label="Available" value={availableItems} />
          <StatCard icon={<CheckCircle />} label="Reserved" value={reservedItems} />
        </div>

        {/* ================= MY ITEMS ================= */}
        <div>
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-extrabold tracking-tight text-[#e25e2d]">
              My Items
            </h2>

            <button
              onClick={() => router.push("/donate")}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white
                         bg-[#e25e2d] 
                         shadow-[0_15px_35px_-15px_rgba(226,94,45,0.7)]
                         hover:scale-[1.03] transition"
            >
              + Add Item
            </button>
          </div>

          {items.length === 0 ? (
            <div
              className="rounded-3xl bg-white/80 backdrop-blur-xl p-14 text-center
                         shadow-[0_30px_70px_-30px_rgba(226,94,45,0.35)]"
            >
              <p className="text-slate-500 mb-6">
                You haven’t added any items yet.
              </p>
              <button
                onClick={() => router.push("/donate")}
                className="px-8 py-3 rounded-xl text-white font-semibold
                           bg-gradient-to-br from-[#e25e2d] to-[#f3a552]
                           shadow-[0_15px_30px_-10px_rgba(226,94,45,0.6)]
                           hover:scale-[1.03] transition"
              >
                Add your first item
              </button>
            </div>
          ) : (
            <div className="grid gap-8">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="relative flex gap-6 p-6 rounded-3xl
                             bg-white/85 backdrop-blur-xl
                             shadow-[0_30px_70px_-30px_rgba(226,94,45,0.35)]
                             hover:-translate-y-1
                             hover:shadow-[0_40px_90px_-35px_rgba(226,94,45,0.45)]
                             transition-all duration-300"
                >
                  {/* ORANGE STRIPE */}
                  <div className="absolute left-0 top-6 bottom-6 w-1.5 rounded-full
                                  bg-gradient-to-b from-[#e25e2d] to-[#f3a552]" />

                  <img
                    src={item.image_url || "/images/placeholder.png"}
                    alt=""
                    className="w-28 h-28 rounded-2xl object-cover
                               shadow-[0_15px_30px_-15px_rgba(0,0,0,0.4)]"
                  />

                  <div className="flex-1">
                    <p className="font-bold text-lg text-slate-900 line-clamp-1">
                      {item.description}
                    </p>

                    <p className="text-sm text-slate-500 mt-2">
                      {item.location}
                    </p>

                    <p className="text-sm text-slate-500">
                     
                      {item.cost}
                    </p>

                    <div className="mt-4">
                      <StatusBadge isSold={item.is_sold} />
                    </div>
                  </div>
                </div>
              ))}
                
            </div>
          )}
        </div>

        {/* ================= MY REQUESTS ================= */}
        <div>
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-extrabold tracking-tight text-[#e25e2d]">
              Bundle Requests
            </h2>
                        <button
              onClick={() => router.push("/bundle-request")}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white
                         bg-[#e25e2d] 
                         shadow-[0_15px_35px_-15px_rgba(226,94,45,0.7)]
                         hover:scale-[1.03] transition"
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
                  className="group relative flex items-center justify-between p-6 rounded-3xl bg-white/85 backdrop-blur-xl shadow-[0_20px_50px_-20px_rgba(226,94,45,0.2)] hover:shadow-[0_30px_60px_-25px_rgba(226,94,45,0.3)] transition-all duration-300 border border-white"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-[#e25e2d]">
                      <Package size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">
                        {req.description}
                      </h3>
                      <p className="text-xs text-slate-400 font-mono">
                        {new Date(req.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                   
                <button 
                    onClick={() => deleteRequest(req.id)} 
                    className="p-3 rounded-xl bg-slate-50 text-slate-400 cursor-pointer hover:bg-[#e25e2d] hover:text-white transition-colors"
                  >
                    delete
                </button>
                  <button onClick={() => openEditModal(req)} className="p-3 rounded-xl bg-slate-50 text-slate-400 cursor-pointer hover:bg-[#e25e2d] hover:text-white transition-colors">
                            edit
                  </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
       {editingRequest && (
  <>
    {/* Overlay */}
    <div 
      className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-[100]" 
      onClick={() => setEditingRequest(null)} 
    />
    
    {/* Drawer */}
    <div className="fixed right-0 top-0 h-full w-full max-w-xl bg-[#fff6ef] shadow-2xl z-[110] overflow-y-auto p-8 animate-in slide-in-from-right duration-300">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black text-slate-900">
          Edit <span className="text-[#e25e2d]">Request</span>
        </h2>
        <button 
          onClick={() => setEditingRequest(null)} 
          className="text-slate-400 hover:text-red-500 text-2xl font-bold"
        >
          ×
        </button>
      </div>

      <div className="space-y-6 bg-white p-6 rounded-2xl border border-[#fae9d7]">
        
        {/* Category */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Category</label>
          <select
            value={editForm.category_id}
            onChange={(e) => setEditForm({...editForm, category_id: e.target.value})}
            className="w-full rounded-xl border border-[#fae9d7] bg-[#fff6ef] px-4 py-3 text-sm focus:border-[#e25e2d] outline-none transition-all"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">What do you need?</label>
          <textarea
            rows={3}
            value={editForm.description}
            onChange={(e) => setEditForm({...editForm, description: e.target.value})}
            placeholder="Describe your needs..."
            className="rounded-xl border border-[#fae9d7] bg-[#fff6ef] px-4 py-3 text-sm focus:border-[#e25e2d] outline-none transition-all"
          />
        </div>

        {/* Location - CHANGED FROM MAP TO INPUT */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Delivery Location</label>
          <div className="relative">            
             <input
              type="text"
              value={editForm.location}
              onChange={(e) => setEditForm({...editForm, location: e.target.value})}
              placeholder="Enter your street or neighborhood"
              className="w-full rounded-xl border border-[#fae9d7] bg-[#fff6ef] pl-10 pr-4 py-3 text-sm focus:border-[#e25e2d] outline-none transition-all"
            />
          </div>
          <p className="text-[10px] text-slate-400 ml-1 italic">* Please provide a clear neighborhood or building name</p>
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Contact Number</label>
          <div className="relative">
            <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#f3a552]" />
            <input
              type="text"
              value={editForm.phone}
              onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
              placeholder="71 234 567"
              className="w-full rounded-xl border border-[#fae9d7] bg-[#fff6ef] pl-10 pr-4 py-3 text-sm focus:border-[#e25e2d] outline-none transition-all"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="pt-6 flex gap-4">
          <button
            onClick={() => setEditingRequest(null)}
            className="flex-1 px-6 py-3 rounded-xl font-bold text-slate-400 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => handleUpdate(editingRequest.id)}
            disabled={loading}
            className="flex-1 bg-[#e25e2d] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#d14d1c] transition-all shadow-lg shadow-orange-200 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Saving..." : "Update Request"}
          </button>
        </div>
      </div>
    </div>
  </>
)}
      </div>
    </div>
  );
}



function StatCard({ icon, label, value }) {
  return (
    <div className="p-8 rounded-3xl bg-white/80 backdrop-blur-xl
                    shadow-[0_25px_60px_-25px_rgba(226,94,45,0.3)]
                    hover:-translate-y-1 transition-all">
      <div className="flex items-center gap-3 text-[#e25e2d]
                      text-sm font-semibold uppercase tracking-wide">
        {icon}
        {label}
      </div>
      <p className="text-4xl font-extrabold mt-6 text-slate-900">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ isSold }) {
  return isSold ? (
    <span className="inline-flex px-4 py-1 rounded-full text-xs font-semibold
                     bg-orange-100 text-orange-700">
      Reserved
    </span>
  ) : (
    <span className="inline-flex px-4 py-1 rounded-full text-xs font-semibold
                     bg-green-100 text-green-700">
      Available
    </span>
  );
}
