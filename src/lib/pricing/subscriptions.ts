import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server-admin";
import { Database } from "@/types/database";
import { getTierByKey, TierKey, calculateExpirationDate } from "./tiers";
import type { SupabaseClient } from "@supabase/supabase-js";

export type MerchantSubscription =
  Database["public"]["Tables"]["merchant_subscriptions"]["Row"];

export type SubscriptionWithTier = MerchantSubscription & {
  tier: Database["public"]["Tables"]["pricing_tiers"]["Row"];
};

/**
 * Get current subscription for a merchant
 */
export async function getCurrentSubscription(
  merchantId: string
): Promise<SubscriptionWithTier | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("merchant_subscriptions")
    .select(
      `
      *,
      tier:pricing_tiers(*)
    `
    )
    .eq("merchant_id", merchantId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching subscription:", error);
    return null;
  }

  return data as SubscriptionWithTier | null;
}

/**
 * Check if a subscription is active and not expired
 */
export function isSubscriptionActive(
  subscription: MerchantSubscription | null
): boolean {
  if (!subscription) return false;
  if (subscription.status !== "active") return false;

  // If no expiration date, it's the free tier (never expires)
  if (!subscription.expires_at) return true;

  // Check if not expired
  const expiresAt = new Date(subscription.expires_at);
  return expiresAt > new Date();
}

/**
 * Create a new subscription for a merchant
 */
export async function createSubscription(
  merchantId: string,
  tierKey: TierKey,
  billingCycle: "monthly" | "annual" = "monthly",
  notes?: string
): Promise<MerchantSubscription | null> {
  const supabase = await createClient();

  // Get the tier
  const tier = await getTierByKey(tierKey);
  if (!tier) {
    console.error(`Tier ${tierKey} not found`);
    return null;
  }

  // Calculate expiration date
  const expiresAt = calculateExpirationDate(tierKey, billingCycle);

  const { data, error } = await supabase
    .from("merchant_subscriptions")
    .insert({
      merchant_id: merchantId,
      pricing_tier_id: tier.id,
      status: "active",
      subscription_started_at: new Date().toISOString(),
      expires_at: expiresAt?.toISOString() || null,
      notes,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating subscription:", error);
    return null;
  }

  return data;
}

/**
 * Upgrade a merchant's subscription to a new tier
 * @param useAdminClient - Set to true to bypass RLS (for admin operations)
 */
export async function upgradeSubscription(
  merchantId: string,
  newTierKey: TierKey,
  billingCycle: "monthly" | "annual" = "monthly",
  notes?: string,
  useAdminClient: boolean = false
): Promise<MerchantSubscription | null> {
  const supabase = useAdminClient ? createAdminClient() : await createClient();

  // Get the new tier
  const newTier = await getTierByKey(newTierKey);
  if (!newTier) {
    console.error(`Tier ${newTierKey} not found`);
    return null;
  }

  // Calculate new expiration date
  const expiresAt = calculateExpirationDate(newTierKey, billingCycle);

  const { data, error} = await supabase
    .from("merchant_subscriptions")
    .update({
      pricing_tier_id: newTier.id,
      status: "active",
      subscription_started_at: new Date().toISOString(),
      expires_at: expiresAt?.toISOString() || null,
      notes,
    })
    .eq("merchant_id", merchantId)
    .select()
    .single();

  if (error) {
    console.error("Error upgrading subscription:", {
      error,
      merchantId,
      newTierKey,
      newTierId: newTier.id,
      useAdminClient
    });
    return null;
  }

  console.log("Subscription upgraded successfully:", data);
  return data;
}

/**
 * Extend a subscription by a specified period
 * Used by admins to grant extensions
 */
export async function extendSubscription(
  merchantId: string,
  months: number,
  notes?: string
): Promise<MerchantSubscription | null> {
  const supabase = await createClient();

  // Get current subscription
  const current = await getCurrentSubscription(merchantId);
  if (!current) {
    console.error("No subscription found for merchant");
    return null;
  }

  // Calculate new expiration date
  let newExpiresAt: Date;
  if (current.expires_at) {
    // Extend from current expiration
    newExpiresAt = new Date(current.expires_at);
  } else {
    // If free tier (no expiration), start from now
    newExpiresAt = new Date();
  }
  newExpiresAt.setMonth(newExpiresAt.getMonth() + months);

  const { data, error } = await supabase
    .from("merchant_subscriptions")
    .update({
      expires_at: newExpiresAt.toISOString(),
      notes: notes || `Extended by ${months} month(s)`,
    })
    .eq("merchant_id", merchantId)
    .select()
    .single();

  if (error) {
    console.error("Error extending subscription:", error);
    return null;
  }

  return data;
}

/**
 * Cancel a subscription (sets status to cancelled)
 */
export async function cancelSubscription(
  merchantId: string,
  notes?: string
): Promise<MerchantSubscription | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("merchant_subscriptions")
    .update({
      status: "cancelled",
      notes: notes || "Subscription cancelled",
    })
    .eq("merchant_id", merchantId)
    .select()
    .single();

  if (error) {
    console.error("Error cancelling subscription:", error);
    return null;
  }

  return data;
}

/**
 * Downgrade expired Pro subscriptions to Free tier
 * This should be run via a cron job or scheduled function
 */
export async function downgradeExpiredSubscriptions(): Promise<number> {
  const supabase = await createClient();

  // Get Free tier
  const freeTier = await getTierByKey("free");
  if (!freeTier) {
    console.error("Free tier not found");
    return 0;
  }

  // Find expired Pro subscriptions
  const { data: expiredSubs, error: fetchError } = await supabase
    .from("merchant_subscriptions")
    .select("*")
    .eq("status", "active")
    .not("expires_at", "is", null)
    .lt("expires_at", new Date().toISOString());

  if (fetchError || !expiredSubs) {
    console.error("Error fetching expired subscriptions:", fetchError);
    return 0;
  }

  // Downgrade each to Free tier
  let count = 0;
  for (const sub of expiredSubs) {
    const { error } = await supabase
      .from("merchant_subscriptions")
      .update({
        pricing_tier_id: freeTier.id,
        status: "expired",
        expires_at: null,
        notes: "Automatically downgraded to Free after Pro expiration",
      })
      .eq("id", sub.id);

    if (!error) {
      count++;
    }
  }

  console.log(`Downgraded ${count} expired subscriptions to Free tier`);
  return count;
}
