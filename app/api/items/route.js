import { supabase } from "../../../lib/supabaseClient";
import { NextResponse } from "next/server";

//API route to fetch available items from the database
export  async function GET() {
    try {
        //1 the query to fetch items from database.
        const { data, error } = await supabase
            .from("items")
            .select("*")
            .order("created_at", { ascending: false }); // Show newest items first

        //2 return the errors from the query it might have
        if (error) {
            return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
        }
        
        // 3 Return the data as JSON that the query fetched successfully
        return NextResponse.json(data);


    } catch (err) {
        // Handle unexpected server errors
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

}