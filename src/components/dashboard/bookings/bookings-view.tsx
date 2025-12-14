"use client";

import { useState } from "react";
import { Calendar, List, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { BookingsList } from "./bookings-list";
import { BookingsCalendar } from "./bookings-calendar";
import { Booking } from "@/types/database";

type BookingWithRelations = Booking & {
  services: { name: string } | null;
  staff: { name: string } | null;
  customers?: { name: string; phone: string } | null;
};

interface BookingsViewProps {
  bookings: BookingWithRelations[];
  customerFilter?: string;
  initialStatusFilter?: string;
  currency?: string;
}

export function BookingsView({ bookings, customerFilter, initialStatusFilter, currency = "VND" }: BookingsViewProps) {
  const t = useTranslations("bookings");
  const router = useRouter();
  const [view, setView] = useState<"list" | "calendar">("list");

  // Get customer name from bookings if filter is active
  const customerName = customerFilter && bookings.length > 0
    ? bookings[0]?.customers?.name || bookings[0]?.customer_name
    : null;

  const clearFilter = () => {
    router.push('/dashboard/bookings');
  };

  return (
    <div className="space-y-4">
      {/* Customer Filter Badge */}
      {customerFilter && (
        <div className="flex items-center gap-2 p-3 bg-purple-50 border border-purple-200 rounded-lg">
          <span className="text-sm text-purple-800">
            <strong>{t("filteringBy")}:</strong> {customerName || customerFilter}
          </span>
          <button
            onClick={clearFilter}
            className="ml-auto flex items-center gap-1 px-2 py-1 text-xs font-medium text-purple-600 hover:bg-purple-100 rounded transition-colors"
          >
            <X className="h-3 w-3" />
            {t("clearFilter")}
          </button>
        </div>
      )}

      {/* View Toggle */}
      <div className="flex items-center justify-end">
        <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
          <button
            onClick={() => setView("list")}
            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              view === "list"
                ? "bg-purple-100 text-purple-700"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <List className="h-4 w-4" />
            {t("list")}
          </button>
          <button
            onClick={() => setView("calendar")}
            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              view === "calendar"
                ? "bg-purple-100 text-purple-700"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Calendar className="h-4 w-4" />
            {t("calendar")}
          </button>
        </div>
      </div>

      {/* View Content */}
      {view === "calendar" ? (
        <BookingsCalendar bookings={bookings} currency={currency} />
      ) : (
        <BookingsList bookings={bookings} initialStatusFilter={initialStatusFilter} currency={currency} />
      )}
    </div>
  );
}
