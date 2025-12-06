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
          showHeader ? "translate-y-0 opacity-100" : "hidden"
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
          <div className="flex items-center gap-3">
            <LanguageSwitcher accentColor={colors.primaryColor} position="inline" />
            {cart.cart.length > 0 && (
              <button
                onClick={onOpenCart}
                className="relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 group"
                style={{
                  backgroundColor: colors.primaryColor,
                }}
              >
                <svg
                  className="w-5 h-5 text-white"
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
                <div
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md border-2 border-white"
                  style={{
                    backgroundColor: colors.accentColor || '#FF4757',
                  }}
                >
                  {cart.cart.length}
                </div>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Floating Language Switcher & Cart - Only visible when header is hidden */}
      {!showHeader && (
        <>
          {cart.cart.length > 0 ? (
            <div className="fixed top-8 right-8 z-50 flex items-center gap-3">
              <LanguageSwitcher accentColor={colors.primaryColor} position="inline" />
              <button
                onClick={onOpenCart}
                className="relative w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                style={{
                  backgroundColor: colors.primaryColor,
                }}
              >
                <svg
                  className="w-6 h-6 text-white"
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
                <div
                  className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md border-2 border-white"
                  style={{
                    backgroundColor: colors.accentColor || '#FF4757',
                  }}
                >
                  {cart.cart.length}
                </div>
              </button>
            </div>
          ) : (
            <LanguageSwitcher accentColor={colors.primaryColor} position="top-right" />
          )}
        </>
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
    </div>
  );
}
