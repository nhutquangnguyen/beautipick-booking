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
  // Hidden: Vietnamese only mode
  return null;
}

export function LanguageSwitcherCompact({ className = "" }: { className?: string }) {
  // Hidden: Vietnamese only mode
  return null;
}

export function LanguageSwitcherIcon({ className = "" }: { className?: string }) {
  // Hidden: Vietnamese only mode
  return null;
}
