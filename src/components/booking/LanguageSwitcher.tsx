"use client";

import { useState, useTransition } from "react";
import { Globe } from "lucide-react";
import { useLocale } from "next-intl";

interface LanguageSwitcherProps {
  accentColor?: string;
  primaryColor?: string;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "inline";
}

export function LanguageSwitcher({
  accentColor = "#3B82F6",
  primaryColor,
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
        className={`flex items-center gap-2 rounded-full transition-all duration-300 border-3 group ${
          isInline
            ? "px-3 py-2 bg-transparent hover:bg-gray-50"
            : "px-4 py-2.5 bg-white shadow-xl hover:shadow-2xl"
        }`}
        style={{
          borderColor: primaryColor || accentColor,
          borderWidth: isInline ? '2px' : '3px',
          boxShadow: isInline ? undefined : `0 4px 20px ${primaryColor || accentColor}40, 0 0 0 1px ${primaryColor || accentColor}20`,
        }}
      >
        <Globe
          className={`transition-transform group-hover:rotate-12 ${isInline ? "w-5 h-5" : "w-5 h-5"}`}
          style={{ color: primaryColor || accentColor, filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))' }}
        />
        <span className={`font-semibold ${isInline ? "text-base" : "text-sm"}`}>{currentLanguage.flag}</span>
        {!isInline && (
          <span className="text-sm font-bold hidden sm:inline" style={{ color: primaryColor || accentColor }}>
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
          <div
            className="absolute top-full mt-2 right-0 rounded-xl shadow-2xl border-3 overflow-hidden z-40 min-w-[180px]"
            style={{
              backgroundColor: '#FFFEF5',
              borderColor: primaryColor || accentColor,
            }}
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                disabled={isPending}
                className={`w-full flex items-center gap-3 px-4 py-3 transition-all duration-200 ${
                  currentLocale === lang.code
                    ? "font-black"
                    : "hover:bg-white/50 font-semibold"
                }`}
                style={{
                  backgroundColor: currentLocale === lang.code ? accentColor : undefined,
                  color: currentLocale === lang.code ? primaryColor || '#C62828' : "#374151",
                  textShadow: currentLocale === lang.code ? '0 1px 2px rgba(255,255,255,0.5)' : undefined,
                }}
              >
                <span className="text-xl">{lang.flag}</span>
                <span className="text-base">{lang.name}</span>
                {currentLocale === lang.code && (
                  <span className="ml-auto text-lg font-black">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
