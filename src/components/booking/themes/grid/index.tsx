"use client";

import { useEffect, useState } from "react";
import { ThemeComponentProps } from "../types";
import { GridHeroSection } from "./HeroSection";
import { GridAboutSection } from "./AboutSection";
import { GridServicesSection } from "./ServicesSection";
import { GridProductsSection } from "./ProductsSection";
import { GridGallerySection } from "./GallerySection";
import { GridContactSection } from "./ContactSection";
import { GridSocialSection } from "./SocialSection";
import { GridVideoSection } from "./VideoSection";
import { getYouTubeVideoId, scrollToElement } from "../utils";

export function GridTheme({ data, colors, cart }: ThemeComponentProps) {
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
      className="min-h-screen relative"
      style={{
        fontFamily: colors.fontFamily,
        backgroundColor: colors.backgroundColor,
      }}
    >
      {/* Grid pattern overlay */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(${colors.primaryColor} 1px, transparent 1px),
            linear-gradient(90deg, ${colors.primaryColor} 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Floating navigation dots */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 space-y-3 hidden lg:block">
        {['Hero', 'About', 'Gallery', 'Services', 'Products', 'Contact'].map((section, idx) => (
          <button
            key={section}
            onClick={() => scrollToElement(`section-${section.toLowerCase()}`)}
            className="w-3 h-3 rounded-full border-2 transition-all duration-300 hover:scale-125"
            style={{
              borderColor: colors.primaryColor,
              backgroundColor: scrollY > idx * 600 ? colors.primaryColor : 'transparent',
            }}
            aria-label={`Scroll to ${section}`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10">
        <GridHeroSection merchant={data.merchant} colors={colors} onScrollToServices={handleScrollToServices} />
        <GridAboutSection merchant={data.merchant} colors={colors} />
        <GridGallerySection gallery={data.gallery} colors={colors} />
        <GridServicesSection services={data.services} merchant={data.merchant} colors={colors} cart={cart} />
        <GridProductsSection products={data.products} merchant={data.merchant} colors={colors} cart={cart} />
        {videoId && <GridVideoSection videoUrl={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`} colors={colors} />}
        <GridContactSection merchant={data.merchant} colors={colors} />
        <GridSocialSection socialLinks={data.socialLinks} colors={colors} />
      </div>
    </div>
  );
}
