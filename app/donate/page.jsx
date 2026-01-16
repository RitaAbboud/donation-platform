"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { Poppins } from "next/font/google";
import { MapPin, Upload } from "lucide-react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export default function DonatePage() {
  const router = useRouter();

  const [categories, setCategories] = useState([]);
  const [fixedPrice, setFixedPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [costError, setCostError] = useState("");

  const [form, setForm] = useState({
    category_id: "",
    description: "",
    location: "",
    phone_number: "",
    image: null,
    cost: "",
  });

  const locations = ["Beirut", "Tripoli", "Saida", "Jbeil", "Zahle"];

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

  const handleLocationSelect = (loc) => {
    setForm((p) => ({ ...p, location: loc }));
    setLocationOpen(false);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (fixedPrice !== null && Number(form.cost) > fixedPrice) {
    setCostError(`Maximum allowed: ${fixedPrice}`);
    return;
  }

  setLoading(true);
  try {
    // 1️⃣ Get current user correctly
    const { data, error: userError } = await supabase.auth.getUser();
    if (userError || !data.user) throw new Error("You must be logged in");
    const user = data.user;

    // 2️⃣ Upload image if exists
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

    // 3️⃣ Insert item
    const { error: insertError } = await supabase.from("items").insert({
      owner_id: user.id,
      category_id: form.category_id,
      description: form.description,
      location: form.location,
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
    <div className={`relative min-h-screen bg-[#fff6ef] overflow-hidden ${poppins.className}`}>

      {/* ===== TOP WAVE (HALF PAGE) ===== */}
      <div className="absolute top-0 left-0 w-full h-[60vh] z-0">
        <svg
          viewBox="0 0 1200 300"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <path
            d="
              M0,180
              C150,260 350,80 600,140
              C850,200 1050,120 1200,160
              L1200,0
              L0,0
              Z
            "
            fill="#ffd8c2"
          />
        </svg>
      </div>

      {/* ===== DONATE CARD ===== */}
      <div className="relative z-10 flex justify-center pt-[10vh] pb-40">

        <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 md:p-10">

          <h2 className="text-3xl font-bold text-center text-[#e25e2d]">
  Donate an Item
</h2>
<p className="text-center text-gray-500 text-sm mt-2 mb-10">
  Share items you no longer need and help someone today
</p>

<form onSubmit={handleSubmit} className="space-y-5">

  {/* CATEGORY */}
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700">
      Category
    </label>
    <select
      name="category_id"
      value={form.category_id}
      onChange={handleChange}
      required
      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm
                 focus:border-[#e25e2d] focus:ring-2 focus:ring-orange-100 outline-none"
    >
      <option value="">Select a category</option>
      {categories.map((c) => (
        <option key={c.id} value={c.id}>{c.name}</option>
      ))}
    </select>
  </div>

  {/* DESCRIPTION */}
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700">
      Item description
    </label>
    <input
      name="description"
      value={form.description}
      onChange={handleChange}
      placeholder="e.g: Winter jacket, size M, gently used"
      required
      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm
                 focus:border-[#e25e2d] focus:ring-2 focus:ring-orange-100 outline-none"
    />
  </div>

  {/* LOCATION */}
  <div className="flex flex-col gap-1 relative">
    <label className="text-sm font-medium text-gray-700">
      Location
    </label>
    <div className="relative">
      <MapPin
        size={16}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input
        value={form.location}
        onChange={(e) => {
          setForm((p) => ({ ...p, location: e.target.value }));
          setLocationOpen(true);
        }}
        placeholder="Select your city"
        required
        className="w-full rounded-xl border border-gray-300 pl-10 pr-4 py-3 text-sm
                   focus:border-[#e25e2d] focus:ring-2 focus:ring-orange-100 outline-none"
      />
    </div>

    {locationOpen && (
      <div className="absolute top-[72px] w-full rounded-xl border bg-white shadow-lg z-30">
        {locations
          .filter((l) =>
            l.toLowerCase().includes(form.location.toLowerCase())
          )
          .map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => handleLocationSelect(l)}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-orange-50"
            >
              {l}
            </button>
          ))}
      </div>
    )}
  </div>

  {/* PHONE */}
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700">
      Phone number
    </label>
    <input
      name="phone_number"
      value={form.phone_number}
      onChange={handleChange}
      placeholder="e.g. 71 234 567"
      required
      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm
                 focus:border-[#e25e2d] focus:ring-2 focus:ring-orange-100 outline-none"
    />
  </div>

  {/* IMAGE */}
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700">
      Item image (optional)
    </label>
    <label className="flex items-center justify-between rounded-xl border border-dashed
                      border-gray-300 px-4 py-3 cursor-pointer
                      bg-gray-50 hover:bg-orange-50 transition">
      <span className="text-sm text-gray-500">
        {form.image ? form.image.name : "Upload an image"}
      </span>
      <Upload size={18} className="text-gray-500" />
      <input type="file" hidden onChange={handleImage} />
    </label>
  </div>

  {/* COST */}
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700">
      Price
    </label>
    <input
      type="number"
      name="cost"
      value={form.cost}
      onChange={handleChange}
      placeholder={fixedPrice ? `Maximum ${fixedPrice}` : "Set a reasonable price"}
      required
      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm
                 focus:border-[#e25e2d] focus:ring-2 focus:ring-orange-100 outline-none"
    />
    {costError && (
      <span className="text-xs text-red-500">{costError}</span>
    )}
  </div>

  {/* SUBMIT */}
  <button
    disabled={loading}
    className="w-full mt-4 bg-[#e25e2d] text-white py-3 rounded-full
               font-semibold tracking-wide
               hover:bg-[#ff7b50] transition"
  >
    {loading ? "Submitting..." : "Donate Item"}
  </button>

</form>

        </div>
      </div>

    </div>
  );
}
