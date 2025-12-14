"use client";

import Link from "next/link";
import {
  Check,
  Palette,
  Image,
  Globe,
  BadgeX,
  Zap,
  Crown,
  ArrowRight,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardStorePage() {
  const t = useTranslations("landing");
  const router = useRouter();
  const supabase = createClient();
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      // Check current subscription
      const { data: subscription } = await supabase
        .from("merchant_subscriptions")
        .select("pricing_tiers(tier_key, tier_name, tier_name_vi)")
        .eq("merchant_id", user.id)
        .eq("status", "active")
        .maybeSingle();

      const tierKey = (subscription?.pricing_tiers as any)?.tier_key || "free";
      setIsPro(tierKey === "pro");
      setLoading(false);
    };

    checkUser();
  }, [router, supabase]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">{t("pricing")}</h2>
        <p className="text-sm text-gray-600 mt-1">
          {isPro ? t("pricingProMember") : t("pricingStandardDesc")}
        </p>
      </div>

      {/* Current Plan Status */}
      {isPro && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Crown className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{t("pricingProMemberTitle")}</h3>
              <p className="text-sm text-gray-600">{t("pricingProMemberDesc")}</p>
            </div>
          </div>
          <Link
            href="/business/dashboard/billing"
            className="inline-flex items-center gap-2 mt-4 text-sm font-medium text-purple-600 hover:text-purple-700"
          >
            {t("pricingManageSubscription")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {/* Product Grid */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t("pricingAvailableAddons")}</h3>

        {/* Pro Bundle - Featured */}
        <div className="mb-6 relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
          <div className="relative bg-white rounded-2xl p-6 shadow-lg border border-purple-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <Crown className="h-7 w-7 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold text-gray-900">Pro Bundle</h3>
                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      BEST VALUE
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">Everything you need to look professional</p>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1"><Check className="h-4 w-4 text-purple-500" /> All themes</span>
                    <span className="flex items-center gap-1"><Check className="h-4 w-4 text-purple-500" /> 500 images</span>
                    <span className="flex items-center gap-1"><Check className="h-4 w-4 text-purple-500" /> Custom domain</span>
                    <span className="flex items-center gap-1"><Check className="h-4 w-4 text-purple-500" /> No branding</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-3">
                <div className="text-right">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-gray-400 line-through text-lg">200k</span>
                    <span className="text-3xl font-bold text-gray-900">160k</span>
                    <span className="text-gray-500">/month</span>
                  </div>
                  <p className="text-sm text-purple-600 font-medium">Billed yearly • {t("pricingAnnualEffective")}</p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <Link
                    href="/business/dashboard/billing"
                    className="inline-flex items-center justify-center px-4 py-2 rounded-full border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm"
                  >
                    200k/month
                  </Link>
                  <Link
                    href="/business/dashboard/billing"
                    className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:opacity-90 transition-opacity"
                  >
                    160k/month (yearly)
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Individual Add-ons Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Premium Themes */}
          <AddonCard
            icon={<Palette className="h-6 w-6 text-white" />}
            iconGradient="from-violet-500 to-purple-600"
            title={t("pricingFeatureAllThemes")}
            description={t("pricingFeatureAllThemesDesc")}
            price="50k"
            isPro={isPro}
          />

          {/* Extra Gallery */}
          <AddonCard
            icon={<Image className="h-6 w-6 text-white" />}
            iconGradient="from-blue-500 to-cyan-500"
            title={t("pricingFeatureGallery")}
            description={t("pricingFeatureGalleryDesc")}
            price="30k"
            isPro={isPro}
          />

          {/* Custom Domain */}
          <AddonCard
            icon={<Globe className="h-6 w-6 text-white" />}
            iconGradient="from-green-500 to-emerald-500"
            title={t("pricingFeatureCustomDomain")}
            description={t("pricingFeatureCustomDomainDesc")}
            price="50k"
            isPro={isPro}
          />

          {/* Remove Branding */}
          <AddonCard
            icon={<BadgeX className="h-6 w-6 text-white" />}
            iconGradient="from-orange-500 to-red-500"
            title={t("pricingFeatureRemoveBranding")}
            description={t("pricingFeatureRemoveBrandingDesc")}
            price="50k"
            isPro={isPro}
          />

          {/* Unlimited Services */}
          <AddonCard
            icon={<Zap className="h-6 w-6 text-white" />}
            iconGradient="from-amber-500 to-yellow-500"
            title={t("pricingFeatureUnlimited")}
            description={t("pricingFeatureUnlimitedDesc")}
            price="30k"
            isPro={isPro}
          />
        </div>
      </div>

      {/* FREE Reminder */}
      {!isPro && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 text-center">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-sm font-bold px-3 py-1 rounded-full mb-3">
              <Check className="h-4 w-4" />
              {t("pricingBadge")}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t("pricingWhyFreeTitle")}</h3>
            <p className="text-gray-600 text-sm mb-4">
              {t("pricingWhyFreeDesc")}
            </p>
            <p className="text-sm text-gray-500">
              {t("pricingAlreadyMember")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function AddonCard({
  icon,
  iconGradient,
  title,
  description,
  price,
  isPro,
}: {
  icon: React.ReactNode;
  iconGradient: string;
  title: string;
  description: string;
  price: string;
  isPro: boolean;
}) {
  return (
    <div className="group">
      <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100 hover:shadow-lg hover:border-purple-200 transition-all h-full flex flex-col">
        <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${iconGradient} flex items-center justify-center mb-4`}>
          {icon}
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-600 mb-4 flex-grow">{description}</p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">
            {price}
            <span className="text-sm font-normal text-gray-500">/mo</span>
          </span>
          {isPro ? (
            <span className="text-xs text-purple-600 font-medium bg-purple-50 px-2 py-1 rounded-full">
              Active
            </span>
          ) : (
            <span className="text-xs text-purple-600 font-medium bg-purple-50 px-2 py-1 rounded-full">
              Included in Pro
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
