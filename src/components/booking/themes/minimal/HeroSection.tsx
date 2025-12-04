"use client";

import { HeroSectionProps } from "../types";

interface MinimalHeroSectionProps extends HeroSectionProps {
  opacity?: number;
}

export function MinimalHeroSection({ merchant, colors, onScrollToServices, opacity = 1 }: MinimalHeroSectionProps) {
  return (
    <section
      className="min-h-screen flex items-center justify-center relative px-6"
      style={{ backgroundColor: colors.backgroundColor }}
    >
      {/* Background Image with subtle overlay */}
      {merchant.cover_image_url && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${merchant.cover_image_url})`,
            opacity: opacity * 0.3,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/80 to-white/90" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 text-center max-w-3xl mx-auto">
        {/* Logo */}
        {merchant.logo_url && (
          <div className="mb-12 flex justify-center">
            <div
              className="w-32 h-32 rounded-full overflow-hidden transition-all duration-700 hover:scale-105"
              style={{
                border: `1px solid ${colors.primaryColor}20`,
                opacity: opacity,
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
          className="text-5xl sm:text-7xl font-extralight tracking-tight mb-8"
          style={{
            fontFamily: colors.fontFamily,
            color: colors.textColor,
            opacity: opacity,
          }}
        >
          {merchant.business_name}
        </h1>

        {/* Description */}
        {merchant.description && (
          <p
            className="text-lg sm:text-xl opacity-70 mb-16 max-w-2xl mx-auto leading-relaxed"
            style={{
              fontFamily: colors.fontFamily,
              color: colors.textColor,
            }}
          >
            {merchant.description}
          </p>
        )}

        {/* CTA Button - Minimal style */}
        <button
          onClick={onScrollToServices}
          className="px-10 py-4 text-base font-light tracking-wide transition-all duration-500 hover:opacity-70"
          style={{
            backgroundColor: "transparent",
            color: colors.primaryColor,
            border: `1px solid ${colors.primaryColor}`,
            borderRadius: colors.borderRadius === "full" ? "9999px" : colors.borderRadius === "none" ? "0" : "4px",
          }}
        >
          View Services
        </button>
      </div>

      {/* Subtle divider */}
      <div
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-16 h-px"
        style={{
          backgroundColor: `${colors.primaryColor}40`,
        }}
      />
    </section>
  );
}
