"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Search, Mail, Phone, Calendar, DollarSign, ShoppingBag } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Customer } from "@/types/database";
import { formatCurrency } from "@/lib/utils";

export function CustomersView({ customers, currency }: { customers: Customer[]; currency: string }) {
  const t = useTranslations("customers");
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter customers based on search query
  const filteredCustomers = customers.filter((customer) => {
    const query = searchQuery.toLowerCase();
    return (
      customer.name.toLowerCase().includes(query) ||
      customer.email.toLowerCase().includes(query) ||
      customer.phone?.toLowerCase().includes(query)
    );
  });

  // Calculate stats
  const totalCustomers = customers.length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.total_spent, 0);
  const avgSpent = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <ShoppingBag className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{t("totalCustomers")}</p>
              <p className="text-2xl font-bold text-gray-900">{totalCustomers}</p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{t("totalRevenue")}</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(totalRevenue, currency)}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{t("avgSpent")}</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(avgSpent, currency)}
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
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>

      {/* Customers List */}
      {filteredCustomers.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-gray-600">
            {searchQuery ? t("noResults") : t("noCustomers")}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="mt-2 text-sm text-purple-600 hover:text-purple-700"
            >
              {t("clearSearch")}
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Mobile Cards */}
          <div className="space-y-3 md:hidden">
            {filteredCustomers.map((customer) => (
              <div key={customer.id} className="card p-4">
                {/* Header with avatar and name */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                    <span className="text-sm font-semibold text-purple-600">
                      {customer.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{customer.name}</p>
                    <p className="text-xs text-gray-500">
                      {customer.last_booking_date
                        ? formatDistanceToNow(new Date(customer.last_booking_date), { addSuffix: true })
                        : t("noBookingsYet")}
                    </p>
                  </div>
                  <button
                    onClick={() => router.push(`/dashboard/bookings?customer=${encodeURIComponent(customer.phone || customer.email)}`)}
                    className="flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700"
                  >
                    {customer.total_bookings} {t("bookings")}
                  </button>
                </div>

                {/* Contact info */}
                <div className="space-y-1.5 mb-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                  {customer.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{customer.phone}</span>
                    </div>
                  )}
                </div>

                {/* Stats row */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(customer.total_spent, currency)}</p>
                    <p className="text-xs text-gray-500">{t("totalSpent")}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">{customer.total_bookings}</p>
                    <p className="text-xs text-gray-500">{t("orders")}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">
                      {customer.total_bookings > 0
                        ? formatCurrency(customer.total_spent / customer.total_bookings, currency)
                        : formatCurrency(0, currency)}
                    </p>
                    <p className="text-xs text-gray-500">{t("avgOrder")}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="card overflow-hidden hidden md:block">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("customer")}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("contact")}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("bookings")}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("totalSpent")}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("lastBooking")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <p className="font-medium text-gray-900">{customer.name}</p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="h-4 w-4" />
                            <span>{customer.email}</span>
                          </div>
                          {customer.phone && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone className="h-4 w-4" />
                              <span>{customer.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => router.push(`/dashboard/bookings?customer=${encodeURIComponent(customer.phone || customer.email)}`)}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors cursor-pointer"
                        >
                          {customer.total_bookings} {t("bookings")}
                        </button>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm font-medium text-gray-900">
                          {formatCurrency(customer.total_spent, currency)}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm text-gray-600">
                          {customer.last_booking_date ? formatDistanceToNow(new Date(customer.last_booking_date), {
                            addSuffix: true,
                          }) : t("noBookingsYet")}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Results count */}
      <div className="text-sm text-gray-600 text-center">
        {t("showing")} {filteredCustomers.length} {t("of")} {totalCustomers} {t("customers")}
      </div>
    </div>
  );
}
