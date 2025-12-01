"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Youtube } from "lucide-react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { Merchant } from "@/types/database";
import { generateSlug } from "@/lib/utils";

export function BusinessInfoForm({ merchant }: { merchant: Merchant }) {
  const t = useTranslations("businessForm");
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [origin, setOrigin] = useState("");

  const [businessInfo, setBusinessInfo] = useState({
    business_name: merchant.business_name,
    slug: merchant.slug,
    description: merchant.description ?? "",
    youtube_url: merchant.youtube_url ?? "",
    timezone: merchant.timezone ?? "Asia/Ho_Chi_Minh",
    currency: merchant.currency ?? "VND",
  });

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      await supabase
        .from("merchants")
        .update({
          business_name: businessInfo.business_name,
          slug: businessInfo.slug,
          description: businessInfo.description || null,
          youtube_url: businessInfo.youtube_url || null,
          timezone: businessInfo.timezone,
          currency: businessInfo.currency,
        })
        .eq("id", merchant.id);

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
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
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
