"use client";

import { useEffect, useState } from "react";
import { ThemeComponentProps } from "../types";
import { ChristmasHeroSection } from "./HeroSection";
import { ChristmasAboutSection } from "./AboutSection";
import { ChristmasServicesSection } from "./ServicesSection";
import { ChristmasProductsSection } from "./ProductsSection";
import { ChristmasGallerySection } from "./GallerySection";
import { ChristmasContactSection } from "./ContactSection";
import { ChristmasSocialSection } from "./SocialSection";
import { ChristmasVideoSection } from "./VideoSection";
import { getYouTubeVideoId, scrollToElement } from "../utils";
import { LanguageSwitcher } from "../../LanguageSwitcher";

export function ChristmasTheme({ data, colors, cart, onOpenCart }: ThemeComponentProps) {
  const [scrollY, setScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
      }}
    >
      {/* Festive Background Pattern - Subtle Stars */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, ${colors.accentColor}40 2px, transparent 2px),
            radial-gradient(circle at 60% 70%, ${colors.accentColor}40 1px, transparent 1px),
            radial-gradient(circle at 80% 10%, ${colors.primaryColor}30 1px, transparent 1px),
            radial-gradient(circle at 40% 90%, ${colors.secondaryColor}30 2px, transparent 2px)
          `,
          backgroundSize: '100px 100px, 150px 150px, 120px 120px, 180px 180px',
        }}
      />

      {/* Animated Snowflakes - Optional CSS Animation */}
      {mounted && (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute text-white opacity-60 animate-snowfall"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-${Math.random() * 20}%`,
                fontSize: `${Math.random() * 10 + 10}px`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 10 + 10}s`,
              }}
            >
              ❄
            </div>
          ))}
        </div>
      )}

      {/* Festive Top Border */}
      <div
        className="sticky top-0 z-50 h-2 w-full transition-opacity duration-300"
        style={{
          background: `repeating-linear-gradient(
            90deg,
            ${colors.primaryColor} 0px,
            ${colors.primaryColor} 20px,
            ${colors.secondaryColor} 20px,
            ${colors.secondaryColor} 40px,
            ${colors.accentColor} 40px,
            ${colors.accentColor} 60px
          )`,
          opacity: mounted && scrollY > 100 ? 1 : 0.7,
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        <ChristmasHeroSection
          merchant={data.merchant}
          colors={colors}
          onScrollToServices={handleScrollToServices}
        />
        <ChristmasAboutSection merchant={data.merchant} colors={colors} />
        <ChristmasGallerySection gallery={data.gallery} colors={colors} />
        <ChristmasServicesSection
          services={data.services}
          merchant={data.merchant}
          colors={colors}
          cart={cart}
        />
        <ChristmasProductsSection
          products={data.products}
          merchant={data.merchant}
          colors={colors}
          cart={cart}
        />
        {videoId && (
          <ChristmasVideoSection
            videoUrl={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
            colors={colors}
          />
        )}
        <ChristmasContactSection merchant={data.merchant} colors={colors} />
        <ChristmasSocialSection socialLinks={data.socialLinks} colors={colors} />
      </div>

      {/* Language Switcher */}
      <LanguageSwitcher accentColor={colors.accentColor} position="top-right" />

      {/* Floating Cart Button - Festive Christmas Style */}
      {cart.cart.length > 0 && (
        <button
          onClick={onOpenCart}
          className="fixed bottom-8 right-8 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 z-50 group"
          style={{
            background: `linear-gradient(135deg, ${colors.primaryColor}, ${colors.secondaryColor})`,
            border: `3px solid ${colors.accentColor}`,
            animation: 'christmas-cart-jingle 2s ease-in-out infinite',
          }}
        >
          {/* Festive glow ring */}
          <div
            className="absolute -inset-2 blur-lg opacity-50 rounded-full"
            style={{
              background: `linear-gradient(135deg, ${colors.primaryColor}, ${colors.accentColor})`,
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

          {/* Item Count Badge - Gold/Holiday themed */}
          <div
            className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-lg border-2"
            style={{
              background: 'linear-gradient(135deg, #FFD700, #FFA500)',
              color: colors.primaryColor,
              borderColor: '#FFFFFF',
            }}
          >
            {cart.cart.length}
          </div>

          {/* Sparkle decoration */}
          <div className="absolute -top-1 -left-1 text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            ✨
          </div>
        </button>
      )}

      {/* Snowfall Animation Keyframes */}
      <style jsx global>{`
        @keyframes christmas-snowfall {
          0% {
            transform: translateY(-100px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0.3;
          }
        }
        .animate-snowfall {
          animation: christmas-snowfall linear infinite;
        }
        @keyframes christmas-cart-jingle {
          0%, 100% {
            transform: scale(1) rotate(0deg);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          }
          25% {
            transform: scale(1.05) rotate(-5deg);
          }
          50% {
            transform: scale(1.08) rotate(0deg);
            box-shadow: 0 15px 40px rgba(178, 34, 34, 0.5);
          }
          75% {
            transform: scale(1.05) rotate(5deg);
          }
        }
      `}</style>
    </div>
  );
}
