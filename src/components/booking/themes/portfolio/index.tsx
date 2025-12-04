"use client";

import { useEffect, useState } from "react";
import { ThemeComponentProps } from "../types";
import { PortfolioHeroSection } from "./HeroSection";
import { PortfolioAboutSection } from "./AboutSection";
import { PortfolioServicesSection } from "./ServicesSection";
import { PortfolioProductsSection } from "./ProductsSection";
import { PortfolioGallerySection } from "./GallerySection";
import { PortfolioContactSection } from "./ContactSection";
import { PortfolioSocialSection } from "./SocialSection";
import { PortfolioVideoSection } from "./VideoSection";
import { getYouTubeVideoId, scrollToElement } from "../utils";

export function PortfolioTheme({ data, colors, cart }: ThemeComponentProps) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
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
        backgroundColor: colors.backgroundColor,
        color: colors.textColor,
      }}
    >
      {/* Bold geometric background pattern */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(45deg, ${colors.primaryColor}40 25%, transparent 25%),
            linear-gradient(-45deg, ${colors.primaryColor}40 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, ${colors.secondaryColor}40 75%),
            linear-gradient(-45deg, transparent 75%, ${colors.secondaryColor}40 75%)
          `,
          backgroundSize: '60px 60px',
          backgroundPosition: '0 0, 0 30px, 30px -30px, -30px 0px',
        }}
      />

      {/* Dynamic gradient overlay */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-20"
        style={{
          background: `
            radial-gradient(circle at 20% 30%, ${colors.primaryColor}30 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, ${colors.secondaryColor}30 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, ${colors.accentColor}20 0%, transparent 60%)
          `,
        }}
      />

      {/* Progress bar */}
      <div
        className="fixed top-0 left-0 z-50 h-1 transition-all duration-300"
        style={{
          width: `${Math.min((scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100, 100)}%`,
          background: `linear-gradient(90deg, ${colors.primaryColor}, ${colors.secondaryColor}, ${colors.accentColor})`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        <PortfolioHeroSection
          merchant={data.merchant}
          colors={colors}
          onScrollToServices={handleScrollToServices}
        />
        <PortfolioAboutSection merchant={data.merchant} colors={colors} />
        <PortfolioGallerySection gallery={data.gallery} colors={colors} />
        <PortfolioServicesSection services={data.services} merchant={data.merchant} colors={colors} cart={cart} />
        <PortfolioProductsSection products={data.products} merchant={data.merchant} colors={colors} cart={cart} />
        {videoId && <PortfolioVideoSection videoUrl={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`} colors={colors} />}
        <PortfolioContactSection merchant={data.merchant} colors={colors} />
        <PortfolioSocialSection socialLinks={data.socialLinks} colors={colors} />
      </div>
    </div>
  );
}
