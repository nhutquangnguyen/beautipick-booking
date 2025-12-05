"use client";

import { HeroSectionProps } from "../types";

export function StarterHeroSection({ merchant, colors }: HeroSectionProps) {
  return (
    <div className="flex flex-col items-center text-center py-16 sm:py-24 lg:py-32 relative min-h-[70vh] lg:min-h-[80vh] justify-center overflow-hidden">
      {/* Cover Image Background */}
      {merchant.cover_image_url && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center z-0"
            style={{
              backgroundImage: `url(${merchant.cover_image_url})`,
            }}
          />
          {/* Gradient overlay for depth */}
          <div
            className="absolute inset-0 z-0"
            style={{
              background: "linear-gradient(to bottom, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)",
            }}
          />
        </>
      )}

      {/* Decorative circles in background - Enhanced for desktop */}
      {!merchant.cover_image_url && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div
            className="absolute -top-32 -right-32 w-96 h-96 lg:w-[600px] lg:h-[600px] rounded-full opacity-10"
            style={{ backgroundColor: colors.primaryColor }}
          />
          <div
            className="absolute -bottom-32 -left-32 w-80 h-80 lg:w-[500px] lg:h-[500px] rounded-full opacity-10"
            style={{ backgroundColor: colors.primaryColor }}
          />
          {/* Additional decorative element for desktop */}
          <div
            className="hidden lg:block absolute top-1/2 left-1/4 w-40 h-40 rounded-full opacity-5"
            style={{ backgroundColor: colors.primaryColor }}
          />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4">
        {/* Profile Photo with decorative ring - Larger on desktop */}
        {merchant.logo_url && (
          <div className="mb-10 lg:mb-12 relative">
            {/* Decorative ring */}
            <div
              className="absolute inset-0 w-40 h-40 lg:w-56 lg:h-56 mx-auto rounded-full opacity-20 animate-pulse"
              style={{
                background: `radial-gradient(circle, ${colors.primaryColor}40 0%, transparent 70%)`,
                transform: 'scale(1.2)',
              }}
            />
            {/* Logo */}
            <img
              src={merchant.logo_url}
              alt={merchant.business_name}
              className="w-36 h-36 lg:w-48 lg:h-48 rounded-full object-cover mx-auto shadow-2xl border-4 lg:border-8 border-white relative z-10 transition-transform hover:scale-105 duration-300"
              style={{
                borderColor: colors.primaryColor + "15",
                boxShadow: `0 20px 40px rgba(0, 0, 0, 0.12), 0 0 0 1px ${colors.primaryColor}20`,
              }}
            />
          </div>
        )}

        {/* Business Name with decorative underline */}
        <div className="relative inline-block">
          <h1
            className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-3 lg:mb-4 tracking-tight"
            style={{ color: colors.primaryColor }}
          >
            {merchant.business_name}
          </h1>
          {/* Decorative underline - Longer on desktop */}
          <div
            className="mx-auto mt-4 lg:mt-6 h-1 lg:h-1.5 w-24 lg:w-32 rounded-full"
            style={{
              background: `linear-gradient(to right, transparent, ${colors.primaryColor}, transparent)`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
