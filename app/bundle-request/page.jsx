"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { Poppins } from "next/font/google";
import { Phone } from "lucide-react";
import dynamic from "next/dynamic";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] });

// Dynamic import to prevent SSR issues
const BundleRequestMap = dynamic(() => import("./BundleRequestMap"), { ssr: false });

export default function BundleRequestPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    category_id: "",
    description: "",
    phone: "",
    location: "",
    lat: null,
    lng: null,
  });

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase.from("categories").select("id, name");
      setCategories(data || []);
    }
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) throw new Error("Not authenticated");

      const { error: insertError } = await supabase.from("bundle_requests").insert({
        user_id: data.user.id,
        category_id: form.category_id,
        description: form.description,
        phone: form.phone,
        location: form.location,
        lat: form.lat,
        lng: form.lng,
      });

      if (insertError) throw insertError;
      router.push("/dashboard");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-[#fff6ef] ${poppins.className}`}>
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[#fae9d7]/20 hidden lg:block" />
      <div className="relative max-w-6xl mx-auto px-6 py-12 lg:py-20">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          {/* LEFT */}
          <div className="lg:w-1/3 space-y-6">
            <button
              onClick={() => router.back()}
              className="text-slate-400 hover:text-[#e25e2d] text-sm font-bold uppercase tracking-widest"
            >
              ← Back to shop
            </button>
            <h1 className="text-5xl font-black leading-tight">
              Request a <br />
              <span className="text-[#e25e2d]">Bundle.</span>
            </h1>
            <p className="text-slate-500 text-lg leading-relaxed">
              Request essential items in one place. Our community of donors will
              review your request and respond with care, dignity, and purpose.
            </p>
          </div>

          {/* RIGHT FORM */}
          <div className="w-full lg:w-2/3 bg-white border border-[#fae9d7] rounded-2xl shadow-sm p-8 md:p-12">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* CATEGORY */}
              <div className="md:col-span-2 flex flex-col gap-2 w-full max-w-xs">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                  Category
                </label>
                <select
                  name="category_id"
                  value={form.category_id}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-[#fae9d7] bg-[#fff6ef] px-4 py-3 text-sm focus:border-[#e25e2d] outline-none transition-all"
                >
                  <option value="">Select a category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* DESCRIPTION */}
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                  What do you need?
                </label>
                <textarea
                  rows={3}
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  placeholder="e.g: Winter clothes, blankets, shoes"
                  className="rounded-xl border border-[#fae9d7] bg-[#fff6ef] px-4 py-3 text-sm focus:border-[#e25e2d] outline-none transition-all"
                />
              </div>

              {/* LOCATION */}
              <div className="md:col-span-2 flex flex-col gap-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                  Pick your location
                </label>

                <BundleRequestMap form={form} setForm={setForm} />

                <input
                  name="location"
                  value={form.location}
                  readOnly
                  required
                  className="w-full rounded-xl border border-[#fae9d7] bg-[#fff6ef] px-4 py-3 text-sm focus:border-[#e25e2d] outline-none transition-all mt-2"
                />
              </div>

              {/* PHONE */}
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                  Contact Number
                </label>
                <div className="relative">
                  <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#f3a552]" />
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    placeholder="71 234 567"
                    className="w-full rounded-xl border border-[#fae9d7] bg-[#fff6ef] pl-10 pr-4 py-3 text-sm focus:border-[#e25e2d] outline-none transition-all"
                  />
                </div>
              </div>

              {/* SUBMIT */}
              <div className="md:col-span-2 pt-4 flex justify-center">
                <button
                  disabled={loading}
                  className="bg-[#e25e2d] text-white px-8 py-3 rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-[#d14d1c] transition-all shadow-sm active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
