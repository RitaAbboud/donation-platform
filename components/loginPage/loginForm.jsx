"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { Mail, Lock, ArrowRight, ArrowLeft, Loader2, Sparkles } from "lucide-react";

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
    router.push("/dashboard");
  }
  async function handleResetPassword() {
    if (!email){
      setMsg("Please enter your email address to reset your password.");
      return;
    }
    setLoading(true);
    const {error} = await supabase.auth.resetPasswordForEmail(email, {redirectTo: `${window.location.origin}/resetPassword`});
    if (error) {
      setLoading(false);
      setMsg(error.message);
      return;
    }
    setMsg("Password reset email sent. Please check your inbox.");
    setLoading(false);  
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white selection:bg-[#fae9d7]">
      
      {/* Left Column: Brand Messaging (Matches Signup) */}
      <div className="hidden lg:flex flex-col justify-center p-12 xl:p-20 bg-[#f8d5b8] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#f3a552]/10 rounded-full -mr-20 -mt-20" />
        
        <div className="max-w-md relative z-10">
          <div className="w-16 h-1 bg-[#e25e2d] mb-8 rounded-full" />
          <h2 className="text-4xl xl:text-5xl font-bold text-[#222222] mb-6 leading-[1.1]">
            Continue your <br /> impact journey.
          </h2>
          <p className="text-lg text-[#333333]/70 font-light leading-relaxed">
            Welcome back! Log in to manage your donations, track your impact, and discover new causes that need your help.
          </p>
        </div>
      </div>

      {/* Right Column: The Form */}
      <div className="flex items-center justify-center p-6 sm:p-12 md:p-16 lg:p-20">
        <div className="w-full max-w-sm mx-auto">
          
          <button 
            onClick={() => router.push("/")} 
            className="group flex items-center gap-2 text-sm text-gray-400 hover:text-[#e25e2d] mb-8 sm:mb-12 transition-all p-2 -ml-2"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
            Back to home
          </button>

          <div className="mb-8 sm:mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#222222] tracking-tight flex items-center gap-3">
              Welcome back <Sparkles className="w-6 h-6 text-[#f3a552]" />
            </h1>
            <p className="text-gray-400 mt-3 text-base sm:text-lg font-light">Enter your details to sign in.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6 sm:space-y-8">
            <div className="space-y-4 sm:space-y-6">
              
              {/* Email Input */}
              <div className="relative group">
                <Mail className="absolute left-0 top-3 w-5 h-5 text-gray-300 group-focus-within:text-[#e25e2d] transition-colors" />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="w-full border-b-2 border-gray-100 focus:border-[#e25e2d] py-3 pl-8 outline-none transition-all text-base sm:text-lg placeholder:text-gray-300 bg-transparent rounded-none appearance-none"
                  value={email}
                  onChange={(e) => {setMsg(""); setEmail(e.target.value)}}
                  required
                />
              </div>
              
              {/* Password Input */}
              <div className="relative group">
                <Lock className="absolute left-0 top-3 w-5 h-5 text-gray-300 group-focus-within:text-[#e25e2d] transition-colors" />
                <input 
                  type="password" 
                  placeholder="Password" 
                  className="w-full border-b-2 border-gray-100 focus:border-[#e25e2d] py-3 pl-8 outline-none transition-all text-base sm:text-lg placeholder:text-gray-300 bg-transparent rounded-none appearance-none"
                  value={password}
                  onChange={(e) => {setMsg(""); setPassword(e.target.value)}}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end">
               <button type="button" onClick={handleResetPassword} className="text-xs sm:text-sm font-semibold text-[#e25e2d] hover:underline transition-colors">
                  Forgot Password?
               </button>
            </div>

            {msg == "Password reset email sent. Please check your inbox." ?(
              <div className="text-sm p-3 rounded-lg bg-green-50 text-green-500 animate-in fade-in duration-300">
                {msg}
              </div>
            ) :  <div className="text-sm p-3 rounded-lg bg-red-50 text-red-500 animate-in fade-in duration-300">
                {msg}
              </div> }

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#e25e2d] hover:bg-[#ff7b50] disabled:bg-gray-200 text-white font-bold py-4 sm:py-5 rounded-full transition-all flex items-center justify-center gap-3 shadow-xl shadow-gray-100 active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>Sign In <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>

          <p className="mt-8 sm:mt-10 text-center text-sm sm:text-base text-gray-400">
            New to the community? <a href="/register" className="text-[#e25e2d] font-bold hover:underline underline-offset-4">Create Account</a>
          </p>
        </div>
      </div>
    </div>
  );
}