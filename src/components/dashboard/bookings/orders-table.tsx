"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import { Check, X, ChevronDown, ChevronUp, Search, Filter } from "lucide-react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { Booking } from "@/types/database";
import { formatCurrency, formatTime } from "@/lib/utils";

type BookingWithRelations = Booking & {
  services: { name: string } | null;
  staff: { name: string } | null;
};

type SortField = "created_at" | "customer_name" | "status" | "total_price" | "booking_date";
type SortDirection = "asc" | "desc";

interface CartItemData {
  type: "service" | "product";
  id: string;
  quantity: number;
  service?: {
    name: string;
    price: number;
    duration_minutes?: number;
  };
  product?: {
    name: string;
    price: number;
  };
}


export function OrdersTable({ bookings }: { bookings: BookingWithRelations[] }) {
  const t = useTranslations("bookings");
  const router = useRouter();
  const supabase = createClient();

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [selectedBooking, setSelectedBooking] = useState<BookingWithRelations | null>(null);
  const [showActionDropdown, setShowActionDropdown] = useState(false);

  // Filtered and sorted bookings
  const filteredBookings = useMemo(() => {
    let filtered = bookings.filter((booking) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesId = booking.id.toLowerCase().includes(query);
        const matchesName = booking.customer_name.toLowerCase().includes(query);
        const matchesEmail = booking.customer_email.toLowerCase().includes(query);
        const matchesPhone = booking.customer_phone?.toLowerCase().includes(query);
        if (!matchesId && !matchesName && !matchesEmail && !matchesPhone) {
          return false;
        }
      }

      // Status filter
      if (statusFilter !== "all" && booking.status !== statusFilter) {
        return false;
      }

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      let aVal: any;
      let bVal: any;

      switch (sortField) {
        case "created_at":
          aVal = new Date(a.created_at).getTime();
          bVal = new Date(b.created_at).getTime();
          break;
        case "customer_name":
          aVal = a.customer_name.toLowerCase();
          bVal = b.customer_name.toLowerCase();
          break;
        case "status":
          aVal = a.status;
          bVal = b.status;
          break;
        case "total_price":
          aVal = a.total_price;
          bVal = b.total_price;
          break;
        case "booking_date":
          aVal = a.booking_date ? new Date(a.booking_date).getTime() : 0;
          bVal = b.booking_date ? new Date(b.booking_date).getTime() : 0;
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [bookings, searchQuery, statusFilter, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const updateStatus = async (id: string, status: Booking["status"]) => {
    await supabase.from("bookings").update({ status }).eq("id", id);
    router.refresh();
    setSelectedBooking(null);
    setShowActionDropdown(false);
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-50 text-green-600 ring-1 ring-green-500/20";
      case "pending":
        return "bg-amber-50 text-amber-600 ring-1 ring-amber-500/20";
      case "completed":
        return "bg-blue-50 text-blue-600 ring-1 ring-blue-500/20";
      case "cancelled":
        return "bg-red-50 text-red-600 ring-1 ring-red-500/20";
      default:
        return "bg-gray-50 text-gray-600 ring-1 ring-gray-500/20";
    }
  };

  const getOrderDetails = (booking: BookingWithRelations) => {
    if (booking.cart_items && Array.isArray(booking.cart_items) && booking.cart_items.length > 0) {
      const items = booking.cart_items as unknown as CartItemData[];
      return items.map((item) => item.service?.name || item.product?.name || "Unknown").join(", ");
    }
    return booking.services?.name || "N/A";
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ChevronUp className="h-4 w-4 inline ml-1" />
    ) : (
      <ChevronDown className="h-4 w-4 inline ml-1" />
    );
  };

  if (bookings.length === 0) {
    return (
      <div className="card p-8 text-center">
        <p className="text-gray-600">
          {t("noBookings")}. {t("sharePageDesc")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            >
              <option value="all">{t("all")}</option>
              <option value="pending">{t("status.pending")}</option>
              <option value="confirmed">{t("status.confirmed")}</option>
              <option value="completed">{t("status.completed")}</option>
              <option value="cancelled">{t("status.cancelled")}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("created_at")}
                >
                  Order ID <SortIcon field="created_at" />
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("created_at")}
                >
                  Created At <SortIcon field="created_at" />
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("customer_name")}
                >
                  Customer <SortIcon field="customer_name" />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Details
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("status")}
                >
                  Status <SortIcon field="status" />
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("booking_date")}
                >
                  Date/Time <SortIcon field="booking_date" />
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort("total_price")}
                >
                  Total <SortIcon field="total_price" />
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    {t("noBookings")}
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="text-sm font-mono text-purple-600 hover:text-purple-700 hover:underline font-medium cursor-pointer text-left"
                      >
                        {booking.id.substring(0, 8)}...
                      </button>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {format(parseISO(booking.created_at), "MMM d, yyyy")}
                      </div>
                      <div className="text-xs text-gray-500">
                        {format(parseISO(booking.created_at), "h:mm a")}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-gray-900">{booking.customer_name}</div>
                      <div className="text-xs text-gray-500">{booking.customer_email}</div>
                      {booking.customer_phone && (
                        <div className="text-xs text-gray-500">{booking.customer_phone}</div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {getOrderDetails(booking)}
                      </div>
                      {booking.staff && (
                        <div className="text-xs text-gray-500">with {booking.staff.name}</div>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusBadgeStyle(booking.status)}`}
                      >
                        {t(`status.${booking.status}`)}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {booking.booking_date ? (
                        <>
                          <div className="text-sm text-gray-900">
                            {format(parseISO(booking.booking_date), "MMM d, yyyy")}
                          </div>
                          {booking.start_time && booking.end_time && (
                            <div className="text-xs text-gray-500">
                              {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                            </div>
                          )}
                        </>
                      ) : (
                        <span className="text-sm text-gray-400">{t("productOrder")}</span>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(booking.total_price)}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination info */}
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-500">
            Showing {filteredBookings.length} of {bookings.length} orders
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedBooking && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedBooking(null)}
        >
          <div
            className="w-full max-w-2xl rounded-2xl bg-white p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{t("bookingDetails")}</h2>
                <p className="text-sm text-gray-500 font-mono mt-1">ID: {selectedBooking.id}</p>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Status and Dates */}
              <div className="flex items-center gap-4 flex-wrap">
                <span
                  className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusBadgeStyle(selectedBooking.status)}`}
                >
                  {t(`status.${selectedBooking.status}`)}
                </span>
                <span className="text-sm text-gray-500">
                  Created: {format(parseISO(selectedBooking.created_at), "PPP")}
                </span>
              </div>

              {/* Customer Info */}
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">{t("customer")}</h3>
                <p className="font-medium text-gray-900">{selectedBooking.customer_name}</p>
                <p className="text-sm text-gray-600 mt-1">{selectedBooking.customer_email}</p>
                {selectedBooking.customer_phone && (
                  <p className="text-sm text-gray-600">{selectedBooking.customer_phone}</p>
                )}
              </div>

              {/* Order Details */}
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Order Details</h3>
                {selectedBooking.booking_date && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-600">
                      {format(parseISO(selectedBooking.booking_date), "EEEE, MMMM d, yyyy")}
                    </p>
                    {selectedBooking.start_time && selectedBooking.end_time && (
                      <p className="text-lg font-semibold text-gray-900">
                        {formatTime(selectedBooking.start_time)} - {formatTime(selectedBooking.end_time)}
                      </p>
                    )}
                  </div>
                )}

                {/* Cart Items */}
                {selectedBooking.cart_items &&
                Array.isArray(selectedBooking.cart_items) &&
                selectedBooking.cart_items.length > 0 ? (
                  <div className="space-y-2">
                    {(selectedBooking.cart_items as unknown as CartItemData[]).map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {item.service?.name || item.product?.name || "Unknown"}
                            {item.quantity > 1 && <span className="text-gray-500"> x{item.quantity}</span>}
                          </p>
                          <p className="text-xs text-gray-500 capitalize">{item.type}</p>
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {formatCurrency((item.service?.price || item.product?.price || 0) * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-700">{selectedBooking.services?.name}</p>
                )}

                {selectedBooking.staff && (
                  <p className="text-sm text-gray-500 mt-3">Staff: {selectedBooking.staff.name}</p>
                )}

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-lg font-semibold text-purple-600">
                      {formatCurrency(selectedBooking.total_price)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedBooking.notes && (
                <div className="rounded-lg bg-gray-50 p-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">{t("notes")}</h3>
                  <p className="text-sm text-gray-700">{selectedBooking.notes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-gray-100">
                {selectedBooking.status === "pending" && (
                  <div className="relative flex-1">
                    <button
                      onClick={() => setShowActionDropdown(!showActionDropdown)}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-green-600 py-2.5 font-medium text-white hover:bg-green-700"
                    >
                      <Check className="h-4 w-4" />
                      {t("updateStatus")}
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    {showActionDropdown && (
                      <div className="absolute bottom-full left-0 right-0 mb-2 rounded-xl bg-white border border-gray-200 shadow-lg overflow-hidden z-10">
                        <button
                          onClick={() => updateStatus(selectedBooking.id, "confirmed")}
                          className="w-full flex items-center gap-2 px-4 py-3 text-left text-green-700 hover:bg-green-50"
                        >
                          <Check className="h-4 w-4" />
                          {t("confirmOrder")}
                        </button>
                        <button
                          onClick={() => updateStatus(selectedBooking.id, "cancelled")}
                          className="w-full flex items-center gap-2 px-4 py-3 text-left text-red-700 hover:bg-red-50 border-t border-gray-100"
                        >
                          <X className="h-4 w-4" />
                          {t("cancelOrder")}
                        </button>
                      </div>
                    )}
                  </div>
                )}
                {selectedBooking.status === "confirmed" && (
                  <div className="relative flex-1">
                    <button
                      onClick={() => setShowActionDropdown(!showActionDropdown)}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 font-medium text-white hover:bg-blue-700"
                    >
                      {t("updateStatus")}
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    {showActionDropdown && (
                      <div className="absolute bottom-full left-0 right-0 mb-2 rounded-xl bg-white border border-gray-200 shadow-lg overflow-hidden z-10">
                        <button
                          onClick={() => updateStatus(selectedBooking.id, "completed")}
                          className="w-full flex items-center gap-2 px-4 py-3 text-left text-blue-700 hover:bg-blue-50"
                        >
                          <Check className="h-4 w-4" />
                          {t("markCompleted")}
                        </button>
                        <button
                          onClick={() => updateStatus(selectedBooking.id, "cancelled")}
                          className="w-full flex items-center gap-2 px-4 py-3 text-left text-red-700 hover:bg-red-50 border-t border-gray-100"
                        >
                          <X className="h-4 w-4" />
                          {t("cancelOrder")}
                        </button>
                      </div>
                    )}
                  </div>
                )}
                <button
                  onClick={() => {
                    setSelectedBooking(null);
                    setShowActionDropdown(false);
                  }}
                  className="flex-1 rounded-xl border border-gray-200 py-2.5 font-medium text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
