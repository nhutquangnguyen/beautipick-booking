import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { search_query, results_count, selected_merchant_id } = body;

    if (!search_query) {
      return NextResponse.json(
        { error: "search_query is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Log the search
    const { error } = await supabase.from("search_analytics").insert({
      search_query: search_query.trim(),
      results_count: results_count || 0,
      user_id: user?.id || null,
      selected_merchant_id: selected_merchant_id || null,
    });

    if (error) {
      console.error("Search analytics error:", error);
      return NextResponse.json(
        { error: "Failed to log search" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Search analytics API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Get popular searches
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get popular searches from the last 30 days
    const { data, error } = await supabase.rpc("get_popular_searches", {
      limit_count: 10,
    });

    if (error) {
      console.error("Get popular searches error:", error);
      // Return empty array if function doesn't exist yet
      return NextResponse.json({ searches: [] });
    }

    return NextResponse.json({ searches: data || [] });
  } catch (error) {
    console.error("Get popular searches API error:", error);
    return NextResponse.json({ searches: [] });
  }
}
