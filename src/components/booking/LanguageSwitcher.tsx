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
  // Hidden: Vietnamese only mode
  return null;
}
