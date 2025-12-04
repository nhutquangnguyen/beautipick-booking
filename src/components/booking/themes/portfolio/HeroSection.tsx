"use client";

import { useState } from "react";
import { HeroSectionProps } from "../types";

export function PortfolioHeroSection({ merchant, colors, onScrollToServices }: HeroSectionProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: colors.backgroundColor }}
    >
      {/* Background Image with parallax effect */}
      {merchant.cover_image_url && (
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700"
          style={{
            backgroundImage: `url(${merchant.cover_image_url})`,
            transform: "scale(1.1)",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${colors.primaryColor}dd, ${colors.secondaryColor}dd)`,
              mixBlendMode: "multiply",
            }}
          />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Logo */}
        {merchant.logo_url && (
          <div className="mb-10 flex justify-center">
            <div
              className="w-40 h-40 rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-110 hover:rotate-3"
              style={{
                border: `4px solid ${colors.primaryColor}`,
                boxShadow: `0 20px 60px ${colors.primaryColor}60`,
              }}
            >
              <img
                src={merchant.logo_url}
                alt={merchant.business_name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Business Name */}
        <h1
          className="text-6xl sm:text-8xl font-black uppercase mb-8 leading-tight"
          style={{
            fontFamily: colors.fontFamily,
            color: merchant.cover_image_url ? "#fff" : colors.textColor,
            textShadow: merchant.cover_image_url
              ? "0 4px 20px rgba(0,0,0,0.5), 0 8px 40px rgba(0,0,0,0.3)"
              : "none",
            letterSpacing: "-0.02em",
          }}
        >
          {merchant.business_name}
        </h1>

        {/* Description */}
        {merchant.description && (
          <p
            className="text-xl sm:text-2xl font-bold mb-12 max-w-3xl mx-auto"
            style={{
              fontFamily: colors.fontFamily,
              color: merchant.cover_image_url ? "#fff" : colors.textColor,
              textShadow: merchant.cover_image_url
                ? "0 2px 10px rgba(0,0,0,0.5)"
                : "none",
            }}
          >
            {merchant.description}
          </p>
        )}

        {/* CTA Button - Bold style */}
        <button
          onClick={onScrollToServices}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="px-12 py-5 text-xl font-black uppercase tracking-wider transition-all duration-300 transform hover:scale-110"
          style={{
            background: isHovered
              ? `linear-gradient(135deg, ${colors.secondaryColor}, ${colors.primaryColor})`
              : `linear-gradient(135deg, ${colors.primaryColor}, ${colors.secondaryColor})`,
            color: "#fff",
            borderRadius: colors.borderRadius === "full" ? "9999px" : colors.borderRadius === "none" ? "0" : "12px",
            boxShadow: `0 10px 40px ${colors.primaryColor}60`,
          }}
        >
          View Work
        </button>
      </div>

      {/* Decorative elements */}
      <div
        className="absolute bottom-0 left-0 right-0 h-2"
        style={{
          background: `linear-gradient(90deg, ${colors.primaryColor}, ${colors.secondaryColor}, ${colors.accentColor})`,
        }}
      />
    </section>
  );
}
