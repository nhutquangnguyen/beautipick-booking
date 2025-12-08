import Link from "next/link";
import {
  Check,
  Palette,
  Image,
  Globe,
  BadgeX,
  Zap,
  Crown,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { LandingHeader } from "@/components/landing/landing-header";

export default async function StorePage() {
  const t = await getTranslations("landing");
  const tNav = await getTranslations("nav");

  return (
    <div className="min-h-screen bg-gray-50">
      <LandingHeader
        brand={t("brand")}
        store={t("pricing")}
        login={t("login")}
        getStarted={t("getStarted")}
        language={tNav("language")}
      />

      {/* Main Content */}
      <main className="pt-32 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Page Title */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              {t("pricing")}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t("pricingStandardDesc")}
            </p>
          </div>

          {/* Product Grid - Store Style */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">

            {/* Pro Bundle - Featured */}
            <div className="sm:col-span-2 lg:col-span-3 relative group">
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
                    <div className="flex items-center gap-2">
                      <Link
                        href="/signup"
                        className="inline-flex items-center justify-center px-4 py-2 rounded-full border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm"
                      >
                        200k/month
                      </Link>
                      <Link
                        href="/signup"
                        className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:opacity-90 transition-opacity"
                      >
                        160k/month (yearly)
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Themes */}
            <div className="group">
              <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100 hover:shadow-lg hover:border-purple-200 transition-all h-full flex flex-col">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-4">
                  <Palette className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{t("pricingFeatureAllThemes")}</h3>
                <p className="text-sm text-gray-600 mb-4 flex-grow">{t("pricingFeatureAllThemesDesc")}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">50k<span className="text-sm font-normal text-gray-500">/mo</span></span>
                  <span className="text-xs text-purple-600 font-medium bg-purple-50 px-2 py-1 rounded-full">Included in Pro</span>
                </div>
              </div>
            </div>

            {/* Extra Gallery */}
            <div className="group">
              <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100 hover:shadow-lg hover:border-purple-200 transition-all h-full flex flex-col">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4">
                  <Image className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{t("pricingFeatureGallery")}</h3>
                <p className="text-sm text-gray-600 mb-4 flex-grow">{t("pricingFeatureGalleryDesc")}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">30k<span className="text-sm font-normal text-gray-500">/mo</span></span>
                  <span className="text-xs text-purple-600 font-medium bg-purple-50 px-2 py-1 rounded-full">Included in Pro</span>
                </div>
              </div>
            </div>

            {/* Custom Domain */}
            <div className="group">
              <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100 hover:shadow-lg hover:border-purple-200 transition-all h-full flex flex-col">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{t("pricingFeatureCustomDomain")}</h3>
                <p className="text-sm text-gray-600 mb-4 flex-grow">{t("pricingFeatureCustomDomainDesc")}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">50k<span className="text-sm font-normal text-gray-500">/mo</span></span>
                  <span className="text-xs text-purple-600 font-medium bg-purple-50 px-2 py-1 rounded-full">Included in Pro</span>
                </div>
              </div>
            </div>

            {/* Remove Branding */}
            <div className="group">
              <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100 hover:shadow-lg hover:border-purple-200 transition-all h-full flex flex-col">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-4">
                  <BadgeX className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{t("pricingFeatureRemoveBranding")}</h3>
                <p className="text-sm text-gray-600 mb-4 flex-grow">{t("pricingFeatureRemoveBrandingDesc")}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">50k<span className="text-sm font-normal text-gray-500">/mo</span></span>
                  <span className="text-xs text-purple-600 font-medium bg-purple-50 px-2 py-1 rounded-full">Included in Pro</span>
                </div>
              </div>
            </div>

            {/* Unlimited Services */}
            <div className="group">
              <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100 hover:shadow-lg hover:border-purple-200 transition-all h-full flex flex-col">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{t("pricingFeatureUnlimited")}</h3>
                <p className="text-sm text-gray-600 mb-4 flex-grow">{t("pricingFeatureUnlimitedDesc")}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">30k<span className="text-sm font-normal text-gray-500">/mo</span></span>
                  <span className="text-xs text-purple-600 font-medium bg-purple-50 px-2 py-1 rounded-full">Included in Pro</span>
                </div>
              </div>
            </div>

          </div>

          {/* FREE Reminder */}
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
              <Link
                href="/signup"
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
              >
                {t("startFreeTrial")}
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
