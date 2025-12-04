"use client";

import { SocialSectionProps } from "../types";
import { Facebook, Instagram, Twitter, Linkedin, Youtube, Music } from "lucide-react";

export function ModernSocialSection({ socialLinks, colors }: SocialSectionProps) {
  if (socialLinks.length === 0) return null;

  const getSocialIcon = (platform: string) => {
    const iconProps = { className: "w-6 h-6" };
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
      className="modern-section py-20 px-6"
      style={{ backgroundColor: `${colors.backgroundColor}f5` }}
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2
          className="text-4xl sm:text-5xl font-bold mb-8"
          style={{
            fontFamily: colors.fontFamily,
            background: `linear-gradient(135deg, ${colors.primaryColor}, ${colors.secondaryColor})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Follow Us
        </h2>

        <p
          className="text-lg mb-12 opacity-80"
          style={{
            fontFamily: colors.fontFamily,
            color: colors.textColor,
          }}
        >
          Stay connected with us on social media
        </p>

        <div className="flex justify-center gap-6 flex-wrap">
          {socialLinks.map((link) => (
            <a
              key={link.type}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group p-6 rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              style={{
                backgroundColor: colors.backgroundColor,
                border: `2px solid ${colors.primaryColor}20`,
              }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300"
                style={{
                  background: `linear-gradient(135deg, ${colors.primaryColor}, ${colors.secondaryColor})`,
                  boxShadow: `0 4px 20px ${colors.primaryColor}30`,
                }}
              >
                <div style={{ color: "#fff" }}>
                  {getSocialIcon(link.type)}
                </div>
              </div>
              <p
                className="mt-4 font-medium capitalize"
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
