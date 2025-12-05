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
import { LanguageSwitcher } from "../../LanguageSwitcher";

// EleganceGrid Theme Colors
const ELEGANCE_COLORS = {
  primary: '#0B5345',      // Deep Teal
  secondary: '#F5F5DC',    // Warm Beige
  accent: '#C89467',       // Rose Gold
  background: '#F7F7F7',   // Off-White
  text: '#333333',         // Dark Gray
};

export function EleganceGridTheme({ data, colors, cart, onOpenCart }: ThemeComponentProps) {
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

      {/* Language Switcher */}
      <LanguageSwitcher accentColor={ELEGANCE_COLORS.accent} position="top-right" />

      {/* Floating Cart Button - Elegant & Sophisticated Style */}
      {cart.cart.length > 0 && (
        <button
          onClick={onOpenCart}
          className="fixed bottom-8 right-8 w-16 h-16 rounded-full shadow-xl flex items-center justify-center transition-all duration-500 hover:scale-110 z-50 group"
          style={{
            background: `linear-gradient(135deg, ${ELEGANCE_COLORS.primary}, ${ELEGANCE_COLORS.accent})`,
            boxShadow: `0 8px 32px rgba(11, 83, 69, 0.3)`,
          }}
        >
          {/* Elegant glow ring */}
          <div
            className="absolute -inset-1 blur-md opacity-40 rounded-full transition-all duration-500 group-hover:opacity-60"
            style={{
              background: `linear-gradient(135deg, ${ELEGANCE_COLORS.accent}, ${ELEGANCE_COLORS.primary})`,
            }}
          />

          {/* Shopping Cart Icon */}
          <svg
            className="w-7 h-7 text-white relative z-10 transition-transform duration-500 group-hover:scale-110"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>

          {/* Item Count Badge - Rose Gold Accent */}
          <div
            className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-lg border-2 transition-all duration-300 group-hover:scale-110"
            style={{
              backgroundColor: ELEGANCE_COLORS.accent,
              color: '#FFFFFF',
              borderColor: ELEGANCE_COLORS.secondary,
            }}
          >
            {cart.cart.length}
          </div>

          {/* Subtle shimmer effect on hover */}
          <div
            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500"
            style={{
              background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.8) 50%, transparent 70%)',
              animation: 'shimmer 2s infinite',
            }}
          />
        </button>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) rotate(45deg);
          }
          100% {
            transform: translateX(100%) rotate(45deg);
          }
        }
      `}</style>
    </div>
  );
}
