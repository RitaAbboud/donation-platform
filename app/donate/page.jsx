"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { Poppins } from "next/font/google";
import { X, Upload, Phone, ArrowLeft } from "lucide-react";
import dynamic from "next/dynamic";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const DonateMap = dynamic(() => import("./DonateMap"), { ssr: false });

export default function DonatePage() {
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [fixedPrice, setFixedPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [costError, setCostError] = useState("");

  const [form, setForm] = useState({
    category_id: "",
    description: "",
    location: "",
    lat: null,
    lng: null,
    phone_number: "",
    image: null,
    imagePreview: null,
    cost: "",
  });

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase
        .from("categories")
        .select("id, name, fixed_price");
      setCategories(data || []);
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    return () => {
      if (form.imagePreview) URL.revokeObjectURL(form.imagePreview);
    };
  }, [form.imagePreview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "category_id") {
      const selected = categories.find((c) => String(c.id) === value);
      setFixedPrice(selected?.fixed_price ?? null);
      setForm((p) => ({ ...p, category_id: value, cost: "" }));
      setCostError("");
      return;
    }
    if (name === "cost") {
      const num = Number(value);
      if (num < 0) return;
      if (fixedPrice !== null && num > fixedPrice)
        setCostError(`Maximum allowed: ${fixedPrice}`);
      else setCostError("");
    }
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (form.imagePreview) URL.revokeObjectURL(form.imagePreview);
      setForm((p) => ({
        ...p,
        image: file,
        imagePreview: URL.createObjectURL(file)
      }));
    }
  };

  const removeImage = (e) => {
    e.preventDefault(); 
    e.stopPropagation();
    if (form.imagePreview) URL.revokeObjectURL(form.imagePreview);
    setForm((p) => ({ ...p, image: null, imagePreview: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (costError) return;
    setLoading(true);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("You must be logged in");

      let image_url = null;
      if (form.image) {
        const ext = form.image.name.split(".").pop();
        const path = `${user.id}/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage.from("donations").upload(path, form.image);
        if (uploadError) throw uploadError;
        const { data: publicUrlData } = supabase.storage.from("donations").getPublicUrl(path);
        image_url = publicUrlData.publicUrl;
      }

      const { error: insertError } = await supabase.from("items").insert({
        owner_id: user.id,
        category_id: form.category_id,
        description: form.description,
        location: form.location,
        lat: form.lat,
        lng: form.lng,
        phone_number: form.phone_number,
        image_url,
        cost: Number(form.cost),
        is_sold: false,
      });

      if (insertError) throw insertError;
      alert("Item added successfully!");
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-[#fff6ef] text-slate-900 ${poppins.className} pb-10`}>
      {/* Background decoration - only lg */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[#fae9d7]/20 z-0 hidden lg:block" />

      {/* Mobile Top Header */}
      <div className="lg:hidden flex items-center p-4 bg-white/50 backdrop-blur-md sticky top-0 z-[100] border-b border-[#fae9d7]">
        <button onClick={() => router.back()} className="p-2 -ml-2 text-slate-600">
            <ArrowLeft size={20} />
        </button>
        <span className="ml-2 font-bold text-sm uppercase tracking-widest text-slate-400">Add Listing</span>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-6 lg:py-20">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">

          {/* Left Sidebar - Adjusted for Mobile Visibility */}
          <div className="w-full lg:w-1/3 space-y-4 lg:space-y-6 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
              Give your items <br />
              <span className="text-[#e25e2d]">New Life.</span>
            </h1>
            <p className="text-slate-500 text-sm sm:text-base lg:text-lg leading-relaxed max-w-md mx-auto lg:mx-0">
              Your unwanted treasures could be exactly what someone else is searching for.
            </p>
          </div>

          {/* Right Form - Mobile Friendly Padding & Grid */}
          <div className="w-full lg:w-2/3 bg-white border border-[#fae9d7] rounded-3xl shadow-sm p-5 sm:p-8 lg:p-12">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 sm:grid sm:grid-cols-2 sm:gap-6">

              {/* Category */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Category</label>
                <select
                  name="category_id"
                  value={form.category_id}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-[#fae9d7] bg-[#fff6ef] px-4 py-4 text-sm focus:border-[#e25e2d] outline-none transition-all cursor-pointer appearance-none"
                >
                  <option value="">Select a category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Cost */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Price ($)</label>
                <input
                  type="number"
                  name="cost"
                  value={form.cost}
                  max={fixedPrice || ""}
                  onChange={handleChange}
                  placeholder={fixedPrice ? `Max ${fixedPrice}` : "0.00"}
                  required
                  className="w-full rounded-2xl border border-[#fae9d7] bg-[#fff6ef] px-4 py-4 text-sm focus:border-[#e25e2d] outline-none transition-all"
                />
              </div>

              {/* Photo Upload - Height optimized for mobile */}
              <div className="flex flex-col gap-2 sm:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Item Photo</label>
                <div className="relative">
                  {form.imagePreview ? (
                    <div className="relative group w-full h-56 sm:h-72 rounded-2xl overflow-hidden border-2 border-[#fae9d7] shadow-inner bg-slate-50">
                      <img src={form.imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 lg:bg-black/20 flex items-center justify-center">
                        <button
                          onClick={removeImage}
                          type="button"
                          className="bg-white text-red-500 p-3 rounded-full shadow-2xl active:scale-90 lg:hover:scale-110 transition-all"
                        >
                          <X size={20} strokeWidth={3} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#fae9d7] p-8 sm:p-12 cursor-pointer bg-[#fff6ef] active:bg-white transition-all duration-300">
                      <div className="flex flex-col items-center gap-3">
                        <div className="p-3 bg-white rounded-xl shadow-sm">
                          <Upload size={24} className="text-[#e25e2d]" />
                        </div>
                        <div className="text-center">
                          <span className="block text-xs font-bold text-slate-700">Tap to upload photo</span>
                        </div>
                      </div>
                      <input type="file" hidden accept="image/*" onChange={handleImage} />
                    </label>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-2 sm:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Description</label>
                <textarea
                  rows={3}
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Tell us about the item..."
                  required
                  className="w-full rounded-2xl border border-[#fae9d7] bg-[#fff6ef] px-4 py-4 text-sm focus:border-[#e25e2d] outline-none transition-all resize-none"
                />
              </div>

              {/* Location - Map height restricted for mobile */}
              <div className="flex flex-col gap-2 sm:col-span-2 relative">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Location</label>
                <div className="rounded-2xl overflow-hidden border border-[#fae9d7] h-48 sm:h-64">
                    <DonateMap form={form} setForm={setForm} />
                </div>
                <input
                  name="location"
                  value={form.location}
                  readOnly
                  required
                  placeholder="Locate on map..."
                  className="w-full rounded-2xl border border-[#fae9d7] bg-[#fff6ef] px-4 py-4 text-sm outline-none mt-2 truncate"
                />
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-2 sm:col-span-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Contact</label>
                <div className="relative">
                  <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#f3a552]" />
                  <input
                    name="phone_number"
                    value={form.phone_number}
                    onChange={handleChange}
                    placeholder="71 234 567"
                    required
                    className="w-full rounded-2xl border border-[#fae9d7] bg-[#fff6ef] pl-10 pr-4 py-4 text-sm focus:border-[#e25e2d] outline-none transition-all"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="sm:col-span-2 pt-2">
                {costError && (
                  <p className="text-[10px] text-red-500 mb-3 font-bold uppercase tracking-tight text-center">⚠️ {costError}</p>
                )}
                <button
                  disabled={loading || !!costError}
                  className="w-full bg-[#e25e2d] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg active:scale-95 disabled:opacity-50 transition-all"
                >
                  {loading ? "Adding..." : "Confirm Listing"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}