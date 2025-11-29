"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Check, ChevronRight, Clock, Scissors, Store } from "lucide-react";

type Step = "business" | "services" | "hours" | "complete";

const COMMON_SERVICES = [
  { name: "Haircut", duration: 45, price: 35, category: "Hair" },
  { name: "Hair Coloring", duration: 120, price: 85, category: "Hair" },
  { name: "Blowout", duration: 45, price: 45, category: "Hair" },
  { name: "Manicure", duration: 30, price: 25, category: "Nails" },
  { name: "Pedicure", duration: 45, price: 35, category: "Nails" },
  { name: "Gel Nails", duration: 60, price: 45, category: "Nails" },
  { name: "Facial", duration: 60, price: 65, category: "Skincare" },
  { name: "Eyebrow Wax", duration: 15, price: 15, category: "Waxing" },
  { name: "Makeup Application", duration: 45, price: 55, category: "Makeup" },
  { name: "Lash Extensions", duration: 90, price: 120, category: "Lashes" },
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
  const [step, setStep] = useState<Step>("business");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

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

  const handleBusinessSubmit = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      await supabase.from("merchants").update({
        phone: businessInfo.phone || null,
        address: businessInfo.address || null,
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
      <div className="mx-auto max-w-2xl px-4 py-12">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2">
            {[
              { key: "business", icon: Store, label: "Info" },
              { key: "services", icon: Scissors, label: "Services" },
              { key: "hours", icon: Clock, label: "Hours" },
            ].map((s, i, arr) => (
              <div key={s.key} className="flex items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    step === s.key
                      ? "bg-purple-600 text-white"
                      : arr.findIndex((x) => x.key === step) > i
                        ? "bg-green-500 text-white"
                        : "bg-white text-gray-400"
                  }`}
                >
                  {arr.findIndex((x) => x.key === step) > i ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <s.icon className="h-5 w-5" />
                  )}
                </div>
                {i < arr.length - 1 && (
                  <div
                    className={`h-1 w-12 ${
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

        {/* Step: Business Info */}
        {step === "business" && (
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900">
              Let's set up your business
            </h1>
            <p className="mt-2 text-gray-600">
              Add some basic info so customers can find you
            </p>

            <div className="mt-8 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number (optional)
                </label>
                <input
                  type="tel"
                  value={businessInfo.phone}
                  onChange={(e) =>
                    setBusinessInfo({ ...businessInfo, phone: e.target.value })
                  }
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Address (optional)
                </label>
                <input
                  type="text"
                  value={businessInfo.address}
                  onChange={(e) =>
                    setBusinessInfo({ ...businessInfo, address: e.target.value })
                  }
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                  placeholder="123 Main St, City, State"
                />
              </div>
            </div>

            <button
              onClick={handleBusinessSubmit}
              disabled={loading}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 py-4 font-semibold text-white hover:bg-purple-700"
            >
              {loading ? "Saving..." : "Continue"}
              <ChevronRight className="h-5 w-5" />
            </button>

            <button
              onClick={() => setStep("services")}
              className="mt-3 w-full py-2 text-sm text-gray-500 hover:text-gray-700"
            >
              Skip for now
            </button>
          </div>
        )}

        {/* Step: Services */}
        {step === "services" && (
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900">
              What services do you offer?
            </h1>
            <p className="mt-2 text-gray-600">
              Select from common services or add your own later
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {COMMON_SERVICES.map((service) => {
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
                        {service.name}
                      </span>
                      {isSelected && (
                        <Check className="h-5 w-5 text-purple-600" />
                      )}
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      {service.duration} min · ${service.price}
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
              {loading ? "Saving..." : `Continue with ${selectedServices.length} services`}
              <ChevronRight className="h-5 w-5" />
            </button>

            <button
              onClick={() => setStep("hours")}
              className="mt-3 w-full py-2 text-sm text-gray-500 hover:text-gray-700"
            >
              Skip for now
            </button>
          </div>
        )}

        {/* Step: Hours */}
        {step === "hours" && (
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900">
              Set your working hours
            </h1>
            <p className="mt-2 text-gray-600">
              When can customers book appointments?
            </p>

            <div className="mt-6 space-y-3">
              {hours.map((day, index) => (
                <div
                  key={day.day}
                  className={`flex items-center gap-4 rounded-xl border p-4 ${
                    day.enabled ? "border-gray-200" : "border-gray-100 bg-gray-50"
                  }`}
                >
                  <label className="flex w-24 items-center gap-2">
                    <input
                      type="checkbox"
                      checked={day.enabled}
                      onChange={(e) => {
                        const newHours = [...hours];
                        newHours[index].enabled = e.target.checked;
                        setHours(newHours);
                      }}
                      className="h-4 w-4 rounded text-purple-600"
                    />
                    <span
                      className={`font-medium ${
                        day.enabled ? "text-gray-900" : "text-gray-400"
                      }`}
                    >
                      {day.name.slice(0, 3)}
                    </span>
                  </label>

                  {day.enabled ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        value={day.open}
                        onChange={(e) => {
                          const newHours = [...hours];
                          newHours[index].open = e.target.value;
                          setHours(newHours);
                        }}
                        className="rounded-lg border border-gray-200 px-3 py-2"
                      />
                      <span className="text-gray-400">to</span>
                      <input
                        type="time"
                        value={day.close}
                        onChange={(e) => {
                          const newHours = [...hours];
                          newHours[index].close = e.target.value;
                          setHours(newHours);
                        }}
                        className="rounded-lg border border-gray-200 px-3 py-2"
                      />
                    </div>
                  ) : (
                    <span className="text-gray-400">Closed</span>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={handleHoursSubmit}
              disabled={loading}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 py-4 font-semibold text-white hover:bg-purple-700"
            >
              {loading ? "Saving..." : "Finish Setup"}
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Step: Complete */}
        {step === "complete" && (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="mt-6 text-2xl font-bold text-gray-900">
              You're all set!
            </h1>
            <p className="mt-2 text-gray-600">
              Your booking page is ready. Share it with your customers to start accepting appointments.
            </p>

            <button
              onClick={handleComplete}
              className="mt-8 w-full rounded-xl bg-purple-600 py-4 font-semibold text-white hover:bg-purple-700"
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
