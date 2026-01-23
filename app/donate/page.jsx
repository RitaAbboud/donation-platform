"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { Poppins } from "next/font/google";
import { MapPin, Upload, Phone } from "lucide-react";
import dynamic from "next/dynamic";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

// Dynamic import for map (no SSR)
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

  const handleImage = (e) =>
    setForm((p) => ({ ...p, image: e.target.files[0] }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1️ Get current user
      const { data, error: userError } = await supabase.auth.getUser();
      if (userError || !data.user) throw new Error("You must be logged in");
      const user = data.user;

      // 2️ Upload image if exists
      let image_url = null;
      if (form.image) {
        const ext = form.image.name.split(".").pop();
        const path = `${user.id}/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase
          .storage
          .from("donations")
          .upload(path, form.image);
        if (uploadError) throw uploadError;
        image_url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/donations/${path}`;
      }

      // 3️ Insert item
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
      alert("Error adding item: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-[#fff6ef] text-slate-900 ${poppins.className}`}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[#fae9d7]/20 z-0 hidden lg:block" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 lg:py-20">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          {/* Left */}
          <div className="lg:w-1/3 space-y-6">
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 text-slate-400 hover:text-[#e25e2d] transition-colors text-sm font-bold uppercase tracking-widest"
            >
              ← Back to Shop
            </button>
            <h1 className="text-5xl font-black text-slate-900 leading-tight">
              Give your items <br />
              <span className="text-[#e25e2d]">New Life.</span>
            </h1>
            <p className="text-slate-500 text-lg leading-relaxed">
              Your unwanted treasures could be exactly what someone else is searching for. 
              Join our community of mindful sharing.
            </p>
          </div>

          {/* Right Form */}
          <div className="w-full lg:w-2/3 bg-white border border-[#fae9d7] rounded-2xl shadow-sm p-8 md:p-12">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Category */}
              <div className="flex flex-col gap-2 md:col-span-1">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                  Category
                </label>
                <select
                  name="category_id"
                  value={form.category_id}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-[#fae9d7] bg-[#fff6ef] px-4 py-3 text-sm focus:border-[#e25e2d] outline-none transition-all cursor-pointer"
                >
                  <option value="">Select a category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Cost */}
              <div className="flex flex-col gap-2 md:col-span-1">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                  Price ($)
                </label>
                <input
                  type="number"
                  name="cost"
                  value={form.cost}
                  max={fixedPrice || ""}
                  onChange={handleChange}
                  placeholder={fixedPrice ? `Max ${fixedPrice}` : "0.00"}
                  required
                  className="w-full rounded-xl border border-[#fae9d7] bg-[#fff6ef] px-4 py-3 text-sm focus:border-[#e25e2d] outline-none transition-all"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                  Item description
                </label>
                <textarea
                  rows={3}
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="e.g: Winter jacket, size M, gently used"
                  required
                  className="w-full rounded-xl border border-[#fae9d7] bg-[#fff6ef] px-4 py-3 text-sm focus:border-[#e25e2d] outline-none transition-all"
                />
              </div>

              {/* Location */}
              <div className="flex flex-col gap-2 md:col-span-2 relative">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                  Location
                </label>
                <DonateMap form={form} setForm={setForm} />
                <input
                  name="location"
                  value={form.location}
                  readOnly
                  required
                  className="w-full rounded-xl border border-[#fae9d7] bg-[#fff6ef] px-4 py-3 text-sm focus:border-[#e25e2d] outline-none transition-all mt-2"
                />
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-2 md:col-span-1">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                  Contact Number
                </label>
                <div className="relative">
                  <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#f3a552]" />
                  <input
                    name="phone_number"
                    value={form.phone_number}
                    onChange={handleChange}
                    placeholder="71 234 567"
                    required
                    className="w-full rounded-xl border border-[#fae9d7] bg-[#fff6ef] pl-10 pr-4 py-3 text-sm focus:border-[#e25e2d] outline-none transition-all"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                  Item Photo
                </label>
                <label className="group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#fae9d7] p-8 cursor-pointer bg-[#fff6ef] hover:bg-white hover:border-[#e25e2d] transition-all">
                  <div className="flex flex-col items-center gap-2">
                    <div className="p-3 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
                      <Upload size={24} className="text-[#e25e2d]" />
                    </div>
                    <span className="text-sm font-bold text-slate-600">
                      {form.image ? form.image.name : "Click to upload image"}
                    </span>
                    <span className="text-xs text-slate-400">PNG, JPG up to 10MB</span>
                  </div>
                  <input type="file" hidden onChange={handleImage} />
                </label>
              </div>

              {/* Submit */}
              <div className="md:col-span-2 pt-4">
                {costError && (
                  <p className="text-xs text-red-500 mb-4 font-bold uppercase tracking-tight">⚠️ {costError}</p>
                )}
                <button
                  disabled={loading}
                  className="w-full bg-[#e25e2d] text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-[#d14d1c] shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Processing..." : "Confirm Donation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
