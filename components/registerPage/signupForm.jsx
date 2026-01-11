"use client";
import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Mail, Lock, UserPlus, ShieldCheck, ArrowRight, Heart, Shield } from "lucide-react";

export default function SignupDialog() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleSubmitButton(e) {
    e.preventDefault();
    setLoading(true);
    if (!password || !email || !confirmPassword) {
      setMsg("All fields are required!");
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setMsg("Passwords do not match!");
      setLoading(false);
      return;
    }
    
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setMsg(error.message);
      setLoading(false);
      return;
    }
    setLoading(false);
    setMsg("Your account is created successfully!");
    setTimeout(() => router.push("/"), 1500);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fae9d7] bg-[radial-gradient(circle_at_top_right,_#f3a55220,_transparent)] p-6">
      <div className="w-full max-w-[440px]">
        {/* Brand/Logo Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-[#e25e2d] rounded-2xl flex items-center justify-center shadow-lg shadow-[#e25e2d]/30 rotate-3 mb-4">
            <Heart className="text-white w-7 h-7 fill-white" />
          </div>
          
        </div>

        <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(226,94,45,0.08)] overflow-hidden border border-white">
          {/* Header */}
          <div className="p-8 pb-0 text-center">
            <h1 className="text-2xl font-bold text-[#222222] mb-2">Join the Mission</h1>
            <p className="text-[#333333]/70 text-sm">Create an account to track your impact and support causes you love.</p>
          </div>

          <form onSubmit={handleSubmitButton} className="p-8 space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-bold text-[#333333] ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#e25e2d] transition-colors w-5 h-5" />
                <input 
                  type="email" 
                  placeholder="name@impact.com" 
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 focus:border-[#e25e2d] focus:ring-4 focus:ring-[#e25e2d]/10 rounded-2xl outline-none transition-all text-[#222222] placeholder:text-gray-400"
                  value={email} 
                  onChange={(e) => {setMsg(""); setEmail(e.target.value);}}
                />
              </div>
            </div>

            {/* Password Grid (Two Columns for cleaner layout on wider screens) */}
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-[#333333] ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#e25e2d] transition-colors w-5 h-5" />
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 focus:border-[#e25e2d] focus:ring-4 focus:ring-[#e25e2d]/10 rounded-2xl outline-none transition-all text-[#222222]"
                    value={password} 
                    onChange={(e) => {setMsg(""); setPassword(e.target.value);}}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[13px] font-bold text-[#333333] ml-1">Confirm Password</label>
                <div className="relative group">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#e25e2d] transition-colors w-5 h-5" />
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 focus:border-[#e25e2d] focus:ring-4 focus:ring-[#e25e2d]/10 rounded-2xl outline-none transition-all text-[#222222]"
                    value={confirmPassword} 
                    onChange={(e) => {setMsg(""); setConfirmPassword(e.target.value);}}
                  />
                </div>
              </div>
            </div>

            {msg && (
              <div className={`flex items-center gap-2 p-4 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-1 ${msg.includes("success") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                 <span>{msg}</span>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="group w-full bg-[#e25e2d] hover:bg-[#c94f24] text-white font-extrabold py-4 rounded-2xl shadow-xl shadow-[#e25e2d]/25 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {loading ? "Creating your account..." : "Create Account"}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="relative py-2">
               <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
               <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-400 font-medium tracking-widest">or</span></div>
            </div>

            <p className="text-center text-sm text-[#333333] font-medium">
              Already a member? <a href="/login" className="text-[#e25e2d] hover:text-[#c94f24] transition-colors decoration-2 underline-offset-4 hover:underline">Log in here</a>
            </p>
          </form>
          
        </div>
      </div>
    </div>
  );
}