"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
export default function ResetPasswordPage() {
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleUpdatePassword(e){
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) {
            setLoading(false);
            alert(error.message);
            return;
        }
        setLoading(false);
        alert("Password updated successfully. Please log in with your new password.");
        router.push("/login");
    }



  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleUpdatePassword} className="p-8 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Set New Password</h1>
        <input 
          type="password" 
          placeholder="Enter new password"
          className="border p-2 w-full mb-4"
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button className="bg-[#e25e2d] text-white p-2 w-full rounded">
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}

