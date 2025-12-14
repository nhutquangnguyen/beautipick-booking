"use client";

import { useState } from "react";
import {
  Users,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Search,
  Calendar,
  Image,
  Scissors,
  UserCheck,
  Globe,
  ArrowUpRight,
  BookOpen,
  CreditCard,
  Crown
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { MerchantDetailModal } from "./merchant-detail-modal";
import { DirectoryToggle } from "./directory-toggle";

interface MerchantWithStats {
  id: string;
  email: string;
  business_name: string;
  slug: string;
  phone: string | null;
  created_at: string;
  is_active: boolean;
  show_in_directory: boolean;
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
}

interface AdminDashboardProps {
  merchants: MerchantWithStats[];
}

export function AdminDashboard({ merchants }: AdminDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMerchant, setSelectedMerchant] = useState<MerchantWithStats | null>(null);

  // Filter merchants based on search
  const filteredMerchants = merchants.filter((merchant) => {
    const query = searchQuery.toLowerCase();
    return (
      merchant.business_name.toLowerCase().includes(query) ||
      merchant.email.toLowerCase().includes(query) ||
      merchant.slug.toLowerCase().includes(query)
    );
  });

  // Calculate totals
  const totalMerchants = merchants.length;
  const activeMerchants = merchants.filter((m) => m.is_active).length;
  const totalBookings = merchants.reduce((sum, m) => sum + m.total_bookings, 0);
  const totalRevenue = merchants.reduce((sum, m) => sum + m.total_revenue, 0);
  const totalCustomers = merchants.reduce((sum, m) => sum + m.total_customers, 0);
  const totalGalleryImages = merchants.reduce((sum, m) => sum + m.total_gallery_images, 0);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage all registered merchants</p>
        </div>
        <Link
          href="/admin/blog"
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          <BookOpen className="h-5 w-5" />
          Manage Blog
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Merchants</p>
              <p className="text-2xl font-bold text-gray-900">{totalMerchants}</p>
              <p className="text-xs text-green-600">{activeMerchants} active</p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ShoppingBag className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{totalBookings.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <UserCheck className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{totalCustomers.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <Image className="h-5 w-5 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">Total Gallery Images</p>
              <p className="text-xl font-bold text-gray-900">{totalGalleryImages.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Average Revenue per Merchant</p>
              <p className="text-xl font-bold text-gray-900">
                ${totalMerchants > 0 ? Math.round(totalRevenue / totalMerchants).toLocaleString() : 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by business name, email, or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>

      {/* Merchants Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Merchant
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Contact
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Tier
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Directory
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Stats
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Revenue
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Created
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredMerchants.map((merchant) => {
                // Handle both array and object formats for merchant_subscriptions
                const subscription = Array.isArray(merchant.merchant_subscriptions)
                  ? merchant.merchant_subscriptions[0]
                  : merchant.merchant_subscriptions;

                const pricingTiers = Array.isArray(subscription?.pricing_tiers)
                  ? subscription?.pricing_tiers[0]
                  : subscription?.pricing_tiers;
                const tierKey = pricingTiers?.tier_key || "free";

                return (
                  <tr key={merchant.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div>
                        {/* Pro badge for Pro tier merchants */}
                        <div className="flex items-center gap-2">
                          {tierKey === "pro" && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold rounded">
                              <Crown className="h-3 w-3" />
                              Pro
                            </span>
                          )}
                          <p className="font-medium text-gray-900">{merchant.business_name}</p>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Link
                            href={`/${merchant.slug}`}
                            target="_blank"
                            className="text-xs text-purple-600 hover:text-purple-700 flex items-center gap-1"
                          >
                            /{merchant.slug}
                            <ArrowUpRight className="h-3 w-3" />
                          </Link>
                          {merchant.custom_domain && (
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                              <Globe className="h-3 w-3" />
                              {merchant.custom_domain}
                            </span>
                          )}
                        </div>
                        {!merchant.is_active && (
                          <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded">
                            Inactive
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="text-sm">
                        <p className="text-gray-900">{merchant.email}</p>
                        {merchant.phone && (
                          <p className="text-gray-500">{merchant.phone}</p>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      {tierKey === "free" ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Free
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          Pro
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-4">
                      <DirectoryToggle
                        merchantId={merchant.id}
                        merchantName={merchant.business_name}
                        initialValue={merchant.show_in_directory ?? true}
                      />
                    </td>

                    <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 rounded text-xs">
                        <ShoppingBag className="h-3 w-3 text-blue-600" />
                        <span className="text-blue-900">{merchant.total_bookings}</span>
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 bg-purple-50 rounded text-xs">
                        <Users className="h-3 w-3 text-purple-600" />
                        <span className="text-purple-900">{merchant.total_customers}</span>
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 bg-green-50 rounded text-xs">
                        <Scissors className="h-3 w-3 text-green-600" />
                        <span className="text-green-900">{merchant.total_services}</span>
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 bg-orange-50 rounded text-xs">
                        <Image className="h-3 w-3 text-orange-600" />
                        <span className="text-orange-900">{merchant.total_gallery_images}</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <p className="text-sm font-medium text-gray-900">
                      ${merchant.total_revenue.toLocaleString()}
                    </p>
                  </td>

                  <td className="px-4 py-4">
                    <p className="text-sm text-gray-600">
                      {formatDistanceToNow(new Date(merchant.created_at), {
                        addSuffix: true,
                      })}
                    </p>
                  </td>

                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <Link
                          href={`/${merchant.slug}`}
                          target="_blank"
                          className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                        >
                          View Page
                        </Link>
                        <span className="text-gray-300">|</span>
                        <button
                          onClick={() => setSelectedMerchant(merchant)}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredMerchants.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-gray-600">
              {searchQuery ? "No merchants found" : "No merchants registered yet"}
            </p>
          </div>
        )}
      </div>

      {/* Summary Footer */}
      <div className="text-sm text-gray-600 text-center">
        Showing {filteredMerchants.length} of {totalMerchants} merchants
      </div>

      {/* Merchant Detail Modal */}
      {selectedMerchant && (
        <MerchantDetailModal
          merchant={selectedMerchant}
          onClose={() => setSelectedMerchant(null)}
        />
      )}
    </div>
  );
}
