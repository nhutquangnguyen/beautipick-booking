"use client";

import { AboutSectionProps } from "../types";

export function MinimalAboutSection({ merchant, colors }: AboutSectionProps) {
  if (!merchant.description) return null;

  return (
    <section
      className="py-32 px-6"
      style={{ backgroundColor: `${colors.backgroundColor}f8` }}
    >
      <div className="max-w-3xl mx-auto text-center">
        {/* Section title */}
        <h2
          className="text-3xl sm:text-4xl font-extralight tracking-wide mb-12"
          style={{
            fontFamily: colors.fontFamily,
            color: colors.textColor,
          }}
        >
          About
        </h2>

        {/* Divider line */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div
            className="h-px w-12"
            style={{ backgroundColor: `${colors.primaryColor}30` }}
          />
          <div
            className="w-1 h-1 rounded-full"
            style={{ backgroundColor: colors.primaryColor }}
          />
          <div
            className="h-px w-12"
            style={{ backgroundColor: `${colors.primaryColor}30` }}
          />
        </div>

        {/* Description */}
        <p
          className="text-lg sm:text-xl leading-loose opacity-80"
          style={{
            fontFamily: colors.fontFamily,
            color: colors.textColor,
          }}
        >
          {merchant.description}
        </p>
      </div>
    </section>
  );
}
