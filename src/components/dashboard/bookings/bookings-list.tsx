"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format, parseISO, isToday, isTomorrow, isPast } from "date-fns";
import { Check, X, Clock, Mail, Phone, Sparkles, ShoppingBag, ChevronDown, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { Booking } from "@/types/database";
import { formatCurrency, formatTime, formatDuration } from "@/lib/utils";

// Cart item type for display
interface CartItemData {
  type: "service" | "product";
  id: string;
  name: string;
  price: number;
  quantity: number;
  duration_minutes?: number;
}

type BookingWithRelations = Booking & {
  services: { name: string } | null;
  staff: { name: string } | null;
};

export function BookingsList({ bookings }: { bookings: BookingWithRelations[] }) {
  const t = useTranslations("bookings");
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<BookingWithRelations | null>(null);
  const [showActionDropdown, setShowActionDropdown] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const filteredBookings = bookings.filter((booking) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesName = booking.customer_name.toLowerCase().includes(query);
      const matchesEmail = booking.customer_email.toLowerCase().includes(query);
      const matchesPhone = booking.customer_phone?.toLowerCase().includes(query);
      const matchesService = booking.services?.name.toLowerCase().includes(query);
      if (!matchesName && !matchesEmail && !matchesPhone && !matchesService) {
        return false;
      }
    }

    // Date filter
    if (!booking.booking_date) return filter === "all";
    const bookingDate = parseISO(booking.booking_date);
    if (filter === "upcoming") {
      return !isPast(bookingDate) || isToday(bookingDate);
    }
    if (filter === "past") {
      return isPast(bookingDate) && !isToday(bookingDate);
    }
    return true;
  });

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

  const formatBookingDate = (dateStr: string) => {
    const date = parseISO(dateStr);
    if (isToday(date)) return t("today");
    if (isTomorrow(date)) return "Tomorrow";
    return format(date, "EEE, MMM d");
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

        {/* Filters */}
        <div className="flex gap-2">
          {(["all", "upcoming", "past"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                filter === f
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t(f)}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings */}
      <div className="space-y-3">
        {filteredBookings.length === 0 ? (
          <div className="card p-8 text-center text-gray-500">
            {t("noBookings")}
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div
              key={booking.id}
              onClick={() => setSelectedBooking(booking)}
              className="card p-4 cursor-pointer hover:border-purple-300 hover:shadow-sm transition-all"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div>
                      {booking.booking_date ? (
                        <>
                          <span className="text-sm font-medium text-gray-500">
                            {formatBookingDate(booking.booking_date)}
                          </span>
                          {booking.start_time && booking.end_time && (
                            <>
                              <span className="mx-2 text-gray-300">•</span>
                              <span className="text-sm text-gray-500">
                                {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                              </span>
                            </>
                          )}
                        </>
                      ) : (
                        <span className="text-sm text-gray-500">{t("productOrder")}</span>
                      )}
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusBadgeStyle(booking.status)}`}>
                      {t(`status.${booking.status}`)}
                    </span>
                  </div>

                  <h3 className="mt-2 font-medium text-gray-900">
                    {booking.customer_name}
                  </h3>

                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600">
                    {booking.cart_items && Array.isArray(booking.cart_items) && booking.cart_items.length > 0
                      ? <span>{booking.cart_items.length} {booking.cart_items.length > 1 ? t("items") : t("item")}</span>
                      : <span>{booking.services?.name}</span>
                    }
                    {booking.staff && <span>with {booking.staff.name}</span>}
                    <span className="font-medium text-gray-900">
                      {formatCurrency(booking.total_price)}
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5" />
                      {booking.customer_email}
                    </span>
                    {booking.customer_phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5" />
                        {booking.customer_phone}
                      </span>
                    )}
                  </div>
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
                    {(selectedBooking.cart_items as unknown as CartItemData[]).map((item, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
                        <div className="flex items-center gap-2">
                          {item.type === "service" ? (
                            <Sparkles className="h-4 w-4 text-purple-500" />
                          ) : (
                            <ShoppingBag className="h-4 w-4 text-blue-500" />
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {item.name}
                              {item.quantity > 1 && <span className="text-gray-500"> x{item.quantity}</span>}
                            </p>
                            {item.type === "service" && item.duration_minutes && (
                              <p className="text-xs text-gray-500">{formatDuration(item.duration_minutes)}</p>
                            )}
                          </div>
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
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
