"use client";

import { useTranslations } from "next-intl";

interface UsageMetricsProps {
  quota: {
    services: {
      used: number;
      limit: number;
      unlimited: boolean;
      percentage: number;
    };
    products: {
      used: number;
      limit: number;
      unlimited: boolean;
      percentage: number;
    };
    gallery: {
      used: number;
      limit: number;
      unlimited: boolean;
      percentage: number;
    };
  };
}

export function UsageMetrics({ quota }: UsageMetricsProps) {
  const t = useTranslations("billing");

  const formatLimit = (limit: number, unlimited: boolean) => {
    return unlimited ? t("unlimited") : limit.toString();
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">{t("usageStats")}</h3>

      {/* Services */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            {t("servicesUsed", {
              used: quota.services.used,
              limit: formatLimit(quota.services.limit, quota.services.unlimited),
            })}
          </span>
          {!quota.services.unlimited && (
            <span className="text-xs text-gray-500">
              {Math.round(quota.services.percentage)}%
            </span>
          )}
        </div>
        {!quota.services.unlimited && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${getProgressColor(quota.services.percentage)}`}
              style={{ width: `${Math.min(quota.services.percentage, 100)}%` }}
            />
          </div>
        )}
      </div>

      {/* Products */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            {t("productsUsed", {
              used: quota.products.used,
              limit: formatLimit(quota.products.limit, quota.products.unlimited),
            })}
          </span>
          {!quota.products.unlimited && (
            <span className="text-xs text-gray-500">
              {Math.round(quota.products.percentage)}%
            </span>
          )}
        </div>
        {!quota.products.unlimited && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${getProgressColor(quota.products.percentage)}`}
              style={{ width: `${Math.min(quota.products.percentage, 100)}%` }}
            />
          </div>
        )}
      </div>

      {/* Gallery */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            {t("galleryUsed", {
              used: quota.gallery.used,
              limit: formatLimit(quota.gallery.limit, quota.gallery.unlimited),
            })}
          </span>
          {!quota.gallery.unlimited && (
            <span className="text-xs text-gray-500">
              {Math.round(quota.gallery.percentage)}%
            </span>
          )}
        </div>
        {!quota.gallery.unlimited && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${getProgressColor(quota.gallery.percentage)}`}
              style={{ width: `${Math.min(quota.gallery.percentage, 100)}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
