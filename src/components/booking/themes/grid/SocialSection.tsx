"use client";

import { SocialSectionProps } from "../types";
import { SOCIAL_LINK_CONFIG } from "../shared/SocialConfig";

export function GridSocialSection({ socialLinks, colors }: SocialSectionProps) {
  if (socialLinks.length === 0) return null;

  return (
    <section
      className="py-20 px-6 relative"
      style={{
        backgroundColor: `${colors.backgroundColor}f8`,
      }}
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2
          className="text-4xl sm:text-5xl font-bold mb-6"
          style={{
            fontFamily: colors.fontFamily,
            color: colors.primaryColor,
          }}
        >
          Connect With Us
        </h2>
        <p
          className="text-lg mb-12 opacity-80"
          style={{
            fontFamily: colors.fontFamily,
            color: colors.textColor,
          }}
        >
          Follow us on social media for updates and inspiration
        </p>

        {/* Grid layout for social icons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
          {socialLinks.map((link, idx) => {
            const config = SOCIAL_LINK_CONFIG[link.type];
            const Icon = config.icon;
            const accentColors = [colors.primaryColor, colors.secondaryColor, colors.accentColor];
            const linkColor = accentColors[idx % 3];

            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-3 p-6 transition-all duration-300 hover:scale-110"
                style={{
                  backgroundColor: `${linkColor}10`,
                  borderRadius: colors.borderRadius === "full" ? "24px" : colors.borderRadius === "none" ? "0" : "16px",
                  border: `2px solid ${linkColor}30`,
                }}
              >
                <div
                  className="w-16 h-16 flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  style={{
                    backgroundColor: linkColor,
                    borderRadius: colors.borderRadius === "full" ? "50%" : colors.borderRadius === "none" ? "0" : "12px",
                  }}
                >
                  <div style={{ color: "#fff" }}>
                    <Icon className="w-8 h-8" />
                  </div>
                </div>
                <span
                  className="font-semibold text-sm capitalize"
                  style={{
                    fontFamily: colors.fontFamily,
                    color: colors.textColor,
                  }}
                >
                  {link.title}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
