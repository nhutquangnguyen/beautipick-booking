"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { X, Calendar, Info } from "lucide-react";

interface Merchant {
  id: string;
  email: string;
  business_name: string;
  created_at: string;
  merchant_subscriptions?: Array<{
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
  subscription_usage?: Array<{
    services_count: number;
    products_count: number;
    gallery_images_count: number;
  }>;
}

interface UpgradeMerchantModalProps {
  merchant: Merchant;
  onClose: () => void;
}

export function UpgradeMerchantModal({ merchant, onClose }: UpgradeMerchantModalProps) {
  const router = useRouter();
  // Handle both array and object formats for merchant_subscriptions
  const subscription = Array.isArray(merchant.merchant_subscriptions)
    ? merchant.merchant_subscriptions[0]
    : merchant.merchant_subscriptions;

  const pricingTiers = Array.isArray(subscription?.pricing_tiers)
    ? subscription?.pricing_tiers[0]
    : subscription?.pricing_tiers;
  const currentTier = pricingTiers?.tier_key || "free";

  const [selectedTier, setSelectedTier] = useState<"free" | "pro">(currentTier as "free" | "pro");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [notes, setNotes] = useState(subscription?.notes || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateExpirationDate = () => {
    if (selectedTier === "free") {
      return null;
    }

    const expiresAt = new Date();
    if (billingCycle === "monthly") {
      expiresAt.setMonth(expiresAt.getMonth() + 1);
    } else {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    }
    return expiresAt;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const requestBody = {
        merchantId: merchant.id,
        tierKey: selectedTier,
        billingCycle: selectedTier === "pro" ? billingCycle : undefined,
        notes: notes.trim() || null, // Send null to clear notes, not undefined
      };

      console.log("Sending upgrade request:", requestBody);

      const response = await fetch("/api/subscriptions/upgrade", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log("Upgrade response:", { status: response.status, data });

      if (!response.ok) {
        const errorMsg = data.details || data.error || "Failed to update subscription";
        throw new Error(errorMsg);
      }

      console.log("Subscription updated successfully!");

      // Close modal first
      onClose();

      // Force a hard refresh of the page data
      router.refresh();

      // Give Next.js time to revalidate, then refresh again
      setTimeout(() => {
        router.refresh();
      }, 100);
    } catch (err) {
      console.error("Error in handleSubmit:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const expirationDate = calculateExpirationDate();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Change Subscription Tier
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {merchant.business_name} ({merchant.email})
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Current Subscription */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Current Subscription</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Tier:</span>{" "}
                <span className="font-medium text-gray-900">
                  {currentTier === "free" ? "Free" : "Pro"}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>{" "}
                <span className="font-medium text-gray-900">
                  {subscription?.status || "N/A"}
                </span>
              </div>
              {subscription?.expires_at && (
                <div className="col-span-2">
                  <span className="text-gray-600">Expires:</span>{" "}
                  <span className="font-medium text-gray-900">
                    {new Date(subscription.expires_at).toLocaleDateString()}
                  </span>
                  <span className="text-gray-500 ml-2" suppressHydrationWarning>
                    ({formatDistanceToNow(new Date(subscription.expires_at), { addSuffix: true })})
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Usage Stats */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-medium text-blue-900 mb-2">Current Usage</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-blue-700">Services:</span>{" "}
                <span className="font-medium text-blue-900">
                  {merchant.subscription_usage?.[0]?.services_count || 0}
                </span>
              </div>
              <div>
                <span className="text-blue-700">Products:</span>{" "}
                <span className="font-medium text-blue-900">
                  {merchant.subscription_usage?.[0]?.products_count || 0}
                </span>
              </div>
              <div>
                <span className="text-blue-700">Images:</span>{" "}
                <span className="font-medium text-blue-900">
                  {merchant.subscription_usage?.[0]?.gallery_images_count || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Tier Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              New Subscription Tier
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setSelectedTier("free")}
                className={`p-4 border-2 rounded-lg transition-colors ${
                  selectedTier === "free"
                    ? "border-purple-600 bg-purple-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="font-semibold text-gray-900 mb-1">Free</div>
                <div className="text-xs text-gray-600">
                  100 services, 100 products, 20 images
                </div>
                <div className="text-lg font-bold text-purple-600 mt-2">$0</div>
              </button>
              <button
                type="button"
                onClick={() => setSelectedTier("pro")}
                className={`p-4 border-2 rounded-lg transition-colors ${
                  selectedTier === "pro"
                    ? "border-purple-600 bg-purple-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="font-semibold text-gray-900 mb-1">Pro</div>
                <div className="text-xs text-gray-600">
                  Unlimited services & products, 500 images
                </div>
                <div className="text-lg font-bold text-purple-600 mt-2">200k VND/mo</div>
              </button>
            </div>
          </div>

          {/* Billing Cycle (only for Pro) */}
          {selectedTier === "pro" && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Billing Cycle
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setBillingCycle("monthly")}
                  className={`p-3 border-2 rounded-lg transition-colors ${
                    billingCycle === "monthly"
                      ? "border-purple-600 bg-purple-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="font-medium text-gray-900">Monthly</div>
                  <div className="text-sm text-gray-600">200,000 VND/month</div>
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle("annual")}
                  className={`p-3 border-2 rounded-lg transition-colors ${
                    billingCycle === "annual"
                      ? "border-purple-600 bg-purple-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="font-medium text-gray-900">Annual</div>
                  <div className="text-sm text-gray-600">
                    1,920,000 VND/year
                    <span className="text-green-600 font-medium"> (Save 480k)</span>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Expiration Preview */}
          {expirationDate && (
            <div className="mb-6 p-4 bg-green-50 rounded-lg flex items-start gap-3">
              <Calendar className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-green-900">
                  New Expiration Date
                </div>
                <div className="text-sm text-green-700">
                  {expirationDate.toLocaleDateString()} - {expirationDate.toLocaleTimeString()}
                </div>
              </div>
            </div>
          )}

          {selectedTier === "free" && currentTier === "pro" && (
            <div className="mb-6 p-4 bg-orange-50 rounded-lg flex items-start gap-3">
              <Info className="w-5 h-5 text-orange-600 mt-0.5" />
              <div className="text-sm text-orange-800">
                <strong>Warning:</strong> Downgrading to Free will limit this merchant to 100 services,
                100 products, and 20 gallery images. If they exceed these limits, they won't be able to create new items.
              </div>
            </div>
          )}

          {/* Admin Notes */}
          <div className="mb-6">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Admin Notes (Optional)
            </label>
            <textarea
              id="notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Promotional upgrade, manual adjustment, etc."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Updating..." : "Update Subscription"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
