"use client";

import { useTranslations } from "next-intl";
import { Share2 } from "lucide-react";

interface ShareBookingPageProps {
  businessSlug: string | null;
}

export function ShareBookingPage({ businessSlug }: ShareBookingPageProps) {
  const t = useTranslations("dashboard");

  const bookingUrl = businessSlug ? `https://beautipick.com/${businessSlug}` : "";

  const handleShare = async () => {
    if (!bookingUrl) return;

    // Check if native share is available
    if (navigator.share) {
      try {
        await navigator.share({
          title: t("shareBookingPage"),
          text: t("shareWeeklyTip"),
          url: bookingUrl,
        });
      } catch (err) {
        // User cancelled or share failed, silently ignore
        console.log("Share cancelled or failed:", err);
      }
    } else {
      // Fallback to copy
      await navigator.clipboard.writeText(bookingUrl);
    }
  };

  return (
    <div className="rounded-xl border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <h3 className="font-semibold text-gray-900">{t("shareBookingPage")}</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            {businessSlug ? `beautipick.com/${businessSlug}` : t("setUpSlugFirst")}
          </p>
          {businessSlug && (
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity"
            >
              <Share2 className="h-4 w-4" />
              {t("shareNow")}
            </button>
          )}
        </div>
        <div className="text-sm text-gray-600">
          💡 {t("shareWeeklyTip")}
        </div>
      </div>
    </div>
  );
}
