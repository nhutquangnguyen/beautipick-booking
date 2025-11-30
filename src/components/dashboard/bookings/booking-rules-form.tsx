"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { MerchantSettings } from "@/types/database";

export function BookingRulesForm({
  merchantId,
  settings,
}: {
  merchantId: string;
  settings: MerchantSettings;
}) {
  const t = useTranslations("bookingRules");
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [bookingSettings, setBookingSettings] = useState<MerchantSettings>(settings);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      await supabase
        .from("merchants")
        .update({ settings: bookingSettings })
        .eq("id", merchantId);

      setSuccess(true);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-4 sm:p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Timing Settings */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">{t("timing")}</h3>
          <div className="grid gap-4 grid-cols-2">
            <div>
              <label className="label">{t("leadTime")}</label>
              <input
                type="number"
                value={bookingSettings.bookingLeadTime}
                onChange={(e) =>
                  setBookingSettings({
                    ...bookingSettings,
                    bookingLeadTime: parseInt(e.target.value),
                  })
                }
                className="input mt-1"
                min={0}
              />
              <p className="mt-1 text-xs text-gray-500">
                {t("leadTimeDesc")}
              </p>
            </div>
            <div>
              <label className="label">{t("bookingWindow")}</label>
              <input
                type="number"
                value={bookingSettings.bookingWindow}
                onChange={(e) =>
                  setBookingSettings({
                    ...bookingSettings,
                    bookingWindow: parseInt(e.target.value),
                  })
                }
                className="input mt-1"
                min={1}
              />
              <p className="mt-1 text-xs text-gray-500">
                {t("bookingWindowDesc")}
              </p>
            </div>
          </div>
        </div>

        {/* Cancellation Policy */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">{t("cancellationPolicy")}</h3>
          <textarea
            value={bookingSettings.cancellationPolicy}
            onChange={(e) =>
              setBookingSettings({ ...bookingSettings, cancellationPolicy: e.target.value })
            }
            className="input"
            rows={3}
            placeholder={t("cancellationPolicyPlaceholder")}
          />
        </div>

        {/* Customer Options */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">{t("customerOptions")}</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={bookingSettings.showStaffSelection}
                onChange={(e) =>
                  setBookingSettings({ ...bookingSettings, showStaffSelection: e.target.checked })
                }
                className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700">{t("allowStaffSelection")}</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={bookingSettings.requirePhoneNumber}
                onChange={(e) =>
                  setBookingSettings({ ...bookingSettings, requirePhoneNumber: e.target.checked })
                }
                className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700">{t("requirePhoneNumber")}</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={bookingSettings.allowNotes}
                onChange={(e) =>
                  setBookingSettings({ ...bookingSettings, allowNotes: e.target.checked })
                }
                className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700">{t("allowBookingNotes")}</span>
            </label>
          </div>
        </div>

        {/* Email Notifications */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">{t("emailNotifications")}</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={bookingSettings.confirmationEmailEnabled}
                onChange={(e) =>
                  setBookingSettings({
                    ...bookingSettings,
                    confirmationEmailEnabled: e.target.checked,
                  })
                }
                className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700">{t("sendConfirmationEmails")}</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={bookingSettings.reminderEmailEnabled}
                onChange={(e) =>
                  setBookingSettings({
                    ...bookingSettings,
                    reminderEmailEnabled: e.target.checked,
                  })
                }
                className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700">{t("sendReminderEmails")}</span>
            </label>

            {bookingSettings.reminderEmailEnabled && (
              <div className="ml-6">
                <label className="label">{t("remindBefore")}</label>
                <input
                  type="number"
                  value={bookingSettings.reminderHoursBefore}
                  onChange={(e) =>
                    setBookingSettings({
                      ...bookingSettings,
                      reminderHoursBefore: parseInt(e.target.value),
                    })
                  }
                  className="input mt-1 w-32"
                  min={1}
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={loading} className="btn btn-primary btn-md">
            {loading ? t("saving") : t("saveRules")}
          </button>
          {success && (
            <span className="text-sm text-green-600">{t("saved")}</span>
          )}
        </div>
      </form>
    </div>
  );
}
