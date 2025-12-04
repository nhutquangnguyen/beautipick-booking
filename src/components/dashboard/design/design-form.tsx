"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
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
}: {
  merchantId: string;
  theme: MerchantTheme;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState<MerchantTheme>(ensureCompleteTheme(theme));
  const [previewTheme, setPreviewTheme] = useState<ThemePreset | null>(null);

  // Track if this is the initial render to prevent auto-save on mount
  const isInitialMount = useRef(true);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-save function
  const autoSave = useCallback(async () => {
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
      router.refresh();

      // Hide "Saved" message after 2 seconds
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }, [formData, merchantId, supabase, router]);

  // Auto-save with debounce when formData changes
  useEffect(() => {
    // Skip auto-save on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout for auto-save (debounce 1 second)
    saveTimeoutRef.current = setTimeout(() => {
      autoSave();
    }, 1000);

    // Cleanup on unmount
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [formData, autoSave]);

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
          <h3 className="font-semibold text-gray-900 text-lg sm:text-2xl">Choose Your Layout & Colors</h3>
          <p className="text-sm sm:text-base text-gray-500 mt-2">
            First, select a layout style that matches your business. Then choose from curated color schemes designed for that layout.
          </p>
        </div>
        <LayoutSelector
          layouts={layoutOptions}
          selectedLayout={formData.layoutTemplate}
          selectedColorScheme={getCurrentColorScheme()}
          onLayoutChange={handleLayoutChange}
        />
      </div>

      {/* Auto-save Status */}
      <div className="flex items-center justify-center gap-2 py-4 text-sm text-gray-500">
        {saving && (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-purple-600" />
            <span>Saving...</span>
          </>
        )}
        {saved && !saving && (
          <>
            <Check className="h-4 w-4 text-green-600" />
            <span className="text-green-600">Saved</span>
          </>
        )}
        {!saving && !saved && (
          <span className="text-gray-400">Changes are auto-saved</span>
        )}
      </div>
    </div>
  );
}
