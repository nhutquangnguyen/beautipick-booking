"use client";

import { useTranslations } from "next-intl";
import { SocialSectionProps } from "../types";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  Globe,
  MessageCircle,
} from "lucide-react";

const socialIcons: Record<string, React.ElementType> = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
  linkedin: Linkedin,
  website: Globe,
  tiktok: MessageCircle,
  whatsapp: MessageCircle,
  zalo: MessageCircle,
  telegram: MessageCircle,
  shopee: Globe,
};

export function TetHolidaySocialSection({ socialLinks, colors }: SocialSectionProps) {
  const t = useTranslations("common");

  const validLinks = socialLinks.filter((link) => link.url);
  if (validLinks.length === 0) return null;

  return (
    <section
      className="py-20 px-6 relative overflow-hidden"
      style={{ backgroundColor: colors.backgroundColor }}
    >
      {/* Decorative pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 40%, ${colors.secondaryColor} 5px, transparent 5px)`,
          backgroundSize: '180px 180px',
        }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header: "Kết Nối May Mắn" */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-4xl">🏮</span>
            <h2
              className="text-4xl sm:text-5xl font-bold"
              style={{
                fontFamily: colors.fontFamily,
                color: colors.primaryColor,
              }}
            >
              {t("connectWithUs")}
            </h2>
            <span className="text-4xl">🏮</span>
          </div>
          <p
            className="text-lg font-serif italic"
            style={{ color: colors.textColor }}
          >
            {t("tetSocialSubtitle") || "Kết Nối May Mắn"}
          </p>

          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <span className="text-2xl">🌸</span>
            <div
              className="h-px w-24"
              style={{
                background: `linear-gradient(90deg, transparent, ${colors.secondaryColor}, transparent)`,
              }}
            />
            <span className="text-2xl">🧧</span>
            <div
              className="h-px w-24"
              style={{
                background: `linear-gradient(90deg, transparent, ${colors.secondaryColor}, transparent)`,
              }}
            />
            <span className="text-2xl">✿</span>
          </div>
        </div>

        {/* Social Icons - Horizontal Layout with Mini Bloom Effect */}
        <div className="flex flex-wrap justify-center gap-8">
          {validLinks.map((link) => {
            const Icon = socialIcons[link.type];
            if (!Icon) return null;

            return (
              <a
                key={link.type}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-3 transition-all duration-300 ease-out"
              >
                {/* Icon Container - Red Velvet Circle with Golden Aura on Hover */}
                <div className="relative">
                  {/* Golden Aura - Appears on hover (Mini Bloom) */}
                  <div
                    className="absolute -inset-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out blur-md"
                    style={{
                      background: `radial-gradient(circle, ${colors.secondaryColor}99, transparent 70%)`,
                      boxShadow: `0 0 30px ${colors.secondaryColor}80`,
                    }}
                  />

                  {/* Main Icon Circle */}
                  <div
                    className="relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ease-out group-hover:scale-110 shadow-lg group-hover:shadow-yellow-200/50"
                    style={{
                      background: `linear-gradient(135deg, ${colors.primaryColor}, ${colors.primaryColor}dd)`,
                      border: `3px solid ${colors.secondaryColor}`,
                      boxShadow: `0 8px 25px ${colors.primaryColor}4D`,
                    }}
                  >
                    {/* Icon - Golden Color */}
                    <Icon
                      className="w-9 h-9 transition-all duration-300 ease-out group-hover:scale-105"
                      style={{ color: colors.secondaryColor }}
                    />

                    {/* Inner glow on hover */}
                    <div
                      className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-300"
                      style={{
                        background: `radial-gradient(circle, ${colors.secondaryColor}, transparent)`,
                      }}
                    />
                  </div>

                  {/* Sparkle decoration on hover - Top right */}
                  <div
                    className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:rotate-12"
                    style={{
                      background: `linear-gradient(135deg, ${colors.secondaryColor}, ${colors.accentColor})`,
                      border: `2px solid ${colors.primaryColor}`,
                      boxShadow: `0 2px 8px ${colors.secondaryColor}80`,
                    }}
                  >
                    <span className="text-xs">✨</span>
                  </div>
                </div>

                {/* Platform Name - Appears with fade-in on hover */}
                <span
                  className="text-sm font-bold capitalize transition-all duration-300 opacity-70 group-hover:opacity-100 group-hover:scale-105"
                  style={{
                    fontFamily: colors.fontFamily,
                    color: colors.primaryColor,
                  }}
                >
                  {link.type}
                </span>

                {/* Bottom decoration line - Expands on hover */}
                <div
                  className="h-0.5 w-0 group-hover:w-16 transition-all duration-300 rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${colors.primaryColor}, ${colors.secondaryColor}, ${colors.primaryColor})`,
                  }}
                />
              </a>
            );
          })}
        </div>

        {/* Call-to-Action Message */}
        <div
          className="text-center mt-16 p-8 rounded-3xl relative overflow-hidden"
          style={{
            backgroundColor: `${colors.accentColor}1A`,
            border: `2px solid ${colors.secondaryColor}`,
          }}
        >
          <p
            className="text-xl font-bold mb-2"
            style={{
              fontFamily: colors.fontFamily,
              color: colors.primaryColor,
            }}
          >
            {t("tetSocialTitle") || "Theo Dõi Chúng Tôi Để Nhận Ưu Đãi Tết"}
          </p>
          <p
            className="text-sm opacity-80"
            style={{ color: colors.textColor }}
          >
            {t("tetSocialSubtitle") || "Cập nhật thông tin mới nhất và nhận lì xì đặc biệt"}
          </p>

          {/* Decorative emojis */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <span className="text-2xl animate-bounce" style={{ animationDuration: '2s' }}>🎁</span>
            <span className="text-2xl animate-bounce" style={{ animationDuration: '2.2s', animationDelay: '0.2s' }}>🧧</span>
            <span className="text-2xl animate-bounce" style={{ animationDuration: '2.4s', animationDelay: '0.4s' }}>🎊</span>
          </div>
        </div>

        {/* Decorative footer flourish */}
        <div className="flex items-center justify-center gap-3 mt-12">
          <span className="text-xl">✿</span>
          <div
            className="h-px w-16"
            style={{
              background: `linear-gradient(90deg, transparent, ${colors.secondaryColor}, transparent)`,
            }}
          />
          <span className="text-2xl">🏮</span>
          <div
            className="h-px w-16"
            style={{
              background: `linear-gradient(90deg, transparent, ${colors.secondaryColor}, transparent)`,
            }}
          />
          <span className="text-xl">❀</span>
        </div>
      </div>
    </section>
  );
}
