"use client";

import { SocialSectionProps } from "../types";
import { SOCIAL_LINK_CONFIG } from "../shared/SocialConfig";

export function EleganceGridSocialSection({ socialLinks, colors }: SocialSectionProps) {
  if (socialLinks.length === 0) return null;

  return (
    <section
      className="py-20 px-6"
      style={{ backgroundColor: colors.secondaryColor }}
    >
      <div className="max-w-4xl mx-auto text-center">
        {/* Section Header */}
        <h2
          className="text-4xl sm:text-5xl font-bold mb-4"
          style={{
            fontFamily: colors.fontFamily,
            color: colors.primaryColor,
          }}
        >
          Connect With Us
        </h2>
        <div
          className="w-20 h-1 mx-auto mb-6"
          style={{ backgroundColor: colors.accentColor }}
        />
        <p
          className="text-lg mb-12"
          style={{
            fontFamily: colors.fontFamily,
            color: colors.textColor,
            opacity: 0.8,
          }}
        >
          Follow us on social media for updates and inspiration
        </p>

        {/* Social Links Grid */}
        <div className="flex flex-wrap items-center justify-center gap-6">
          {socialLinks.map((link) => {
            const config = SOCIAL_LINK_CONFIG[link.type];
            const Icon = config.icon;

            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-3 p-6 rounded-2xl transition-all duration-300 hover:scale-110 hover:-translate-y-2"
                style={{
                  backgroundColor: colors.backgroundColor,
                  boxShadow: `0 4px 20px ${colors.accentColor}15`,
                  border: `2px solid transparent`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 20px 40px ${colors.accentColor}30`;
                  e.currentTarget.style.borderColor = colors.accentColor;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = `0 4px 20px ${colors.accentColor}15`;
                  e.currentTarget.style.borderColor = 'transparent';
                }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  style={{ backgroundColor: config.color }}
                >
                  <Icon className="w-8 h-8 text-white" />
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
