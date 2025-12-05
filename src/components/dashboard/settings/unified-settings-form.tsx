"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Globe, Info, ClipboardList, QrCode as QrCodeIcon, ChevronDown, ChevronUp, Download } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Merchant } from "@/types/database";
import { generateSlug } from "@/lib/utils";
import { QRCodeSVG } from "qrcode.react";

export function UnifiedSettingsForm({ merchant }: { merchant: Merchant }) {
  const t = useTranslations("settings");
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [origin, setOrigin] = useState("");

  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["url"])
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

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const normalizeCustomDomain = (domain: string): string | null => {
    if (!domain) return null;
    let normalized = domain.trim().toLowerCase();
    normalized = normalized.replace(/^https?:\/\//, '');
    normalized = normalized.replace(/^www\./, '');
    normalized = normalized.replace(/\/$/, '');
    return normalized || null;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const normalizedDomain = normalizeCustomDomain(urlSettings.custom_domain);

      await supabase
        .from("merchants")
        .update({
          slug: urlSettings.slug,
          custom_domain: normalizedDomain,
          settings: {
            ...(merchant.settings as any || {}),
            booking_rules: bookingRules,
          },
        })
        .eq("id", merchant.id);

      setSuccess(true);
      router.refresh();
      setTimeout(() => setSuccess(false), 3000);
    } finally {
      setLoading(false);
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
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* URL Settings */}
      <div className="card overflow-hidden">
        <SectionHeader title={t("bookingPageUrl")} section="url" icon={Globe} />
        {expandedSections.has("url") && (
          <div className="p-6 space-y-4">
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
              </label>
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
            </div>
          </div>
        )}
      </div>

      {/* Booking Rules */}
      <div className="card overflow-hidden">
        <SectionHeader title={t("bookingRulesTitle")} section="rules" icon={ClipboardList} />
        {expandedSections.has("rules") && (
          <div className="p-6 space-y-4">
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={bookingRules.require_phone}
                  onChange={(e) =>
                    setBookingRules({ ...bookingRules, require_phone: e.target.checked })
                  }
                  className="h-4 w-4 rounded text-purple-600"
                />
                <div>
                  <p className="text-sm font-medium text-gray-700">{t("requirePhoneNumber")}</p>
                  <p className="text-xs text-gray-500">{t("requirePhoneNumberDesc")}</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={bookingRules.require_email}
                  onChange={(e) =>
                    setBookingRules({ ...bookingRules, require_email: e.target.checked })
                  }
                  className="h-4 w-4 rounded text-purple-600"
                />
                <div>
                  <p className="text-sm font-medium text-gray-700">{t("requireEmailAddress")}</p>
                  <p className="text-xs text-gray-500">{t("requireEmailDesc")}</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={bookingRules.allow_same_day_booking}
                  onChange={(e) =>
                    setBookingRules({ ...bookingRules, allow_same_day_booking: e.target.checked })
                  }
                  className="h-4 w-4 rounded text-purple-600"
                />
                <div>
                  <p className="text-sm font-medium text-gray-700">{t("allowSameDayBooking")}</p>
                  <p className="text-xs text-gray-500">{t("allowSameDayBookingDesc")}</p>
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
          </div>
        )}
      </div>

      {/* QR Code */}
      <div className="card overflow-hidden">
        <SectionHeader title={t("qrCodeTitle")} section="qrcode" icon={QrCodeIcon} />
        {expandedSections.has("qrcode") && (
          <div className="p-6 space-y-4">
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

      {/* Save Button */}
      <div className="card p-6">
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg"
          >
            {loading ? t("saving") : t("saveSettings")}
          </button>
          {success && (
            <span className="text-sm text-green-600 font-medium">{t("savedSuccessfully")}</span>
          )}
        </div>
      </div>
    </form>
  );
}
