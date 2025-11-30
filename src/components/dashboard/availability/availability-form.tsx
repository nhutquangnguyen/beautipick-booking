"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { Availability } from "@/types/database";

type AvailabilityFormData = {
  [key: number]: {
    is_available: boolean;
    start_time: string;
    end_time: string;
  };
};

const DEFAULT_HOURS = {
  is_available: true,
  start_time: "09:00",
  end_time: "17:00",
};

const DAY_KEYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

export function AvailabilityForm({
  merchantId,
  availability,
  staff,
}: {
  merchantId: string;
  availability: Availability[];
  staff: { id: string; name: string }[];
}) {
  const t = useTranslations("hoursForm");
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Initialize form data from existing availability
  const initialData: AvailabilityFormData = {};
  for (let i = 0; i < 7; i++) {
    const existing = availability.find((a) => a.day_of_week === i);
    initialData[i] = existing
      ? {
          is_available: existing.is_available,
          start_time: existing.start_time,
          end_time: existing.end_time,
        }
      : { ...DEFAULT_HOURS, is_available: i !== 0 && i !== 6 }; // Closed on weekends by default
  }

  const [formData, setFormData] = useState<AvailabilityFormData>(initialData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      // Delete existing business hours
      await supabase
        .from("availability")
        .delete()
        .eq("merchant_id", merchantId)
        .is("staff_id", null);

      // Insert new availability
      const records = Object.entries(formData).map(([day, data]) => ({
        merchant_id: merchantId,
        staff_id: null,
        day_of_week: parseInt(day),
        start_time: data.start_time,
        end_time: data.end_time,
        is_available: data.is_available,
      }));

      await supabase.from("availability").insert(records);

      setSuccess(true);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const updateDay = (
    day: number,
    field: keyof AvailabilityFormData[number],
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900">{t("businessHours")}</h2>
        <p className="mt-1 text-sm text-gray-600">
          {t("businessHoursDesc")}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {DAY_KEYS.map((dayKey, index) => (
            <div
              key={dayKey}
              className="flex flex-wrap items-center gap-4 rounded-lg border border-gray-200 p-4"
            >
              <div className="w-28">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData[index].is_available}
                    onChange={(e) => updateDay(index, "is_available", e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="font-medium text-gray-900">{t(dayKey)}</span>
                </label>
              </div>

              {formData[index].is_available ? (
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={formData[index].start_time}
                    onChange={(e) => updateDay(index, "start_time", e.target.value)}
                    className="input w-auto"
                  />
                  <span className="text-gray-500">{t("to")}</span>
                  <input
                    type="time"
                    value={formData[index].end_time}
                    onChange={(e) => updateDay(index, "end_time", e.target.value)}
                    className="input w-auto"
                  />
                </div>
              ) : (
                <span className="text-gray-500">{t("closed")}</span>
              )}
            </div>
          ))}

          <div className="flex items-center gap-4 pt-4">
            <button type="submit" disabled={loading} className="btn btn-primary btn-md">
              {loading ? t("saving") : t("saveHours")}
            </button>
            {success && (
              <span className="text-sm text-green-600">{t("hoursSaved")}</span>
            )}
          </div>
        </form>
      </div>

      {staff.length > 0 && (
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900">{t("staffSchedules")}</h2>
          <p className="mt-1 text-sm text-gray-600">
            {t("staffSchedulesDesc")}
          </p>
          <div className="mt-4 space-y-2">
            {staff.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 p-3"
              >
                <span className="font-medium text-gray-900">{member.name}</span>
                <span className="text-sm text-gray-500">{t("usesBusinessHours")}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
