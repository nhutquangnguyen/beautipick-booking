"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format, parseISO, isToday, isTomorrow, isPast } from "date-fns";
import { Check, X, Clock, Mail, Phone } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Booking } from "@/types/database";
import { formatCurrency, formatTime } from "@/lib/utils";

type BookingWithRelations = Booking & {
  services: { name: string } | null;
  staff: { name: string } | null;
};

export function BookingsList({ bookings }: { bookings: BookingWithRelations[] }) {
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("upcoming");
  const router = useRouter();
  const supabase = createClient();

  const filteredBookings = bookings.filter((booking) => {
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
  };

  const formatBookingDate = (dateStr: string) => {
    const date = parseISO(dateStr);
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    return format(date, "EEE, MMM d");
  };

  if (bookings.length === 0) {
    return (
      <div className="card p-8 text-center">
        <p className="text-gray-600">
          No bookings yet. Share your booking page to start receiving appointments!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-2">
        {(["upcoming", "past", "all"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              filter === f
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Bookings */}
      <div className="card divide-y">
        {filteredBookings.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No {filter} bookings
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div key={booking.id} className="p-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        {formatBookingDate(booking.booking_date)}
                      </span>
                      <span className="mx-2 text-gray-300">•</span>
                      <span className="text-sm text-gray-500">
                        {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                      </span>
                    </div>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        booking.status === "confirmed"
                          ? "bg-green-100 text-green-700"
                          : booking.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : booking.status === "cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <h3 className="mt-2 font-medium text-gray-900">
                    {booking.customer_name}
                  </h3>

                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600">
                    <span>{booking.services?.name}</span>
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

                  {booking.notes && (
                    <p className="mt-2 text-sm text-gray-600">
                      Note: {booking.notes}
                    </p>
                  )}
                </div>

                {/* Actions */}
                {booking.status === "pending" && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateStatus(booking.id, "confirmed")}
                      className="flex items-center gap-1 rounded-md bg-green-100 px-3 py-1.5 text-sm font-medium text-green-700 hover:bg-green-200"
                    >
                      <Check className="h-4 w-4" />
                      Confirm
                    </button>
                    <button
                      onClick={() => updateStatus(booking.id, "cancelled")}
                      className="flex items-center gap-1 rounded-md bg-red-100 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-200"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </button>
                  </div>
                )}

                {booking.status === "confirmed" && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateStatus(booking.id, "completed")}
                      className="flex items-center gap-1 rounded-md bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-200"
                    >
                      <Clock className="h-4 w-4" />
                      Complete
                    </button>
                    <button
                      onClick={() => updateStatus(booking.id, "cancelled")}
                      className="flex items-center gap-1 rounded-md bg-red-100 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-200"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
