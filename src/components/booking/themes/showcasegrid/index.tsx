"use client";

import { ThemeComponentProps } from "../types";
import { Header } from "../../Header";
import { ShowcaseGridHeroSection } from "./HeroSection";
import { ShowcaseGridAboutSection } from "./AboutSection";
import { ShowcaseGridVideoSection } from "./VideoSection";
import { ShowcaseGridGallerySection } from "./GallerySection";
import { ShowcaseGridWorkSection } from "./WorkSection";
import { ShowcaseGridProductsSection } from "./ProductsSection";
import { ShowcaseGridContactSection } from "./ContactSection";
import { ShowcaseColors } from "@/config/ShowcaseColors";
import { LanguageSwitcher } from "../../LanguageSwitcher";

export function ShowcaseGridTheme({ data, colors, cart, locale, currency, onOpenCart }: ThemeComponentProps) {
  // Override with Showcase Grid color palette using constants
  const showcaseColors = {
    ...colors,
    primaryColor: ShowcaseColors.primary,      // Deep Charcoal
    secondaryColor: ShowcaseColors.secondary,  // Light Gray
    accentColor: ShowcaseColors.accent,        // Vibrant Blue
    backgroundColor: "#FFFFFF",                 // White
    textColor: ShowcaseColors.text,            // Deep Charcoal
    fontFamily: "Inter",
  };

  const scrollToServices = () => {
    const element = document.getElementById("section-services");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: showcaseColors.backgroundColor }}>
      {/* Fixed High-Contrast Header */}
      <Header
        businessName={data.merchant.business_name}
        logoUrl={data.merchant.logo_url || undefined}
        primaryColor={showcaseColors.primaryColor}
        accentColor={showcaseColors.accentColor}
        onScrollToServices={scrollToServices}
      />

      {/* Hero Section - Premium 70vh Slideshow */}
      <ShowcaseGridHeroSection
        merchant={data.merchant}
        colors={showcaseColors}
        onScrollToServices={scrollToServices}
      />

      {/* About Section - Trust Building (ngay sau Hero) */}
      <ShowcaseGridAboutSection
        merchant={data.merchant}
        colors={showcaseColors}
      />

      {/* Video Section - Watch Our Story */}
      {data.merchant.youtube_url && (
        <ShowcaseGridVideoSection
          videoUrl={data.merchant.youtube_url}
          colors={showcaseColors}
        />
      )}

      {/* Gallery Section - Premium Bento Box Layout */}
      {data.gallery && data.gallery.length > 0 && (
        <ShowcaseGridGallerySection
          gallery={data.gallery}
          colors={showcaseColors}
        />
      )}

      {/* Work/Services Section - Alternating Layout */}
      {data.services && data.services.length > 0 && (
        <ShowcaseGridWorkSection
          services={data.services}
          colors={showcaseColors}
          cart={cart}
          locale={locale}
          currency={currency}
        />
      )}

      {/* Products Section - Premium Card Grid */}
      {data.products && data.products.length > 0 && (
        <ShowcaseGridProductsSection
          products={data.products}
          merchant={data.merchant}
          colors={showcaseColors}
          cart={cart}
        />
      )}

      {/* Contact Section - Form & Info */}
      <ShowcaseGridContactSection
        merchant={data.merchant}
        colors={showcaseColors}
      />

      {/* Language Switcher */}
      <LanguageSwitcher accentColor={showcaseColors.accentColor} position="top-right" />

      {/* Floating Cart Button */}
      {cart.cart.length > 0 && (
        <button
          onClick={onOpenCart}
          className="fixed bottom-8 right-8 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 z-50 group"
          style={{
            backgroundColor: showcaseColors.accentColor,
            animation: 'cart-pulse 2s ease-in-out infinite',
          }}
        >
          {/* Glow ring */}
          <div
            className="absolute -inset-2 blur-lg opacity-50"
            style={{
              backgroundColor: showcaseColors.accentColor,
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
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

          {/* Item Count Badge */}
          <div
            className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg border-2 border-white"
            style={{
              backgroundColor: '#FF4757',
            }}
          >
            {cart.cart.length}
          </div>
        </button>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes cart-pulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 15px 40px rgba(59, 130, 246, 0.5);
          }
        }
      `}</style>
    </div>
  );
}
