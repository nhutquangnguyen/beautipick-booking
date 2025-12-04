"use client";

import { HeroSectionProps } from "../types";

export function BlossomHeroSection({ merchant, colors, onScrollToServices }: HeroSectionProps) {
  return (
    <section className="blossom-section min-h-[85vh] flex items-center justify-center relative overflow-hidden px-6 py-16">
      {/* Cover Image Background */}
      {merchant.cover_image_url && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${merchant.cover_image_url})`,
          }}
        >
          {/* Soft pastel gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${colors.primaryColor}dd 0%, ${colors.backgroundColor}ee 50%, ${colors.accentColor}cc 100%)`,
            }}
          />
        </div>
      )}

      {/* Soft gradient background (fallback if no cover image) */}
      {!merchant.cover_image_url && (
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background: `linear-gradient(135deg, ${colors.backgroundColor} 0%, ${colors.accentColor}20 50%, ${colors.primaryColor}15 100%)`,
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Circular Logo with soft pink border and gentle floating animation */}
        {merchant.logo_url && (
          <div className="mb-8 flex justify-center">
            <div
              className="w-40 h-40 rounded-full overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
              style={{
                border: `4px solid ${colors.primaryColor}`,
                boxShadow: `0 10px 30px ${colors.primaryColor}40`,
                animation: "float 3s ease-in-out infinite",
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

        {/* Business Name in Dancing Script font */}
        <h1
          className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6"
          style={{
            fontFamily: "'Dancing Script', cursive",
            color: merchant.cover_image_url ? "#FFFFFF" : colors.textColor,
            textShadow: merchant.cover_image_url
              ? "0 4px 20px rgba(0, 0, 0, 0.4), 0 2px 10px rgba(0, 0, 0, 0.3)"
              : `0 2px 10px ${colors.primaryColor}20`,
          }}
        >
          {merchant.business_name}
        </h1>

        {/* Description text in Lato */}
        {merchant.description && (
          <p
            className="text-lg sm:text-xl mb-10 leading-relaxed max-w-2xl mx-auto opacity-90"
            style={{
              fontFamily: "'Lato', sans-serif",
              color: merchant.cover_image_url ? "#FFFFFF" : colors.textColor,
              textShadow: merchant.cover_image_url ? "0 2px 10px rgba(0, 0, 0, 0.3)" : "none",
            }}
          >
            {merchant.description}
          </p>
        )}

        {/* Rounded CTA button with rose gold */}
        <button
          onClick={onScrollToServices}
          className="px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl"
          style={{
            fontFamily: "'Lato', sans-serif",
            backgroundColor: colors.accentColor,
            color: "#fff",
            borderRadius: "9999px",
            boxShadow: `0 8px 20px ${colors.accentColor}40`,
          }}
        >
          Explore Our Services
        </button>
      </div>

      {/* Gentle scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <div
          className="w-6 h-10 border-2 rounded-full p-1 opacity-50"
          style={{ borderColor: colors.primaryColor }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full mx-auto"
            style={{ backgroundColor: colors.primaryColor }}
          />
        </div>
      </div>
    </section>
  );
}
