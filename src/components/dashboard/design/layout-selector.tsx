"use client";

import { useState } from "react";
import { Check, Crown, Lock, Eye } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { LayoutOption, ColorScheme, LayoutTemplate } from "@/types/database";

interface LayoutSelectorProps {
  layouts: LayoutOption[];
  selectedLayout: LayoutTemplate;
  selectedColorScheme: string;
  onLayoutChange: (layoutId: LayoutTemplate, colorSchemeId: string) => void;
  isFree?: boolean;
  merchantId?: string;
  merchantSlug?: string;
}

export function LayoutSelector({
  layouts,
  selectedLayout,
  selectedColorScheme,
  onLayoutChange,
  isFree = false,
  merchantId,
  merchantSlug,
}: LayoutSelectorProps) {
  const t = useTranslations("themes");
  const [expandedLayout, setExpandedLayout] = useState<LayoutTemplate | null>(selectedLayout);
  const [tryingOn, setTryingOn] = useState<string | null>(null);

  const handleLayoutClick = (layout: LayoutOption) => {
    // Check if layout is locked for free users
    const isLocked = isFree && layout.id !== "starter";

    if (expandedLayout === layout.id) {
      // If clicking the already expanded layout, collapse it
      setExpandedLayout(null);
    } else {
      // Expand this layout
      setExpandedLayout(layout.id);
      // Only auto-select if not locked
      if (!isLocked && selectedLayout !== layout.id) {
        onLayoutChange(layout.id, layout.defaultColorScheme);
      }
    }
  };

  const handleColorSchemeClick = (layoutId: LayoutTemplate, colorScheme: ColorScheme) => {
    onLayoutChange(layoutId, colorScheme.id);
  };

  const handleTryIt = async (layoutId: LayoutTemplate, colorSchemeId: string) => {
    if (!merchantId || !merchantSlug) {
      alert("Unable to create preview. Please try again.");
      return;
    }

    const tryKey = `${layoutId}-${colorSchemeId}`;
    setTryingOn(tryKey);

    try {
      // Get the layout and color scheme
      const layout = layouts.find((l) => l.id === layoutId);
      const colorScheme = layout?.colorSchemes.find((cs) => cs.id === colorSchemeId);

      if (!layout || !colorScheme) {
        throw new Error("Invalid layout or color scheme");
      }

      // Create preview theme data
      const previewTheme = {
        themeId: tryKey,
        layoutTemplate: layoutId,
        primaryColor: colorScheme.primaryColor,
        secondaryColor: colorScheme.secondaryColor,
        accentColor: colorScheme.accentColor,
        backgroundColor: colorScheme.backgroundColor,
        textColor: colorScheme.textColor,
        fontFamily: colorScheme.fontFamily,
        borderRadius: "lg",
        buttonStyle: "solid",
        headerStyle: "overlay",
        showSectionTitles: true,
        contentOrder: [
          { id: "hero", enabled: true },
          { id: "services", enabled: true },
          { id: "products", enabled: true },
          { id: "gallery", enabled: true },
          { id: "about", enabled: true },
          { id: "contact", enabled: true },
        ],
      };

      // Call API to create preview
      const response = await fetch("/api/theme-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: previewTheme }),
      });

      if (!response.ok) {
        throw new Error("Failed to create preview");
      }

      const { hash } = await response.json();

      // Open preview in new tab
      window.open(`/try-on/${hash}/${merchantSlug}`, "_blank");
    } catch (error) {
      console.error("Error creating preview:", error);
      alert("Failed to create preview. Please try again.");
    } finally {
      setTryingOn(null);
    }
  };

  return (
    <div className="space-y-4">
      {layouts.map((layout) => {
        const isSelected = selectedLayout === layout.id;
        const isExpanded = expandedLayout === layout.id;
        const isLocked = isFree && layout.id !== "starter";

        return (
          <div
            key={layout.id}
            className={`border rounded-xl overflow-hidden transition-all duration-300 ${
              isLocked ? "opacity-75" : ""
            }`}
            style={{
              borderColor: isSelected ? "#8B5CF6" : "#E5E7EB",
              backgroundColor: isExpanded ? "#FAFAFA" : "#FFFFFF",
            }}
          >
            {/* Layout Header */}
            <div
              onClick={() => handleLayoutClick(layout)}
              className="w-full p-5 sm:p-6 flex items-start gap-4 transition-colors cursor-pointer hover:bg-gray-50"
            >
              {/* Icon */}
              <div className="flex-shrink-0">
                <div
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center text-3xl shadow-md relative"
                  style={{
                    background: isSelected
                      ? "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)"
                      : "#F3F4F6",
                  }}
                >
                  {isSelected ? (
                    <Check className="h-8 w-8 text-white" />
                  ) : (
                    <span>{layout.icon}</span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 text-left">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg sm:text-xl text-gray-900">
                        {t(`layouts.${layout.id}.name`)}
                      </h3>
                      {isLocked && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-xs font-semibold rounded-full">
                          <Crown className="h-3 w-3" />
                          Pro
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{t(`layouts.${layout.id}.description`)}</p>
                  </div>
                  {isSelected && !isLocked && (
                    <div className="flex-shrink-0 px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                      Active
                    </div>
                  )}
                </div>
              </div>

              {/* Expand Indicator */}
              <div className="flex-shrink-0">
                <div
                  className={`transform transition-transform duration-300 ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                >
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Color Schemes - Expandable */}
            {isExpanded && (
              <div className="px-5 sm:px-6 pb-4 pt-2">
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-xs text-gray-600 mb-3 uppercase tracking-wider">
                    Color Schemes ({layout.colorSchemes.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {layout.colorSchemes.map((colorScheme) => {
                      const isColorSelected =
                        isSelected && selectedColorScheme === colorScheme.id;
                      const tryKey = `${layout.id}-${colorScheme.id}`;
                      const isTrying = tryingOn === tryKey;

                      return (
                        <div
                          key={colorScheme.id}
                          onClick={() => !isLocked && handleColorSchemeClick(layout.id, colorScheme)}
                          className={`relative p-3 border-2 rounded-lg transition-all duration-200 text-left flex-1 min-w-[140px] max-w-[200px] ${
                            !isLocked ? "cursor-pointer hover:shadow-md" : ""
                          }`}
                          style={{
                            borderColor: isColorSelected ? "#8B5CF6" : "#E5E7EB",
                            backgroundColor: isColorSelected ? "#F5F3FF" : "#FFFFFF",
                          }}
                        >
                          {/* Selected Check */}
                          {isColorSelected && (
                            <div className="absolute top-2 right-2">
                              <div className="w-4 h-4 rounded-full bg-purple-600 flex items-center justify-center">
                                <Check className="h-3 w-3 text-white" />
                              </div>
                            </div>
                          )}

                          {/* Color Preview */}
                          <div
                            className="w-full h-12 rounded-md mb-2 shadow-sm"
                            style={{ background: colorScheme.preview }}
                          />

                          {/* Color Scheme Info */}
                          <h5 className="font-bold text-sm text-gray-900">
                            {t(`colorSchemes.${colorScheme.id}.name`)}
                          </h5>
                          <p className="text-xs text-gray-700 mt-0.5 line-clamp-1 font-medium">
                            {t(`colorSchemes.${colorScheme.id}.description`)}
                          </p>

                          {/* Color Swatches */}
                          <div className="flex items-center gap-1 mt-2">
                            <div
                              className="w-4 h-4 rounded-full border border-white shadow-sm"
                              style={{ backgroundColor: colorScheme.primaryColor }}
                              title="Primary"
                            />
                            <div
                              className="w-4 h-4 rounded-full border border-white shadow-sm"
                              style={{ backgroundColor: colorScheme.secondaryColor }}
                              title="Secondary"
                            />
                            <div
                              className="w-4 h-4 rounded-full border border-white shadow-sm"
                              style={{ backgroundColor: colorScheme.accentColor }}
                              title="Accent"
                            />
                          </div>

                          {/* Try it button for locked layouts */}
                          {isLocked && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTryIt(layout.id, colorScheme.id);
                              }}
                              disabled={isTrying}
                              className="w-full mt-3 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
                            >
                              {isTrying ? (
                                <>
                                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                  <span>Opening...</span>
                                </>
                              ) : (
                                <>
                                  <Eye className="h-3 w-3" />
                                  Try it
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
