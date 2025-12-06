"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { X, Calendar, Users, ShoppingBag, Scissors, Image, CreditCard, Mail, Phone, Globe, Edit2 } from "lucide-react";
import { UpgradeMerchantModal } from "./upgrade-merchant-modal";

interface MerchantDetailModalProps {
  merchant: {
    id: string;
    email: string;
    business_name: string;
    slug: string;
    phone: string | null;
    created_at: string;
    is_active: boolean;
    custom_domain: string | null;
    total_bookings: number;
    total_customers: number;
    total_services: number;
    total_products: number;
    total_staff: number;
    total_gallery_images: number;
    total_revenue: number;
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
  };
  onClose: () => void;
}

export function MerchantDetailModal({ merchant, onClose }: MerchantDetailModalProps) {
  const router = useRouter();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Handle both array and object formats for merchant_subscriptions
  const subscription = Array.isArray(merchant.merchant_subscriptions)
    ? merchant.merchant_subscriptions[0]
    : merchant.merchant_subscriptions;

  const pricingTiers = Array.isArray(subscription?.pricing_tiers)
    ? subscription?.pricing_tiers[0]
    : subscription?.pricing_tiers;
  const tierKey = pricingTiers?.tier_key || "free";

  const isExpired = subscription?.expires_at && new Date(subscription.expires_at) < new Date();

  // Use the calculated totals from the merchant object instead of subscription_usage
  const servicesCount = merchant.total_services || 0;
  const productsCount = merchant.total_products || 0;
  const galleryCount = merchant.total_gallery_images || 0;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {merchant.business_name}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Merchant Details & Subscription
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Contact Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{merchant.email}</p>
                  </div>
                </div>
                {merchant.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium text-gray-900">{merchant.phone}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Slug</p>
                    <a
                      href={`/${merchant.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-purple-600 hover:text-purple-700"
                    >
                      /{merchant.slug}
                    </a>
                  </div>
                </div>
                {merchant.custom_domain && (
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Custom Domain</p>
                      <p className="font-medium text-gray-900">{merchant.custom_domain}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Subscription Info */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Subscription</h3>
                <button
                  onClick={() => setShowUpgradeModal(true)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Change Tier
                </button>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Current Tier</p>
                  {tierKey === "free" ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                      Free
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                      Pro
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  {isExpired ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                      Expired
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  )}
                </div>
                {subscription?.expires_at ? (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Expires</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(subscription.expires_at).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500" suppressHydrationWarning>
                          {formatDistanceToNow(new Date(subscription.expires_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Expires</p>
                    <p className="text-sm font-medium text-gray-900">Never</p>
                  </div>
                )}
              </div>
              {subscription?.notes && (
                <div className="mt-3 pt-3 border-t border-purple-200">
                  <p className="text-sm text-gray-600 mb-1">Admin Notes</p>
                  <p className="text-sm text-gray-900">{subscription.notes}</p>
                </div>
              )}
            </div>

            {/* Usage Stats */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Resource Usage</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Scissors className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Services</p>
                    <p className="text-xl font-bold text-gray-900">
                      {servicesCount}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <ShoppingBag className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Products</p>
                    <p className="text-xl font-bold text-gray-900">
                      {productsCount}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Image className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Gallery Images</p>
                    <p className="text-xl font-bold text-gray-900">
                      {galleryCount}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Stats */}
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Business Statistics</h3>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <ShoppingBag className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="text-xl font-bold text-gray-900">{merchant.total_bookings}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Customers</p>
                    <p className="text-xl font-bold text-gray-900">{merchant.total_customers}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CreditCard className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Revenue</p>
                    <p className="text-xl font-bold text-gray-900">
                      ${merchant.total_revenue.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Users className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Staff Members</p>
                    <p className="text-xl font-bold text-gray-900">{merchant.total_staff}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Account Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Created</p>
                  <p className="font-medium text-gray-900" suppressHydrationWarning>
                    {formatDistanceToNow(new Date(merchant.created_at), { addSuffix: true })}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(merchant.created_at).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  {merchant.is_active ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Inactive
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <UpgradeMerchantModal
          merchant={merchant}
          onClose={() => {
            setShowUpgradeModal(false);
            router.refresh();
          }}
        />
      )}
    </>
  );
}
