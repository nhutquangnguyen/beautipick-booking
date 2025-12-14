import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET - Get user's favorites or check if a merchant is favorited
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const merchantId = searchParams.get("merchant_id");

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // If merchant_id is provided, check if it's favorited
    if (merchantId) {
      const { data, error } = await supabase
        .from("favorites")
        .select("id")
        .eq("customer_id", user.id)
        .eq("merchant_id", merchantId)
        .maybeSingle();

      if (error) {
        console.error("Error checking favorite:", error);
        return NextResponse.json(
          { error: "Failed to check favorite" },
          { status: 500 }
        );
      }

      return NextResponse.json({ isFavorited: !!data, favoriteId: data?.id });
    }

    // Otherwise, get all favorites with merchant details
    const { data: favorites, error } = await supabase
      .from("favorites")
      .select(
        `
        id,
        merchant_id,
        created_at,
        merchants (
          id,
          business_name,
          slug,
          logo_url,
          address,
          phone,
          description
        )
      `
      )
      .eq("customer_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching favorites:", error);
      return NextResponse.json(
        { error: "Failed to fetch favorites" },
        { status: 500 }
      );
    }

    return NextResponse.json({ favorites: favorites || [] });
  } catch (error: any) {
    console.error("Error processing favorites request:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

// POST - Add a favorite
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { merchant_id } = await request.json();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (!merchant_id) {
      return NextResponse.json(
        { error: "merchant_id is required" },
        { status: 400 }
      );
    }

    // Check if already favorited
    const { data: existing } = await supabase
      .from("favorites")
      .select("id")
      .eq("customer_id", user.id)
      .eq("merchant_id", merchant_id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({
        message: "Already favorited",
        favoriteId: existing.id,
      });
    }

    // Add favorite
    const { data, error } = await supabase
      .from("favorites")
      .insert({
        customer_id: user.id,
        merchant_id: merchant_id,
      })
      .select()
      .single();

    if (error) {
      console.error("Error adding favorite:", error);
      return NextResponse.json(
        { error: "Failed to add favorite", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, favorite: data });
  } catch (error: any) {
    console.error("Error processing add favorite request:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Remove a favorite
export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const merchantId = searchParams.get("merchant_id");

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (!merchantId) {
      return NextResponse.json(
        { error: "merchant_id is required" },
        { status: 400 }
      );
    }

    // Delete favorite
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("customer_id", user.id)
      .eq("merchant_id", merchantId);

    if (error) {
      console.error("Error removing favorite:", error);
      return NextResponse.json(
        { error: "Failed to remove favorite", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error processing remove favorite request:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
