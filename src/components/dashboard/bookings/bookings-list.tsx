"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import { Check, X, Clock, Mail, Phone, Sparkles, ShoppingBag, ChevronDown, Search, ArrowUp, ArrowDown, Calendar, User, Package, DollarSign } from "lucide-react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { Booking } from "@/types/database";
import { formatCurrency, formatTime, formatDuration } from "@/lib/utils";

// Cart item type for display
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


type BookingWithRelations = Booking & {
  services: { name: string } | null;
  staff: { name: string } | null;
};

export function BookingsList({ bookings }: { bookings: BookingWithRelations[] }) {
  const t = useTranslations("bookings");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<BookingWithRelations | null>(null);
  const [showActionDropdown, setShowActionDropdown] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Sorting
  const [sortBy, setSortBy] = useState<"created_at" | "booking_date" | "total_price">("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const router = useRouter();
  const supabase = createClient();

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = booking.customer_name.toLowerCase().includes(query);
        const matchesEmail = booking.customer_email.toLowerCase().includes(query);
        const matchesPhone = booking.customer_phone?.toLowerCase().includes(query);
        const matchesService = booking.services?.name.toLowerCase().includes(query);
        const matchesId = booking.id.toLowerCase().includes(query);
        if (!matchesName && !matchesEmail && !matchesPhone && !matchesService && !matchesId) {
          return false;
        }
      }

      // Status filter
      if (statusFilter !== "all" && booking.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [bookings, searchQuery, statusFilter]);

  // Apply sorting
  const sortedBookings = useMemo(() => {
    const sorted = [...filteredBookings];

    sorted.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case "created_at":
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
        case "booking_date":
          // For booking date, use booking_date + start_time, or created_at for product orders
          if (a.booking_date && a.start_time) {
            aValue = new Date(`${a.booking_date}T${a.start_time}`).getTime();
          } else {
            aValue = new Date(a.created_at).getTime();
          }
          if (b.booking_date && b.start_time) {
            bValue = new Date(`${b.booking_date}T${b.start_time}`).getTime();
          } else {
            bValue = new Date(b.created_at).getTime();
          }
          break;
        case "total_price":
          aValue = a.total_price;
          bValue = b.total_price;
          break;
        default:
          return 0;
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });

    return sorted;
  }, [filteredBookings, sortBy, sortDirection]);

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
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
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
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
        >
          <option value="all">All Statuses</option>
          <option value="pending">{t("status.pending")}</option>
          <option value="confirmed">{t("status.confirmed")}</option>
          <option value="completed">{t("status.completed")}</option>
          <option value="cancelled">{t("status.cancelled")}</option>
        </select>
      </div>

      {/* Sort Controls */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <span className="text-sm text-gray-600">Showing {sortedBookings.length} of {bookings.length} orders</span>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            <option value="created_at">Created Time</option>
            <option value="booking_date">Booking Time</option>
            <option value="total_price">Total Money</option>
          </select>
          <button
            onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
            className="flex items-center justify-center rounded-lg border border-gray-200 bg-white p-2 hover:bg-gray-50 transition-colors"
            title={sortDirection === "asc" ? "Ascending" : "Descending"}
          >
            {sortDirection === "asc" ? (
              <ArrowUp className="h-4 w-4 text-gray-600" />
            ) : (
              <ArrowDown className="h-4 w-4 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Bookings */}
      <div className="space-y-3">
        {sortedBookings.length === 0 ? (
          <div className="card p-8 text-center text-gray-500">
            {t("noBookings")}
          </div>
        ) : (
          sortedBookings.map((booking) => (
            <div
              key={booking.id}
              onClick={() => setSelectedBooking(booking)}
              className="card overflow-hidden cursor-pointer hover:shadow-md hover:border-purple-300 transition-all"
            >
              {/* Header Section */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-3 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-medium text-gray-500">Order ID</span>
                    <p className="text-sm font-mono font-semibold text-gray-900">#{booking.id.substring(0, 8)}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusBadgeStyle(booking.status)}`}>
                    {t(`status.${booking.status}`)}
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-4 space-y-3">
                {/* Customer Info */}
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <User className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{booking.customer_name}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                      <Mail className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{booking.customer_email}</span>
                    </div>
                    {booking.customer_phone && (
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                        <Phone className="h-3 w-3 flex-shrink-0" />
                        <span>{booking.customer_phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Time Information */}
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 mb-1">Created</p>
                    <p className="text-sm text-gray-900">
                      {format(parseISO(booking.created_at), "MMM d, yyyy")} • {format(parseISO(booking.created_at), "h:mm a")}
                    </p>
                    {booking.booking_date && (
                      <>
                        <p className="text-xs font-medium text-gray-500 mt-2 mb-1">Booking Time</p>
                        <p className="text-sm text-gray-900">
                          {format(parseISO(booking.booking_date), "MMM d, yyyy")}
                          {booking.start_time && booking.end_time && (
                            <> • {formatTime(booking.start_time)} - {formatTime(booking.end_time)}</>
                          )}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Items/Service Info */}
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <Package className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 mb-1">
                      {booking.booking_date ? "Service" : "Products"}
                    </p>
                    {booking.cart_items && Array.isArray(booking.cart_items) && booking.cart_items.length > 0 ? (
                      <div className="text-sm text-gray-900">
                        {(booking.cart_items as unknown as CartItemData[]).map((item, idx) => (
                          <div key={idx}>
                            {item.type === "service" ? item.service?.name || "Service" : item.product?.name || "Product"}
                            {item.type === "product" && ` (x${item.quantity || 1})`}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-900">{booking.services?.name}</p>
                    )}
                    {booking.staff && (
                      <p className="text-xs text-gray-500 mt-1">with {booking.staff.name}</p>
                    )}
                  </div>
                </div>

                {/* Total Price */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <DollarSign className="h-4 w-4 text-purple-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Total</span>
                  </div>
                  <span className="text-lg font-bold text-purple-600">
                    {formatCurrency(booking.total_price)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-900">{t("bookingDetails")}</h2>
            </div>

            <div className="space-y-4">
              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusBadgeStyle(selectedBooking.status)}`}>
                  {t(`status.${selectedBooking.status}`)}
                </span>
              </div>

              {/* Time & Items */}
              <div className="rounded-lg bg-gray-50 p-4">
                {selectedBooking.booking_date && (
                  <>
                    <p className="text-sm text-gray-500">
                      {format(parseISO(selectedBooking.booking_date), "EEEE, MMMM d, yyyy")}
                    </p>
                    {selectedBooking.start_time && selectedBooking.end_time && (
                      <p className="text-lg font-semibold text-gray-900">
                        {formatTime(selectedBooking.start_time)} - {formatTime(selectedBooking.end_time)}
                      </p>
                    )}
                  </>
                )}

                {/* Cart Items */}
                {selectedBooking.cart_items && Array.isArray(selectedBooking.cart_items) && selectedBooking.cart_items.length > 0 ? (
                  <div className="mt-3 space-y-2">
                    {(selectedBooking.cart_items as unknown as CartItemData[]).map((item, index) => {
                      const name = item.type === "service" ? item.service?.name : item.product?.name;
                      const price = item.type === "service" ? item.service?.price : item.product?.price;
                      const quantity = item.quantity || 1;
                      const durationMinutes = item.type === "service" ? item.service?.duration_minutes : null;

                      return (
                        <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
                          <div className="flex items-center gap-2">
                            {item.type === "service" ? (
                              <Sparkles className="h-4 w-4 text-purple-500" />
                            ) : (
                              <ShoppingBag className="h-4 w-4 text-blue-500" />
                            )}
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {name || (item.type === "service" ? "Service" : "Product")}
                                {quantity > 1 && <span className="text-gray-500"> x{quantity}</span>}
                              </p>
                              {item.type === "service" && durationMinutes && (
                                <p className="text-xs text-gray-500">{formatDuration(durationMinutes)}</p>
                              )}
                            </div>
                          </div>
                          <span className="text-sm font-medium text-gray-700">
                            {formatCurrency((price || 0) * quantity)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <>
                    {/* Fallback for old bookings without cart_items */}
                    <p className="text-gray-700 mt-1">{selectedBooking.services?.name}</p>
                  </>
                )}

                {selectedBooking.staff && (
                  <p className="text-sm text-gray-500 mt-2">with {selectedBooking.staff.name}</p>
                )}
                <p className="text-lg font-semibold text-purple-600 mt-3 pt-3 border-t border-gray-200">
                  {formatCurrency(selectedBooking.total_price)}
                </p>
              </div>

              {/* Customer Info */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">{t("customer")}</h3>
                <p className="font-medium text-gray-900">{selectedBooking.customer_name}</p>
                <div className="mt-2 space-y-1 text-sm text-gray-600">
                  <a
                    href={`mailto:${selectedBooking.customer_email}`}
                    className="flex items-center gap-2 hover:text-purple-600"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Mail className="h-4 w-4" />
                    {selectedBooking.customer_email}
                  </a>
                  {selectedBooking.customer_phone && (
                    <a
                      href={`tel:${selectedBooking.customer_phone}`}
                      className="flex items-center gap-2 hover:text-purple-600"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Phone className="h-4 w-4" />
                      {selectedBooking.customer_phone}
                    </a>
                  )}
                </div>
              </div>

              {/* Notes */}
              {selectedBooking.notes && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">{t("notes")}</h3>
                  <p className="text-sm text-gray-700">{selectedBooking.notes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-gray-100">
                {selectedBooking.status === "pending" && (
                  <>
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
                    <button
                      onClick={() => {
                        setSelectedBooking(null);
                        setShowActionDropdown(false);
                      }}
                      className="flex-1 rounded-xl border border-gray-200 py-2.5 font-medium text-gray-700 hover:bg-gray-50"
                    >
                      {t("cancelEdit")}
                    </button>
                  </>
                )}
                {selectedBooking.status === "confirmed" && (
                  <>
                    <div className="relative flex-1">
                      <button
                        onClick={() => setShowActionDropdown(!showActionDropdown)}
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 font-medium text-white hover:bg-blue-700"
                      >
                        <Clock className="h-4 w-4" />
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
                    <button
                      onClick={() => {
                        setSelectedBooking(null);
                        setShowActionDropdown(false);
                      }}
                      className="flex-1 rounded-xl border border-gray-200 py-2.5 font-medium text-gray-700 hover:bg-gray-50"
                    >
                      {t("cancelEdit")}
                    </button>
                  </>
                )}
                {(selectedBooking.status === "completed" || selectedBooking.status === "cancelled") && (
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="flex-1 rounded-xl border border-gray-200 py-2.5 font-medium text-gray-700 hover:bg-gray-50"
                  >
                    {t("cancelEdit")}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
