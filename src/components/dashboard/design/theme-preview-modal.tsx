"use client";

import { X, Check, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { ThemePreset } from "@/types/database";
import { useEffect } from "react";

interface ThemePreviewModalProps {
  theme: ThemePreset | null;
  isOpen: boolean;
  onClose: () => void;
  onApply: (themeId: string) => void;
  currentThemeId: string;
}

export function ThemePreviewModal({
  theme,
  isOpen,
  onClose,
  onApply,
  currentThemeId,
}: ThemePreviewModalProps) {
  const t = useTranslations("themes");

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !theme) return null;

  const isCurrentTheme = currentThemeId === theme.id;
  const isPopular = ["modern", "elegant", "minimal"].includes(theme.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-6xl max-h-[90vh] m-4 bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gray-50">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-lg"
              style={{ background: theme.preview }}
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900">{t(`presets.${theme.id}.name`)}</h2>
                {isPopular && (
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    Popular
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-0.5">{t(`presets.${theme.id}.description`)}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-auto">
          <div
            className="min-h-full p-8 sm:p-12"
            style={{
              backgroundColor: theme.theme.backgroundColor,
              color: theme.theme.textColor,
              fontFamily: theme.theme.fontFamily,
            }}
          >
            {/* Hero Section */}
            <div className="max-w-4xl mx-auto">
              {/* Logo */}
              <div
                className="w-20 h-20 rounded-full mb-6 flex items-center justify-center text-white font-bold text-2xl"
                style={{ backgroundColor: theme.theme.primaryColor }}
              >
                S
              </div>

              {/* Heading */}
              <h1 className="text-4xl sm:text-5xl font-bold mb-4" style={{ color: theme.theme.textColor }}>
                Your Spa & Wellness
              </h1>
              <p className="text-lg sm:text-xl opacity-80 mb-8">
                Premium beauty and wellness services tailored just for you
              </p>

              {/* CTA Button */}
              <button
                type="button"
                className="px-8 py-3 text-base font-semibold transition-all hover:opacity-90"
                style={{
                  backgroundColor:
                    theme.theme.buttonStyle === "solid"
                      ? theme.theme.primaryColor
                      : "transparent",
                  color:
                    theme.theme.buttonStyle === "solid"
                      ? "#fff"
                      : theme.theme.primaryColor,
                  border:
                    theme.theme.buttonStyle === "outline"
                      ? `2px solid ${theme.theme.primaryColor}`
                      : "none",
                  borderRadius:
                    theme.theme.borderRadius === "none"
                      ? "0"
                      : theme.theme.borderRadius === "sm"
                      ? "6px"
                      : theme.theme.borderRadius === "md"
                      ? "10px"
                      : theme.theme.borderRadius === "lg"
                      ? "14px"
                      : "9999px",
                }}
              >
                Book Appointment
              </button>

              {/* Services Grid */}
              <div className="mt-16">
                {theme.theme.showSectionTitles && (
                  <h2 className="text-2xl font-bold mb-6" style={{ color: theme.theme.textColor }}>
                    Our Services
                  </h2>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { name: "Facial Treatment", price: 75, duration: "60 min" },
                    { name: "Body Massage", price: 90, duration: "90 min" },
                    { name: "Manicure & Pedicure", price: 55, duration: "45 min" },
                    { name: "Hot Stone Therapy", price: 110, duration: "90 min" },
                  ].map((service, index) => (
                    <div
                      key={index}
                      className="p-5 backdrop-blur-sm transition-all hover:shadow-lg"
                      style={{
                        backgroundColor: theme.theme.backgroundColor,
                        borderRadius:
                          theme.theme.borderRadius === "none"
                            ? "0"
                            : theme.theme.borderRadius === "sm"
                            ? "8px"
                            : theme.theme.borderRadius === "md"
                            ? "12px"
                            : theme.theme.borderRadius === "lg"
                            ? "16px"
                            : "24px",
                        border: `2px solid ${theme.theme.primaryColor}30`,
                      }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg" style={{ color: theme.theme.textColor }}>
                          {service.name}
                        </h3>
                        <span
                          className="font-bold text-xl"
                          style={{ color: theme.theme.primaryColor }}
                        >
                          ${service.price}
                        </span>
                      </div>
                      <p className="text-sm opacity-70 mb-4">{service.duration}</p>
                      <button
                        type="button"
                        className="w-full py-2 text-sm font-medium transition-all hover:opacity-90"
                        style={{
                          backgroundColor:
                            theme.theme.buttonStyle === "solid"
                              ? theme.theme.primaryColor
                              : "transparent",
                          color:
                            theme.theme.buttonStyle === "solid"
                              ? "#fff"
                              : theme.theme.primaryColor,
                          border:
                            theme.theme.buttonStyle === "outline"
                              ? `2px solid ${theme.theme.primaryColor}`
                              : "none",
                          borderRadius:
                            theme.theme.borderRadius === "none"
                              ? "0"
                              : theme.theme.borderRadius === "sm"
                              ? "6px"
                              : theme.theme.borderRadius === "md"
                              ? "8px"
                              : theme.theme.borderRadius === "lg"
                              ? "12px"
                              : "9999px",
                        }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* About Section */}
              <div className="mt-16 p-8" style={{
                backgroundColor: `${theme.theme.primaryColor}10`,
                borderRadius: theme.theme.borderRadius === "none"
                  ? "0"
                  : theme.theme.borderRadius === "sm"
                  ? "8px"
                  : theme.theme.borderRadius === "md"
                  ? "12px"
                  : theme.theme.borderRadius === "lg"
                  ? "16px"
                  : "24px",
              }}>
                {theme.theme.showSectionTitles && (
                  <h2 className="text-2xl font-bold mb-4" style={{ color: theme.theme.textColor }}>
                    About Us
                  </h2>
                )}
                <p className="opacity-80 leading-relaxed">
                  Welcome to our premium spa and wellness center. We offer a wide range of beauty
                  and relaxation services designed to help you look and feel your best. Our experienced
                  team is dedicated to providing you with exceptional care in a serene environment.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-4 p-6 border-t bg-gray-50">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-full">
              {theme.theme.fontFamily}
            </span>
            <span className="text-sm px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-full capitalize">
              {theme.theme.buttonStyle} buttons
            </span>
            <span className="text-sm px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-full capitalize">
              {theme.theme.headerStyle} header
            </span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onApply(theme.id);
                onClose();
              }}
              disabled={isCurrentTheme}
              className={`px-6 py-2.5 text-sm font-semibold text-white rounded-lg transition-all flex items-center gap-2 ${
                isCurrentTheme
                  ? "bg-green-500 cursor-default"
                  : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              }`}
            >
              {isCurrentTheme ? (
                <>
                  <Check className="h-4 w-4" />
                  Current Theme
                </>
              ) : (
                "Apply Theme"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
