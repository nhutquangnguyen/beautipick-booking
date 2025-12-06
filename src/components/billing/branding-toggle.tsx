"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Crown } from "lucide-react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";

interface BrandingToggleProps {
  merchantId: string;
  currentValue: boolean;
  isPro: boolean;
}

export function BrandingToggle({ merchantId, currentValue, isPro }: BrandingToggleProps) {
  const t = useTranslations("billing");
  const router = useRouter();
  const supabase = createClient();
  const [showBranding, setShowBranding] = useState(currentValue);
  const [saving, setSaving] = useState(false);

  const handleToggle = async (checked: boolean) => {
    if (!isPro) return; // Prevent Free users from changing

    setSaving(true);
    setShowBranding(checked);

    try {
      // Get current settings
      const { data: merchant } = await supabase
        .from("merchants")
        .select("settings")
        .eq("id", merchantId)
        .single();

      // Update settings
      await supabase
        .from("merchants")
        .update({
          settings: {
            ...(merchant?.settings as any || {}),
            showBranding: checked,
          },
        })
        .eq("id", merchantId);

      router.refresh();
    } catch (error) {
      console.error("Error updating branding setting:", error);
      // Revert on error
      setShowBranding(currentValue);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        {t("brandingSettings")}
        {isPro && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold rounded-full">
            <Crown className="h-3 w-3" />
            Pro
          </span>
        )}
      </h2>

      <div className={`p-4 rounded-lg ${isPro ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200' : 'bg-gray-100 border-2 border-gray-300'}`}>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={showBranding}
            onChange={(e) => handleToggle(e.target.checked)}
            disabled={!isPro || saving}
            className={`h-5 w-5 rounded mt-0.5 ${isPro ? 'text-purple-600' : 'text-gray-400 cursor-not-allowed'}`}
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className={`text-sm font-medium ${isPro ? 'text-gray-900' : 'text-gray-500'}`}>
                {t("showBranding")}
              </p>
              {saving && <span className="text-xs text-gray-500">Saving...</span>}
            </div>
            <p className={`text-xs mt-1 ${isPro ? 'text-gray-600' : 'text-gray-500'}`}>
              {isPro ? t("showBrandingDescPro") : t("showBrandingDescFree")}
            </p>
            {!isPro && (
              <p className="text-xs text-purple-600 font-medium mt-2">
                {t("upgradeToPro")}
              </p>
            )}
          </div>
        </label>
      </div>
    </div>
  );
}
