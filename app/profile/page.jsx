"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import NavBar from "../../components/NavBar";
import { Package, CheckCircle, Clock } from "lucide-react";

export default function MyProfile() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUser(user);

      const { data } = await supabase
        .from("items")
        .select("*")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });

      setItems(data || []);
      setLoading(false);
    };

    loadProfile();
  }, [router]);

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
                      📍 {item.location}
                    </p>

                    <p className="text-sm text-slate-500">
                      💰 ${item.cost}
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
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

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
