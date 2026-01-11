"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { LogIn, Mail, Lock, Heart, ArrowRight, Sparkles } from "lucide-react";

export default function LoginDialog() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoading(false);
      setMsg(error.message);
      return;
    }
    setLoading(false);
    router.push("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fae9d7] bg-[radial-gradient(circle_at_bottom_left,_#f3a55225,_transparent)] p-6">
      <div className="w-full max-w-[420px]">
        {/* Brand Identity */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#e25e2d] to-[#f3a552] rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative p-4 bg-white rounded-2xl shadow-sm border border-orange-100">
              <Heart className="w-8 h-8 text-[#e25e2d] fill-[#e25e2d]" />
            </div>
          </div>
          
        </div>

        <div className="bg-white  backdrop-blur-xl rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(226,94,45,0.1)] overflow-hidden border border-white p-8 md:p-10">
          <div className="mb-8">
            <h2 className="mt-4 text-[#222222] font-black text-xl tracking-tight flex items-center gap-2">
            Welcome Back <Sparkles className="w-4 h-4 text-[#f3a552]" />
          </h2>
            <p className="text-[#333333]/60 text-sm mt-2 font-medium">Your kindness continues here.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Input */}
            <div className="group">
              <div className="relative transition-all duration-300">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#e25e2d] w-5 h-5 transition-colors" />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-100 focus:bg-white focus:border-[#f3a552] focus:ring-4 focus:ring-[#f3a552]/10 rounded-2xl outline-none transition-all text-[#222222] font-medium placeholder:text-gray-400"
                  value={email} 
                  onChange={(e) => {setMsg(""); setEmail(e.target.value);}}
                  required 
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="group">
              <div className="relative transition-all duration-300">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#e25e2d] w-5 h-5 transition-colors" />
                <input 
                  type="password" 
                  placeholder="Password" 
                  className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-100 focus:bg-white focus:border-[#f3a552] focus:ring-4 focus:ring-[#f3a552]/10 rounded-2xl outline-none transition-all text-[#222222] font-medium placeholder:text-gray-400"
                  value={password} 
                  onChange={(e) => {setMsg(""); setPassword(e.target.value);}}
                  required 
                />
              </div>
            </div>

            {/* Remember & Forgot Links */}
            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#e25e2d] focus:ring-[#e25e2d]/20 cursor-pointer" />
                <span className="text-xs text-[#333333]/70 font-semibold group-hover:text-[#333333]">Remember me</span>
              </label>
              <button type="button" className="text-xs text-[#e25e2d] font-bold hover:underline underline-offset-4">Forgot Password?</button>
            </div>

            {msg && (
              <div className="flex items-center gap-2 p-4 bg-red-50 rounded-2xl border border-red-100 animate-in fade-in zoom-in duration-200">
                <p className="text-xs font-bold text-red-600 uppercase tracking-tight">{msg}</p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="group relative w-full bg-[#e25e2d] hover:bg-[#c94f24] text-white font-black py-4 rounded-2xl shadow-xl shadow-[#e25e2d]/20 transition-all active:scale-[0.98] disabled:bg-gray-200 disabled:shadow-none overflow-hidden"
            >
              <div className="flex items-center justify-center gap-2 relative z-10">
                {loading ? "Authenticating..." : "Sign In "}
                <LogIn className={`w-5 h-5 ${loading ? 'animate-pulse' : 'group-hover:translate-x-1 transition-transform'}`} />
              </div>
            </button>
          </form>

          <div className="mt-10 pt-6 border-t border-gray-100/50 text-center">
            <p className="text-center text-sm text-[#333333] font-medium">
             New to our community? <a href="/register" className="text-[#e25e2d] hover:text-[#c94f24] transition-colors decoration-2 underline-offset-4 hover:underline">Create Account</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}