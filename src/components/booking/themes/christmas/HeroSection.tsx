"use client";

import { useTranslations } from "next-intl";
import { HeroSectionProps } from "../types";

export function ChristmasHeroSection({ merchant, colors, onScrollToServices }: HeroSectionProps) {
  const t = useTranslations("common");
  return (
    <section className="christmas-section min-h-[85vh] flex items-center justify-center relative overflow-hidden px-6 py-20">
      {/* Festive Gradient Background */}
      <div
        className="absolute inset-0 opacity-90"
        style={{
          background: `linear-gradient(135deg, ${colors.primaryColor}30 0%, ${colors.secondaryColor}40 50%, ${colors.primaryColor}30 100%)`,
        }}
      />

      {/* Decorative Christmas Ornaments (Corner Elements) */}
      <div
        className="absolute top-10 left-10 w-20 h-20 rounded-full opacity-20 animate-pulse"
        style={{
          background: `radial-gradient(circle, ${colors.accentColor}, transparent)`,
          animationDuration: '3s',
        }}
      />
      <div
        className="absolute bottom-20 right-10 w-32 h-32 rounded-full opacity-15 animate-pulse"
        style={{
          background: `radial-gradient(circle, ${colors.secondaryColor}, transparent)`,
          animationDuration: '4s',
        }}
      />

      {/* Background Image with Christmas Overlay */}
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
              background: `linear-gradient(135deg, ${colors.primaryColor}dd 0%, ${colors.secondaryColor}dd 100%)`,
            }}
          />
        </div>
      )}

      {/* Content Container */}
      <div className="relative z-10 text-center max-w-5xl mx-auto">
        {/* Holiday Special Badge */}
        <div className="mb-8 flex justify-center animate-bounce">
          <div
            className="px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wider shadow-xl"
            style={{
              backgroundColor: colors.accentColor,
              color: colors.primaryColor,
              boxShadow: `0 8px 30px ${colors.accentColor}60`,
            }}
          >
            {t("christmasHolidaySpecial")}
          </div>
        </div>

        {/* Logo with Festive Frame */}
        {merchant.logo_url && (
          <div className="mb-10 flex justify-center animate-fade-in">
            <div className="relative">
              {/* Decorative Border */}
              <div
                className="absolute -inset-4 rounded-3xl opacity-50 blur-sm"
                style={{
                  background: `linear-gradient(45deg, ${colors.primaryColor}, ${colors.accentColor}, ${colors.secondaryColor})`,
                }}
              />
              {/* Logo Container */}
              <div
                className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300"
                style={{
                  border: `4px solid ${colors.accentColor}`,
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
          </div>
        )}

        {/* Business Name with Festive Styling */}
        <h1
          className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in drop-shadow-2xl"
          style={{
            fontFamily: colors.fontFamily,
            color: merchant.cover_image_url ? "#fff" : colors.textColor,
            textShadow: merchant.cover_image_url
              ? `0 4px 20px ${colors.primaryColor}80, 0 0 40px ${colors.accentColor}40`
              : `0 2px 10px ${colors.primaryColor}20`,
          }}
        >
          {merchant.business_name}
        </h1>

        {/* Festive Divider */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <span className="text-3xl" style={{ color: colors.primaryColor }}>🎅</span>
          <div
            className="h-1 w-20 rounded-full"
            style={{
              background: `linear-gradient(90deg, ${colors.primaryColor}, ${colors.accentColor}, ${colors.secondaryColor})`,
            }}
          />
          <span className="text-3xl" style={{ color: colors.secondaryColor }}>🎄</span>
        </div>

        {/* Description */}
        {merchant.description && (
          <p
            className="text-xl sm:text-2xl mb-10 opacity-95 leading-relaxed max-w-3xl mx-auto px-4"
            style={{
              fontFamily: colors.fontFamily,
              color: merchant.cover_image_url ? "#fff" : colors.textColor,
              textShadow: merchant.cover_image_url ? "0 2px 10px rgba(0,0,0,0.5)" : "none",
            }}
          >
            {merchant.description}
          </p>
        )}

        {/* CTA Button - Holiday Themed */}
        <button
          onClick={onScrollToServices}
          className="group relative px-12 py-5 text-xl font-bold transition-all duration-300 hover:scale-110 hover:shadow-2xl overflow-hidden"
          style={{
            backgroundColor: colors.accentColor,
            color: colors.primaryColor,
            borderRadius: colors.borderRadius === "full" ? "9999px" : "16px",
            boxShadow: `0 10px 40px ${colors.accentColor}60`,
          }}
        >
          {/* Button Shine Effect */}
          <span
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `linear-gradient(90deg, transparent, ${colors.backgroundColor}40, transparent)`,
              transform: 'translateX(-100%)',
              animation: 'shine 1.5s infinite',
            }}
          />

          <span className="relative z-10 flex items-center gap-3">
            {t("christmasBookButton")}
          </span>
        </button>

        {/* Seasonal Message */}
        <p
          className="mt-8 text-sm uppercase tracking-widest opacity-80"
          style={{
            color: merchant.cover_image_url ? "#fff" : colors.textColor,
          }}
        >
          {t("christmasSeasonalMessage")}
        </p>
      </div>

      {/* Bottom Decorative Wave */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24"
        style={{
          background: `linear-gradient(180deg, transparent 0%, ${colors.backgroundColor} 100%)`,
        }}
      />

      {/* Button Shine Animation */}
      <style jsx>{`
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
      `}</style>
    </section>
  );
}
