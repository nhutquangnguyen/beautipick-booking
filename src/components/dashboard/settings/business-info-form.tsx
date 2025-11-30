"use client";

import { useState } from "react";
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

  const [businessInfo, setBusinessInfo] = useState({
    business_name: merchant.business_name,
    slug: merchant.slug,
    description: merchant.description ?? "",
    youtube_url: merchant.youtube_url ?? "",
  });

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
                {typeof window !== 'undefined' ? window.location.origin : ''}/
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
              className="input mt-1"
              rows={4}
              placeholder={t("descriptionPlaceholder")}
            />
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
