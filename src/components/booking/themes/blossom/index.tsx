"use client";

import { useEffect, useState } from "react";
import { ThemeComponentProps } from "../types";
import { BlossomHeroSection } from "./HeroSection";
import { BlossomAboutSection } from "./AboutSection";
import { BlossomServicesSection } from "./ServicesSection";
import { BlossomProductsSection } from "./ProductsSection";
import { BlossomGallerySection } from "./GallerySection";
import { BlossomContactSection } from "./ContactSection";
import { BlossomSocialSection } from "./SocialSection";
import { BlossomVideoSection } from "./VideoSection";
import { getYouTubeVideoId, scrollToElement } from "../utils";

export function BlossomTheme({ data, colors, cart }: ThemeComponentProps) {
  const [scrollY, setScrollY] = useState(0);
  const [scrollHeight, setScrollHeight] = useState(1);

  useEffect(() => {
    const updateScrollHeight = () => {
      if (typeof document !== 'undefined') {
        setScrollHeight(Math.max(document.documentElement.scrollHeight - window.innerHeight, 1));
      }
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    updateScrollHeight();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateScrollHeight);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateScrollHeight);
    };
  }, []);

  const handleScrollToServices = () => {
    scrollToElement('section-services');
  };

  const videoId = data.merchant.youtube_url ? getYouTubeVideoId(data.merchant.youtube_url) : null;
  const scrollPercentage = Math.min((scrollY / scrollHeight) * 100, 100);

  return (
    <div
      className="min-h-screen scroll-smooth relative overflow-x-hidden"
      style={{
        fontFamily: "'Lato', sans-serif",
        background: `linear-gradient(180deg, ${colors.backgroundColor} 0%, ${colors.accentColor}10 100%)`,
      }}
    >
      {/* Soft pastel gradient background overlay */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-20"
        style={{
          background: `
            radial-gradient(circle at 20% 30%, ${colors.primaryColor}20 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, ${colors.accentColor}20 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, ${colors.secondaryColor}10 0%, transparent 60%)
          `,
        }}
      />

      {/* Soft gradient progress bar */}
      <div
        className="fixed top-0 left-0 h-1 z-50 transition-all duration-300"
        style={{
          width: `${scrollPercentage}%`,
          background: `linear-gradient(90deg, ${colors.primaryColor}, ${colors.accentColor})`,
          opacity: scrollY > 100 ? 1 : 0,
        }}
      />

      {/* Content with soft spacing */}
      <div className="relative z-10 space-y-16">
        <BlossomHeroSection merchant={data.merchant} colors={colors} onScrollToServices={handleScrollToServices} />
        <BlossomAboutSection merchant={data.merchant} colors={colors} />
        <BlossomGallerySection gallery={data.gallery} colors={colors} />
        <BlossomServicesSection services={data.services} merchant={data.merchant} colors={colors} cart={cart} />
        <BlossomProductsSection products={data.products} merchant={data.merchant} colors={colors} cart={cart} />
        {videoId && <BlossomVideoSection videoUrl={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`} colors={colors} />}
        <BlossomContactSection merchant={data.merchant} colors={colors} />
        <BlossomSocialSection socialLinks={data.socialLinks} colors={colors} />
      </div>

      {/* Add Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&family=Lato:wght@300;400;700&display=swap"
        rel="stylesheet"
      />
    </div>
  );
}
