"use client";

import { useState, useMemo } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  parseISO,
  isToday,
} from "date-fns";
import { ChevronLeft, ChevronRight, X, Check, Clock, Mail, Phone, Sparkles, ShoppingBag, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { Booking, Json } from "@/types/database";
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

interface BookingsCalendarProps {
  bookings: BookingWithRelations[];
  currency?: string;
}

export function BookingsCalendar({ bookings, currency = "VND" }: BookingsCalendarProps) {
  const t = useTranslations("bookings");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<BookingWithRelations | null>(null);
  const [showActionDropdown, setShowActionDropdown] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Group bookings by date
  const bookingsByDate = useMemo(() => {
    const grouped: Record<string, BookingWithRelations[]> = {};
    bookings.forEach((booking) => {
      const dateKey = booking.booking_date;
      if (!dateKey) return; // Skip bookings without a date
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(booking);
    });
    // Sort bookings within each day by start_time
    Object.keys(grouped).forEach((date) => {
      grouped[date].sort((a, b) => (a.start_time || "").localeCompare(b.start_time || ""));
    });
    return grouped;
  }, [bookings]);

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days: Date[] = [];
    let day = startDate;
    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  }, [currentMonth]);

  // Get bookings for selected date
  const selectedDateBookings = useMemo(() => {
    if (!selectedDate) return [];
    const dateKey = format(selectedDate, "yyyy-MM-dd");
    return bookingsByDate[dateKey] || [];
  }, [selectedDate, bookingsByDate]);

  const updateStatus = async (id: string, status: Booking["status"]) => {
    await supabase.from("bookings").update({ status }).eq("id", id);
    router.refresh();
    setSelectedBooking(null);
    setShowActionDropdown(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500";
      case "pending":
        return "bg-amber-500";
      case "completed":
        return "bg-blue-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
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

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentMonth(new Date())}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-purple-600 hover:bg-purple-50"
          >
            {t("today")}
          </button>
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="rounded-lg p-1.5 text-gray-600 hover:bg-gray-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="rounded-lg p-1.5 text-gray-600 hover:bg-gray-100"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="py-2 text-center text-xs font-medium text-gray-500"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, index) => {
            const dateKey = format(day, "yyyy-MM-dd");
            const dayBookings = bookingsByDate[dateKey] || [];
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const hasBookings = dayBookings.length > 0;
            const confirmedCount = dayBookings.filter(b => b.status === "confirmed").length;
            const pendingCount = dayBookings.filter(b => b.status === "pending").length;

            return (
              <button
                key={index}
                onClick={() => setSelectedDate(day)}
                className={`
                  h-16 p-1 border-b border-r border-gray-100 text-center transition-colors relative
                  ${!isCurrentMonth ? "bg-gray-50/50" : "bg-white hover:bg-gray-50"}
                  ${isSelected ? "bg-purple-50 ring-2 ring-inset ring-purple-500" : ""}
                  ${index % 7 === 6 ? "border-r-0" : ""}
                `}
              >
                <span
                  className={`
                    inline-flex h-6 w-6 items-center justify-center rounded-full text-sm
                    ${isToday(day) ? "bg-purple-600 text-white font-semibold" : ""}
                    ${!isCurrentMonth ? "text-gray-400" : "text-gray-900"}
                  `}
                >
                  {format(day, "d")}
                </span>

                {/* Booking Dots */}
                {hasBookings && (
                  <div className="flex items-center justify-center gap-0.5 mt-1">
                    {confirmedCount > 0 && (
                      <div className="flex items-center gap-0.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                        {confirmedCount > 1 && <span className="text-[10px] text-green-600">{confirmedCount}</span>}
                      </div>
                    )}
                    {pendingCount > 0 && (
                      <div className="flex items-center gap-0.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                        {pendingCount > 1 && <span className="text-[10px] text-amber-600">{pendingCount}</span>}
                      </div>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Date Panel */}
      {selectedDate && (
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">
              {format(selectedDate, "EEEE, MMMM d, yyyy")}
            </h3>
            <button
              onClick={() => setSelectedDate(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {selectedDateBookings.length === 0 ? (
            <p className="text-gray-500 text-sm py-4 text-center">
              {t("noBookingsOnDay")}
            </p>
          ) : (
            <div className="space-y-3">
              {selectedDateBookings.map((booking) => (
                <div
                  key={booking.id}
                  onClick={() => setSelectedBooking(booking)}
                  className={`
                    p-3 rounded-lg border cursor-pointer transition-all
                    ${booking.status === "cancelled" ? "opacity-60 border-gray-200" : "border-gray-200 hover:border-purple-300 hover:shadow-sm"}
                  `}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`w-1 h-12 rounded-full ${getStatusColor(booking.status)}`} />
                      <div>
                        <div className="flex items-center gap-2">
                          {booking.start_time && booking.end_time && (
                            <span className="font-medium text-gray-900">
                              {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                            </span>
                          )}
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusBadgeStyle(booking.status)}`}>
                            {t(`status.${booking.status}`)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-900 mt-0.5">{booking.customer_name}</p>
                        {booking.cart_items && Array.isArray(booking.cart_items) && booking.cart_items.length > 0 ? (
                          <div className="text-sm text-gray-500">
                            {(booking.cart_items as unknown as CartItemData[]).map((item, idx) => (
                              <div key={idx}>
                                {item.type === "service" ? item.service?.name || "Service" : item.product?.name || "Product"}
                                {item.type === "product" && ` (x${item.quantity || 1})`}
                              </div>
                            ))}
                            {booking.staff && <span className="block mt-0.5">with {booking.staff.name}</span>}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">
                            {booking.services?.name}
                            {booking.staff && ` with ${booking.staff.name}`}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(booking.total_price, currency)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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
                            {formatCurrency((price || 0) * quantity, currency)}
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
                  {formatCurrency(selectedBooking.total_price, currency)}
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
                  >
                    <Mail className="h-4 w-4" />
                    {selectedBooking.customer_email}
                  </a>
                  {selectedBooking.customer_phone && (
                    <a
                      href={`tel:${selectedBooking.customer_phone}`}
                      className="flex items-center gap-2 hover:text-purple-600"
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
