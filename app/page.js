"use client";
import { supabase } from "../lib/supabaseClient" ;
import {useRouter} from "next/navigation";
export default function Home() {
const router = useRouter();
  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert("Error logging out: " + error.message);
      return;
    }
    alert("Logged out successfully!");
    router.push("/login");
  }
  return (
    <> 
    <h4>Welcome to the Donation Platform</h4>
    <p>Donate to causes you care about</p>
    <button  onClick={handleLogout}>Logout</button>
   </>
  );
}
