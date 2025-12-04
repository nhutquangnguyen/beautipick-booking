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
  LucideIcon,
} from "lucide-react";

const socialIconMap: Record<string, LucideIcon> = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
  youtube: Youtube,
  tiktok: Music,
  whatsapp: MessageCircle,
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
  website: "#6B7280",
};

export function StarterSocialSection({ socialLinks, colors }: SocialSectionProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (socialLinks.length === 0) return null;

  return (
    <div className="w-full py-8">
      {/* Social Icons Row */}
      <div className="flex justify-center items-center gap-4 flex-wrap">
        {socialLinks.map((link) => {
          const Icon = socialIconMap[link.type] || Globe;
          const socialColor = socialColorMap[link.type] || colors.primaryColor;
          const isHovered = hoveredId === link.id;

          return (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setHoveredId(link.id)}
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
