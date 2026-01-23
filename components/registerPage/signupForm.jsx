"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import {
  UserPlus,
  ArrowLeft,
  Loader2,
  Mail,
  Lock,
  ShieldCheck,
} from "lucide-react";

export default function SignupDialog() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [isagree, setIsagree] = useState(false);      

  async function handleSubmitButton(e) {
    e.preventDefault();
    if(isagree === false){
      setMsg("You must agree to the Terms of Service");
      return;
    }
    if (password !== confirmPassword) {
      setMsg("Passwords do not match");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setMsg(error.message);
      setLoading(false);
      return;
    }
    setLoading(false);
    setMsg("success");
    setTimeout(() => router.push("/dashboard"), 1500);
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white selection:bg-[#f8d5b8]">
      {/* Left Column: Brand Messaging */}
      <div className="hidden lg:flex flex-col justify-center p-12 xl:p-20 bg-[#f8d5b8] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#e25e2d]/5 rounded-full -mr-20 -mt-20" />
        <div className="max-w-md relative z-10">
          <div className="w-16 h-1 bg-[#e25e2d] mb-8 rounded-full" />
          <h2 className="text-4xl xl:text-5xl font-bold text-[#222222] mb-6 leading-[1.1]">
            Change the world <br /> from your screen.
          </h2>
          <p className="text-lg text-[#333333]/70 font-light leading-relaxed">
            Join a community of dedicated givers. Setting up your profile takes
            less than a minute.
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
            <h1 className="text-3xl sm:text-4xl font-bold text-[#222222] tracking-tight">
              Create Account
            </h1>
            <p className="text-gray-400 mt-3 text-base sm:text-lg font-light">
              Start your journey today.
            </p>
          </div>

          <form
            onSubmit={handleSubmitButton}
            className="space-y-6 sm:space-y-8"
          >
            <div className="space-y-4 sm:space-y-6">
              {/* Email Input */}
              <div className="relative group">
                <Mail className="absolute left-0 top-3 w-5 h-5 text-gray-300 group-focus-within:text-[#e25e2d] transition-colors" />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full border-b-2 border-gray-100 focus:border-[#e25e2d] py-3 pl-8 outline-none transition-all text-base sm:text-lg placeholder:text-gray-300 bg-transparent rounded-none appearance-none"
                  value={email}
                  onChange={(e) => {
                    setMsg("");
                    setEmail(e.target.value);
                  }}
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
                  onChange={(e) => {
                    setMsg("");
                    setPassword(e.target.value);
                  }}
                  required
                />
              </div>

              {/* Confirm Password Input */}
              <div className="relative group">
                <ShieldCheck className="absolute left-0 top-3 w-5 h-5 text-gray-300 group-focus-within:text-[#e25e2d] transition-colors" />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full border-b-2 border-gray-100 focus:border-[#e25e2d] py-3 pl-8 outline-none transition-all text-base sm:text-lg placeholder:text-gray-300 bg-transparent rounded-none appearance-none"
                  value={confirmPassword}
                  onChange={(e) => {
                    setMsg("");
                    setConfirmPassword(e.target.value);
                  }}
                  required
                />
              </div>

              <div>
                <input type="checkbox" id="terms"  className="mr-2" value={isagree} onChange={() => setIsagree(!isagree)}/>
                <label htmlFor="terms" className="text-sm text-gray-500">
                  I agree to the{" "}
                  <a href="/terms" className="text-[#e25e2d] hover:underline">
                    Terms of Service
                  </a>
                </label>
              </div>
            </div>

            {msg && (
              <div
                className={`text-sm p-3 rounded-lg ${msg === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"} animate-in fade-in duration-300`}
              >
                {msg === "success" ? "Account created! Redirecting..." : msg}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#e25e2d] hover:bg-[#ff7b50] disabled:bg-gray-200 text-white font-bold py-4 sm:py-5 rounded-full transition-all flex items-center justify-center gap-3 shadow-xl shadow-orange-100 active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Join the Mission <UserPlus className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 sm:mt-10 text-center text-sm sm:text-base text-gray-400">
            Already a member?{" "}
            <a
              href="/login"
              className="text-[#e25e2d] font-bold hover:underline underline-offset-4"
            >
              Log In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
