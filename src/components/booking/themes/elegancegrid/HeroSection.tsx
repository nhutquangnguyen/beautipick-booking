"use client";

import { useState, useEffect } from "react";
import { HeroSectionProps } from "../types";

// Default cover images if merchant doesn't have any
const DEFAULT_COVERS = [
  "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2070",
  "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?q=80&w=2070",
  "https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?q=80&w=2070",
];

export function EleganceGridHeroSection({ merchant, colors, onScrollToServices }: HeroSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Use merchant cover or default covers
  const slides = merchant.cover_image_url ? [merchant.cover_image_url] : DEFAULT_COVERS;

  // Auto-advance slideshow
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
      className="relative min-h-screen flex items-center justify-start px-6 pt-20 overflow-hidden"
    >
      {/* Slideshow Background */}
      <div className="absolute inset-0">
        {slides.map((image, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              idx === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${image})` }}
            />
            {/* Gradient Overlay */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to right, ${colors.backgroundColor}f5 0%, ${colors.backgroundColor}e0 40%, ${colors.backgroundColor}40 100%)`,
              }}
            />
          </div>
        ))}
      </div>

      {/* Slide Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className="w-12 h-1 rounded-full transition-all duration-300"
              style={{
                backgroundColor: idx === currentSlide ? colors.accentColor : `${colors.primaryColor}30`,
              }}
            />
          ))}
        </div>
      )}

      {/* Content - Left Aligned */}
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="max-w-2xl">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 backdrop-blur-sm"
            style={{
              backgroundColor: `${colors.accentColor}20`,
              border: `1px solid ${colors.accentColor}40`,
            }}
          >
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: colors.accentColor }}
            />
            <span
              className="text-sm font-semibold"
              style={{ color: colors.accentColor }}
            >
              Premium Spa & Wellness
            </span>
          </div>

          {/* Main Heading - Left Aligned */}
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 leading-tight"
            style={{
              fontFamily: colors.fontFamily,
              color: colors.primaryColor,
            }}
          >
            {merchant.business_name}
          </h1>

          {/* Decorative Line */}
          <div className="flex items-center gap-4 mb-6">
            <div
              className="w-20 h-1"
              style={{ backgroundColor: colors.accentColor }}
            />
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: colors.accentColor }}
            />
            <div
              className="w-12 h-1"
              style={{ backgroundColor: colors.accentColor }}
            />
          </div>

          {/* Description */}
          {merchant.description && (
            <p
              className="text-xl sm:text-2xl mb-8 leading-relaxed"
              style={{
                fontFamily: colors.fontFamily,
                color: colors.textColor,
                opacity: 0.9,
              }}
            >
              {merchant.description}
            </p>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onScrollToServices}
              className="group px-10 py-5 text-lg font-semibold text-white rounded-full transition-all duration-300 hover:scale-105 relative overflow-hidden"
              style={{
                backgroundColor: colors.accentColor,
                boxShadow: `0 10px 30px ${colors.accentColor}40`,
              }}
            >
              <span className="relative z-10">Explore Services</span>
              <div
                className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  backgroundImage: `linear-gradient(to right, ${colors.accentColor}, ${colors.primaryColor})`,
                }}
              />
            </button>

            <button
              onClick={() => {
                const element = document.getElementById('section-gallery');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="px-10 py-5 text-lg font-semibold rounded-full transition-all duration-300 hover:scale-105 backdrop-blur-sm"
              style={{
                color: colors.primaryColor,
                border: `2px solid ${colors.primaryColor}`,
                backgroundColor: `${colors.backgroundColor}80`,
              }}
            >
              View Gallery
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mt-12 max-w-xl">
            <div
              className="p-4 rounded-xl backdrop-blur-sm"
              style={{
                backgroundColor: `${colors.secondaryColor}80`,
                border: `1px solid ${colors.accentColor}30`,
              }}
            >
              <div className="text-3xl font-bold" style={{ color: colors.accentColor }}>
                500+
              </div>
              <div className="text-sm mt-1" style={{ color: colors.textColor, opacity: 0.7 }}>
                Happy Clients
              </div>
            </div>

            <div
              className="p-4 rounded-xl backdrop-blur-sm"
              style={{
                backgroundColor: `${colors.secondaryColor}80`,
                border: `1px solid ${colors.accentColor}30`,
              }}
            >
              <div className="text-3xl font-bold" style={{ color: colors.accentColor }}>
                15+
              </div>
              <div className="text-sm mt-1" style={{ color: colors.textColor, opacity: 0.7 }}>
                Services
              </div>
            </div>

            <div
              className="p-4 rounded-xl backdrop-blur-sm"
              style={{
                backgroundColor: `${colors.secondaryColor}80`,
                border: `1px solid ${colors.accentColor}30`,
              }}
            >
              <div className="text-3xl font-bold" style={{ color: colors.accentColor }}>
                5★
              </div>
              <div className="text-sm mt-1" style={{ color: colors.textColor, opacity: 0.7 }}>
                Rating
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-24 right-8 animate-bounce hidden lg:block">
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm font-medium" style={{ color: colors.primaryColor, opacity: 0.7 }}>
            Scroll
          </span>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            style={{ color: colors.primaryColor, opacity: 0.7 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
