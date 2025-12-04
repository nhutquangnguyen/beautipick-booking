"use client";

import { HeroSectionProps } from "../types";

export function GridHeroSection({ merchant, colors, onScrollToServices }: HeroSectionProps) {
  return (
    <section
      id="section-hero"
      className="min-h-screen flex items-center justify-center relative overflow-hidden px-6 py-20"
    >
      {/* Grid background pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, ${colors.primaryColor} 0px, ${colors.primaryColor} 2px, transparent 2px, transparent 80px),
            repeating-linear-gradient(90deg, ${colors.primaryColor} 0px, ${colors.primaryColor} 2px, transparent 2px, transparent 80px)
          `,
        }}
      />

      {/* Background Image with grid overlay */}
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
              background: `linear-gradient(to bottom, ${colors.backgroundColor}f0, ${colors.backgroundColor}e0)`,
            }}
          />
        </div>
      )}

      {/* Content in grid layout */}
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Logo section */}
          {merchant.logo_url && (
            <div className="lg:col-span-4 flex justify-center lg:justify-start">
              <div
                className="w-48 h-48 sm:w-64 sm:h-64 overflow-hidden transform hover:scale-105 transition-all duration-500"
                style={{
                  borderRadius: colors.borderRadius === "full" ? "50%" : colors.borderRadius === "none" ? "0" : "24px",
                  boxShadow: `0 10px 40px ${colors.primaryColor}30`,
                  border: `4px solid ${colors.primaryColor}20`,
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

          {/* Text content */}
          <div className={`${merchant.logo_url ? 'lg:col-span-8' : 'lg:col-span-12'} text-center lg:text-left`}>
            <h1
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 leading-tight"
              style={{
                fontFamily: colors.fontFamily,
                color: colors.textColor,
                textShadow: merchant.cover_image_url ? `2px 2px 4px ${colors.backgroundColor}80` : 'none',
              }}
            >
              {merchant.business_name}
            </h1>

            {merchant.description && (
              <p
                className="text-lg sm:text-xl lg:text-2xl mb-8 opacity-90 leading-relaxed max-w-3xl"
                style={{
                  fontFamily: colors.fontFamily,
                  color: colors.textColor,
                }}
              >
                {merchant.description}
              </p>
            )}

            {/* Grid of info cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto lg:mx-0">
              <div
                className="p-4 backdrop-blur-sm"
                style={{
                  backgroundColor: `${colors.primaryColor}15`,
                  borderRadius: colors.borderRadius === "full" ? "9999px" : colors.borderRadius === "none" ? "0" : "12px",
                  border: `2px solid ${colors.primaryColor}30`,
                }}
              >
                <div className="text-3xl font-bold" style={{ color: colors.primaryColor }}>
                  {merchant.address?.split(',')[0] || 'Premium'}
                </div>
                <div className="text-sm opacity-70" style={{ color: colors.textColor }}>Location</div>
              </div>

              <div
                className="p-4 backdrop-blur-sm"
                style={{
                  backgroundColor: `${colors.secondaryColor}15`,
                  borderRadius: colors.borderRadius === "full" ? "9999px" : colors.borderRadius === "none" ? "0" : "12px",
                  border: `2px solid ${colors.secondaryColor}30`,
                }}
              >
                <div className="text-3xl font-bold" style={{ color: colors.secondaryColor }}>
                  {merchant.phone || 'Contact'}
                </div>
                <div className="text-sm opacity-70" style={{ color: colors.textColor }}>Phone</div>
              </div>

              <div
                className="p-4 backdrop-blur-sm"
                style={{
                  backgroundColor: `${colors.accentColor}15`,
                  borderRadius: colors.borderRadius === "full" ? "9999px" : colors.borderRadius === "none" ? "0" : "12px",
                  border: `2px solid ${colors.accentColor}30`,
                }}
              >
                <div className="text-3xl font-bold" style={{ color: colors.accentColor }}>
                  Open
                </div>
                <div className="text-sm opacity-70" style={{ color: colors.textColor }}>Today</div>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={onScrollToServices}
              className="px-10 py-5 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl"
              style={{
                backgroundColor: colors.buttonStyle === "solid" ? colors.primaryColor : "transparent",
                color: colors.buttonStyle === "solid" ? "#fff" : colors.primaryColor,
                border: colors.buttonStyle === "outline" ? `3px solid ${colors.primaryColor}` : "none",
                borderRadius: colors.borderRadius === "full" ? "9999px" : colors.borderRadius === "none" ? "0" : "12px",
              }}
            >
              Explore Services
            </button>
          </div>
        </div>
      </div>

      {/* Decorative grid elements */}
      <div className="absolute top-10 right-10 w-20 h-20 opacity-20" style={{ border: `3px solid ${colors.accentColor}` }} />
      <div className="absolute bottom-10 left-10 w-16 h-16 opacity-20" style={{ border: `3px solid ${colors.secondaryColor}` }} />
    </section>
  );
}
