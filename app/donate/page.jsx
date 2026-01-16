"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { Poppins } from "next/font/google";
import { MapPin, Upload } from "lucide-react";

const poppins = Poppins({ subsets: ["latin"], weight: "700" });

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
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, fixed_price");
      if (error) console.error(error);
      else setCategories(data);
    }
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "category_id") {
      const selected = categories.find((c) => String(c.id) === value);
      setFixedPrice(selected?.fixed_price ?? null);
      setForm((prev) => ({ ...prev, category_id: value, cost: "" }));
      setCostError("");
      return;
    }

    if (name === "cost") {
      const num = Number(value);
      if (num < 0) return;
      if (fixedPrice !== null && num > fixedPrice)
        setCostError(`Maximum allowed: ${fixedPrice}`);
      else setCostError("");
      setForm((prev) => ({ ...prev, cost: value }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImage = (e) => {
    setForm((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleLocationSelect = (loc) => {
    setForm((prev) => ({ ...prev, location: loc }));
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("You must be logged in");

      let image_url = null;
      if (form.image) {
        const ext = form.image.name.split(".").pop();
        const fileName = `${user.id}/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("donations")
          .upload(fileName, form.image);
        if (uploadError) throw uploadError;
        image_url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/donations/${fileName}`;
      }

      const { error } = await supabase.from("items").insert({
        owner_id: user.id,
        category_id: form.category_id,
        description: form.description,
        location: form.location,
        phone_number: form.phone_number,
        image_url,
        cost: Number(form.cost),
        is_sold: false,
      });
      if (error) throw error;

      alert("Item donated successfully!");
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-[#fff7f1] flex justify-center items-start py-12 overflow-hidden font-sans">
      
      {/* --- SMOOTH WAVE LIKE HERO --- */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none -z-10">
        <svg
          className="relative block w-[calc(100%+1.3px)] h-20 md:h-28"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44C191.47,82.34,66.28,98.93,0,105.35V120H1200V0
               C1132.21,36.42,1035.6,69.52,912.45,74.87
               C746.18,82.04,585.15,31.42,321.39,56.44Z"
            fill="#ffd8c2"
          />
        </svg>
      </div>

      {/* --- CARD --- */}
      <div
        className={`relative w-full max-w-lg bg-white p-8 rounded-3xl shadow-2xl z-10 transform hover:-translate-y-1 transition-all duration-300 ${poppins.className}`}
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-[#e25e2d]">
          Donate an Item
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* CATEGORY */}
          <label className="flex flex-col">
            <span className="font-semibold mb-1">Category</span>
            <select
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              required
              className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-orange-200 transition"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </label>

          {/* DESCRIPTION */}
          <label className="flex flex-col">
            <span className="font-semibold mb-1">Description</span>
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              placeholder="Red winter jacket, size M"
              className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-orange-200 transition text-sm"
            />
          </label>

          {/* LOCATION */}
          <label className="flex flex-col relative">
            <span className="font-semibold mb-1 flex items-center gap-1 text-sm">
              <MapPin size={16} /> Location
            </span>
            <input
              type="text"
              value={form.location}
              onChange={(e) => {
                setForm((p) => ({ ...p, location: e.target.value }));
                setLocationOpen(true);
              }}
              required
              className="border px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-orange-200 transition"
            />
            {locationOpen && form.location && (
              <div className="absolute top-12 bg-white border shadow-lg rounded-lg w-full z-20 max-h-36 overflow-auto text-sm">
                {locations
                  .filter((l) =>
                    l.toLowerCase().includes(form.location.toLowerCase())
                  )
                  .map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => handleLocationSelect(l)}
                      className="block w-full px-3 py-1 text-left hover:bg-orange-50 transition"
                    >
                      {l}
                    </button>
                  ))}
              </div>
            )}
          </label>

          {/* PHONE NUMBER */}
          <label className="flex flex-col">
            <span className="font-semibold mb-1">Phone Number</span>
            <input
              type="text"
              name="phone_number"
              value={form.phone_number}
              onChange={handleChange}
              placeholder="71234567"
              required
              className="border px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-orange-200 transition"
            />
          </label>

          {/* IMAGE */}
          <label className="flex flex-col">
            <span className="font-semibold mb-1">Image</span>
            <label className="flex items-center justify-between border px-3 py-2 rounded-lg cursor-pointer bg-gray-50 hover:bg-orange-50 transition">
              <span className="text-sm">{form.image ? form.image.name : "Choose file"}</span>
              <Upload size={18} className="text-gray-600" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImage}
                className="hidden"
              />
            </label>
          </label>

          {/* COST */}
          <label className="flex flex-col">
            <span className="font-semibold mb-1">Cost</span>
            <input
              type="number"
              name="cost"
              value={form.cost}
              onChange={handleChange}
              required
              placeholder={fixedPrice ? `Max: ${fixedPrice}` : "Set your price"}
              className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-orange-200 transition"
            />
            {costError && (
              <span className="text-red-500 text-sm">{costError}</span>
            )}
          </label>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="bg-[#e25e2d] text-white py-2 rounded-full font-semibold hover:bg-[#ff7b50] active:scale-105 transform transition-all duration-150"
          >
            {loading ? "Submitting..." : "Donate"}
          </button>
        </form>
      </div>
    </div>
  );
}
