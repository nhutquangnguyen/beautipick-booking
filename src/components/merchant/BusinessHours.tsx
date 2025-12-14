"use client";

import { useState } from "react";
import { Clock, ChevronDown } from "lucide-react";

interface BusinessHoursProps {
  availability: Array<{
    day_of_week: number;
    start_time: string;
    end_time: string;
    is_available: boolean;
  }>;
}

const DAY_NAMES = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];

export function BusinessHours({ availability }: BusinessHoursProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Group availability by day
  const hoursByDay = new Map<number, { start_time: string; end_time: string; is_available: boolean }>();

  availability.forEach((avail) => {
    hoursByDay.set(avail.day_of_week, {
      start_time: avail.start_time,
      end_time: avail.end_time,
      is_available: avail.is_available,
    });
  });

  // Get current day
  const currentDay = new Date().getDay();

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between gap-2 mb-4 hover:opacity-70 transition"
      >
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-purple-600" />
          <h3 className="font-bold text-gray-900">Giờ làm việc</h3>
        </div>
        <ChevronDown
          className={`h-5 w-5 text-gray-600 transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>
      {isExpanded && (
        <div className="space-y-2">
          {[0, 1, 2, 3, 4, 5, 6].map((day) => {
            const hours = hoursByDay.get(day);
            const isToday = day === currentDay;
            const isOpen = hours?.is_available ?? false;

            return (
              <div
                key={day}
                className={`flex items-center justify-between py-2 ${
                  isToday ? "bg-purple-50 -mx-2 px-2 rounded-lg" : ""
                }`}
              >
                <span className={`font-medium ${isToday ? "text-purple-600" : "text-gray-700"}`}>
                  {DAY_NAMES[day]}
                  {isToday && <span className="ml-2 text-xs">(Hôm nay)</span>}
                </span>
                {isOpen && hours ? (
                  <span className="text-gray-600 text-sm">
                    {hours.start_time.slice(0, 5)} - {hours.end_time.slice(0, 5)}
                  </span>
                ) : (
                  <span className="text-gray-400 text-sm">Đóng cửa</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
