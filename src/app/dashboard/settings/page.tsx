import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { UnifiedSettingsForm } from "@/components/dashboard/settings/unified-settings-form";
import { SubscriptionUsageCard } from "@/components/dashboard/settings/subscription-usage-card";
import { getCurrentSubscription } from "@/lib/pricing/subscriptions";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: merchant } = await supabase
    .from("merchants")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!merchant) redirect("/login");

  // Fetch subscription and usage data
  const subscription = await getCurrentSubscription(user.id);

  // Get actual counts from database instead of cached subscription_usage
  const [servicesResult, productsResult, galleryResult] = await Promise.all([
    supabase.from("services").select("id", { count: "exact" }).eq("merchant_id", user.id),
    supabase.from("products").select("id", { count: "exact" }).eq("merchant_id", user.id),
    supabase.from("gallery").select("id", { count: "exact" }).eq("merchant_id", user.id),
  ]);

  // Build quota info from actual counts
  let quotaInfo = null;
  if (subscription?.tier) {
    const limits = {
      services: subscription.tier.max_services,
      products: subscription.tier.max_products,
      galleryImages: subscription.tier.max_gallery_images,
    };

    const isUnlimited = (limit: number) => limit === -1;

    const servicesCount = servicesResult.count || 0;
    const productsCount = productsResult.count || 0;
    const galleryCount = galleryResult.count || 0;

    quotaInfo = {
      services: {
        used: servicesCount,
        limit: limits.services,
        unlimited: isUnlimited(limits.services),
        percentage: isUnlimited(limits.services) ? 0 : (servicesCount / limits.services) * 100,
      },
      products: {
        used: productsCount,
        limit: limits.products,
        unlimited: isUnlimited(limits.products),
        percentage: isUnlimited(limits.products) ? 0 : (productsCount / limits.products) * 100,
      },
      gallery: {
        used: galleryCount,
        limit: limits.galleryImages,
        unlimited: isUnlimited(limits.galleryImages),
        percentage: isUnlimited(limits.galleryImages) ? 0 : (galleryCount / limits.galleryImages) * 100,
      },
    };
  }

  const t = await getTranslations("settings");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">{t("title")}</h2>
        <p className="text-sm text-gray-600">
          {t("subtitle")}
        </p>
      </div>

      {/* Subscription & Usage Card */}
      {subscription && quotaInfo && (
        <SubscriptionUsageCard subscription={subscription} quotaInfo={quotaInfo} />
      )}

      <UnifiedSettingsForm merchant={merchant} />
    </div>
  );
}
