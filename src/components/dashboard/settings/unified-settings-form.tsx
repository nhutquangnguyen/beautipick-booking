"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Globe, Info, ClipboardList, QrCode as QrCodeIcon, ChevronDown, ChevronUp, Download, Crown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Merchant } from "@/types/database";
import { generateSlug } from "@/lib/utils";
import { QRCodeSVG } from "qrcode.react";
import Link from "next/link";

export function UnifiedSettingsForm({ merchant }: { merchant: Merchant }) {
  const t = useTranslations("settings");
  const router = useRouter();
  const supabase = createClient();
  const [urlLoading, setUrlLoading] = useState(false);
  const [urlSuccess, setUrlSuccess] = useState(false);
  const [urlError, setUrlError] = useState("");
  const [rulesLoading, setRulesLoading] = useState(false);
  const [rulesSuccess, setRulesSuccess] = useState(false);
  const [rulesError, setRulesError] = useState("");
  const [origin, setOrigin] = useState("");
  const [isPro, setIsPro] = useState(false);

  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["url", "rules"])
  );

  // URL Settings
  const [urlSettings, setUrlSettings] = useState({
    slug: merchant.slug,
    custom_domain: merchant.custom_domain ?? "",
  });

  // Booking Rules
  const [bookingRules, setBookingRules] = useState<any>(
    (merchant.settings as any)?.booking_rules ?? {
      require_phone: true,
      require_email: true,
      min_advance_booking: 0,
      max_advance_booking: 30,
      allow_same_day_booking: true,
      cancellation_hours: 24,
    }
  );

  // Branding setting (default to true to show branding)
  const [showBranding, setShowBranding] = useState<boolean>(
    (merchant.settings as any)?.showBranding !== false
  );

  useEffect(() => {
    setOrigin(window.location.origin);

    // Check subscription tier
    const checkTier = async () => {
      const { data: subscription } = await supabase
        .from("merchant_subscriptions")
        .select("pricing_tiers(tier_key)")
        .eq("merchant_id", merchant.id)
        .eq("status", "active")
        .maybeSingle();

      const tierKey = (subscription?.pricing_tiers as any)?.tier_key || "free";
      setIsPro(tierKey === "pro");
    };
    checkTier();
  }, [merchant.id, supabase]);

  const normalizeCustomDomain = (domain: string): string | null => {
    if (!domain) return null;
    let normalized = domain.trim().toLowerCase();
    normalized = normalized.replace(/^https?:\/\//, '');
    normalized = normalized.replace(/^www\./, '');
    normalized = normalized.replace(/\/$/, '');
    return normalized || null;
  };

  const validateCustomDomain = (domain: string): string | null => {
    if (!domain) return null;
    const normalized = normalizeCustomDomain(domain);
    if (!normalized) return null;

    // Basic domain validation
    const domainRegex = /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,}$/;
    if (!domainRegex.test(normalized)) {
      return t("invalidDomainFormat");
    }
    return null;
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUrlLoading(true);
    setUrlSuccess(false);
    setUrlError("");

    try {
      // Validate slug
      if (!urlSettings.slug || urlSettings.slug.length < 3) {
        setUrlError(t("slugTooShort"));
        return;
      }

      // Validate custom domain for Pro users
      if (isPro && urlSettings.custom_domain) {
        const domainError = validateCustomDomain(urlSettings.custom_domain);
        if (domainError) {
          setUrlError(domainError);
          return;
        }
      }

      const normalizedDomain = isPro ? normalizeCustomDomain(urlSettings.custom_domain) : null;

      const { error } = await supabase
        .from("merchants")
        .update({
          slug: urlSettings.slug,
          custom_domain: normalizedDomain,
          settings: {
            ...(merchant.settings as any || {}),
            showBranding: showBranding,
          },
        })
        .eq("id", merchant.id);

      if (error) throw error;

      setUrlSuccess(true);
      router.refresh();
      setTimeout(() => setUrlSuccess(false), 5000);
    } catch (error: any) {
      setUrlError(error.message || t("errorSaving"));
    } finally {
      setUrlLoading(false);
    }
  };

  const handleRulesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRulesLoading(true);
    setRulesSuccess(false);
    setRulesError("");

    try {
      // Validate booking rules
      if (bookingRules.max_advance_booking < bookingRules.min_advance_booking) {
        setRulesError(t("maxBookingLessThanMin"));
        return;
      }

      if (bookingRules.min_advance_booking < 0 || bookingRules.max_advance_booking < 1) {
        setRulesError(t("invalidBookingDays"));
        return;
      }

      const { error } = await supabase
        .from("merchants")
        .update({
          settings: {
            ...(merchant.settings as any || {}),
            booking_rules: bookingRules,
          },
        })
        .eq("id", merchant.id);

      if (error) throw error;

      setRulesSuccess(true);
      router.refresh();
      setTimeout(() => setRulesSuccess(false), 5000);
    } catch (error: any) {
      setRulesError(error.message || t("errorSaving"));
    } finally {
      setRulesLoading(false);
    }
  };

  const downloadQR = () => {
    const canvas = document.getElementById("qr-code") as HTMLCanvasElement;
    if (!canvas) return;

    const svg = canvas.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const svgUrl = URL.createObjectURL(svgBlob);

    const downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = `${merchant.slug}-qr-code.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(svgUrl);
  };

  const bookingPageUrl = `${origin}/${merchant.slug}`;
  const customDomainUrl = merchant.custom_domain ? `https://${merchant.custom_domain}` : null;

  const SectionHeader = ({ title, section, icon: Icon }: { title: string; section: string; icon: any }) => {
    const isExpanded = expandedSections.has(section);
    return (
      <button
        type="button"
        onClick={() => toggleSection(section)}
        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors rounded-lg"
        aria-expanded={isExpanded}
        aria-controls={`section-${section}`}
      >
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5 text-gray-600" />
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        )}
      </button>
    );
  };

  return (
    <div className="space-y-6">
      {/* Booking Page Configuration Section Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{t("bookingPageSettings")}</h3>
        <p className="text-sm text-gray-600 mt-1">{t("bookingPageSettingsDesc")}</p>
      </div>

      {/* URL Settings Form */}
      <form onSubmit={handleUrlSubmit} className="card overflow-hidden">
        <SectionHeader title={t("bookingPageUrl")} section="url" icon={Globe} />
        {expandedSections.has("url") && (
          <div id="section-url" className="p-6 space-y-4">
            <div>
              <label className="label">{t("pageSlug")}</label>
              <div className="mt-1 flex flex-col sm:flex-row">
                <span className="flex items-center rounded-t-md sm:rounded-l-md sm:rounded-tr-none border border-b-0 sm:border-b sm:border-r-0 border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-500">
                  {origin}/
                </span>
                <input
                  type="text"
                  value={urlSettings.slug}
                  onChange={(e) =>
                    setUrlSettings({ ...urlSettings, slug: generateSlug(e.target.value) })
                  }
                  className="input rounded-t-none sm:rounded-l-none sm:rounded-tr-md"
                  required
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                {t("pageSlugDesc")}
              </p>
            </div>

            <div>
              <label className="label flex items-center gap-2">
                <Globe className="h-4 w-4" />
                {t("customDomainOptional")}
                {!isPro && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold rounded-full">
                    <Crown className="h-3 w-3" />
                    Pro
                  </span>
                )}
              </label>

              {!isPro ? (
                <div className="mt-1 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                      <Crown className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{t("customDomainProFeature")}</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        {t("customDomainProDescription")}
                      </p>
                      <Link
                        href="/business/dashboard/billing"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
                      >
                        <Crown className="h-4 w-4" />
                        {t("upgradeToPro")}
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <input
                    type="text"
                    value={urlSettings.custom_domain}
                    onChange={(e) =>
                      setUrlSettings({ ...urlSettings, custom_domain: e.target.value })
                    }
                    className="input mt-1"
                    placeholder="yourdomain.com"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {t("customDomainDesc", { origin })}
                  </p>
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="flex gap-2">
                      <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-xs text-blue-800 space-y-2">
                        <p className="font-medium">{t("dnsSetupRequired")}</p>
                        <div className="space-y-1 p-2 bg-white rounded border border-blue-300 font-mono text-[11px]">
                          <div><strong>A Record:</strong> @ → 216.198.79.1</div>
                          <div><strong>CNAME:</strong> www → d05236ba666bbb6a.vercel-dns-017.com.</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Show Branding Toggle */}
            <div className="pt-4 border-t border-gray-200">
              <label className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer ${
                isPro ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200' : 'bg-gray-100 border-2 border-gray-300'
              }`}>
                <input
                  type="checkbox"
                  id="show-branding"
                  checked={isPro ? showBranding : true}
                  onChange={(e) => isPro && setShowBranding(e.target.checked)}
                  disabled={!isPro}
                  className={`h-5 w-5 rounded ${isPro ? 'text-purple-600 cursor-pointer' : 'text-gray-400 cursor-not-allowed'}`}
                  aria-describedby="show-branding-desc"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-medium ${isPro ? 'text-gray-900' : 'text-gray-500'}`}>
                      {t("showBranding")}
                    </p>
                    {isPro && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold rounded-full">
                        <Crown className="h-3 w-3" />
                        Pro
                      </span>
                    )}
                  </div>
                  <p id="show-branding-desc" className={`text-xs mt-1 ${isPro ? 'text-gray-600' : 'text-gray-500'}`}>
                    {isPro ? t("showBrandingDesc") : t("showBrandingDescFree")}
                  </p>
                </div>
              </label>
            </div>

            {/* Save Actions */}
            <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                type="submit"
                disabled={urlLoading}
                className="btn btn-primary btn-md"
              >
                {urlLoading ? t("saving") : t("saveUrlSettings")}
              </button>
              {urlSuccess && (
                <span className="text-sm text-green-600 font-medium">{t("savedSuccessfully")}</span>
              )}
            </div>

            {/* Error Display */}
            {urlError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800 font-medium">{urlError}</p>
              </div>
            )}
          </div>
        )}
      </form>

      {/* Booking Rules Form */}
      <form onSubmit={handleRulesSubmit} className="card overflow-hidden">
        <SectionHeader title={t("bookingRulesTitle")} section="rules" icon={ClipboardList} />
        {expandedSections.has("rules") && (
          <div id="section-rules" className="p-6 space-y-4">
            <div className="space-y-3">
              <label htmlFor="require-phone" className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  id="require-phone"
                  checked={bookingRules.require_phone}
                  onChange={(e) =>
                    setBookingRules({ ...bookingRules, require_phone: e.target.checked })
                  }
                  className="h-4 w-4 rounded text-purple-600"
                  aria-describedby="require-phone-desc"
                />
                <div>
                  <p className="text-sm font-medium text-gray-700">{t("requirePhoneNumber")}</p>
                  <p id="require-phone-desc" className="text-xs text-gray-500">{t("requirePhoneNumberDesc")}</p>
                </div>
              </label>

              <label htmlFor="require-email" className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  id="require-email"
                  checked={bookingRules.require_email}
                  onChange={(e) =>
                    setBookingRules({ ...bookingRules, require_email: e.target.checked })
                  }
                  className="h-4 w-4 rounded text-purple-600"
                  aria-describedby="require-email-desc"
                />
                <div>
                  <p className="text-sm font-medium text-gray-700">{t("requireEmailAddress")}</p>
                  <p id="require-email-desc" className="text-xs text-gray-500">{t("requireEmailDesc")}</p>
                </div>
              </label>

              <label htmlFor="allow-same-day" className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  id="allow-same-day"
                  checked={bookingRules.allow_same_day_booking}
                  onChange={(e) =>
                    setBookingRules({ ...bookingRules, allow_same_day_booking: e.target.checked })
                  }
                  className="h-4 w-4 rounded text-purple-600"
                  aria-describedby="allow-same-day-desc"
                />
                <div>
                  <p className="text-sm font-medium text-gray-700">{t("allowSameDayBooking")}</p>
                  <p id="allow-same-day-desc" className="text-xs text-gray-500">{t("allowSameDayBookingDesc")}</p>
                </div>
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">{t("minimumAdvanceBooking")}</label>
                <input
                  type="number"
                  value={bookingRules.min_advance_booking}
                  onChange={(e) =>
                    setBookingRules({ ...bookingRules, min_advance_booking: parseInt(e.target.value) || 0 })
                  }
                  className="input mt-1"
                  min="0"
                />
                <p className="mt-1 text-xs text-gray-500">
                  {t("minimumAdvanceBookingDesc")}
                </p>
              </div>

              <div>
                <label className="label">{t("maximumAdvanceBooking")}</label>
                <input
                  type="number"
                  value={bookingRules.max_advance_booking}
                  onChange={(e) =>
                    setBookingRules({ ...bookingRules, max_advance_booking: parseInt(e.target.value) || 30 })
                  }
                  className="input mt-1"
                  min="1"
                />
                <p className="mt-1 text-xs text-gray-500">
                  {t("maximumAdvanceBookingDesc")}
                </p>
              </div>
            </div>

            <div>
              <label className="label">{t("cancellationNotice")}</label>
              <input
                type="number"
                value={bookingRules.cancellation_hours}
                onChange={(e) =>
                  setBookingRules({ ...bookingRules, cancellation_hours: parseInt(e.target.value) || 24 })
                }
                className="input mt-1"
                min="0"
              />
              <p className="mt-1 text-xs text-gray-500">
                {t("cancellationNoticeDesc")}
              </p>
            </div>

            {/* Save Button */}
            <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                type="submit"
                disabled={rulesLoading}
                className="btn btn-primary btn-md"
              >
                {rulesLoading ? t("saving") : t("saveBookingRules")}
              </button>
              {rulesSuccess && (
                <span className="text-sm text-green-600 font-medium">{t("savedSuccessfully")}</span>
              )}
            </div>

            {/* Error Display */}
            {rulesError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800 font-medium">{rulesError}</p>
              </div>
            )}
          </div>
        )}
      </form>

      {/* QR Code - Read Only Section */}
      <div className="card overflow-hidden">
        <SectionHeader title={t("qrCodeTitle")} section="qrcode" icon={QrCodeIcon} />
        {expandedSections.has("qrcode") && (
          <div id="section-qrcode" className="p-6 space-y-4">
            <p className="text-sm text-gray-600">
              {t("qrCodeDesc")}
            </p>

            <div className="flex flex-col sm:flex-row gap-6">
              <div id="qr-code" className="flex-shrink-0">
                <QRCodeSVG
                  value={customDomainUrl || bookingPageUrl}
                  size={200}
                  level="H"
                  includeMargin
                />
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <label className="label">{t("qrCodeUrl")}</label>
                  <input
                    type="text"
                    value={customDomainUrl || bookingPageUrl}
                    readOnly
                    className="input mt-1 bg-gray-50"
                  />
                </div>

                <button
                  type="button"
                  onClick={downloadQR}
                  className="btn btn-outline btn-md flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  {t("downloadQrCode")}
                </button>

                <p className="text-xs text-gray-500">
                  {t("qrCodePrintDesc")}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
