import { createClient } from "@/lib/supabase/server";
import { Database } from "@/types/database";

export type PricingTier = Database["public"]["Tables"]["pricing_tiers"]["Row"];
export type TierKey = "free" | "pro";

/**
 * Get a pricing tier by its key
 */
export async function getTierByKey(tierKey: TierKey): Promise<PricingTier | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("pricing_tiers")
    .select("*")
    .eq("tier_key", tierKey)
    .eq("is_active", true)
    .single();

  if (error) {
    console.error("Error fetching tier:", error);
    return null;
  }

  return data;
}

/**
 * Get all active pricing tiers
 */
export async function getAllTiers(): Promise<PricingTier[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("pricing_tiers")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Error fetching tiers:", error);
    return [];
  }

  return data || [];
}

/**
 * Check if a feature is included in a tier
 */
export function hasFeature(tier: PricingTier, feature: string): boolean {
  if (!tier.features || !Array.isArray(tier.features)) {
    return false;
  }
  return tier.features.includes(feature);
}

/**
 * Get tier limits
 */
export function getTierLimits(tier: PricingTier) {
  return {
    services: tier.max_services,
    products: tier.max_products,
    galleryImages: tier.max_gallery_images,
    themes: tier.max_themes,
  };
}

/**
 * Check if a limit is unlimited (-1)
 */
export function isUnlimited(limit: number): boolean {
  return limit === -1;
}

/**
 * Format limit for display (returns "Unlimited" if -1)
 */
export function formatLimit(limit: number): string {
  return isUnlimited(limit) ? "Unlimited" : limit.toString();
}

/**
 * Calculate expiration date based on tier and billing cycle
 * @param tierKey - The tier key
 * @param billingCycle - "monthly" or "annual"
 * @returns Date when subscription expires, or null for free tier
 */
export function calculateExpirationDate(
  tierKey: TierKey,
  billingCycle: "monthly" | "annual"
): Date | null {
  if (tierKey === "free") {
    return null; // Free tier never expires
  }

  const now = new Date();
  const expiresAt = new Date(now);

  if (billingCycle === "monthly") {
    // Add 1 month
    expiresAt.setMonth(expiresAt.getMonth() + 1);
  } else {
    // Add 1 year
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);
  }

  return expiresAt;
}
