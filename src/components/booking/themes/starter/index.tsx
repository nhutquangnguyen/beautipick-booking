"use client";

import { useState, useEffect } from "react";
import { ThemeComponentProps } from "../types";
import { StarterHeroSection } from "./HeroSection";
import { StarterAboutSection } from "./AboutSection";
import { StarterServicesSection } from "./ServicesSection";
import { StarterProductsSection } from "./ProductsSection";
import { StarterGallerySection } from "./GallerySection";
import { StarterContactSection } from "./ContactSection";
import { StarterSocialSection } from "./SocialSection";
import { StarterVideoSection } from "./VideoSection";
import { getYouTubeVideoId } from "../utils";
import { LanguageSwitcher } from "../../LanguageSwitcher";

export function StarterTheme({ data, colors, cart, onOpenCart }: ThemeComponentProps) {
  const videoId = data.merchant.youtube_url ? getYouTubeVideoId(data.merchant.youtube_url) : null;
  const [showHeader, setShowHeader] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show header when scrolled down more than 300px (past the hero avatar)
      setShowHeader(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="min-h-screen"
      style={{
        fontFamily: colors.fontFamily,
        backgroundColor: "#FFFFFF",
        color: colors.textColor,
      }}
    >
      {/* Sticky Header - Only visible when scrolled past hero */}
      <header
        className={`sticky top-0 z-40 bg-white shadow-sm transition-all duration-300 ${
          showHeader ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
      >
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {data.merchant.logo_url && (
              <img
                src={data.merchant.logo_url}
                alt={data.merchant.business_name}
                className="w-10 h-10 rounded-full object-cover"
              />
            )}
            <span className="font-semibold text-gray-900">{data.merchant.business_name}</span>
          </div>
          <LanguageSwitcher accentColor={colors.primaryColor} position="inline" />
        </div>
      </header>

      {/* Floating Language Switcher - Only visible when header is hidden */}
      {!showHeader && (
        <LanguageSwitcher accentColor={colors.primaryColor} position="top-right" />
      )}

      {/* Hero Section - Full width to allow decorative elements */}
      <StarterHeroSection merchant={data.merchant} colors={colors} onScrollToServices={() => {}} />

      {/* Linktree-style single column layout - Wider on desktop */}
      <div className="max-w-2xl lg:max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <div className="flex flex-col gap-6 lg:gap-8">

          {data.merchant.description && (
            <StarterAboutSection merchant={data.merchant} colors={colors} />
          )}

          {videoId && (
            <StarterVideoSection
              videoUrl={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
              colors={colors}
            />
          )}

          {data.services.length > 0 && (
            <StarterServicesSection
              services={data.services}
              merchant={data.merchant}
              colors={colors}
              cart={cart}
            />
          )}

          {data.products.length > 0 && (
            <StarterProductsSection
              products={data.products}
              merchant={data.merchant}
              colors={colors}
              cart={cart}
            />
          )}

          {data.gallery.length > 0 && (
            <StarterGallerySection gallery={data.gallery} colors={colors} />
          )}

          <StarterContactSection merchant={data.merchant} colors={colors} />

          {data.socialLinks.length > 0 && (
            <StarterSocialSection socialLinks={data.socialLinks} colors={colors} />
          )}
        </div>
      </div>

      {/* Floating Cart Button - Clean & Simple Linktree Style */}
      {cart.cart.length > 0 && (
        <button
          onClick={onOpenCart}
          className="fixed bottom-8 right-8 w-16 h-16 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 z-50 group"
          style={{
            backgroundColor: colors.primaryColor,
          }}
        >
          {/* Simple glow on hover */}
          <div
            className="absolute -inset-1 blur-sm opacity-0 group-hover:opacity-50 rounded-full transition-opacity duration-300"
            style={{
              backgroundColor: colors.primaryColor,
            }}
          />

          {/* Shopping Cart Icon */}
          <svg
            className="w-7 h-7 text-white relative z-10 transition-transform duration-300 group-hover:scale-110"
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

          {/* Item Count Badge - Simple & Clean */}
          <div
            className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md border-2 border-white"
            style={{
              backgroundColor: colors.accentColor || '#FF4757',
            }}
          >
            {cart.cart.length}
          </div>
        </button>
      )}
    </div>
  );
}
