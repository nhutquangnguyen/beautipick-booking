"use client";

import { useEffect, useState } from "react";
import { ThemeComponentProps } from "../types";
import { LuxuryHeroSection } from "./HeroSection";
import { LuxuryAboutSection } from "./AboutSection";
import { LuxuryServicesSection } from "./ServicesSection";
import { LuxuryProductsSection } from "./ProductsSection";
import { LuxuryGallerySection } from "./GallerySection";
import { LuxuryContactSection } from "./ContactSection";
import { LuxurySocialSection } from "./SocialSection";
import { LuxuryVideoSection } from "./VideoSection";
import { getYouTubeVideoId, scrollToElement } from "../utils";

export function LuxuryTheme({ data, colors, cart }: ThemeComponentProps) {
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);

      // Detect active section for navigation
      const sections = document.querySelectorAll('.luxury-section');
      let current = 0;
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100) {
          current = index;
        }
      });
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Parallax transform based on scroll
  const parallaxTransform = `translateY(${scrollY * 0.5}px)`;
  const parallaxOpacity = Math.max(1 - scrollY / 600, 0);

  const handleScrollToServices = () => {
    scrollToElement('section-services');
  };

  const videoId = data.merchant.youtube_url ? getYouTubeVideoId(data.merchant.youtube_url) : null;

  return (
    <div
      className="min-h-screen scroll-smooth relative overflow-x-hidden bg-gradient-to-b from-neutral-50 via-neutral-100 to-neutral-50"
      style={{ fontFamily: colors.fontFamily }}
    >
      {/* Ambient background effects */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-40 animate-pulse"
        style={{
          background: `
            radial-gradient(circle at 20% 30%, ${colors.primaryColor}08 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, ${colors.secondaryColor}06 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, ${colors.accentColor}04 0%, transparent 70%)
          `,
          animationDuration: '20s',
        }}
      />

      {/* Floating side navigation dots */}
      <nav
        className="fixed right-8 top-1/2 -translate-y-1/2 z-[100] hidden lg:flex flex-col gap-4 opacity-0 animate-fade-in-delayed"
        aria-label="Page sections"
      >
        {[0, 1, 2, 3, 4].map((index) => (
          <button
            key={index}
            className={`
              w-3 h-3 rounded-full border-2 transition-all duration-300 ease-out cursor-pointer relative
              hover:scale-125
              ${activeSection === index ? 'scale-125' : ''}
            `}
            style={{
              borderColor: activeSection === index ? colors.primaryColor : `${colors.primaryColor}30`,
              backgroundColor: activeSection === index ? colors.primaryColor : 'transparent',
              boxShadow: activeSection === index ? `0 0 12px ${colors.primaryColor}50` : 'none',
            }}
            onClick={() => {
              const sections = document.querySelectorAll('.luxury-section');
              sections[index]?.scrollIntoView({ behavior: 'smooth' });
            }}
            aria-label={`Section ${index + 1}`}
          >
            {/* Hover glow effect */}
            <span
              className="absolute -inset-1 rounded-full opacity-0 hover:opacity-100 transition-opacity pointer-events-none"
              style={{
                background: `radial-gradient(circle, ${colors.primaryColor}20, transparent)`,
              }}
            />
          </button>
        ))}
      </nav>

      {/* Parallax overlay for hero */}
      <div
        className="fixed inset-0 pointer-events-none z-[1]"
        style={{
          transform: parallaxTransform,
          opacity: parallaxOpacity,
          background: `radial-gradient(circle at 50% 30%, ${colors.primaryColor}10, transparent 60%)`,
          willChange: 'transform, opacity',
        }}
      />

      {/* Content */}
      <div className="relative z-[2]">
        <LuxuryHeroSection merchant={data.merchant} colors={colors} onScrollToServices={handleScrollToServices} />
        <LuxuryAboutSection merchant={data.merchant} colors={colors} />
        <LuxuryGallerySection gallery={data.gallery} colors={colors} />
        <LuxuryServicesSection services={data.services} merchant={data.merchant} colors={colors} cart={cart} />
        <LuxuryProductsSection products={data.products} merchant={data.merchant} colors={colors} cart={cart} />
        {videoId && <LuxuryVideoSection videoUrl={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`} colors={colors} />}
        <LuxuryContactSection merchant={data.merchant} colors={colors} />
        <LuxurySocialSection socialLinks={data.socialLinks} colors={colors} />
      </div>

      {/* Minimal CSS for animations that can't be done in Tailwind */}
      <style jsx>{`
        @keyframes fade-in-delayed {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in-delayed {
          animation: fade-in-delayed 0.6s ease 1s forwards;
        }
      `}</style>
    </div>
  );
}
