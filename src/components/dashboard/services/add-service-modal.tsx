"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";

const PRESET_SERVICES = [
  { name: "Haircut", duration: 45, price: 35, category: "Hair" },
  { name: "Hair Coloring", duration: 120, price: 85, category: "Hair" },
  { name: "Blowout", duration: 45, price: 45, category: "Hair" },
  { name: "Manicure", duration: 30, price: 25, category: "Nails" },
  { name: "Pedicure", duration: 45, price: 35, category: "Nails" },
  { name: "Facial", duration: 60, price: 65, category: "Skincare" },
];

export function AddServiceModal({
  merchantId,
  isEmptyState = false,
}: {
  merchantId: string;
  isEmptyState?: boolean;
}) {
  const t = useTranslations("servicesForm");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const [formData, setFormData] = useState({
    name: "",
    duration_minutes: 60,
    price: 0,
    category: "",
  });

  const handlePresetSelect = async (preset: (typeof PRESET_SERVICES)[0]) => {
    setLoading(true);
    await supabase.from("services").insert({
      merchant_id: merchantId,
      name: preset.name,
      duration_minutes: preset.duration,
      price: preset.price,
      category: preset.category,
    });
    setLoading(false);
    setIsOpen(false);
    router.refresh();
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await supabase.from("services").insert({
      merchant_id: merchantId,
      ...formData,
    });
    setLoading(false);
    setIsOpen(false);
    setShowCustom(false);
    setFormData({ name: "", duration_minutes: 60, price: 0, category: "" });
    router.refresh();
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={
          isEmptyState
            ? "mt-4 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 font-medium text-white hover:bg-purple-700"
            : "flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 font-medium text-white hover:bg-purple-700"
        }
      >
        <Plus className="h-5 w-5" />
        {t("addService")}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {showCustom ? t("customService") : t("addService")}
              </h2>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setShowCustom(false);
                }}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {!showCustom ? (
              <>
                <p className="mt-2 text-sm text-gray-600">
                  {t("chooseOrCreate")}
                </p>

                <div className="mt-6 space-y-2">
                  {PRESET_SERVICES.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => handlePresetSelect(preset)}
                      disabled={loading}
                      className="flex w-full items-center justify-between rounded-xl border border-gray-200 p-4 text-left transition-colors hover:border-purple-200 hover:bg-purple-50"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{preset.name}</p>
                        <p className="text-sm text-gray-500">
                          {preset.duration} min · {preset.category}
                        </p>
                      </div>
                      <span className="font-semibold text-purple-600">
                        ${preset.price}
                      </span>
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setShowCustom(true)}
                  className="mt-4 w-full rounded-xl border-2 border-dashed border-gray-200 py-3 text-center font-medium text-gray-600 hover:border-gray-300 hover:text-gray-900"
                >
                  {t("createCustomService")}
                </button>
              </>
            ) : (
              <form onSubmit={handleCustomSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t("serviceName")}
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-purple-500 focus:outline-none"
                    placeholder={t("serviceNamePlaceholder")}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t("durationMins")}
                    </label>
                    <input
                      type="number"
                      value={formData.duration_minutes}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          duration_minutes: parseInt(e.target.value),
                        })
                      }
                      className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-purple-500 focus:outline-none"
                      min={5}
                      step={5}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t("price")} ($)
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price: parseFloat(e.target.value),
                        })
                      }
                      className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-purple-500 focus:outline-none"
                      min={0}
                      step={0.01}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t("categoryOptional")}
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-purple-500 focus:outline-none"
                    placeholder={t("categoryPlaceholder")}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCustom(false)}
                    className="flex-1 rounded-xl border border-gray-200 py-3 font-medium text-gray-700 hover:bg-gray-50"
                  >
                    {t("back")}
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 rounded-xl bg-purple-600 py-3 font-medium text-white hover:bg-purple-700"
                  >
                    {loading ? t("adding") : t("addService")}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
