"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import {
  MerchantTheme,
  themePresets,
  defaultTheme,
  defaultContentOrder,
  ThemePreset,
  layoutOptions,
  LayoutTemplate,
} from "@/types/database";
import { ThemeGallery } from "@/components/dashboard/design/theme-gallery";
import { ThemePreviewModal } from "@/components/dashboard/design/theme-preview-modal";
import { LayoutSelector } from "@/components/dashboard/design/layout-selector";

// Helper to ensure theme has all required fields
function ensureCompleteTheme(theme: Partial<MerchantTheme>): MerchantTheme {
  return {
    ...defaultTheme,
    ...theme,
    contentOrder: theme.contentOrder || defaultContentOrder,
  };
}

export function DesignForm({
  merchantId,
  theme,
  isFree = false,
}: {
  merchantId: string;
  theme: MerchantTheme;
  isFree?: boolean;
}) {
  const t = useTranslations("designForm");
  const router = useRouter();
  const supabase = createClient();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState<MerchantTheme>(ensureCompleteTheme(theme));
  const [previewTheme, setPreviewTheme] = useState<ThemePreset | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [merchantSlug, setMerchantSlug] = useState<string>("");

  // Track original theme to detect changes
  const originalTheme = useRef<MerchantTheme>(ensureCompleteTheme(theme));

  // Fetch merchant slug for preview
  useEffect(() => {
    const fetchMerchantSlug = async () => {
      const { data } = await supabase
        .from("merchants")
        .select("slug")
        .eq("id", merchantId)
        .single();
      if (data) {
        setMerchantSlug(data.slug);
      }
    };
    fetchMerchantSlug();
  }, [merchantId, supabase]);

  // Detect changes
  useEffect(() => {
    const changed = JSON.stringify(formData) !== JSON.stringify(originalTheme.current);
    setHasChanges(changed);
  }, [formData]);

  // Manual save function
  const handleSave = async () => {
    // Prevent free users from saving premium themes
    if (isFree && formData.layoutTemplate !== "starter") {
      alert("Free plan users can only use the Starter theme. Please upgrade to Pro to use premium themes.");
      return;
    }

    setSaving(true);
    setSaved(false);

    try {
      await supabase
        .from("merchants")
        .update({
          theme: formData,
        })
        .eq("id", merchantId);

      setSaved(true);
      setHasChanges(false);
      originalTheme.current = formData;
      router.refresh();

      // Hide "Saved" message after 2 seconds
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const selectPreset = (presetId: string) => {
    const preset = themePresets.find((p) => p.id === presetId);
    if (preset) {
      // Apply ALL theme settings including layout template, content order, header style, etc.
      setFormData({
        themeId: presetId,
        layoutTemplate: preset.theme.layoutTemplate,
        primaryColor: preset.theme.primaryColor,
        secondaryColor: preset.theme.secondaryColor,
        accentColor: preset.theme.accentColor,
        backgroundColor: preset.theme.backgroundColor,
        textColor: preset.theme.textColor,
        fontFamily: preset.theme.fontFamily,
        borderRadius: preset.theme.borderRadius,
        buttonStyle: preset.theme.buttonStyle,
        headerStyle: preset.theme.headerStyle,
        contentOrder: preset.theme.contentOrder,
        showSectionTitles: preset.theme.showSectionTitles,
      });
    }
  };

  const handleLayoutChange = (layoutId: LayoutTemplate, colorSchemeId: string) => {
    const layout = layoutOptions.find((l) => l.id === layoutId);
    const colorScheme = layout?.colorSchemes.find((cs) => cs.id === colorSchemeId);

    if (layout && colorScheme) {
      // Apply layout and color scheme settings
      setFormData({
        ...formData,
        themeId: `${layoutId}-${colorSchemeId}`,
        layoutTemplate: layoutId,
        primaryColor: colorScheme.primaryColor,
        secondaryColor: colorScheme.secondaryColor,
        accentColor: colorScheme.accentColor,
        backgroundColor: colorScheme.backgroundColor,
        textColor: colorScheme.textColor,
        fontFamily: colorScheme.fontFamily,
        // Keep existing layout settings
        borderRadius: "lg",
        buttonStyle: "solid",
        headerStyle: "overlay",
      });
    }
  };

  // Determine current color scheme from themeId
  const getCurrentColorScheme = (): string => {
    // If themeId contains a dash, it's the new format: "layout-colorscheme"
    if (formData.themeId.includes("-")) {
      return formData.themeId.split("-")[1];
    }
    // Otherwise, it's a legacy theme preset ID - find its color scheme
    const layout = layoutOptions.find((l) => l.id === formData.layoutTemplate);
    return layout?.defaultColorScheme || "radiance";
  };

  return (
    <div className="space-y-6">
      {/* Layout Selector */}
      <div className="card p-4 sm:p-6">
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 text-lg sm:text-2xl">{t("chooseLayoutColors")}</h3>
          <p className="text-sm sm:text-base text-gray-500 mt-2">
            {t("chooseLayoutColorsDesc")}
          </p>
        </div>
        <LayoutSelector
          layouts={layoutOptions}
          selectedLayout={formData.layoutTemplate}
          selectedColorScheme={getCurrentColorScheme()}
          onLayoutChange={handleLayoutChange}
          isFree={isFree}
          merchantId={merchantId}
          merchantSlug={merchantSlug}
        />
      </div>

      {/* Save Button */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 -mx-4 sm:-mx-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm">
          {saved && !saving && (
            <>
              <Check className="h-4 w-4 text-green-600" />
              <span className="text-green-600">{t("savedSuccessfully")}</span>
            </>
          )}
          {hasChanges && !saving && !saved && (
            <span className="text-amber-600">{t("unsavedChanges")}</span>
          )}
        </div>
        <button
          onClick={handleSave}
          disabled={!hasChanges || saving}
          className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {saving ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>{t("saving")}</span>
            </>
          ) : (
            <>
              <Check className="h-4 w-4" />
              <span>{t("saveChanges")}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
