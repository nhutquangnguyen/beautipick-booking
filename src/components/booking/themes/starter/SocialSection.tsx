"use client";

import { useState } from "react";
import { SocialSectionProps } from "../types";
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Globe,
  MessageCircle,
  Music,
  Send,
  LucideIcon,
} from "lucide-react";

// Custom Zalo icon component - Official Zalo logo
const ZaloIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 4C12.96 4 4 12.96 4 24c0 6.28 2.92 11.88 7.48 15.52L9.6 44l5.76-2.6C17.84 42.44 20.84 43.2 24 43.2c11.04 0 20-8.96 20-19.2C44 12.96 35.04 4 24 4z" fill="currentColor"/>
    <path d="M31.68 28.8h-5.76l-3.84 3.84v-3.84h-2.88c-1.6 0-2.88-1.28-2.88-2.88v-7.68c0-1.6 1.28-2.88 2.88-2.88h12.48c1.6 0 2.88 1.28 2.88 2.88v7.68c0 1.6-1.28 2.88-2.88 2.88z" fill="white"/>
    <path d="M21.12 21.12h1.92v1.92h-1.92v-1.92zm3.84 0h1.92v1.92h-1.92v-1.92zm3.84 0h1.92v1.92h-1.92v-1.92z" fill="currentColor"/>
  </svg>
);

const socialIconMap: Record<string, LucideIcon | typeof ZaloIcon> = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
  youtube: Youtube,
  tiktok: Music,
  whatsapp: Send,
  zalo: ZaloIcon,
  website: Globe,
};

const socialColorMap: Record<string, string> = {
  facebook: "#1877F2",
  instagram: "#E4405F",
  twitter: "#1DA1F2",
  linkedin: "#0A66C2",
  youtube: "#FF0000",
  tiktok: "#000000",
  whatsapp: "#25D366",
  zalo: "#0068FF",
  website: "#6B7280",
};

export function StarterSocialSection({ socialLinks, colors }: SocialSectionProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (socialLinks.length === 0) return null;

  return (
    <div className="w-full py-8">
      {/* Social Icons Row */}
      <div className="flex justify-center items-center gap-4 flex-wrap">
        {socialLinks.map((link, index) => {
          const Icon = socialIconMap[link.type] || Globe;
          const socialColor = socialColorMap[link.type] || colors.primaryColor;
          const linkId = link.id || `${link.type}-${index}`;
          const isHovered = hoveredId === linkId;

          return (
            <a
              key={linkId}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setHoveredId(linkId)}
              onMouseLeave={() => setHoveredId(null)}
              className="w-12 h-12 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200"
              style={{
                backgroundColor: isHovered ? socialColor : '#F3F4F6',
                transform: isHovered ? 'scale(1.1)' : 'scale(1)',
              }}
              aria-label={link.type}
            >
              <Icon
                className="w-6 h-6"
                style={{ color: isHovered ? '#FFFFFF' : socialColor }}
              />
            </a>
          );
        })}
      </div>
    </div>
  );
}
