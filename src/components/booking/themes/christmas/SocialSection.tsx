"use client";

import { useTranslations } from "next-intl";
import { SocialSectionProps } from "../types";
import { Facebook, Instagram, Twitter, Linkedin, Youtube, Music, Globe } from "lucide-react";

export function ChristmasSocialSection({ socialLinks, colors }: SocialSectionProps) {
  const t = useTranslations("common");
  if (socialLinks.length === 0) return null;

  const getSocialIcon = (platform: string) => {
    const iconProps = { className: "w-7 h-7" };
    switch (platform.toLowerCase()) {
      case "facebook":
        return <Facebook {...iconProps} />;
      case "instagram":
        return <Instagram {...iconProps} />;
      case "twitter":
        return <Twitter {...iconProps} />;
      case "linkedin":
        return <Linkedin {...iconProps} />;
      case "youtube":
        return <Youtube {...iconProps} />;
      case "tiktok":
        return <Music {...iconProps} />;
      case "website":
        return <Globe {...iconProps} />;
      default:
        return <Globe {...iconProps} />;
    }
  };

  return (
    <section
      id="section-social"
      className="py-20 px-6"
      style={{ backgroundColor: `${colors.backgroundColor}f8` }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Festive header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-3xl">🎅</span>
            <h2
              className="text-4xl sm:text-5xl font-bold"
              style={{
                fontFamily: colors.fontFamily,
                color: colors.primaryColor,
              }}
            >
              {t("connectWithUs")}
            </h2>
            <span className="text-3xl">🎅</span>
          </div>
          <p
            className="text-lg"
            style={{
              fontFamily: colors.fontFamily,
              color: colors.secondaryColor,
            }}
          >
            {t("christmasSocialSubtitle")}
          </p>
        </div>

        {/* Social links with festive cards */}
        <div className="flex justify-center gap-6 flex-wrap">
          {socialLinks.map((link) => (
            <a
              key={link.type}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-8 rounded-2xl transition-all duration-300 hover:-translate-y-3 shadow-lg hover:shadow-2xl"
              style={{
                backgroundColor: "#fff",
                border: `3px solid ${colors.accentColor}`,
              }}
            >
              {/* Festive top border */}
              <div
                className="absolute top-0 left-0 right-0 h-2 rounded-t-2xl"
                style={{
                  background: `linear-gradient(90deg, ${colors.primaryColor}, ${colors.accentColor}, ${colors.secondaryColor})`,
                }}
              />

              {/* Icon container */}
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 shadow-md"
                style={{
                  background: `linear-gradient(135deg, ${colors.primaryColor}, ${colors.secondaryColor})`,
                  border: `3px solid ${colors.accentColor}`,
                }}
              >
                <div style={{ color: "#fff" }}>
                  {getSocialIcon(link.type)}
                </div>
              </div>

              {/* Platform name */}
              <p
                className="text-xl font-bold capitalize text-center"
                style={{
                  fontFamily: colors.fontFamily,
                  color: colors.primaryColor,
                }}
              >
                {link.type}
              </p>

              {/* Festive emoji */}
              <div className="absolute bottom-3 right-3 text-xl opacity-80 group-hover:scale-125 transition-transform duration-300">
                ⭐
              </div>
            </a>
          ))}
        </div>

        {/* Bottom decoration */}
        <div className="flex items-center justify-center gap-3 mt-16">
          <span className="text-2xl">🎁</span>
          <span className="text-2xl">❄️</span>
          <span className="text-2xl">🔔</span>
        </div>
      </div>
    </section>
  );
}
