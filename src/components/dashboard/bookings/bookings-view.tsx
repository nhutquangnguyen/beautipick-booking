"use client";

import { useState } from "react";
import { Calendar, List } from "lucide-react";
import { BookingsList } from "./bookings-list";
import { BookingsCalendar } from "./bookings-calendar";
import { Booking } from "@/types/database";

type BookingWithRelations = Booking & {
  services: { name: string } | null;
  staff: { name: string } | null;
};

interface BookingsViewProps {
  bookings: BookingWithRelations[];
}

export function BookingsView({ bookings }: BookingsViewProps) {
  const [view, setView] = useState<"list" | "calendar">("calendar");

  return (
    <div className="space-y-4">
      {/* View Toggle */}
      <div className="flex items-center justify-end">
        <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
          <button
            onClick={() => setView("calendar")}
            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              view === "calendar"
                ? "bg-purple-100 text-purple-700"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Calendar className="h-4 w-4" />
            Calendar
          </button>
          <button
            onClick={() => setView("list")}
            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              view === "list"
                ? "bg-purple-100 text-purple-700"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <List className="h-4 w-4" />
            List
          </button>
        </div>
      </div>

      {/* View Content */}
      {view === "calendar" ? (
        <BookingsCalendar bookings={bookings} />
      ) : (
        <BookingsList bookings={bookings} />
      )}
    </div>
  );
}
