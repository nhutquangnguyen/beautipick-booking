"use client";

import { useEffect, useState } from "react";
import { ThemeComponentProps } from "../types";
import { MinimalHeroSection } from "./HeroSection";
import { MinimalAboutSection } from "./AboutSection";
import { MinimalServicesSection } from "./ServicesSection";
import { MinimalProductsSection } from "./ProductsSection";
import { MinimalGallerySection } from "./GallerySection";
import { MinimalContactSection } from "./ContactSection";
import { MinimalSocialSection } from "./SocialSection";
import { MinimalVideoSection } from "./VideoSection";
import { getYouTubeVideoId, scrollToElement } from "../utils";

export function MinimalTheme({ data, colors, cart }: ThemeComponentProps) {
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

  // Fade-in opacity based on scroll (subtle parallax)
  const headerOpacity = Math.max(1 - scrollY / 400, 0);

  return (
    <div
      className="min-h-screen scroll-smooth relative"
      style={{
        fontFamily: colors.fontFamily,
        backgroundColor: colors.backgroundColor,
        color: colors.textColor,
      }}
    >
      {/* Subtle texture overlay */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, ${colors.primaryColor}20 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        <MinimalHeroSection
          merchant={data.merchant}
          colors={colors}
          onScrollToServices={handleScrollToServices}
          opacity={headerOpacity}
        />
        <MinimalAboutSection merchant={data.merchant} colors={colors} />
        <MinimalServicesSection services={data.services} merchant={data.merchant} colors={colors} cart={cart} />
        <MinimalGallerySection gallery={data.gallery} colors={colors} />
        <MinimalProductsSection products={data.products} merchant={data.merchant} colors={colors} cart={cart} />
        {videoId && <MinimalVideoSection videoUrl={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`} colors={colors} />}
        <MinimalContactSection merchant={data.merchant} colors={colors} />
        <MinimalSocialSection socialLinks={data.socialLinks} colors={colors} />
      </div>
    </div>
  );
}
