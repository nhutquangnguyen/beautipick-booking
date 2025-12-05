"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { LayoutOption, ColorScheme, LayoutTemplate } from "@/types/database";

interface LayoutSelectorProps {
  layouts: LayoutOption[];
  selectedLayout: LayoutTemplate;
  selectedColorScheme: string;
  onLayoutChange: (layoutId: LayoutTemplate, colorSchemeId: string) => void;
}

export function LayoutSelector({
  layouts,
  selectedLayout,
  selectedColorScheme,
  onLayoutChange,
}: LayoutSelectorProps) {
  const t = useTranslations("themes");
  const [expandedLayout, setExpandedLayout] = useState<LayoutTemplate | null>(selectedLayout);

  const handleLayoutClick = (layout: LayoutOption) => {
    if (expandedLayout === layout.id) {
      // If clicking the already expanded layout, collapse it
      setExpandedLayout(null);
    } else {
      // Expand this layout and auto-select default color scheme if switching layouts
      setExpandedLayout(layout.id);
      if (selectedLayout !== layout.id) {
        onLayoutChange(layout.id, layout.defaultColorScheme);
      }
    }
  };

  const handleColorSchemeClick = (layoutId: LayoutTemplate, colorScheme: ColorScheme) => {
    onLayoutChange(layoutId, colorScheme.id);
  };

  return (
    <div className="space-y-4">
      {layouts.map((layout) => {
        const isSelected = selectedLayout === layout.id;
        const isExpanded = expandedLayout === layout.id;

        return (
          <div
            key={layout.id}
            className="border rounded-xl overflow-hidden transition-all duration-300"
            style={{
              borderColor: isSelected ? "#8B5CF6" : "#E5E7EB",
              backgroundColor: isExpanded ? "#FAFAFA" : "#FFFFFF",
            }}
          >
            {/* Layout Header */}
            <button
              onClick={() => handleLayoutClick(layout)}
              className="w-full p-5 sm:p-6 flex items-start gap-4 hover:bg-gray-50 transition-colors"
            >
              {/* Icon */}
              <div className="flex-shrink-0">
                <div
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center text-3xl shadow-md"
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
                  <div>
                    <h3 className="font-bold text-lg sm:text-xl text-gray-900">
                      {t(`layouts.${layout.id}.name`)}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{t(`layouts.${layout.id}.description`)}</p>
                  </div>
                  {isSelected && (
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
            </button>

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

                      return (
                        <button
                          key={colorScheme.id}
                          onClick={() => handleColorSchemeClick(layout.id, colorScheme)}
                          className="relative p-3 border-2 rounded-lg hover:shadow-md transition-all duration-200 text-left flex-1 min-w-[140px] max-w-[200px]"
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
                          <h5 className="font-semibold text-sm text-gray-900">
                            {t(`colorSchemes.${colorScheme.id}.name`)}
                          </h5>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
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
                        </button>
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
