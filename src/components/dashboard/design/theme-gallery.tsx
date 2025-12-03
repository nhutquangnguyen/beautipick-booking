"use client";

import { useState } from "react";
import { Check, Eye, Sparkles } from "lucide-react";
import { ThemePreset, MerchantTheme } from "@/types/database";

interface ThemeGalleryProps {
  themes: ThemePreset[];
  selectedThemeId: string;
  onSelectTheme: (themeId: string) => void;
  onPreviewTheme?: (theme: ThemePreset) => void;
  compact?: boolean;
}

export function ThemeGallery({
  themes,
  selectedThemeId,
  onSelectTheme,
  onPreviewTheme,
  compact = false,
}: ThemeGalleryProps) {
  const [hoveredTheme, setHoveredTheme] = useState<string | null>(null);

  return (
    <div className={`grid gap-4 ${compact ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}>
      {themes.map((preset) => {
        const isSelected = selectedThemeId === preset.id;
        const isHovered = hoveredTheme === preset.id;
        const isPopular = ["modern", "elegant", "minimal"].includes(preset.id);

        return (
          <div
            key={preset.id}
            className="relative group"
            onMouseEnter={() => setHoveredTheme(preset.id)}
            onMouseLeave={() => setHoveredTheme(null)}
          >
            {/* Popular Badge */}
            {isPopular && !compact && (
              <div className="absolute -top-2 -right-2 z-10 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
                <Sparkles className="h-3 w-3" />
                Popular
              </div>
            )}

            {/* Theme Card */}
            <div
              onClick={() => onSelectTheme(preset.id)}
              className={`relative w-full text-left transition-all duration-200 rounded-xl overflow-hidden cursor-pointer ${
                isSelected
                  ? "ring-4 ring-purple-500 ring-offset-2 shadow-xl scale-[1.02]"
                  : "border-2 border-gray-200 hover:border-purple-300 hover:shadow-lg"
              } ${compact ? "" : "p-1"}`}
            >
              {/* Selected Checkmark */}
              {isSelected && (
                <div className="absolute top-3 left-3 z-20 bg-purple-500 text-white rounded-full p-1.5 shadow-lg">
                  <Check className="h-4 w-4" />
                </div>
              )}

              {/* Preview Button */}
              {!compact && onPreviewTheme && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPreviewTheme(preset);
                  }}
                  className={`absolute top-3 right-3 z-20 bg-white/90 backdrop-blur-sm text-gray-700 rounded-full p-2 shadow-lg transition-all ${
                    isHovered ? "opacity-100 scale-100" : "opacity-0 scale-90"
                  }`}
                >
                  <Eye className="h-4 w-4" />
                </button>
              )}

              {/* Theme Preview */}
              <div
                className={`relative overflow-hidden ${compact ? "h-20 rounded-lg" : "h-48 rounded-xl"}`}
                style={{ background: preset.preview }}
              >
                {/* Mock UI Elements */}
                {!compact && (
                  <div
                    className="absolute inset-0 p-6 flex flex-col justify-between"
                    style={{
                      backgroundColor: preset.theme.backgroundColor + "E6", // 90% opacity
                      color: preset.theme.textColor,
                      fontFamily: preset.theme.fontFamily,
                    }}
                  >
                    {/* Header */}
                    <div>
                      <div
                        className="w-12 h-12 rounded-full mb-3"
                        style={{ backgroundColor: preset.theme.primaryColor }}
                      />
                      <h3 className="font-bold text-lg" style={{ color: preset.theme.textColor }}>
                        Your Spa
                      </h3>
                      <p className="text-xs opacity-70 mt-1">Premium beauty services</p>
                    </div>

                    {/* Service Card */}
                    <div
                      className="p-3 backdrop-blur-sm"
                      style={{
                        backgroundColor: preset.theme.backgroundColor + "CC",
                        borderRadius:
                          preset.theme.borderRadius === "none"
                            ? "0"
                            : preset.theme.borderRadius === "sm"
                            ? "4px"
                            : preset.theme.borderRadius === "md"
                            ? "8px"
                            : preset.theme.borderRadius === "lg"
                            ? "12px"
                            : "24px",
                        border: `1px solid ${preset.theme.primaryColor}40`,
                      }}
                    >
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium">Facial Treatment</span>
                        <span style={{ color: preset.theme.primaryColor }} className="font-semibold">
                          $75
                        </span>
                      </div>

                      {/* Button */}
                      <button
                        type="button"
                        className="w-full mt-2 py-1.5 text-xs font-medium transition-colors"
                        style={{
                          backgroundColor:
                            preset.theme.buttonStyle === "solid"
                              ? preset.theme.primaryColor
                              : "transparent",
                          color:
                            preset.theme.buttonStyle === "solid"
                              ? "#fff"
                              : preset.theme.primaryColor,
                          border:
                            preset.theme.buttonStyle === "outline"
                              ? `2px solid ${preset.theme.primaryColor}`
                              : "none",
                          borderRadius:
                            preset.theme.borderRadius === "none"
                              ? "0"
                              : preset.theme.borderRadius === "sm"
                              ? "4px"
                              : preset.theme.borderRadius === "md"
                              ? "8px"
                              : preset.theme.borderRadius === "lg"
                              ? "12px"
                              : "9999px",
                        }}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Theme Info */}
              <div className={compact ? "p-3" : "p-4"}>
                <h4 className={`font-bold text-gray-900 ${compact ? "text-sm" : "text-base"}`}>
                  {preset.name}
                </h4>
                {!compact && (
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{preset.description}</p>
                )}

                {/* Theme Attributes */}
                {!compact && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                      {preset.theme.fontFamily}
                    </span>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full capitalize">
                      {preset.theme.buttonStyle}
                    </span>
                    {preset.theme.borderRadius !== "none" && (
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                        {preset.theme.borderRadius === "full" ? "Rounded" : `${preset.theme.borderRadius} radius`}
                      </span>
                    )}
                  </div>
                )}

                {compact && (
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">{preset.description}</p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
