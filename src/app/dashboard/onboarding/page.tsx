"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { Check, ChevronRight, Clock, Scissors, Store, Palette } from "lucide-react";
import { themePresets, ThemePreset } from "@/types/database";
import { ThemeGallery } from "@/components/dashboard/design/theme-gallery";
import { ThemePreviewModal } from "@/components/dashboard/design/theme-preview-modal";

type Step = "theme" | "business" | "services" | "hours" | "complete";

const COMMON_SERVICES = [
  { name: "Haircut", translationKey: "haircut", duration: 45, price: 35, category: "Hair", categoryKey: "hair" },
  { name: "Hair Coloring", translationKey: "hairColoring", duration: 120, price: 85, category: "Hair", categoryKey: "hair" },
  { name: "Blowout", translationKey: "blowout", duration: 45, price: 45, category: "Hair", categoryKey: "hair" },
  { name: "Manicure", translationKey: "manicure", duration: 30, price: 25, category: "Nails", categoryKey: "nails" },
  { name: "Pedicure", translationKey: "pedicure", duration: 45, price: 35, category: "Nails", categoryKey: "nails" },
  { name: "Gel Nails", translationKey: "gelNails", duration: 60, price: 45, category: "Nails", categoryKey: "nails" },
  { name: "Facial", translationKey: "facial", duration: 60, price: 65, category: "Skincare", categoryKey: "skincare" },
  { name: "Eyebrow Wax", translationKey: "eyebrowWax", duration: 15, price: 15, category: "Waxing", categoryKey: "waxing" },
  { name: "Makeup Application", translationKey: "makeupApplication", duration: 45, price: 55, category: "Makeup", categoryKey: "makeup" },
  { name: "Lash Extensions", translationKey: "lashExtensions", duration: 90, price: 120, category: "Lashes", categoryKey: "lashes" },
];

