"use client";

import { useTranslations } from "next-intl";
import { HeroSectionProps } from "../types";

export function TetHolidayHeroSection({ merchant, colors, onScrollToServices }: HeroSectionProps) {
  const t = useTranslations("common");

  return (
    <section className="min-h-[85vh] flex items-center justify-center relative overflow-hidden px-6 py-20">
      {/* Elegant Tết Gradient Background - Velvet Red to Warm Cream */}
      <div
        className="absolute inset-0 opacity-95"
        style={{
          background: `linear-gradient(135deg, ${colors.primaryColor}20 0%, ${colors.secondaryColor}20 50%, ${colors.accentColor} 100%)`,
        }}
      />

      {/* Decorative Lucky Coin Pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            radial-gradient(circle at 15% 25%, ${colors.secondaryColor} 8px, transparent 8px),
            radial-gradient(circle at 55% 65%, ${colors.secondaryColor} 6px, transparent 6px),
            radial-gradient(circle at 85% 15%, ${colors.secondaryColor} 10px, transparent 10px),
            radial-gradient(circle at 35% 85%, ${colors.secondaryColor} 7px, transparent 7px)
          `,
          backgroundSize: '250px 250px, 300px 300px, 280px 280px, 320px 320px',
        }}
      />

      {/* Background Image with Tết Overlay */}
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
              background: `linear-gradient(135deg, ${colors.primaryColor}dd 0%, ${colors.primaryColor}cc 50%, ${colors.secondaryColor}aa 100%)`,
            }}
          />
        </div>
      )}

      {/* Content Container */}
      <div className="relative z-10 text-center max-w-5xl mx-auto">
        {/* Tết Greeting Badge - "Cung Chúc Tân Xuân" */}
        <div className="mb-8 flex justify-center animate-bounce">
          <div
            className="px-8 py-3 rounded-2xl font-bold text-base uppercase tracking-wider shadow-2xl border-2"
            style={{
              backgroundColor: colors.secondaryColor,
              color: colors.primaryColor,
              borderColor: colors.primaryColor,
              boxShadow: `0 8px 30px ${colors.secondaryColor}50`,
            }}
          >
            🧧 {t("tetGreeting") || "Cung Chúc Tân Xuân"} 🧧
          </div>
        </div>

        {/* Logo with Golden Fortune Frame */}
        {merchant.logo_url && (
          <div className="mb-10 flex justify-center animate-fade-in">
            <div className="relative">
              {/* Golden Glow Effect */}
              <div
                className="absolute -inset-4 rounded-3xl opacity-60 blur-md"
                style={{
                  background: `linear-gradient(45deg, ${colors.secondaryColor}, ${colors.accentColor}, ${colors.secondaryColor})`,
                }}
              />
              {/* Logo Container with Red Border */}
              <div
                className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300"
                style={{
                  border: `4px solid ${colors.secondaryColor}`,
                  boxShadow: `0 20px 60px ${colors.primaryColor}30`,
                  backgroundColor: colors.backgroundColor,
                }}
              >
                <img
                  src={merchant.logo_url}
                  alt={merchant.business_name}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Corner Decorations - Lucky Gold Coins */}
              <div className="absolute -top-3 -right-3 text-3xl animate-pulse" style={{ animationDuration: '2s' }}>
                🪙
              </div>
              <div className="absolute -bottom-3 -left-3 text-3xl animate-pulse" style={{ animationDuration: '2.5s' }}>
                🪙
              </div>
            </div>
          </div>
        )}

        {/* Business Name with Elegant Serif Typography */}
        <h1
          className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in drop-shadow-2xl"
          style={{
            fontFamily: colors.fontFamily,
            color: merchant.cover_image_url ? colors.secondaryColor : colors.primaryColor,
            textShadow: merchant.cover_image_url
              ? `0 4px 20px ${colors.primaryColor}80, 0 0 60px ${colors.secondaryColor}60`
              : `0 3px 15px ${colors.primaryColor}30`,
          }}
        >
          {merchant.business_name}
        </h1>

        {/* Elegant Divider with Peach Blossom & Apricot Blossom */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <span className="text-4xl animate-pulse" style={{ color: colors.accentColor, animationDuration: '3s' }}>✿</span>
          <div
            className="h-1 w-24 rounded-full"
            style={{
              background: `linear-gradient(90deg, ${colors.primaryColor}, ${colors.secondaryColor}, ${colors.primaryColor})`,
            }}
          />
          <span className="text-4xl animate-pulse" style={{ color: colors.secondaryColor, animationDuration: '3.5s' }}>❀</span>
        </div>

        {/* Subtitle - New Year Blessing */}
        <p
          className="text-2xl sm:text-3xl mb-6 font-serif italic"
          style={{
            color: merchant.cover_image_url ? colors.accentColor : colors.textColor,
            textShadow: merchant.cover_image_url ? '0 2px 10px rgba(0,0,0,0.7)' : 'none',
          }}
        >
          {t("tetSubtitle") || "Xuân Về - Phúc Lộc Đầy Nhà"}
        </p>

        {/* CTA Button - Luxury Lucky Gold Envelope Style */}
        <button
          onClick={onScrollToServices}
          className="group relative px-14 py-6 text-xl font-black transition-all duration-500 hover:scale-105 overflow-hidden rounded-2xl animate-pulse"
          style={{
            background: `linear-gradient(135deg, ${colors.secondaryColor} 0%, ${colors.secondaryColor}dd 50%, ${colors.accentColor} 100%)`,
            color: colors.primaryColor,
            boxShadow: `0 15px 50px ${colors.secondaryColor}70, 0 0 30px ${colors.secondaryColor}50, inset 0 -3px 15px ${colors.primaryColor}30`,
            border: `4px solid ${colors.primaryColor}`,
            animationDuration: '2s',
            textShadow: `0 2px 4px rgba(255,255,255,0.3), 0 0 10px rgba(255,255,255,0.5)`,
          }}
        >
          {/* Multi-layer Shimmer Effect */}
          <span
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            style={{
              background: 'linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.9) 50%, transparent 100%)',
              backgroundSize: '200% 100%',
              animation: 'tet-shimmer 2s ease-in-out infinite',
            }}
          />

          {/* Glowing Border Effect */}
          <span
            className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-orange-300 to-yellow-400 rounded-2xl opacity-0 group-hover:opacity-75 blur-lg transition-opacity duration-500"
          />

          {/* Button Content with Lucky Envelope Icon */}
          <span className="relative z-10 flex items-center justify-center gap-3 drop-shadow-md">
            🧧 {t("tetBookButton") || "Đặt Lịch Ngay"} 🧧
          </span>
        </button>

        {/* Seasonal Blessing Message */}
        <p
          className="mt-8 text-base uppercase tracking-widest opacity-90 font-semibold"
          style={{
            color: merchant.cover_image_url ? colors.secondaryColor : colors.primaryColor,
            textShadow: merchant.cover_image_url ? '0 2px 8px rgba(0,0,0,0.5)' : 'none',
          }}
        >
          {t("tetBlessingMessage") || "Vạn Sự Như Ý - An Khang Thịnh Vượng"}
        </p>
      </div>

      {/* Bottom Decorative Wave - Smooth Transition */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24"
        style={{
          background: `linear-gradient(180deg, transparent 0%, ${colors.backgroundColor} 100%)`,
        }}
      />

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes tet-shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
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
