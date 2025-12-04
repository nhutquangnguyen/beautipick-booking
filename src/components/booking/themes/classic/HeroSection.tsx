"use client";

import { HeroSectionProps } from "../types";

export function ClassicHeroSection({ merchant, colors, onScrollToServices }: HeroSectionProps) {
  return (
    <section className="relative bg-gradient-to-b from-gray-50 to-white py-16 sm:py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        {/* Logo */}
        {merchant.logo_url && (
          <div className="mb-8 flex justify-center">
            <div
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-lg overflow-hidden shadow-lg"
              style={{
                border: `2px solid ${colors.primaryColor}`,
              }}
            >
              <img
                src={merchant.logo_url}
                alt={merchant.business_name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Business Name */}
        <h1
          className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold mb-6"
          style={{
            fontFamily: colors.fontFamily,
            color: colors.textColor,
          }}
        >
          {merchant.business_name}
        </h1>

        {/* Decorative line */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px w-16 sm:w-24" style={{ backgroundColor: colors.primaryColor }} />
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primaryColor }} />
          <div className="h-px w-16 sm:w-24" style={{ backgroundColor: colors.primaryColor }} />
        </div>

        {/* Description */}
        {merchant.description && (
          <p
            className="text-lg sm:text-xl mb-10 max-w-2xl mx-auto leading-relaxed"
            style={{
              fontFamily: colors.fontFamily,
              color: colors.textColor,
              opacity: 0.8,
            }}
          >
            {merchant.description}
          </p>
        )}

        {/* CTA Button */}
        <button
          onClick={onScrollToServices}
          className="px-8 py-4 text-base font-semibold transition-all duration-300 hover:shadow-lg"
          style={{
            backgroundColor: colors.buttonStyle === "solid" ? colors.primaryColor : "transparent",
            color: colors.buttonStyle === "solid" ? "#fff" : colors.primaryColor,
            border: colors.buttonStyle === "outline" ? `2px solid ${colors.primaryColor}` : "none",
            borderRadius: colors.borderRadius === "none" ? "0" : "4px",
            fontFamily: colors.fontFamily,
          }}
        >
          View Our Services
        </button>
      </div>
    </section>
  );
}
