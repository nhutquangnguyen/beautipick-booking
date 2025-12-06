import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const adminCheck = await isAdmin(user.id);
    if (!adminCheck) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await request.json();
    const { merchantId } = body;

    if (!merchantId) {
      return NextResponse.json({ error: "Merchant ID is required" }, { status: 400 });
    }

    // Delete merchant and all related data
    // Due to CASCADE constraints in the database, deleting the merchant will automatically delete:
    // - merchant_subscriptions
    // - subscription_usage
    // - services
    // - products
    // - staff
    // - gallery_images
    // - business_hours
    // - social_links
    // - bookings
    // - customers (if not shared with other merchants)
    // - merchant_customers (junction table)

    const { error: deleteError } = await supabase
      .from("merchants")
      .delete()
      .eq("id", merchantId);

    if (deleteError) {
      console.error("Error deleting merchant:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete merchant", details: deleteError.message },
        { status: 500 }
      );
    }

    // Also delete the user from auth.users if needed
    // Note: This requires service role access and should be done carefully
    // For now, we'll just delete the merchant record
    // The auth user will remain but won't have merchant access

    return NextResponse.json({
      success: true,
      message: "Merchant deleted successfully",
    });
  } catch (error) {
    console.error("Error in delete-merchant API:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
