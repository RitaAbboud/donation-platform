import { supabase } from "../../../lib/supabaseClient";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        // 1. Get query parameters from the URL
        const { searchParams } = new URL(request.url);
        const skip = parseInt(searchParams.get("skip") || "0");
        const limit = parseInt(searchParams.get("limit") || "8");

        // 2. Calculate the range
        const from = skip;
        const to = skip + limit - 1;

        // 3. Updated query with .range()
        const { data, error } = await supabase
            .from("items")
            .select("*")
            .eq("is_sold", false)
            .order("created_at", { ascending: false })
            .range(from, to); // This is the magic line for pagination

        if (error) {
            return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
        }
        
        return NextResponse.json(data);

    } catch (err) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}