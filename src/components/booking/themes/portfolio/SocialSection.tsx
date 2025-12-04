"use client";

import { SocialSectionProps } from "../types";
import { Facebook, Instagram, Twitter, Linkedin, Youtube, Music } from "lucide-react";

export function PortfolioSocialSection({ socialLinks, colors }: SocialSectionProps) {
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
      default:
        return null;
    }
  };

  return (
    <section
      id="section-social"
      className="py-24 px-6"
      style={{ backgroundColor: `${colors.backgroundColor}f5` }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Section title */}
        <div className="mb-16 text-center">
          <div
            className="w-20 h-2 mb-6 mx-auto"
            style={{
              background: `linear-gradient(90deg, ${colors.primaryColor}, ${colors.secondaryColor})`,
            }}
          />
          <h2
            className="text-5xl sm:text-6xl font-black uppercase mb-6"
            style={{
              fontFamily: colors.fontFamily,
              color: colors.textColor,
            }}
          >
            Follow Us
          </h2>
          <p
            className="text-xl font-bold opacity-80"
            style={{
              fontFamily: colors.fontFamily,
              color: colors.textColor,
            }}
          >
            Stay connected on social media
          </p>
        </div>

        {/* Social links */}
        <div className="flex justify-center gap-6 flex-wrap">
          {socialLinks.map((link) => (
            <a
              key={link.type}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group transition-all duration-300 hover:scale-110"
            >
              <div
                className="w-20 h-20 flex items-center justify-center transition-all duration-300"
                style={{
                  background: `linear-gradient(135deg, ${colors.primaryColor}, ${colors.secondaryColor})`,
                  borderRadius: colors.borderRadius === "full" ? "9999px" : colors.borderRadius === "none" ? "0" : "12px",
                  boxShadow: `0 10px 30px ${colors.primaryColor}40`,
                  color: "#fff",
                }}
              >
                {getSocialIcon(link.type)}
              </div>
              <p
                className="mt-4 text-center text-sm font-black uppercase tracking-wider"
                style={{
                  fontFamily: colors.fontFamily,
                  color: colors.textColor,
                }}
              >
                {link.type}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
