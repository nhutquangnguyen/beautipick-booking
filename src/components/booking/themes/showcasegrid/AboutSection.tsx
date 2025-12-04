"use client";

import { Merchant } from "@/types/database";

interface AboutSectionProps {
  merchant: Merchant;
  colors: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    textColor: string;
    fontFamily: string;
  };
}

export function ShowcaseGridAboutSection({ merchant, colors }: AboutSectionProps) {
  if (!merchant.description) return null;

  return (
    <section
      id="section-about"
      className="py-32 px-6 relative overflow-hidden"
      style={{ backgroundColor: '#F8F9FA' }}
    >
      {/* Decorative background shapes */}
      <div className="absolute top-20 right-10 w-40 h-40 rounded-full opacity-5 blur-3xl" style={{ background: `linear-gradient(135deg, ${colors.accentColor}, ${colors.primaryColor})` }} />
      <div className="absolute bottom-20 left-10 w-32 h-32 opacity-5 blur-3xl" style={{
        background: `linear-gradient(135deg, ${colors.primaryColor}, ${colors.accentColor})`,
        borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%'
      }} />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Editorial Header */}
        <div className="text-center mb-16">
          <div className="inline-block relative">
            <h2
              className="text-5xl lg:text-6xl xl:text-7xl font-black uppercase tracking-tight mb-4"
              style={{
                fontFamily: colors.fontFamily,
                color: colors.primaryColor,
                letterSpacing: '-0.02em',
              }}
            >
              About Us
            </h2>

            {/* Decorative underline */}
            <div className="flex justify-center gap-1 mt-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.accentColor }} />
              <div className="w-16 h-2 rounded-full" style={{ backgroundColor: colors.accentColor }} />
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.accentColor }} />
            </div>
          </div>
          <p className="text-gray-500 mt-8 text-sm tracking-widest uppercase font-semibold">
            Our Story
          </p>
        </div>

        {/* Description - Editorial Style */}
        <div className="text-center">
          <p
            className="text-xl lg:text-2xl leading-relaxed max-w-4xl mx-auto"
            style={{
              fontFamily: colors.fontFamily,
              color: colors.textColor,
              lineHeight: '1.8',
            }}
          >
            {merchant.description}
          </p>
        </div>
      </div>
    </section>
  );
}
