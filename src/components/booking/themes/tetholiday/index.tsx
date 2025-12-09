"use client";

import { useEffect, useState } from "react";
import { ThemeComponentProps } from "../types";
import { TetHolidayHeroSection } from "./HeroSection";
import { TetHolidayAboutSection } from "./AboutSection";
import { TetHolidayServicesSection } from "./ServicesSection";
import { TetHolidayProductsSection } from "./ProductsSection";
import { TetHolidayGallerySection } from "./GallerySection";
import { TetHolidayContactSection } from "./ContactSection";
import { TetHolidaySocialSection } from "./SocialSection";
import { TetHolidayVideoSection } from "./VideoSection";
import { getYouTubeVideoId, scrollToElement } from "../utils";
import { LanguageSwitcher } from "../../LanguageSwitcher";
import { Header } from "../../Header";

export function TetHolidayTheme({ data, colors, cart, onOpenCart }: ThemeComponentProps) {
  const [scrollY, setScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [showHeader, setShowHeader] = useState(false);
  const [isFullGalleryOpen, setIsFullGalleryOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setShowHeader(window.scrollY > 300);
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
      }}
    >
      {/* Elegant Lucky Coin Pattern Background */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-8"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, ${colors.secondaryColor}30 8px, transparent 8px),
            radial-gradient(circle at 60% 70%, ${colors.secondaryColor}30 6px, transparent 6px),
            radial-gradient(circle at 80% 10%, ${colors.primaryColor}20 8px, transparent 8px),
            radial-gradient(circle at 40% 90%, ${colors.secondaryColor}30 7px, transparent 7px)
          `,
          backgroundSize: '200px 200px, 250px 250px, 220px 220px, 280px 280px',
        }}
      />

      {/* Animated Falling Flowers (Mai - Apricot & Đào - Peach Blossoms) - Fixed position */}
      {mounted && (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          {[...Array(25)].map((_, i) => {
            // Alternate between secondary (mai/apricot) and accent (đào/peach) flowers
            const isSecondary = i % 2 === 0;
            const flower = isSecondary ? '❀' : '✿';
            const color = isSecondary ? colors.secondaryColor : colors.accentColor;
            const size = 15 + (i % 3) * 8; // 15px, 23px, 31px
            const leftPosition = (i * 4) % 100; // Evenly distributed

            return (
              <div
                key={i}
                className="absolute opacity-60 animate-tet-petal-fall"
                style={{
                  left: `${leftPosition}%`,
                  top: '-10%',
                  fontSize: `${size}px`,
                  color: color,
                  animationDelay: `${i * 0.8}s`,
                  animationDuration: '15s',
                  filter: `drop-shadow(0 2px 4px ${colors.primaryColor}30)`,
                }}
              >
                {flower}
              </div>
            );
          })}
        </div>
      )}

      {/* Sticky Header with Golden Border */}
      {showHeader && !isFullGalleryOpen && (
        <div className="fixed top-0 left-0 right-0 z-50 animate-slide-down">
          {/* Golden Top Border with Red Accent */}
          <div
            className="h-2 w-full"
            style={{
              background: `repeating-linear-gradient(
                90deg,
                ${colors.primaryColor} 0px,
                ${colors.primaryColor} 20px,
                ${colors.secondaryColor} 20px,
                ${colors.secondaryColor} 40px,
                ${colors.primaryColor} 40px,
                ${colors.primaryColor} 60px
              )`,
            }}
          />

          <Header
            businessName={data.merchant.business_name}
            logoUrl={data.merchant.logo_url || undefined}
            primaryColor={colors.primaryColor}
            accentColor={colors.secondaryColor}
            secondaryColor={colors.accentColor}
            backgroundColor={colors.accentColor}
            onScrollToServices={handleScrollToServices}
          />
        </div>
      )}

      {/* Floating Language Switcher */}
      {!showHeader && (
        <LanguageSwitcher accentColor={colors.secondaryColor} primaryColor={colors.primaryColor} position="top-right" />
      )}

      {/* Content */}
      <div className="relative z-10">
        <TetHolidayHeroSection
          merchant={data.merchant}
          colors={colors}
          onScrollToServices={handleScrollToServices}
        />
        <TetHolidayAboutSection merchant={data.merchant} colors={colors} />
        <TetHolidayGallerySection
          gallery={data.gallery}
          colors={colors}
          onFullGalleryChange={setIsFullGalleryOpen}
        />
        <div id="services-section">
          <TetHolidayServicesSection
            services={data.services}
            merchant={data.merchant}
            colors={colors}
            cart={cart}
          />
        </div>
        <div id="products-section">
          <TetHolidayProductsSection
            products={data.products}
            merchant={data.merchant}
            colors={colors}
            cart={cart}
          />
        </div>
        {videoId && (
          <TetHolidayVideoSection
            videoUrl={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
            colors={colors}
          />
        )}
        <div id="contact-section">
          <TetHolidayContactSection merchant={data.merchant} colors={colors} />
        </div>
        <TetHolidaySocialSection socialLinks={data.socialLinks} colors={colors} />
      </div>

      {/* Floating Cart Button - Lucky Envelope Style */}
      {cart.cart.length > 0 && (
        <button
          onClick={onOpenCart}
          className="fixed bottom-8 right-8 w-16 h-16 rounded-2xl shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 z-50 group"
          style={{
            background: `linear-gradient(135deg, ${colors.secondaryColor}, ${colors.accentColor})`,
            border: `3px solid ${colors.primaryColor}`,
            animation: 'tet-cart-pulse 2s ease-in-out infinite',
          }}
        >
          {/* Golden glow ring */}
          <div
            className="absolute -inset-2 blur-lg opacity-60 rounded-2xl"
            style={{
              background: `linear-gradient(135deg, ${colors.secondaryColor}, ${colors.accentColor})`,
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }}
          />

          {/* Shopping Cart Icon */}
          <svg
            className="w-7 h-7 relative z-10 transition-transform duration-300 group-hover:scale-110"
            fill="none"
            stroke={colors.primaryColor}
            viewBox="0 0 24 24"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>

          {/* Item Count Badge - Red Envelope Style */}
          <div
            className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-lg border-2"
            style={{
              background: `linear-gradient(135deg, ${colors.primaryColor}, ${colors.primaryColor}dd)`,
              color: colors.secondaryColor,
              borderColor: colors.secondaryColor,
            }}
          >
            {cart.cart.length}
          </div>

          {/* Lucky coin decoration */}
          <div className="absolute -top-1 -left-1 text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            🪙
          </div>
        </button>
      )}

      {/* Animation Keyframes */}
      <style jsx global>{`
        /* Falling Petals Animation - Smooth & Consistent */
        @keyframes tet-petal-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.7;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(110vh) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-tet-petal-fall {
          animation: tet-petal-fall linear infinite;
        }

        /* Cart Button Pulse - Lucky Glow */
        @keyframes tet-cart-pulse {
          0%, 100% {
            transform: scale(1) rotate(0deg);
            box-shadow: 0 10px 30px ${colors.secondaryColor}40, 0 0 20px ${colors.primaryColor}30;
          }
          25% {
            transform: scale(1.05) rotate(-3deg);
          }
          50% {
            transform: scale(1.08) rotate(0deg);
            box-shadow: 0 15px 40px ${colors.secondaryColor}60, 0 0 30px ${colors.primaryColor}50;
          }
          75% {
            transform: scale(1.05) rotate(3deg);
          }
        }

        /* Header Slide Down */
        @keyframes slide-down {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
