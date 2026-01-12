"use client";
import {useRouter} from"next/navigation";
import {supabase} from"../../lib/supabaseClient";

export default function DashboardPage(){
const router = useRouter();
  
async function handleLogoutButton(){
            const {error} = await supabase.auth.signOut();
            if(error){
                alert("Error logging out:", error.message);
                return;
            }
            router.push("/");
        }

return(
    <button onClick={handleLogoutButton}>Logout</button>
);
}