"use client";

import { AboutSectionProps } from "../types";

export function ClassicAboutSection({ merchant, colors }: AboutSectionProps) {
  if (!merchant.description) return null;

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-3xl mx-auto text-center">
        {/* Section Title */}
        <h2
          className="text-3xl sm:text-4xl font-serif font-bold mb-6"
          style={{ fontFamily: colors.fontFamily, color: colors.textColor }}
        >
          About Us
        </h2>

        {/* Decorative line */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-px w-12" style={{ backgroundColor: colors.primaryColor }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.primaryColor }} />
          <div className="h-px w-12" style={{ backgroundColor: colors.primaryColor }} />
        </div>

        {/* Description */}
        <p
          className="text-base sm:text-lg leading-relaxed"
          style={{ fontFamily: colors.fontFamily, color: colors.textColor, opacity: 0.85 }}
        >
          {merchant.description}
        </p>

        {/* Cover Image */}
        {merchant.cover_image_url && (
          <div className="mt-10">
            <img
              src={merchant.cover_image_url}
              alt="About us"
              className="w-full max-w-2xl mx-auto rounded-lg shadow-xl"
              style={{ border: `4px solid ${colors.primaryColor}15` }}
            />
          </div>
        )}
      </div>
    </section>
  );
}
