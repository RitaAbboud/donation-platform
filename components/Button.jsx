"use client";

export default function Button({ children, type = "primary" }) {
  const base =
    "px-6 py-3 rounded-xl font-semibold transition transform hover:-translate-y-1";

  const styles =
    type === "primary"
      ? `${base} bg-[#e25e2d] text-white hover:bg-[#d14f22]`
      : `${base} border-2 border-[#e25e2d] text-[#e25e2d] hover:bg-[#e25e2d]/10`;

  return <button className={styles}>{children}</button>;
}
