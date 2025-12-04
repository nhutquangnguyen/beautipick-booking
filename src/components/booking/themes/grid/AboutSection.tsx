"use client";

import { AboutSectionProps } from "../types";

export function GridAboutSection({ merchant, colors }: AboutSectionProps) {
  if (!merchant.about) return null;

  return (
    <section
      id="section-about"
      className="py-20 px-6 relative overflow-hidden"
      style={{ backgroundColor: colors.backgroundColor }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="order-2 lg:order-1">
            <h2
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
              style={{
                fontFamily: colors.fontFamily,
                color: colors.primaryColor,
              }}
            >
              About Us
            </h2>
            <div
              className="prose prose-lg max-w-none leading-relaxed"
              style={{
                fontFamily: colors.fontFamily,
                color: colors.textColor,
              }}
            >
              {merchant.about.split('\n').map((paragraph, idx) => (
                <p key={idx} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Grid Pattern Visual */}
          <div className="order-1 lg:order-2">
            <div className="relative h-96">
              {/* Grid boxes */}
              <div className="grid grid-cols-3 grid-rows-3 gap-4 h-full">
                {[...Array(9)].map((_, idx) => (
                  <div
                    key={idx}
                    className="transition-all duration-500 hover:scale-110"
                    style={{
                      backgroundColor: idx % 3 === 0 ? colors.primaryColor : idx % 3 === 1 ? colors.secondaryColor : colors.accentColor,
                      opacity: 0.1 + (idx * 0.08),
                      borderRadius: colors.borderRadius === "full" ? "50%" : colors.borderRadius === "none" ? "0" : "12px",
                    }}
                  />
                ))}
              </div>

              {/* Center overlay */}
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  background: `radial-gradient(circle, ${colors.backgroundColor}00 0%, ${colors.backgroundColor} 100%)`,
                }}
              >
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
