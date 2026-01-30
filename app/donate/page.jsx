"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { Poppins } from "next/font/google";
import { X, Upload, Phone } from "lucide-react";
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
    imagePreview: null, // New field for UI preview
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

  // --- NEW: Image Handling Logic ---
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Cleanup old preview URL to save memory
      if (form.imagePreview) URL.revokeObjectURL(form.imagePreview);

      setForm((p) => ({
        ...p,
        image: file,
        imagePreview: URL.createObjectURL(file)
      }));
    }
  };

  const removeImage = (e) => {
    e.preventDefault(); // Prevent form bubbling
    if (form.imagePreview) URL.revokeObjectURL(form.imagePreview);
    setForm((p) => ({ ...p, image: null, imagePreview: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error: userError } = await supabase.auth.getUser();
      if (userError || !data.user) throw new Error("You must be logged in");
      const user = data.user;

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

      // Cleanup preview memory before redirecting
      if (form.imagePreview) URL.revokeObjectURL(form.imagePreview);

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
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[#fae9d7]/20 z-0 hidden lg:block" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 lg:py-20">
        <div className="flex flex-col lg:flex-row gap-16 items-start">

          {/* Left Sidebar */}
          <div className="lg:w-1/3 space-y-6">

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
              {/* --- ENHANCED IMAGE UPLOAD SECTION --- */}
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                  Item Photo
                </label>

                <div className="relative">
                  {form.imagePreview ? (
                    <div className="relative group w-full h-72 rounded-2xl overflow-hidden border-2 border-[#fae9d7] shadow-inner bg-slate-50">
                      <img
                        src={form.imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={removeImage}
                          type="button"
                          className="bg-white text-red-500 p-4 rounded-full shadow-2xl hover:bg-red-500 hover:text-white transition-all transform hover:scale-110 active:scale-95"
                        >
                          <X size={24} strokeWidth={3} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#fae9d7] p-12 cursor-pointer bg-[#fff6ef] hover:bg-white hover:border-[#e25e2d] transition-all duration-300">
                      <div className="flex flex-col items-center gap-3">
                        <div className="p-4 bg-white rounded-2xl shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all">
                          <Upload size={32} className="text-[#e25e2d]" />
                        </div>
                        <div className="text-center">
                          <span className="block text-sm font-bold text-slate-700">Click to upload photo</span>
                          <span className="text-xs text-slate-400">PNG or JPG (Max 10MB)</span>
                        </div>
                      </div>
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleImage}
                      />
                    </label>
                  )}
                </div>
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
                  placeholder="Select on map above..."
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

              {/* Submit Button */}
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