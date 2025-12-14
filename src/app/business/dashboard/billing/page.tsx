import { createClient } from "@/lib/supabase/server";
import { getCurrentSubscription } from "@/lib/pricing/subscriptions";
import { getQuotaInfo } from "@/lib/pricing/enforcement";
import { UsageMetrics } from "@/components/billing/usage-metrics";
import { BrandingToggle } from "@/components/billing/branding-toggle";
import { UpgradeButton } from "@/components/billing/upgrade-button";
import { getTranslations } from "next-intl/server";
import { formatDistanceToNow } from "date-fns";
import { redirect } from "next/navigation";

export default async function BillingPage() {
  const supabase = await createClient();
  const t = await getTranslations("billing");

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get subscription and quota info
  const subscription = await getCurrentSubscription(user.id);
  const quota = await getQuotaInfo(user.id);

  if (!subscription || !quota) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{t("title")}</h1>
        <p className="text-gray-600">{t("noSubscription")}</p>
      </div>
    );
  }

  // Get merchant info for branding setting
  const { data: merchant } = await supabase
    .from("merchants")
    .select("id, settings")
    .eq("id", user.id)
    .single();

  const showBranding = (merchant?.settings as any)?.showBranding !== false;
  const isPro = subscription.tier.tier_key === "pro";

  const isExpired = subscription.expires_at && new Date(subscription.expires_at) < new Date();
  const statusColor = isExpired ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800";
  const statusText = isExpired ? t("expired") : t("active");

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t("title")}</h1>
        <p className="text-gray-600">{t("subtitle")}</p>
      </div>

      {/* Current Plan Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              {t("currentPlan")}
            </h2>
            <p className="text-3xl font-bold text-purple-600">
              {subscription.tier.tier_key === "free" ? t("free") : t("pro")}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>
            {statusText}
          </span>
        </div>

        {subscription.expires_at ? (
          <div className="text-sm text-gray-600">
            <span className="font-medium">{t("expiresOn")}:</span>{" "}
            {new Date(subscription.expires_at).toLocaleDateString()}
            <span className="text-gray-500 ml-2" suppressHydrationWarning>
              ({formatDistanceToNow(new Date(subscription.expires_at), { addSuffix: true })})
            </span>
          </div>
        ) : (
          <div className="text-sm text-gray-600">
            {t("neverExpires")}
          </div>
        )}

        {subscription.tier.tier_key === "free" && (
          <div className="mt-4 p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-700 mb-3">
              {t("upgradeMessage")}
            </p>
            <UpgradeButton />
          </div>
        )}
      </div>

      {/* Usage Metrics */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <UsageMetrics quota={quota} />
      </div>

      {/* Branding Settings */}
      {merchant && (
        <BrandingToggle
          merchantId={merchant.id}
          currentValue={showBranding}
          isPro={isPro}
        />
      )}
    </div>
  );
}
