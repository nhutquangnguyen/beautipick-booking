import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { DesignForm } from "@/components/dashboard/design/design-form";
import { MerchantTheme, defaultTheme } from "@/types/database";
import { getCurrentSubscription } from "@/lib/pricing/subscriptions";

export default async function MyPageThemesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: merchant } = await supabase
    .from("merchants")
    .select("theme, slug")
    .eq("id", user.id)
    .single();

  if (!merchant) redirect("/login");

  // Get subscription info to determine if user is on free tier
  const subscription = await getCurrentSubscription(user.id);
  const isFree = !subscription || subscription.tier?.tier_key === "free";

  const theme = (merchant.theme as MerchantTheme) ?? defaultTheme;
  const t = await getTranslations("nav");
  const tDashboard = await getTranslations("dashboard");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{t("themes")}</h2>
          <p className="text-sm text-gray-600">
            {t("themesDesc")}
          </p>
        </div>
        <Link
          href={`/${merchant.slug}`}
          target="_blank"
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
        >
          <ExternalLink className="h-4 w-4" />
          {tDashboard("preview")}
        </Link>
      </div>

      <DesignForm merchantId={user.id} theme={theme} isFree={isFree} />
    </div>
  );
}
