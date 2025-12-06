import { createClient } from "@/lib/supabase/server";
import { getCurrentSubscription, isSubscriptionActive } from "./subscriptions";
import { getTierLimits, isUnlimited, hasFeature } from "./tiers";
import { Database } from "@/types/database";

export type SubscriptionUsage =
  Database["public"]["Tables"]["subscription_usage"]["Row"];

/**
 * Get usage stats for a merchant
 */
export async function getUsageStats(
  merchantId: string
): Promise<SubscriptionUsage | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("subscription_usage")
    .select("*")
    .eq("merchant_id", merchantId)
    .single();

  if (error) {
    // If no usage record exists, return default zeros
    if (error.code === "PGRST116") {
      return {
        id: "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        merchant_id: merchantId,
        services_count: 0,
        products_count: 0,
        gallery_images_count: 0,
      };
    }
    console.error("Error fetching usage stats:", error);
    return null;
  }

  return data;
}

/**
 * Check if merchant can create a service
 */
export async function canCreateService(merchantId: string): Promise<boolean> {
  const subscription = await getCurrentSubscription(merchantId);
  if (!subscription || !isSubscriptionActive(subscription)) {
    return false; // No active subscription
  }

  const limits = getTierLimits(subscription.tier);
  if (isUnlimited(limits.services)) {
    return true; // Pro tier has unlimited services
  }

  // Get actual count from services table instead of cached subscription_usage
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("services")
    .select("id", { count: "exact" })
    .eq("merchant_id", merchantId);

  if (error) {
    console.error("Error counting services:", error);
    return false;
  }

  return (count || 0) < limits.services;
}

/**
 * Check if merchant can create a product
 */
export async function canCreateProduct(merchantId: string): Promise<boolean> {
  const subscription = await getCurrentSubscription(merchantId);
  if (!subscription || !isSubscriptionActive(subscription)) {
    return false;
  }

  const limits = getTierLimits(subscription.tier);
  if (isUnlimited(limits.products)) {
    return true; // Pro tier has unlimited products
  }

  // Get actual count from products table instead of cached subscription_usage
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("products")
    .select("id", { count: "exact" })
    .eq("merchant_id", merchantId);

  if (error) {
    console.error("Error counting products:", error);
    return false;
  }

  return (count || 0) < limits.products;
}

/**
 * Check if merchant can upload a gallery image
 */
export async function canUploadImage(merchantId: string): Promise<boolean> {
  const subscription = await getCurrentSubscription(merchantId);
  if (!subscription || !isSubscriptionActive(subscription)) {
    return false;
  }

  const limits = getTierLimits(subscription.tier);
  if (isUnlimited(limits.galleryImages)) {
    return true; // Pro tier has 500 images
  }

  // Get actual count from gallery table instead of cached subscription_usage
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("gallery")
    .select("id", { count: "exact" })
    .eq("merchant_id", merchantId);

  if (error) {
    console.error("Error counting gallery images:", error);
    return false;
  }

  return (count || 0) < limits.galleryImages;
}

/**
 * Check if merchant has access to a specific feature
 */
export async function hasFeatureAccess(
  merchantId: string,
  feature: string
): Promise<boolean> {
  const subscription = await getCurrentSubscription(merchantId);
  if (!subscription || !isSubscriptionActive(subscription)) {
    return false;
  }

  return hasFeature(subscription.tier, feature);
}

/**
 * Get comprehensive quota information for a merchant
 */
export async function getQuotaInfo(merchantId: string) {
  const subscription = await getCurrentSubscription(merchantId);
  if (!subscription || !isSubscriptionActive(subscription)) {
    return null;
  }

  // Get actual counts from database tables instead of cached subscription_usage
  const supabase = await createClient();
  const [servicesResult, productsResult, galleryResult] = await Promise.all([
    supabase.from("services").select("id", { count: "exact" }).eq("merchant_id", merchantId),
    supabase.from("products").select("id", { count: "exact" }).eq("merchant_id", merchantId),
    supabase.from("gallery").select("id", { count: "exact" }).eq("merchant_id", merchantId),
  ]);

  const servicesCount = servicesResult.count || 0;
  const productsCount = productsResult.count || 0;
  const galleryCount = galleryResult.count || 0;

  const limits = getTierLimits(subscription.tier);

  return {
    services: {
      used: servicesCount,
      limit: limits.services,
      unlimited: isUnlimited(limits.services),
      canCreate: isUnlimited(limits.services) || servicesCount < limits.services,
      percentage: isUnlimited(limits.services)
        ? 0
        : (servicesCount / limits.services) * 100,
    },
    products: {
      used: productsCount,
      limit: limits.products,
      unlimited: isUnlimited(limits.products),
      canCreate: isUnlimited(limits.products) || productsCount < limits.products,
      percentage: isUnlimited(limits.products)
        ? 0
        : (productsCount / limits.products) * 100,
    },
    gallery: {
      used: galleryCount,
      limit: limits.galleryImages,
      unlimited: isUnlimited(limits.galleryImages),
      canUpload: isUnlimited(limits.galleryImages) || galleryCount < limits.galleryImages,
      percentage: isUnlimited(limits.galleryImages)
        ? 0
        : (galleryCount / limits.galleryImages) * 100,
    },
  };
}
