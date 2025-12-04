"use client";

import { AboutSectionProps } from "../types";

export function PortfolioAboutSection({ merchant, colors }: AboutSectionProps) {
  if (!merchant.description) return null;

  return (
    <section
      className="py-24 px-6 relative overflow-hidden"
      style={{ backgroundColor: colors.backgroundColor }}
    >
      {/* Decorative background shape */}
      <div
        className="absolute -top-20 -right-20 w-96 h-96 rounded-full blur-3xl opacity-10"
        style={{
          background: `linear-gradient(135deg, ${colors.primaryColor}, ${colors.secondaryColor})`,
        }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section title */}
        <div className="mb-12">
          <div
            className="w-20 h-2 mb-6"
            style={{
              background: `linear-gradient(90deg, ${colors.primaryColor}, ${colors.secondaryColor})`,
            }}
          />
          <h2
            className="text-5xl sm:text-6xl font-black uppercase"
            style={{
              fontFamily: colors.fontFamily,
              color: colors.textColor,
            }}
          >
            About Us
          </h2>
        </div>

        {/* Description */}
        <p
          className="text-xl sm:text-2xl leading-relaxed font-semibold"
          style={{
            fontFamily: colors.fontFamily,
            color: colors.textColor,
            opacity: 0.9,
          }}
        >
          {merchant.description}
        </p>
      </div>
    </section>
  );
}
