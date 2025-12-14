import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") || "";

    if (query.trim().length < 2) {
      return NextResponse.json({ suggestions: [] });
    }

    const supabase = await createClient();

    // Search for merchants with autocomplete
    // Using ilike for now, will be enhanced with full-text search
    // PostgREST or() syntax uses * for wildcards, not %
    const { data: merchants, error } = await supabase
      .from("merchants")
      .select("id, business_name, city, slug")
      .eq("is_active", true)
      .eq("show_in_directory", true)
      .or(`business_name.ilike.*${query}*,description.ilike.*${query}*,city.ilike.*${query}*`)
      .order("business_name")
      .limit(5);

    if (error) {
      console.error("Autocomplete error:", error);
      return NextResponse.json({ suggestions: [] });
    }

    return NextResponse.json({
      suggestions: merchants || [],
    });
  } catch (error) {
    console.error("Autocomplete API error:", error);
    return NextResponse.json({ suggestions: [] }, { status: 500 });
  }
}
