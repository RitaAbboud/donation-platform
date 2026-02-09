"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { Poppins } from "next/font/google";
import { Phone, ArrowLeft, PackagePlus } from "lucide-react";
import dynamic from "next/dynamic";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "600", "700"] });

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
    <div className={`min-h-screen bg-[#fff6ef] text-slate-900 ${poppins.className} pb-10`}>
      {/* Background decoration - only lg */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[#fae9d7]/20 z-0 hidden lg:block" />

      {/* Mobile Top Header */}
      <div className="lg:hidden flex items-center p-4 bg-white/60 backdrop-blur-md sticky top-0 z-[100] border-b border-[#fae9d7]">
        <button onClick={() => router.back()} className="p-2 -ml-2 text-slate-600">
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-2 ml-2">
          <PackagePlus size={16} className="text-[#e25e2d]" />
          <span className="font-bold text-xs uppercase tracking-widest text-slate-500">New Request</span>
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8 lg:py-20">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
          
          {/* LEFT SIDEBAR */}
          <div className="w-full lg:w-1/3 space-y-4 lg:space-y-6 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl font-black leading-tight text-slate-900">
              Request a <br />
              <span className="text-[#e25e2d]">Bundle.</span>
            </h1>
            <p className="text-slate-500 text-sm sm:text-lg leading-relaxed max-w-md mx-auto lg:mx-0 font-medium">
              Request essential items in one place. Our community will review and respond with care.
            </p>
          </div>

          {/* RIGHT FORM */}
          <div className="w-full lg:w-2/3 bg-white border border-[#fae9d7] rounded-[2.5rem] shadow-sm p-6 sm:p-10 lg:p-12">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              
              {/* CATEGORY */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Bundle Category
                </label>
                <select
                  name="category_id"
                  value={form.category_id}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-[#fae9d7] bg-[#fff6ef] px-4 py-4 text-sm focus:border-[#e25e2d] outline-none transition-all appearance-none cursor-pointer font-medium"
                >
                  <option value="">Select a category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* DESCRIPTION */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  What do you need?
                </label>
                <textarea
                  rows={4}
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  placeholder="e.g: Winter clothes for a family of 4, size M and L..."
                  className="w-full rounded-2xl border border-[#fae9d7] bg-[#fff6ef] px-4 py-4 text-sm focus:border-[#e25e2d] outline-none transition-all resize-none font-medium placeholder:text-slate-300"
                />
              </div>

              {/* LOCATION */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Delivery Location
                </label>
                <div className="rounded-2xl overflow-hidden border border-[#fae9d7] h-52 sm:h-72">
                  <BundleRequestMap form={form} setForm={setForm} />
                </div>
                <input
                  name="location"
                  value={form.location}
                  readOnly
                  required
                  placeholder="Select location on map above"
                  className="w-full rounded-2xl border border-[#fae9d7] bg-[#fff6ef] px-4 py-4 text-sm outline-none mt-1 truncate font-medium text-slate-600"
                />
              </div>

              {/* PHONE */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Contact Number
                </label>
                <div className="relative">
                  <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#f3a552]" />
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    placeholder="71 234 567"
                    className="w-full rounded-2xl border border-[#fae9d7] bg-[#fff6ef] pl-10 pr-4 py-4 text-sm focus:border-[#e25e2d] outline-none transition-all font-medium"
                  />
                </div>
              </div>

              {/* SUBMIT */}
              <div className="pt-4">
                <button
                  disabled={loading}
                  className="w-full bg-[#e25e2d] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-orange-200 active:scale-95 disabled:opacity-50 transition-all"
                >
                  {loading ? "Processing..." : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}