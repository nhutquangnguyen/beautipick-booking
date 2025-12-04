"use client";

import { AboutSectionProps } from "../types";
import { Sparkles } from "lucide-react";

export function LuxuryAboutSection({ merchant, colors }: AboutSectionProps) {
  if (!merchant.description) return null;

  // If has cover image, use split-screen layout
  if (merchant.cover_image_url) {
    return (
      <section className="luxury-section grid grid-cols-1 lg:grid-cols-2 min-h-[80vh] items-center">
        <div
          className="relative h-full min-h-[50vh] lg:min-h-[80vh] bg-cover bg-center"
          style={{ backgroundImage: `url(${merchant.cover_image_url})` }}
          role="img"
          aria-label="About us"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
        </div>

        <div className="p-8 sm:p-16" style={{ backgroundColor: colors.backgroundColor }}>
          <div className="flex items-center gap-3 mb-6">
            <div
              className="p-3 rounded-xl"
              style={{ backgroundColor: `${colors.primaryColor}15` }}
            >
              <Sparkles className="h-6 w-6" style={{ color: colors.primaryColor }} />
            </div>
            <h2
              className="text-2xl sm:text-3xl font-light uppercase tracking-widest"
              style={{ fontFamily: colors.fontFamily, color: colors.textColor }}
            >
              About Us
            </h2>
          </div>
          <p
            className="text-base sm:text-lg leading-relaxed opacity-85"
            style={{ fontFamily: colors.fontFamily, color: colors.textColor }}
          >
            {merchant.description}
          </p>
        </div>
      </section>
    );
  }

  // Default glass container layout
  return (
    <section className="luxury-section py-16 sm:py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div
          className="relative overflow-hidden rounded-3xl p-12 sm:p-10 backdrop-blur-[30px]"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
            border: `1px solid ${colors.primaryColor}15`,
            boxShadow: '0 4px 24px rgba(0,0,0,0.06), 0 16px 56px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)',
          }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div
              className="p-3 rounded-xl"
              style={{ backgroundColor: `${colors.primaryColor}15` }}
            >
              <Sparkles className="h-6 w-6" style={{ color: colors.primaryColor }} />
            </div>
            <h2
              className="text-2xl sm:text-3xl font-light uppercase tracking-widest"
              style={{ fontFamily: colors.fontFamily, color: colors.textColor }}
            >
              About Us
            </h2>
          </div>
          <p
            className="text-base sm:text-lg leading-relaxed opacity-85"
            style={{ fontFamily: colors.fontFamily, color: colors.textColor }}
          >
            {merchant.description}
          </p>

          {/* Shimmer effect */}
          <div
            className="absolute -top-1/2 -right-1/2 w-full h-full pointer-events-none animate-pulse"
            style={{
              background: `radial-gradient(circle, ${colors.primaryColor}08 0%, transparent 70%)`,
            }}
          />
        </div>
      </div>
    </section>
  );
}
