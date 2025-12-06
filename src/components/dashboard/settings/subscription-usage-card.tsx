"use client";

import { Crown, Zap, CheckCircle2, AlertCircle } from "lucide-react";

interface SubscriptionUsageCardProps {
  subscription: {
    tier: {
      tier_key: string;
      tier_name: string;
      tier_name_vi: string;
    };
    status: string;
    expires_at: string | null;
  } | null;
  quotaInfo: {
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
  } | null;
}

export function SubscriptionUsageCard({ subscription, quotaInfo }: SubscriptionUsageCardProps) {
  if (!subscription || !quotaInfo) {
    return null;
  }

  const isPro = subscription.tier.tier_key === "pro";
  const isActive = subscription.status === "active";

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getUsageColor = (percentage: number, unlimited: boolean) => {
    if (unlimited) return "text-green-600";
    if (percentage >= 90) return "text-red-600";
    if (percentage >= 70) return "text-yellow-600";
    return "text-green-600";
  };

  const getProgressBarColor = (percentage: number, unlimited: boolean) => {
    if (unlimited) return "bg-green-500";
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className={`p-6 border-b border-gray-200 ${isPro ? "bg-gradient-to-r from-purple-50 to-pink-50" : "bg-gray-50"}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isPro ? (
              <div className="p-2 bg-purple-100 rounded-lg">
                <Crown className="w-6 h-6 text-purple-600" />
              </div>
            ) : (
              <div className="p-2 bg-gray-100 rounded-lg">
                <Zap className="w-6 h-6 text-gray-600" />
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {subscription.tier.tier_name} Plan
              </h3>
              <div className="flex items-center gap-2 mt-1">
                {isActive ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600 font-medium">Active</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm text-yellow-600 font-medium">Inactive</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Expires</p>
            <p className="text-sm font-medium text-gray-900">
              {formatDate(subscription.expires_at)}
            </p>
          </div>
        </div>
      </div>

      {/* Usage Stats */}
      <div className="p-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-4">Resource Usage</h4>
        <div className="space-y-4">
          {/* Services */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Services</span>
              <span className={`text-sm font-semibold ${getUsageColor(quotaInfo.services.percentage, quotaInfo.services.unlimited)}`}>
                {quotaInfo.services.used} / {quotaInfo.services.unlimited ? "Unlimited" : quotaInfo.services.limit}
              </span>
            </div>
            {!quotaInfo.services.unlimited && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${getProgressBarColor(quotaInfo.services.percentage, quotaInfo.services.unlimited)}`}
                  style={{ width: `${Math.min(quotaInfo.services.percentage, 100)}%` }}
                />
              </div>
            )}
          </div>

          {/* Products */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Products</span>
              <span className={`text-sm font-semibold ${getUsageColor(quotaInfo.products.percentage, quotaInfo.products.unlimited)}`}>
                {quotaInfo.products.used} / {quotaInfo.products.unlimited ? "Unlimited" : quotaInfo.products.limit}
              </span>
            </div>
            {!quotaInfo.products.unlimited && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${getProgressBarColor(quotaInfo.products.percentage, quotaInfo.products.unlimited)}`}
                  style={{ width: `${Math.min(quotaInfo.products.percentage, 100)}%` }}
                />
              </div>
            )}
          </div>

          {/* Gallery Images */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Gallery Images</span>
              <span className={`text-sm font-semibold ${getUsageColor(quotaInfo.gallery.percentage, quotaInfo.gallery.unlimited)}`}>
                {quotaInfo.gallery.used} / {quotaInfo.gallery.unlimited ? "Unlimited" : quotaInfo.gallery.limit}
              </span>
            </div>
            {!quotaInfo.gallery.unlimited && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${getProgressBarColor(quotaInfo.gallery.percentage, quotaInfo.gallery.unlimited)}`}
                  style={{ width: `${Math.min(quotaInfo.gallery.percentage, 100)}%` }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Upgrade CTA for Free tier */}
        {!isPro && (
          <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-start gap-3">
              <Crown className="w-5 h-5 text-purple-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-purple-900">Upgrade to Pro</p>
                <p className="text-sm text-purple-700 mt-1">
                  Get unlimited services, products, and 500 gallery images.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
