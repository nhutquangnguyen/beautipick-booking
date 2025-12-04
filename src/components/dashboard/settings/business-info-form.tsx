"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Youtube, Globe, Info } from "lucide-react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { Merchant } from "@/types/database";
import { generateSlug } from "@/lib/utils";
import { ImageUpload } from "@/components/ui/image-upload";

export function BusinessInfoForm({ merchant }: { merchant: Merchant }) {
  const t = useTranslations("businessForm");
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [origin, setOrigin] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(merchant.logo_url);
  const [coverUrl, setCoverUrl] = useState<string | null>(merchant.cover_image_url);
  const [coverUrl1, setCoverUrl1] = useState<string | null>(merchant.cover_image_1);
  const [coverUrl2, setCoverUrl2] = useState<string | null>(merchant.cover_image_2);
  const [coverUrl3, setCoverUrl3] = useState<string | null>(merchant.cover_image_3);

  const [businessInfo, setBusinessInfo] = useState({
    business_name: merchant.business_name,
    slug: merchant.slug,
    description: merchant.description ?? "",
    youtube_url: merchant.youtube_url ?? "",
    timezone: merchant.timezone ?? "Asia/Ho_Chi_Minh",
    currency: merchant.currency ?? "VND",
    custom_domain: merchant.custom_domain ?? "",
  });

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const normalizeCustomDomain = (domain: string): string | null => {
    if (!domain) return null;

    // Remove whitespace
    let normalized = domain.trim().toLowerCase();

    // Remove protocol if present
    normalized = normalized.replace(/^https?:\/\//, '');

    // Remove www. prefix if present
    normalized = normalized.replace(/^www\./, '');

    // Remove trailing slash if present
    normalized = normalized.replace(/\/$/, '');

    return normalized || null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const normalizedDomain = normalizeCustomDomain(businessInfo.custom_domain);

      await supabase
        .from("merchants")
        .update({
          business_name: businessInfo.business_name,
          slug: businessInfo.slug,
          description: businessInfo.description || null,
          youtube_url: businessInfo.youtube_url || null,
          timezone: businessInfo.timezone,
          currency: businessInfo.currency,
          custom_domain: normalizedDomain,
          logo_url: logoUrl,
          cover_image_url: coverUrl,
          cover_image_1: coverUrl1,
          cover_image_2: coverUrl2,
          cover_image_3: coverUrl3,
        })
        .eq("id", merchant.id);

      // Update the local state with normalized domain
      if (normalizedDomain) {
        setBusinessInfo(prev => ({ ...prev, custom_domain: normalizedDomain }));
      }

      setSuccess(true);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Business Details */}
      <div className="card p-4 sm:p-6">
        <h3 className="text-base font-semibold text-gray-900">{t("businessDetails")}</h3>
        <form onSubmit={handleSubmit} className="mt-4 space-y-6">
          {/* Logo & Cover Images */}
          <div className="space-y-6 pb-6 border-b border-gray-200">
            {/* Cover Image (Legacy - for backward compatibility) */}
            <div>
              <label className="label mb-2">Cover Image (Legacy)</label>
              <ImageUpload
                value={coverUrl}
                onChange={setCoverUrl}
                folder={`merchants/${merchant.id}/cover`}
                aspectRatio="cover"
                placeholder="Upload cover image"
              />
              <p className="mt-2 text-xs text-gray-500">
                Recommended: 1200x400px. Used by older themes.
              </p>
            </div>

            {/* 3 Slideshow Cover Images for Showcase Grid Theme */}
            <div className="space-y-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                  ✨
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Slideshow Cover Images</h4>
                  <p className="text-xs text-gray-600">For Showcase Grid theme - 3 images auto-rotate every 5 seconds</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="label mb-2 text-sm">Cover Image 1</label>
                  <ImageUpload
                    value={coverUrl1}
                    onChange={setCoverUrl1}
                    folder={`merchants/${merchant.id}/covers`}
                    aspectRatio="cover"
                    placeholder="Upload image 1"
                  />
                </div>

                <div>
                  <label className="label mb-2 text-sm">Cover Image 2</label>
                  <ImageUpload
                    value={coverUrl2}
                    onChange={setCoverUrl2}
                    folder={`merchants/${merchant.id}/covers`}
                    aspectRatio="cover"
                    placeholder="Upload image 2"
                  />
                </div>

                <div>
                  <label className="label mb-2 text-sm">Cover Image 3</label>
                  <ImageUpload
                    value={coverUrl3}
                    onChange={setCoverUrl3}
                    folder={`merchants/${merchant.id}/covers`}
                    aspectRatio="cover"
                    placeholder="Upload image 3"
                  />
                </div>
              </div>

              <p className="text-xs text-gray-600 mt-2">
                💡 Tip: Upload high-quality images (1920x1080px recommended) for full-screen slideshow effect.
              </p>
            </div>

            <div>
              <label className="label mb-2">Logo</label>
              <ImageUpload
                value={logoUrl}
                onChange={setLogoUrl}
                folder={`merchants/${merchant.id}/logo`}
                aspectRatio="square"
                placeholder="Upload logo"
              />
              <p className="mt-2 text-xs text-gray-500">
                Recommended: 400x400px. Square format works best.
              </p>
            </div>
          </div>

          <div>
            <label className="label">{t("businessName")}</label>
            <input
              type="text"
              value={businessInfo.business_name}
              onChange={(e) => {
                setBusinessInfo({
                  ...businessInfo,
                  business_name: e.target.value,
                  slug: generateSlug(e.target.value),
                });
              }}
              className="input mt-1"
              required
            />
          </div>

          <div>
            <label className="label">{t("bookingPageUrl")}</label>
            <div className="mt-1 flex flex-col sm:flex-row">
              <span className="flex items-center rounded-t-md sm:rounded-l-md sm:rounded-tr-none border border-b-0 sm:border-b sm:border-r-0 border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-500">
                {origin}/
              </span>
              <input
                type="text"
                value={businessInfo.slug}
                onChange={(e) =>
                  setBusinessInfo({ ...businessInfo, slug: generateSlug(e.target.value) })
                }
                className="input rounded-t-none sm:rounded-l-none sm:rounded-tr-md"
                required
              />
            </div>
          </div>

          <div>
            <label className="label flex items-center gap-2">
              <Globe className="h-4 w-4" />
              {t("customDomain")}
            </label>
            <input
              type="text"
              value={businessInfo.custom_domain}
              onChange={(e) =>
                setBusinessInfo({ ...businessInfo, custom_domain: e.target.value })
              }
              className="input mt-1"
              placeholder="yourdomain.com or www.yourdomain.com"
            />
            <p className="mt-1 text-xs text-gray-500">
              {t("customDomainNote")}
            </p>
            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex gap-2">
                <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-blue-800 space-y-3">
                  <p className="font-medium">{t("customDomainSetup")}</p>
                  <ol className="list-decimal ml-4 space-y-2">
                    <li>{t("customDomainStep1")}</li>
                    <li>{t("customDomainStep2")}</li>
                    <li>{t("customDomainStep3")}</li>
                  </ol>
                  <div className="space-y-2 p-2 bg-white rounded border border-blue-300">
                    <p className="font-semibold text-blue-900">{t("dnsRecords")}:</p>
                    <div className="space-y-1.5">
                      <div className="font-mono text-[11px]">
                        <span className="font-semibold">Host:</span> @ <span className="mx-2">|</span>
                        <span className="font-semibold">Type:</span> A <span className="mx-2">|</span>
                        <span className="font-semibold">Value:</span> 216.198.79.1
                      </div>
                      <div className="font-mono text-[11px]">
                        <span className="font-semibold">Host:</span> www <span className="mx-2">|</span>
                        <span className="font-semibold">Type:</span> CNAME <span className="mx-2">|</span>
                        <span className="font-semibold">Value:</span> d05236ba666bbb6a.vercel-dns-017.com.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="label">{t("description")}</label>
            <textarea
              value={businessInfo.description}
              onChange={(e) => setBusinessInfo({ ...businessInfo, description: e.target.value })}
              className="input mt-1 min-h-[200px] resize-y"
              rows={8}
              placeholder={t("descriptionPlaceholder")}
            />
            <div className="mt-2 flex items-center justify-between">
              <p className="text-xs text-gray-500">
                {businessInfo.description.length} characters
              </p>
            </div>
          </div>

          <div>
            <label className="label flex items-center gap-2">
              <Youtube className="h-4 w-4" />
              {t("youtubeVideo")}
            </label>
            <input
              type="url"
              value={businessInfo.youtube_url}
              onChange={(e) => setBusinessInfo({ ...businessInfo, youtube_url: e.target.value })}
              className="input mt-1"
              placeholder={t("youtubeVideoPlaceholder")}
            />
            <p className="mt-2 text-xs text-gray-500">
              {t("youtubeVideoDesc")}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">{t("timezone")}</label>
              <select
                value={businessInfo.timezone}
                onChange={(e) => setBusinessInfo({ ...businessInfo, timezone: e.target.value })}
                className="input mt-1"
              >
                <option value="Asia/Ho_Chi_Minh">Vietnam (GMT+7)</option>
                <option value="Asia/Bangkok">Thailand (GMT+7)</option>
                <option value="Asia/Singapore">Singapore (GMT+8)</option>
                <option value="Asia/Jakarta">Indonesia (GMT+7)</option>
                <option value="Asia/Manila">Philippines (GMT+8)</option>
                <option value="Asia/Kuala_Lumpur">Malaysia (GMT+8)</option>
                <option value="America/New_York">New York (GMT-5)</option>
                <option value="America/Los_Angeles">Los Angeles (GMT-8)</option>
                <option value="Europe/London">London (GMT+0)</option>
                <option value="Australia/Sydney">Sydney (GMT+11)</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                {t("timezoneDesc")}
              </p>
            </div>

            <div>
              <label className="label">{t("currency")}</label>
              <select
                value={businessInfo.currency}
                onChange={(e) => setBusinessInfo({ ...businessInfo, currency: e.target.value })}
                className="input mt-1"
              >
                <option value="VND">₫ Vietnamese Dong (VND)</option>
                <option value="THB">฿ Thai Baht (THB)</option>
                <option value="SGD">$ Singapore Dollar (SGD)</option>
                <option value="IDR">Rp Indonesian Rupiah (IDR)</option>
                <option value="PHP">₱ Philippine Peso (PHP)</option>
                <option value="MYR">RM Malaysian Ringgit (MYR)</option>
                <option value="USD">$ US Dollar (USD)</option>
                <option value="EUR">€ Euro (EUR)</option>
                <option value="GBP">£ British Pound (GBP)</option>
                <option value="AUD">$ Australian Dollar (AUD)</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                {t("currencyDesc")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={loading} className="btn btn-primary btn-md">
              {loading ? t("saving") : t("saveChanges")}
            </button>
            {success && <span className="text-sm text-green-600">{t("saved")}</span>}
          </div>
        </form>
      </div>
    </div>
  );
}
