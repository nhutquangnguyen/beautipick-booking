"use client";

import { AboutSectionProps } from "../types";

export function EleganceGridAboutSection({ merchant, colors }: AboutSectionProps) {
  if (!merchant.about) return null;

  return (
    <section
      id="section-about"
      className="py-20 px-6"
      style={{ backgroundColor: colors.backgroundColor }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div>
            <h2
              className="text-4xl sm:text-5xl font-bold mb-6"
              style={{
                fontFamily: colors.fontFamily,
                color: colors.primaryColor,
              }}
            >
              About Us
            </h2>
            <div
              className="w-20 h-1 mb-6"
              style={{ backgroundColor: colors.accentColor }}
            />
            <div
              className="prose prose-lg max-w-none leading-relaxed space-y-4"
              style={{
                fontFamily: colors.fontFamily,
                color: colors.textColor,
              }}
            >
              {merchant.about.split('\n').map((paragraph, idx) => (
                <p key={idx} className="text-lg">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Decorative Grid Pattern */}
          <div className="relative h-96 hidden lg:block">
            <div
              className="absolute inset-0 rounded-2xl overflow-hidden"
              style={{
                backgroundColor: colors.secondaryColor,
                boxShadow: `0 20px 60px ${colors.accentColor}20`,
              }}
            >
              {/* Grid Pattern */}
              <div className="grid grid-cols-3 grid-rows-3 gap-4 h-full p-6">
                {[...Array(9)].map((_, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg transition-all duration-500 hover:scale-110"
                    style={{
                      backgroundColor: colors.accentColor,
                      opacity: 0.1 + (idx * 0.08),
                    }}
                  />
                ))}
              </div>

              {/* Center Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="text-9xl font-bold opacity-10"
                  style={{ color: colors.primaryColor }}
                >
                  {merchant.business_name.charAt(0)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
