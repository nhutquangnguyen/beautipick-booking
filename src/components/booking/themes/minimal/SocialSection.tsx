"use client";

import { SocialSectionProps } from "../types";
import { Facebook, Instagram, Twitter, Linkedin, Youtube, Music } from "lucide-react";

export function MinimalSocialSection({ socialLinks, colors }: SocialSectionProps) {
  if (socialLinks.length === 0) return null;

  const getSocialIcon = (platform: string) => {
    const iconProps = { className: "w-5 h-5" };
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
      className="py-32 px-6"
      style={{ backgroundColor: colors.backgroundColor }}
    >
      <div className="max-w-3xl mx-auto text-center">
        {/* Section title */}
        <h2
          className="text-3xl sm:text-4xl font-extralight tracking-wide mb-16"
          style={{
            fontFamily: colors.fontFamily,
            color: colors.textColor,
          }}
        >
          Connect
        </h2>

        {/* Social links */}
        <div className="flex justify-center gap-8 flex-wrap">
          {socialLinks.map((link) => (
            <a
              key={link.type}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group transition-all duration-500 hover:opacity-70"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500"
                style={{
                  border: `1px solid ${colors.primaryColor}30`,
                  color: colors.primaryColor,
                }}
              >
                {getSocialIcon(link.type)}
              </div>
              <p
                className="mt-3 text-xs uppercase tracking-widest opacity-60"
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
