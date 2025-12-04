"use client";

import { useEffect, useState } from "react";
import { ThemeComponentProps } from "../types";
import { ModernHeroSection } from "./HeroSection";
import { ModernAboutSection } from "./AboutSection";
import { ModernServicesSection } from "./ServicesSection";
import { ModernProductsSection } from "./ProductsSection";
import { ModernGallerySection } from "./GallerySection";
import { ModernContactSection } from "./ContactSection";
import { ModernSocialSection } from "./SocialSection";
import { ModernVideoSection } from "./VideoSection";
import { getYouTubeVideoId, scrollToElement } from "../utils";

export function ModernTheme({ data, colors, cart }: ThemeComponentProps) {
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);

      // Detect active section for navigation
      const sections = document.querySelectorAll('.modern-section');
      let current = 0;
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 150) {
          current = index;
        }
      });
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToServices = () => {
    scrollToElement('section-services');
  };

  const videoId = data.merchant.youtube_url ? getYouTubeVideoId(data.merchant.youtube_url) : null;

  return (
    <div
      className="min-h-screen scroll-smooth relative overflow-x-hidden"
      style={{
        fontFamily: colors.fontFamily,
        background: `linear-gradient(180deg, ${colors.backgroundColor} 0%, ${colors.backgroundColor}ee 100%)`,
      }}
    >
      {/* Gradient background overlay */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-30"
        style={{
          background: `
            radial-gradient(circle at 15% 20%, ${colors.primaryColor}15 0%, transparent 40%),
            radial-gradient(circle at 85% 80%, ${colors.secondaryColor}15 0%, transparent 40%),
            radial-gradient(circle at 50% 50%, ${colors.accentColor}10 0%, transparent 50%)
          `,
        }}
      />

      {/* Sticky header with gradient bar */}
      <div
        className="sticky top-0 z-50 h-1 w-full transition-opacity duration-300"
        style={{
          background: `linear-gradient(90deg, ${colors.primaryColor}, ${colors.secondaryColor}, ${colors.accentColor})`,
          opacity: scrollY > 100 ? 1 : 0,
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        <ModernHeroSection merchant={data.merchant} colors={colors} onScrollToServices={handleScrollToServices} />
        <ModernAboutSection merchant={data.merchant} colors={colors} />
        <ModernGallerySection gallery={data.gallery} colors={colors} />
        <ModernServicesSection services={data.services} merchant={data.merchant} colors={colors} cart={cart} />
        <ModernProductsSection products={data.products} merchant={data.merchant} colors={colors} cart={cart} />
        {videoId && <ModernVideoSection videoUrl={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`} colors={colors} />}
        <ModernContactSection merchant={data.merchant} colors={colors} />
        <ModernSocialSection socialLinks={data.socialLinks} colors={colors} />
      </div>
    </div>
  );
}
