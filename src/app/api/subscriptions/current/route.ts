import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCurrentSubscription } from "@/lib/pricing/subscriptions";
import { getQuotaInfo } from "@/lib/pricing/enforcement";

/**
 * GET /api/subscriptions/current
 * Get current subscription and usage for the authenticated merchant
 */
export async function GET() {
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

    // Get subscription
    const subscription = await getCurrentSubscription(user.id);
    if (!subscription) {
      return NextResponse.json(
        { error: "No subscription found" },
        { status: 404 }
      );
    }

    // Get quota/usage information
    const quota = await getQuotaInfo(user.id);

    return NextResponse.json({
      subscription: {
        id: subscription.id,
        status: subscription.status,
        tier: {
          key: subscription.tier.tier_key,
          name: subscription.tier.tier_name,
          nameVi: subscription.tier.tier_name_vi,
          description: subscription.tier.description,
          descriptionVi: subscription.tier.description_vi,
        },
        startedAt: subscription.subscription_started_at,
        expiresAt: subscription.expires_at,
        notes: subscription.notes,
      },
      quota,
    });
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
