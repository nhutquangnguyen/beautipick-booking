"use client";

import { SocialSectionProps } from "../types";
import { SOCIAL_LINK_CONFIG } from "../shared/SocialConfig";

export function ClassicSocialSection({ socialLinks, colors }: SocialSectionProps) {
  if (socialLinks.length === 0) return null;

  return (
    <section className="py-12 px-6 bg-gray-50">
      <div className="max-w-3xl mx-auto text-center">
        <h3
          className="text-xl font-serif font-bold mb-6"
          style={{ fontFamily: colors.fontFamily, color: colors.textColor }}
        >
          Connect With Us
        </h3>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {socialLinks.map((link) => {
            const config = SOCIAL_LINK_CONFIG[link.type];
            const Icon = config.icon;

            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-white rounded shadow hover:shadow-md transition-shadow"
                style={{ border: `1px solid ${colors.primaryColor}20` }}
              >
                <div style={{ color: config.color }}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium" style={{ fontFamily: colors.fontFamily }}>
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
