"use client";

import { AlertCircle, Crown } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface QuotaBannerProps {
  resourceType: "services" | "products" | "gallery";
  currentCount: number;
  limit: number;
  tierName: string;
  isFree: boolean;
}

export function QuotaBanner({
  resourceType,
  currentCount,
  limit,
  tierName,
  isFree,
}: QuotaBannerProps) {
  const t = useTranslations("quota");
  const isUnlimited = limit === -1;
  const usagePercentage = !isUnlimited ? (currentCount / limit) * 100 : 0;

  const resourceName = t(resourceType);
  const resourceTypeTitle = t(`${resourceType}Title`);

  // Don't show banner for Pro users with unlimited resources
  if (!isFree || isUnlimited) {
    return null;
  }

  return (
    <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-purple-900">
              {t("planLimit", { tierName, resourceType: resourceTypeTitle })}
            </h3>
          </div>
          <p className="text-sm text-purple-700 mb-3">
            {t("usingOf", { current: currentCount, limit, resourceName })}
          </p>
          <div className="w-full bg-purple-200 rounded-full h-2 mb-3">
            <div
              className={`h-2 rounded-full transition-all ${
                usagePercentage >= 90
                  ? "bg-red-500"
                  : usagePercentage >= 70
                  ? "bg-yellow-500"
                  : "bg-purple-500"
              }`}
              style={{ width: `${Math.min(usagePercentage, 100)}%` }}
            />
          </div>
          {usagePercentage >= 90 && (
            <p className="text-sm text-purple-700 font-medium">
              {t("closeToLimit", { resourceName })}
            </p>
          )}
        </div>
        <Link
          href="/business/dashboard/settings"
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors whitespace-nowrap"
        >
          <Crown className="w-4 h-4" />
          {t("upgradeToPro")}
        </Link>
      </div>
    </div>
  );
}
