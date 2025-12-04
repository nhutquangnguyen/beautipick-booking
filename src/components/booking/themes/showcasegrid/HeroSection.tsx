"use client";

import { useState, useEffect } from "react";
import { HeroSectionProps } from "../types";
import { getCoverImagesArray } from "@/config/ShowcaseCoverImages";

export function ShowcaseGridHeroSection({ merchant, colors, onScrollToServices }: HeroSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Get cover images from merchant settings or use defaults
  // Merchant now has cover_image_1, cover_image_2, cover_image_3 fields for slideshow
  const merchantCovers = {
    cover_image_1: merchant.cover_image_1 || merchant.cover_image_url || undefined,
    cover_image_2: merchant.cover_image_2 || undefined,
    cover_image_3: merchant.cover_image_3 || undefined,
  };

  const slides = getCoverImagesArray(merchantCovers);

  // Auto-advance slideshow every 5 seconds
  useEffect(() => {
    if (slides.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [slides.length]);

  return (
    <section
      id="section-hero"
      className="relative w-full overflow-hidden"
      style={{ height: '70vh', minHeight: '600px', paddingTop: '80px' }}
    >
      {/* Full-Screen Slideshow Background with Horizontal Slide Transition */}
      <div className="absolute inset-0 z-0">
        <div className="relative h-full w-full overflow-hidden">
          {slides.map((image, idx) => (
            <div
              key={idx}
              className="absolute inset-0 w-full h-full transition-transform duration-1000 ease-in-out"
              style={{
                transform: `translateX(${(idx - currentSlide) * 100}%)`,
              }}
            >
              <img
                src={image}
                alt={`${merchant.business_name} - Slide ${idx + 1}`}
                className="h-full w-full object-cover scale-105"
                style={{ objectPosition: 'center' }}
              />
            </div>
          ))}
        </div>

        {/* Premium Dark Gradient Overlay - Enhanced for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      </div>

      {/* Dramatic Hero Content - Centered Clean Design */}
      <div className="absolute inset-0 z-10 flex items-center justify-center px-6">
        <div className="max-w-6xl text-center space-y-8">

          {/* DRAMATIC Main Title - Center Stage */}
          <div className="relative inline-block max-w-full px-4">
            <h1
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black uppercase leading-tight text-white break-words"
              style={{
                textShadow: `
                  0 4px 12px rgba(0, 0, 0, 0.95),
                  0 8px 24px rgba(0, 0, 0, 0.9),
                  0 12px 40px rgba(0, 0, 0, 0.85),
                  0 16px 60px rgba(0, 0, 0, 0.8),
                  0 0 100px rgba(0, 0, 0, 0.6)
                `,
                letterSpacing: '0.08em',
                WebkitTextStroke: '2px rgba(0, 0, 0, 0.3)',
                paintOrder: 'stroke fill',
                wordWrap: 'break-word',
              }}
            >
              {merchant.business_name}
            </h1>

            {/* Accent underline - Minimal */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-24 h-1 bg-white" style={{
              boxShadow: '0 0 20px rgba(255, 255, 255, 0.8)'
            }} />
          </div>

          {/* Bold CTA - Animated with continuous pulse + scale */}
          <div className="pt-6">
            <button
              onClick={onScrollToServices}
              className="group relative px-12 py-5 text-sm font-black uppercase overflow-hidden hover:scale-110"
              style={{
                backgroundColor: colors.accentColor,
                color: '#FFFFFF',
                letterSpacing: '0.2em',
                borderRadius: '0',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                animation: 'pulse-scale 2s ease-in-out infinite',
              }}
            >
              {/* Pulsing glow ring - more intense */}
              <div
                className="absolute -inset-2 bg-white/30 blur-xl"
                style={{
                  animation: 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                }}
              />

              {/* Secondary glow layer */}
              <div
                className="absolute -inset-1 bg-gradient-to-r from-white/20 via-white/30 to-white/20 blur-lg"
                style={{
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite 0.3s',
                }}
              />

              {/* Slide-in from left on hover */}
              <div
                className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"
              />

              {/* Expanding border effect on hover */}
              <div className="absolute inset-0 border-2 border-white scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-50 transition-all duration-500" />

              <span className="relative z-10 inline-block group-hover:scale-105 transition-transform duration-300">
                Khám Phá Ngay
              </span>
            </button>
          </div>

          {/* Add keyframes for enhanced pulse animations */}
          <style jsx>{`
            @keyframes pulse-scale {
              0%, 100% {
                transform: scale(1);
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
              }
              50% {
                transform: scale(1.05);
                box-shadow: 0 15px 50px rgba(0, 0, 0, 0.6), 0 0 40px rgba(255, 255, 255, 0.4);
              }
            }

            @keyframes pulse-ring {
              0%, 100% {
                opacity: 0.3;
                transform: scale(0.95);
              }
              50% {
                opacity: 0.6;
                transform: scale(1.05);
              }
            }
          `}</style>
        </div>
      </div>

      {/* Minimalist Slide Indicators - Bottom Center Above Content */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className="transition-all duration-300"
              style={{
                width: idx === currentSlide ? '40px' : '10px',
                height: '3px',
                backgroundColor: idx === currentSlide ? '#FFFFFF' : 'rgba(255, 255, 255, 0.4)',
                borderRadius: '2px',
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