const DEFAULT_HOURS = [
  { day: 1, name: "Monday", open: "09:00", close: "18:00", enabled: true },
  { day: 2, name: "Tuesday", open: "09:00", close: "18:00", enabled: true },
  { day: 3, name: "Wednesday", open: "09:00", close: "18:00", enabled: true },
  { day: 4, name: "Thursday", open: "09:00", close: "18:00", enabled: true },
  { day: 5, name: "Friday", open: "09:00", close: "18:00", enabled: true },
  { day: 6, name: "Saturday", open: "10:00", close: "16:00", enabled: true },
  { day: 0, name: "Sunday", open: "10:00", close: "16:00", enabled: false },
];

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>("theme");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("onboarding");
  const supabase = createClient();

  // Set currency based on locale
  const currency = locale === "vi" ? "VND" : "USD";
  const priceMultiplier = currency === "VND" ? 25000 : 1;

  // Convert services prices based on currency
  const localizedServices = COMMON_SERVICES.map(service => ({
    ...service,
    price: Math.round(service.price * priceMultiplier)
  }));

  // Theme selection
  const [selectedThemeId, setSelectedThemeId] = useState<string>("modern");
  const [previewTheme, setPreviewTheme] = useState<ThemePreset | null>(null);

  // Business info
  const [businessInfo, setBusinessInfo] = useState({
    phone: "",
    address: "",
  });

  // Services
  const [selectedServices, setSelectedServices] = useState<typeof COMMON_SERVICES>([]);

  // Hours
  const [hours, setHours] = useState(DEFAULT_HOURS);

  const toggleService = (service: (typeof COMMON_SERVICES)[0]) => {
    setSelectedServices((prev) =>
      prev.find((s) => s.name === service.name)
        ? prev.filter((s) => s.name !== service.name)
        : [...prev, service]
    );
  };

  const handleThemeSubmit = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const selectedPreset = themePresets.find(p => p.id === selectedThemeId);
      if (selectedPreset) {
        await supabase.from("merchants").update({
          theme: {
            themeId: selectedThemeId,
            ...selectedPreset.theme
          }
        }).eq("id", user.id);
      }
    }

    setLoading(false);
    setStep("business");
  };

  const handleBusinessSubmit = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      await supabase.from("merchants").update({
        phone: businessInfo.phone || null,
        address: businessInfo.address || null,
        currency: currency,
      }).eq("id", user.id);
    }

    setLoading(false);
    setStep("services");
  };

  const handleServicesSubmit = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (user && selectedServices.length > 0) {
      const servicesToInsert = selectedServices.map((service, index) => ({
        merchant_id: user.id,
        name: service.name,
        duration_minutes: service.duration,
        price: service.price,
        category: service.category,
        display_order: index,
      }));

      await supabase.from("services").insert(servicesToInsert);
    }

    setLoading(false);
    setStep("hours");
  };

  const handleHoursSubmit = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const availabilityToInsert = hours.map((h) => ({
        merchant_id: user.id,
        day_of_week: h.day,
        start_time: h.open,
        end_time: h.close,
        is_available: h.enabled,
      }));

      await supabase.from("availability").insert(availabilityToInsert);
    }

    setLoading(false);
    setStep("complete");
  };

  const handleComplete = () => {
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className={`mx-auto px-4 py-6 sm:py-12 ${step === "theme" ? "max-w-6xl" : "max-w-2xl"}`}>
        {/* Progress */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-1.5 sm:gap-2">
            {[
              { key: "theme", icon: Palette, label: "Theme" },
              { key: "business", icon: Store, label: "Info" },
              { key: "services", icon: Scissors, label: "Services" },
              { key: "hours", icon: Clock, label: "Hours" },
            ].map((s, i, arr) => (
              <div key={s.key} className="flex items-center">
                <div
                  className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full ${
                    step === s.key
                      ? "bg-purple-600 text-white"
                      : arr.findIndex((x) => x.key === step) > i
                        ? "bg-green-500 text-white"
                        : "bg-white text-gray-400"
                  }`}
                >
                  {arr.findIndex((x) => x.key === step) > i ? (
                    <Check className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <s.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </div>
                {i < arr.length - 1 && (
                  <div
                    className={`h-1 w-6 sm:w-8 ${
                      arr.findIndex((x) => x.key === step) > i
                        ? "bg-green-500"
                        : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step: Theme Selection */}
        {step === "theme" && (
          <div className="rounded-2xl bg-white p-4 sm:p-8 shadow-sm">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Choose Your Theme
            </h1>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              Pick a beautiful theme for your booking page. You can customize colors and fonts later.
            </p>

            <div className="mt-8">
              <ThemeGallery
                themes={themePresets}
                selectedThemeId={selectedThemeId}
                onSelectTheme={setSelectedThemeId}
                onPreviewTheme={setPreviewTheme}
                compact={false}
              />
            </div>

            <button
              onClick={handleThemeSubmit}
              disabled={loading}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 py-4 font-semibold text-white hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? t("saving") : t("continue")}
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Theme Preview Modal */}
        <ThemePreviewModal
          theme={previewTheme}
          isOpen={!!previewTheme}
          onClose={() => setPreviewTheme(null)}
          onApply={(themeId) => {
            setSelectedThemeId(themeId);
            setPreviewTheme(null);
          }}
          currentThemeId={selectedThemeId}
        />

        {/* Step: Business Info */}
        {step === "business" && (
          <div className="rounded-2xl bg-white p-4 sm:p-8 shadow-sm">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              {t("setupTitle")}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              {t("setupSubtitle")}
            </p>

            <div className="mt-8 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t("phoneLabel")}
                </label>
                <input
                  type="tel"
                  value={businessInfo.phone}
                  onChange={(e) =>
                    setBusinessInfo({ ...businessInfo, phone: e.target.value })
                  }
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                  placeholder={t("phonePlaceholder")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t("addressLabel")}
                </label>
                <input
                  type="text"
                  value={businessInfo.address}
                  onChange={(e) =>
                    setBusinessInfo({ ...businessInfo, address: e.target.value })
                  }
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                  placeholder={t("addressPlaceholder")}
                />
              </div>
            </div>

            <button
              onClick={handleBusinessSubmit}
              disabled={loading}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 py-4 font-semibold text-white hover:bg-purple-700"
            >
              {loading ? t("saving") : t("continue")}
              <ChevronRight className="h-5 w-5" />
            </button>

            <button
              onClick={() => setStep("services")}
              className="mt-3 w-full py-2 text-sm text-gray-500 hover:text-gray-700"
            >
              {t("skipForNow")}
            </button>
          </div>
        )}

        {/* Step: Services */}
        {step === "services" && (
          <div className="rounded-2xl bg-white p-4 sm:p-8 shadow-sm">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              {t("servicesTitle")}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              {t("servicesSubtitle")}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {localizedServices.map((service) => {
                const isSelected = selectedServices.find(
                  (s) => s.name === service.name
                );
                return (
                  <button
                    key={service.name}
                    onClick={() => toggleService(service)}
                    className={`rounded-xl border-2 p-4 text-left transition-all ${
                      isSelected
                        ? "border-purple-600 bg-purple-50"
                        : "border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="font-medium text-gray-900">
                        {t(`services.${service.translationKey}`)}
                      </span>
                      {isSelected && (
                        <Check className="h-5 w-5 text-purple-600" />
                      )}
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      {service.duration} min · {currency === "VND" ? `${service.price.toLocaleString()} đ` : `$${service.price}`}
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleServicesSubmit}
              disabled={loading}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 py-4 font-semibold text-white hover:bg-purple-700"
            >
              {loading ? t("saving") : t("continueWithServices", { count: selectedServices.length })}
              <ChevronRight className="h-5 w-5" />
            </button>

            <button
              onClick={() => setStep("hours")}
              className="mt-3 w-full py-2 text-sm text-gray-500 hover:text-gray-700"
            >
              {t("skipForNow")}
            </button>
          </div>
        )}

        {/* Step: Hours */}
        {step === "hours" && (
          <div className="rounded-2xl bg-white p-4 sm:p-8 shadow-sm">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              {t("hoursTitle")}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              {t("hoursSubtitle")}
            </p>

            <div className="mt-6 space-y-2">
              {hours.map((day, index) => {
                const dayKeys = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
                const dayKey = dayKeys[day.day] as "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";
                return (
                  <div
                    key={day.day}
                    className={`flex items-center gap-2 rounded-lg sm:rounded-xl border p-2.5 sm:p-4 ${
                      day.enabled ? "border-gray-200" : "border-gray-100 bg-gray-50"
                    }`}
                  >
                    <label className="flex w-12 sm:w-20 items-center gap-1 sm:gap-2 flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={day.enabled}
                        onChange={(e) => {
                          const newHours = [...hours];
                          newHours[index].enabled = e.target.checked;
                          setHours(newHours);
                        }}
                        className="h-3.5 w-3.5 sm:h-4 sm:w-4 rounded text-purple-600"
                      />
                      <span
                        className={`font-medium text-xs sm:text-base ${
                          day.enabled ? "text-gray-900" : "text-gray-400"
                        }`}
                      >
                        {t(dayKey)}
                      </span>
                    </label>

                    {day.enabled ? (
                      <div className="flex items-center gap-1 sm:gap-2 flex-1 min-w-0">
                        <input
                          type="time"
                          value={day.open}
                          onChange={(e) => {
                            const newHours = [...hours];
                            newHours[index].open = e.target.value;
                            setHours(newHours);
                          }}
                          className="rounded-md sm:rounded-lg border border-gray-200 px-1.5 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm w-full"
                        />
                        <span className="text-gray-400 text-[10px] sm:text-sm flex-shrink-0">{t("to")}</span>
                        <input
                          type="time"
                          value={day.close}
                          onChange={(e) => {
                            const newHours = [...hours];
                            newHours[index].close = e.target.value;
                            setHours(newHours);
                          }}
                          className="rounded-md sm:rounded-lg border border-gray-200 px-1.5 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm w-full"
                        />
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs sm:text-base">{t("closed")}</span>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleHoursSubmit}
              disabled={loading}
              className="mt-6 sm:mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 py-3 sm:py-4 font-semibold text-white hover:bg-purple-700"
            >
              {loading ? t("saving") : t("finishSetup")}
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Step: Complete */}
        {step === "complete" && (
          <div className="rounded-2xl bg-white p-4 sm:p-8 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="mt-6 text-xl sm:text-2xl font-bold text-gray-900">
              {t("completeTitle")}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              {t("completeSubtitle")}
            </p>

            <button
              onClick={handleComplete}
              className="mt-6 sm:mt-8 w-full rounded-xl bg-purple-600 py-3 sm:py-4 font-semibold text-white hover:bg-purple-700"
            >
              {t("goToDashboard")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
