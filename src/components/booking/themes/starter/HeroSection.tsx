"use client";

import { HeroSectionProps } from "../types";

export function StarterHeroSection({ merchant, colors }: HeroSectionProps) {
  return (
    <div className="flex flex-col items-center text-center py-8 relative min-h-[50vh] justify-center overflow-hidden">
      {/* Cover Image Background */}
      {merchant.cover_image_url && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center z-0"
            style={{
              backgroundImage: `url(${merchant.cover_image_url})`,
            }}
          />
          {/* Soft white overlay for clean aesthetic */}
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.85)",
            }}
          />
        </>
      )}

      {/* Content */}
      <div className="relative z-10">
        {/* Profile Photo */}
        {merchant.logo_url && (
          <div className="mb-6">
            <img
              src={merchant.logo_url}
              alt={merchant.business_name}
              className="w-32 h-32 rounded-full object-cover mx-auto shadow-lg border-4 border-white"
              style={{
                borderColor: colors.primaryColor + "20",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
              }}
            />
          </div>
        )}

        {/* Business Name */}
        <h1
          className="text-3xl sm:text-4xl font-semibold mb-3"
          style={{ color: colors.primaryColor }}
        >
          {merchant.business_name}
        </h1>

        {/* Description */}
        {merchant.description && (
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            {merchant.description}
          </p>
        )}
      </div>
    </div>
  );
}
