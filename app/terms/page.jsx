"use client";
import { useRouter } from "next/navigation";
export default function TermsPage() {
  const router = useRouter();
  return (
    <div className={`min-h-screen bg-[#fff6ef] text-slate-900 `}>
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 mb-10 text-slate-400 hover:text-[#e25e2d] transition-colors text-sm font-bold uppercase tracking-widest"
      >
        ← go Back
      </button>

      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <p className="text-gray-700 mb-4">
        By participating, you agree to prioritize the lifecycle of the item and
        the well-being of the community over financial gain. You represent that
        your intent is to help others or to find a second life for your
        belongings, aligning with our goal of sustainable, non-profit-driven
        consumption.
      </p>
    </div>
  );
}
