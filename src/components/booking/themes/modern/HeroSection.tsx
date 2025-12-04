"use client";

import { HeroSectionProps } from "../types";

export function ModernHeroSection({ merchant, colors, onScrollToServices }: HeroSectionProps) {
  return (
    <section className="modern-section min-h-[90vh] flex items-center justify-center relative overflow-hidden px-6">
      {/* Animated gradient background */}
      <div
        className="absolute inset-0 opacity-20 animate-pulse"
        style={{
          background: `linear-gradient(135deg, ${colors.primaryColor}, ${colors.secondaryColor})`,
          animationDuration: '10s',
        }}
      />

      {/* Background Image with gradient overlay */}
      {merchant.cover_image_url && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${merchant.cover_image_url})`,
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${colors.primaryColor}cc 0%, ${colors.secondaryColor}cc 100%)`,
            }}
          />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto">
        {/* Logo */}
        {merchant.logo_url && (
          <div className="mb-10 flex justify-center animate-fade-in">
            <div
              className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300"
              style={{
                boxShadow: `0 20px 60px ${colors.primaryColor}40`,
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

        {/* Business Name with gradient text */}
        <h1
          className="text-5xl sm:text-7xl lg:text-8xl font-bold mb-6 animate-fade-in"
          style={{
            fontFamily: colors.fontFamily,
            background: merchant.cover_image_url
              ? '#fff'
              : `linear-gradient(135deg, ${colors.primaryColor}, ${colors.secondaryColor})`,
            WebkitBackgroundClip: merchant.cover_image_url ? 'unset' : 'text',
            WebkitTextFillColor: merchant.cover_image_url ? '#fff' : 'transparent',
            backgroundClip: merchant.cover_image_url ? 'unset' : 'text',
            textShadow: merchant.cover_image_url ? '0 4px 20px rgba(0,0,0,0.3)' : 'none',
          }}
        >
          {merchant.business_name}
        </h1>

        {/* Description */}
        {merchant.description && (
          <p
            className="text-xl sm:text-2xl mb-10 opacity-90 leading-relaxed max-w-3xl mx-auto"
            style={{
              fontFamily: colors.fontFamily,
              color: merchant.cover_image_url ? '#fff' : colors.textColor,
            }}
          >
            {merchant.description}
          </p>
        )}

        {/* CTA Button with gradient */}
        <button
          onClick={onScrollToServices}
          className="group px-10 py-5 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl relative overflow-hidden"
          style={{
            backgroundColor: colors.buttonStyle === "solid" ? colors.primaryColor : "transparent",
            color: colors.buttonStyle === "solid" ? "#fff" : colors.primaryColor,
            border: colors.buttonStyle === "outline" ? `2px solid ${colors.primaryColor}` : "none",
            borderRadius: colors.borderRadius === "full" ? "9999px" : colors.borderRadius === "none" ? "0" : "12px",
          }}
        >
          {/* Gradient hover effect */}
          <span
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: `linear-gradient(135deg, ${colors.primaryColor}, ${colors.secondaryColor})`,
              zIndex: -1,
            }}
          />
          <span className="relative z-10">Discover Our Services</span>
        </button>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <div
          className="w-6 h-10 border-2 rounded-full p-1 opacity-60"
          style={{ borderColor: merchant.cover_image_url ? '#fff' : colors.primaryColor }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full mx-auto"
            style={{ backgroundColor: merchant.cover_image_url ? '#fff' : colors.primaryColor }}
          />
        </div>
      </div>
    </section>
  );
}
