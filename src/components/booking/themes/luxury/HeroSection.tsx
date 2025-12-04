"use client";

import { HeroSectionProps } from "../types";

export function LuxuryHeroSection({ merchant, colors, onScrollToServices }: HeroSectionProps) {
  return (
    <section className="luxury-section min-h-[60vh] md:min-h-[60vh] max-h-[70vh] md:max-h-[90vh] flex items-center justify-center relative overflow-hidden">
      {/* Animated glow overlay */}
      <div
        className="absolute inset-0 pointer-events-none animate-pulse"
        style={{
          background: `radial-gradient(circle at top right, ${colors.primaryColor}15, transparent 60%)`,
          animationDuration: '8s',
        }}
      />

      {/* Background Image */}
      {merchant.cover_image_url && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${merchant.cover_image_url})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Logo */}
        {merchant.logo_url && (
          <div className="mb-8 flex justify-center">
            <div
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden shadow-2xl"
              style={{
                border: `3px solid ${colors.primaryColor}`,
                boxShadow: `0 0 40px ${colors.primaryColor}40`,
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
          className="text-4xl sm:text-6xl lg:text-7xl font-light uppercase tracking-wider mb-6"
          style={{
            fontFamily: colors.fontFamily,
            color: merchant.cover_image_url ? "#fff" : colors.textColor,
            textShadow: merchant.cover_image_url
              ? "0 2px 20px rgba(0,0,0,0.8)"
              : "none",
          }}
        >
          {merchant.business_name}
        </h1>

        {/* Description */}
        {merchant.description && (
          <p
            className="text-lg sm:text-xl opacity-90 mb-8 max-w-2xl mx-auto leading-relaxed"
            style={{
              fontFamily: colors.fontFamily,
              color: merchant.cover_image_url ? "#fff" : colors.textColor,
              textShadow: merchant.cover_image_url
                ? "0 1px 10px rgba(0,0,0,0.8)"
                : "none",
            }}
          >
            {merchant.description}
          </p>
        )}

        {/* CTA Button */}
        <button
          onClick={onScrollToServices}
          className="px-8 py-4 text-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          style={{
            backgroundColor: colors.buttonStyle === "solid" ? colors.primaryColor : "transparent",
            color: colors.buttonStyle === "solid" ? "#fff" : colors.primaryColor,
            border: colors.buttonStyle === "outline" ? `2px solid ${colors.primaryColor}` : "none",
            borderRadius: colors.borderRadius === "full" ? "9999px" : colors.borderRadius === "none" ? "0" : "8px",
            boxShadow: `0 4px 20px ${colors.primaryColor}40`,
          }}
        >
          Explore Services
        </button>
      </div>

      {/* Gold accent line */}
      <div
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-0.5"
        style={{
          background: `linear-gradient(to right, transparent, ${colors.primaryColor}, transparent)`,
          boxShadow: `0 0 20px ${colors.primaryColor}80`,
        }}
      />
    </section>
  );
}
