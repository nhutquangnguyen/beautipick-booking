"use client";

import { useEffect, useState } from "react";
import { ThemeComponentProps } from "../types";
import { Header } from "../../Header";
import { EleganceGridHeroSection } from "./HeroSection";
import { EleganceGridAboutSection } from "./AboutSection";
import { EleganceGridServicesSection } from "./ServicesSection";
import { EleganceGridProductsSection } from "./ProductsSection";
import { EleganceGridGallerySection } from "./GallerySection";
import { EleganceGridContactSection } from "./ContactSection";
import { EleganceGridSocialSection } from "./SocialSection";
import { EleganceGridVideoSection } from "./VideoSection";
import { getYouTubeVideoId, scrollToElement } from "../utils";

// EleganceGrid Theme Colors
const ELEGANCE_COLORS = {
  primary: '#0B5345',      // Deep Teal
  secondary: '#F5F5DC',    // Warm Beige
  accent: '#C89467',       // Rose Gold
  background: '#F7F7F7',   // Off-White
  text: '#333333',         // Dark Gray
};

export function EleganceGridTheme({ data, colors, cart }: ThemeComponentProps) {
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

  // Override theme colors with EleganceGrid palette
  const eleganceColors = {
    ...colors,
    primaryColor: ELEGANCE_COLORS.primary,
    secondaryColor: ELEGANCE_COLORS.secondary,
    accentColor: ELEGANCE_COLORS.accent,
    backgroundColor: ELEGANCE_COLORS.background,
    textColor: ELEGANCE_COLORS.text,
  };

  return (
    <div
      className="min-h-screen relative"
      style={{
        fontFamily: colors.fontFamily,
        backgroundColor: ELEGANCE_COLORS.background,
      }}
    >
      {/* Fixed Header */}
      <Header
        businessName={data.merchant.business_name}
        logoUrl={data.merchant.logo_url || undefined}
        primaryColor={ELEGANCE_COLORS.primary}
        accentColor={ELEGANCE_COLORS.accent}
        onScrollToServices={handleScrollToServices}
      />

      {/* Content - with padding top to account for fixed header */}
      <div className="relative">
        <EleganceGridHeroSection merchant={data.merchant} colors={eleganceColors} onScrollToServices={handleScrollToServices} />
        <EleganceGridAboutSection merchant={data.merchant} colors={eleganceColors} />
        <EleganceGridGallerySection gallery={data.gallery} colors={eleganceColors} />
        <EleganceGridServicesSection services={data.services} merchant={data.merchant} colors={eleganceColors} cart={cart} />
        <EleganceGridProductsSection products={data.products} merchant={data.merchant} colors={eleganceColors} cart={cart} />
        {videoId && <EleganceGridVideoSection videoUrl={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`} colors={eleganceColors} />}
        <EleganceGridContactSection merchant={data.merchant} colors={eleganceColors} />
        <EleganceGridSocialSection socialLinks={data.socialLinks} colors={eleganceColors} />
      </div>
    </div>
  );
}
