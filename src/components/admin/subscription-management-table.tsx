"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Calendar, Check, X, Edit2 } from "lucide-react";
import { UpgradeMerchantModal } from "./upgrade-merchant-modal";

interface Merchant {
  id: string;
  email: string;
  business_name: string;
  created_at: string;
  merchant_subscriptions: Array<{
    id: string;
    status: string;
    subscription_started_at: string;
    expires_at: string | null;
    notes: string | null;
    pricing_tiers: Array<{
      tier_key: string;
      tier_name: string;
      tier_name_vi: string;
    }> | {
      tier_key: string;
      tier_name: string;
      tier_name_vi: string;
    };
  }>;
  subscription_usage: Array<{
    services_count: number;
    products_count: number;
    gallery_images_count: number;
    storage_used_mb: number;
  }>;
}

interface SubscriptionManagementTableProps {
  merchants: Merchant[];
}

export function SubscriptionManagementTable({ merchants }: SubscriptionManagementTableProps) {
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
  const [filterTier, setFilterTier] = useState<"all" | "free" | "pro">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMerchants = merchants.filter((merchant) => {
    const subscription = merchant.merchant_subscriptions?.[0];
    const pricingTiers = Array.isArray(subscription?.pricing_tiers)
      ? subscription?.pricing_tiers[0]
      : subscription?.pricing_tiers;
    const tierKey = pricingTiers?.tier_key;

    // Filter by tier
    if (filterTier !== "all" && tierKey !== filterTier) {
      return false;
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        merchant.business_name.toLowerCase().includes(query) ||
        merchant.email.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const getTierBadge = (tierKey: string) => {
    if (tierKey === "free") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          Free
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
        Pro
      </span>
    );
  };

  const getStatusBadge = (status: string, expiresAt: string | null) => {
    const isExpired = expiresAt && new Date(expiresAt) < new Date();

    if (isExpired || status === "expired") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <X className="w-3 h-3 mr-1" />
          Expired
        </span>
      );
    }

    if (status === "active") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <Check className="w-3 h-3 mr-1" />
          Active
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        {status}
      </span>
    );
  };

  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Filter by tier */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilterTier("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterTier === "all"
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All ({merchants.length})
          </button>
          <button
            onClick={() => setFilterTier("free")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterTier === "free"
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Free ({merchants.filter(m => {
              const pt = m.merchant_subscriptions?.[0]?.pricing_tiers;
              const tierKey = Array.isArray(pt) ? pt[0]?.tier_key : pt?.tier_key;
              return tierKey === "free";
            }).length})
          </button>
          <button
            onClick={() => setFilterTier("pro")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterTier === "pro"
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Pro ({merchants.filter(m => {
              const pt = m.merchant_subscriptions?.[0]?.pricing_tiers;
              const tierKey = Array.isArray(pt) ? pt[0]?.tier_key : pt?.tier_key;
              return tierKey === "pro";
            }).length})
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Merchant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expires
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMerchants.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No merchants found
                  </td>
                </tr>
              ) : (
                filteredMerchants.map((merchant) => {
                  const subscription = merchant.merchant_subscriptions?.[0];
                  const usage = merchant.subscription_usage?.[0];
                  const pricingTiers = Array.isArray(subscription?.pricing_tiers)
                    ? subscription?.pricing_tiers[0]
                    : subscription?.pricing_tiers;
                  const tierKey = pricingTiers?.tier_key || "free";

                  return (
                    <tr key={merchant.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="text-sm font-medium text-gray-900">
                            {merchant.business_name}
                          </div>
                          <div className="text-sm text-gray-500">{merchant.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getTierBadge(tierKey)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(subscription?.status || "unknown", subscription?.expires_at || null)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {usage?.services_count || 0} services
                        </div>
                        <div className="text-sm text-gray-500">
                          {usage?.products_count || 0} products, {usage?.gallery_images_count || 0} images
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {subscription?.expires_at ? (
                          <div className="flex items-center text-sm text-gray-900">
                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                            <div>
                              <div>{new Date(subscription.expires_at).toLocaleDateString()}</div>
                              <div className="text-xs text-gray-500" suppressHydrationWarning>
                                {formatDistanceToNow(new Date(subscription.expires_at), { addSuffix: true })}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">Never</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => setSelectedMerchant(merchant)}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Edit2 className="w-4 h-4 mr-1.5" />
                          Change Tier
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upgrade Modal */}
      {selectedMerchant && (
        <UpgradeMerchantModal
          merchant={selectedMerchant}
          onClose={() => setSelectedMerchant(null)}
        />
      )}
    </>
  );
}
