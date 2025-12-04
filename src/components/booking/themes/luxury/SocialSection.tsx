"use client";

import { SocialSectionProps } from "../types";
import { SOCIAL_LINK_CONFIG } from "../shared/SocialConfig";

export function LuxurySocialSection({ socialLinks, colors }: SocialSectionProps) {
  if (socialLinks.length === 0) return null;

  return (
    <section className="luxury-section py-16 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2
          className="text-xl sm:text-2xl font-light uppercase tracking-widest mb-8"
          style={{ fontFamily: colors.fontFamily, color: colors.textColor }}
        >
          Connect With Us
        </h2>

        <div className="flex flex-wrap items-center justify-center gap-4">
          {socialLinks.map((link) => {
            const config = SOCIAL_LINK_CONFIG[link.type];
            const Icon = config.icon;

            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-5 py-3 transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  backgroundColor: `${colors.primaryColor}08`,
                  borderRadius: colors.borderRadius === "full" ? "9999px" : "12px",
                  border: `1px solid ${colors.primaryColor}15`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${colors.primaryColor}15`;
                  e.currentTarget.style.boxShadow = `0 8px 20px ${colors.primaryColor}20`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = `${colors.primaryColor}08`;
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ color: config.color }}>
                  <Icon className="h-5 w-5" />
                </div>
                <span
                  className="font-medium text-sm"
                  style={{ fontFamily: colors.fontFamily, color: colors.textColor }}
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
