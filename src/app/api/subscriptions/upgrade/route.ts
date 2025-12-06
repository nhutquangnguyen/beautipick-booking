import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { upgradeSubscription } from "@/lib/pricing/subscriptions";
import { isAdmin } from "@/lib/admin";

/**
 * POST /api/subscriptions/upgrade
 * Upgrade a merchant's subscription (admin only for now, until payment is integrated)
 *
 * Body: {
 *   merchantId: string,
 *   tierKey: "free" | "pro",
 *   billingCycle: "monthly" | "annual",
 *   notes?: string
 * }
 */
export async function POST(request: Request) {
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
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { merchantId, tierKey, billingCycle = "monthly", notes } = body;

    if (!merchantId || !tierKey) {
      return NextResponse.json(
        { error: "merchantId and tierKey are required" },
        { status: 400 }
      );
    }

    if (tierKey !== "free" && tierKey !== "pro") {
      return NextResponse.json(
        { error: "tierKey must be 'free' or 'pro'" },
        { status: 400 }
      );
    }

    if (billingCycle !== "monthly" && billingCycle !== "annual") {
      return NextResponse.json(
        { error: "billingCycle must be 'monthly' or 'annual'" },
        { status: 400 }
      );
    }

    // Upgrade subscription using admin client to bypass RLS
    const subscription = await upgradeSubscription(
      merchantId,
      tierKey,
      billingCycle,
      notes,
      true // Use admin client
    );

    if (!subscription) {
      return NextResponse.json(
        { error: "Failed to upgrade subscription" },
        { status: 500 }
      );
    }

    // Revalidate the admin dashboard to show updated data
    revalidatePath("/admin");

    return NextResponse.json({
      success: true,
      subscription: {
        id: subscription.id,
        merchantId: subscription.merchant_id,
        tierKey,
        status: subscription.status,
        startedAt: subscription.subscription_started_at,
        expiresAt: subscription.expires_at,
        notes: subscription.notes,
      },
    });
  } catch (error) {
    console.error("Error upgrading subscription:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
