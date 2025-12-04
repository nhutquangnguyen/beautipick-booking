"use client";

import { AboutSectionProps } from "../types";

export function BlossomAboutSection({ merchant, colors }: AboutSectionProps) {
  if (!merchant.description) return null;

  return (
    <section className="blossom-section py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div
          className="p-8 sm:p-12 shadow-md transition-all duration-300 hover:shadow-lg text-center"
          style={{
            backgroundColor: colors.accentColor,
            borderRadius: "16px",
          }}
        >
          <h2
            className="text-3xl sm:text-4xl font-bold mb-6"
            style={{
              fontFamily: "'Dancing Script', cursive",
              color: colors.textColor,
            }}
          >
            About Us
          </h2>
          <p
            className="text-lg leading-relaxed"
            style={{
              fontFamily: "'Lato', sans-serif",
              color: colors.textColor,
            }}
          >
            {merchant.description}
          </p>
        </div>
      </div>
    </section>
  );
}
