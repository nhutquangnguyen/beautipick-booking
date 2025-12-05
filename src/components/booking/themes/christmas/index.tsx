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

export function ChristmasTheme({ data, colors, cart }: ThemeComponentProps) {
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
          opacity: scrollY > 100 ? 1 : 0.7,
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

      {/* Snowfall Animation Keyframes */}
      <style jsx>{`
        @keyframes snowfall {
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
          animation: snowfall linear infinite;
        }
      `}</style>
    </div>
  );
}
