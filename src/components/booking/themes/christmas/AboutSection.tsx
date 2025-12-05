"use client";

import { useTranslations } from "next-intl";
import { AboutSectionProps } from "../types";

export function ChristmasAboutSection({ merchant, colors }: AboutSectionProps) {
  const t = useTranslations("common");
  if (!merchant.description) return null;

  return (
    <section
      className="py-24 px-6"
      style={{ backgroundColor: colors.backgroundColor }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Festive header with snowflakes */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="text-4xl">❄️</span>
            <h2
              className="text-4xl sm:text-5xl font-bold"
              style={{
                fontFamily: colors.fontFamily,
                color: colors.primaryColor,
              }}
            >
              {t("aboutUs")}
            </h2>
            <span className="text-4xl">❄️</span>
          </div>

          {/* Decorative stars */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <span className="text-2xl">⭐</span>
            <div
              className="h-px w-24"
              style={{ backgroundColor: colors.accentColor }}
            />
            <span className="text-2xl">🎄</span>
            <div
              className="h-px w-24"
              style={{ backgroundColor: colors.accentColor }}
            />
            <span className="text-2xl">⭐</span>
          </div>
        </div>

        {/* Content card with festive styling */}
        <div
          className="rounded-2xl p-8 sm:p-12 shadow-lg"
          style={{
            backgroundColor: "#fff",
            border: `3px solid ${colors.accentColor}`,
          }}
        >
          <p
            className="text-lg sm:text-xl leading-relaxed text-center"
            style={{
              fontFamily: colors.fontFamily,
              color: colors.textColor,
            }}
          >
            {merchant.description}
          </p>

          {/* Festive footer decoration */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <span className="text-xl">🎁</span>
            <span className="text-xl">🔔</span>
            <span className="text-xl">🎅</span>
          </div>
        </div>
      </div>
    </section>
  );
}
