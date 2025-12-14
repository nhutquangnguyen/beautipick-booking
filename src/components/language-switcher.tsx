"use client";

import { useTransition, useState, useRef, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Globe, Check } from "lucide-react";
import { useRouter } from "next/navigation";

const locales = [
  { code: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
  { code: "en", label: "English", flag: "🇺🇸" },
];

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const t = useTranslations("language");
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleChange = (newLocale: string) => {
    startTransition(() => {
      document.cookie = `locale=${newLocale};path=/;max-age=31536000`;
      window.location.reload();
    });
  };

  return (
    <div className={`relative ${className}`}>
      <select
        value={locale}
        onChange={(e) => handleChange(e.target.value)}
        disabled={isPending}
        className="appearance-none bg-transparent border border-gray-300 rounded-lg pl-3 pr-8 py-2 text-sm cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
      >
        {locales.map((loc) => (
          <option key={loc.code} value={loc.code}>
            {loc.flag} {loc.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function LanguageSwitcherCompact({ className = "" }: { className?: string }) {
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleChange = (newLocale: string) => {
    startTransition(() => {
      document.cookie = `locale=${newLocale};path=/;max-age=31536000`;
      window.location.reload();
    });
  };

  const currentLocale = locales.find((l) => l.code === locale);

  return (
    <div className={`flex gap-1 ${className}`}>
      {locales.map((loc) => (
        <button
          key={loc.code}
          onClick={() => handleChange(loc.code)}
          disabled={isPending || locale === loc.code}
          className={`px-2 py-1 text-sm rounded transition-colors ${
            locale === loc.code
              ? "bg-purple-100 text-purple-700 font-medium"
              : "text-gray-600 hover:bg-gray-100"
          } disabled:opacity-50`}
        >
          {loc.flag}
        </button>
      ))}
    </div>
  );
}

export function LanguageSwitcherIcon({ className = "" }: { className?: string }) {
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleChange = (newLocale: string) => {
    setIsOpen(false);
    startTransition(() => {
      document.cookie = `locale=${newLocale};path=/;max-age=31536000`;
      window.location.reload();
    });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
        title={locale === "vi" ? "Chọn ngôn ngữ" : "Select language"}
      >
        <Globe className="h-5 w-5 text-gray-600" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          {locales.map((loc) => (
            <button
              key={loc.code}
              onClick={() => handleChange(loc.code)}
              disabled={isPending}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors disabled:opacity-50 ${
                locale === loc.code ? "bg-purple-50" : ""
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="text-lg">{loc.flag}</span>
                <span className={locale === loc.code ? "font-medium text-purple-700" : "text-gray-700"}>
                  {loc.label}
                </span>
              </span>
              {locale === loc.code && (
                <Check className="h-4 w-4 text-purple-600" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
