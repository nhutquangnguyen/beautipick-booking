"use client";

import { Instagram, Facebook, Youtube, Twitter, Globe } from "lucide-react";
import { SocialSectionProps } from "../types";

export function BlossomSocialSection({ socialLinks, colors }: SocialSectionProps) {
  if (socialLinks.length === 0) return null;

  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "instagram":
        return <Instagram size={24} />;
      case "facebook":
        return <Facebook size={24} />;
      case "youtube":
        return <Youtube size={24} />;
      case "twitter":
        return <Twitter size={24} />;
      case "tiktok":
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
          </svg>
        );
      default:
        return <Globe size={24} />;
    }
  };

  return (
    <section className="blossom-section py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h2
          className="text-4xl sm:text-5xl font-bold mb-12 text-center"
          style={{
            fontFamily: "'Dancing Script', cursive",
            color: colors.textColor,
          }}
        >
          Follow Us
        </h2>

        <div className="flex flex-wrap justify-center gap-4">
          {socialLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
              style={{
                backgroundColor: colors.primaryColor,
                color: "#fff",
                boxShadow: `0 4px 12px ${colors.primaryColor}40`,
              }}
              title={link.title}
            >
              {getIcon(link.type)}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
