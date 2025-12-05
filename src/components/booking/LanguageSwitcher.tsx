"use client";

import { useState, useTransition } from "react";
import { Globe } from "lucide-react";
import { useLocale } from "next-intl";

interface LanguageSwitcherProps {
  accentColor?: string;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "inline";
}

export function LanguageSwitcher({
  accentColor = "#3B82F6",
  position = "top-right"
}: LanguageSwitcherProps) {
  const currentLocale = useLocale();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
    { code: "en", name: "English", flag: "🇺🇸" },
  ];

  const handleLanguageChange = (locale: string) => {
    startTransition(() => {
      // Set cookie and reload page
      document.cookie = `locale=${locale};path=/;max-age=31536000`;
      window.location.reload();
    });
    setIsOpen(false);
  };

  const currentLanguage = languages.find(lang => lang.code === currentLocale) || languages[0];

  const positionClasses = {
    "top-left": "top-4 left-4",
    "top-right": "top-4 right-4",
    "bottom-left": "bottom-20 left-4",
    "bottom-right": "bottom-20 right-4",
    "inline": "",
  };

  const isInline = position === "inline";

  return (
    <div className={`${isInline ? "relative" : `fixed ${positionClasses[position]}`} z-40`}>
      {/* Language Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className={`flex items-center gap-2 rounded-full transition-all duration-300 border-2 group ${
          isInline
            ? "px-2 py-1 bg-transparent hover:bg-gray-50"
            : "px-3 py-2 bg-white shadow-lg hover:shadow-xl"
        }`}
        style={{
          borderColor: isOpen ? accentColor : (isInline ? "transparent" : "#E5E7EB"),
        }}
      >
        <Globe
          className={`transition-transform group-hover:rotate-12 ${isInline ? "w-4 h-4" : "w-5 h-5"}`}
          style={{ color: accentColor }}
        />
        <span className={`font-semibold ${isInline ? "text-xs" : "text-sm"}`}>{currentLanguage.flag}</span>
        {!isInline && (
          <span className="text-sm font-medium text-gray-700 hidden sm:inline">
            {currentLanguage.code.toUpperCase()}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute top-full mt-2 right-0 bg-white rounded-xl shadow-2xl border-2 border-gray-100 overflow-hidden z-40 min-w-[180px]">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                disabled={isPending}
                className={`w-full flex items-center gap-3 px-4 py-3 transition-all duration-200 ${
                  currentLocale === lang.code
                    ? "font-bold"
                    : "hover:bg-gray-50 font-medium"
                }`}
                style={{
                  backgroundColor: currentLocale === lang.code ? `${accentColor}10` : undefined,
                  color: currentLocale === lang.code ? accentColor : "#374151",
                }}
              >
                <span className="text-xl">{lang.flag}</span>
                <span className="text-sm">{lang.name}</span>
                {currentLocale === lang.code && (
                  <span className="ml-auto text-xs">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
