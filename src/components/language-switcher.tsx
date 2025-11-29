"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Globe } from "lucide-react";

const locales = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
];

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const t = useTranslations("language");
  const locale = useLocale();
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
        className="appearance-none bg-transparent border border-gray-300 rounded-lg pl-8 pr-8 py-2 text-sm cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
      >
        {locales.map((loc) => (
          <option key={loc.code} value={loc.code}>
            {loc.flag} {loc.label}
          </option>
        ))}
      </select>
      <Globe className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
    </div>
  );
}

export function LanguageSwitcherCompact({ className = "" }: { className?: string }) {
  const locale = useLocale();
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
