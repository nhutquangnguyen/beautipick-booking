"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { AboutSectionProps } from "../types";

export function TetHolidayAboutSection({ merchant, colors }: AboutSectionProps) {
  const t = useTranslations("common");
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.2, // Trigger when 20% of section is visible
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  if (!merchant.description) return null;

  return (
    <section
      ref={sectionRef}
      className="py-24 px-6 relative overflow-hidden"
      style={{ backgroundColor: colors.backgroundColor }}
    >
      {/* Subtle floral pattern background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 30% 50%, ${colors.secondaryColor} 8px, transparent 8px), radial-gradient(circle at 70% 80%, ${colors.accentColor} 6px, transparent 6px)`,
          backgroundSize: '250px 250px, 300px 300px',
        }}
      />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header: "Câu Chuyện Mùa Xuân" - Hidden initially, reveal on scroll */}
        <div
          className={`text-center mb-12 transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="text-4xl">✿</span>
            <h2
              className="text-4xl sm:text-5xl font-bold"
              style={{
                fontFamily: colors.fontFamily,
                color: colors.primaryColor,
              }}
            >
              {t("aboutUs")}
            </h2>
            <span className="text-4xl">❀</span>
          </div>

          {/* Decorative Divider - Fades in with title */}
          <div className="flex items-center justify-center gap-3">
            <span className="text-2xl">🏮</span>
            <div
              className="h-px w-24"
              style={{
                background: `linear-gradient(90deg, transparent, ${colors.secondaryColor}, transparent)`,
              }}
            />
            <span className="text-2xl">🌸</span>
            <div
              className="h-px w-24"
              style={{
                background: `linear-gradient(90deg, transparent, ${colors.secondaryColor}, transparent)`,
              }}
            />
            <span className="text-2xl">🍊</span>
          </div>
        </div>

        {/* Main Content Box - "Chiếu Thư" / "Lì Xì" Style - Centered, Full Width */}
        <div
          className={`relative transition-all duration-1000 ease-out delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* Outer Golden Glow - Soft shadow */}
          <div
            className="absolute -inset-3 rounded-3xl opacity-30 blur-xl"
            style={{
              background: `linear-gradient(135deg, ${colors.secondaryColor}, ${colors.accentColor}, ${colors.secondaryColor})`,
            }}
          />

          {/* Main Text Box - Double Border (Red Velvet + Gold) */}
          <div
            className="relative rounded-3xl p-12 sm:p-16 shadow-2xl"
            style={{
              backgroundColor: '#FFFFFF',
              border: `5px solid ${colors.primaryColor}`, // Red velvet outer border
              boxShadow: `0 20px 60px ${colors.primaryColor}26, inset 0 0 0 3px ${colors.secondaryColor}`, // Gold inner border via box-shadow
            }}
          >
            {/* Inner Gold Border (Alternative approach using pseudo-element style) */}
            <div
              className="absolute inset-[5px] rounded-[1.25rem] pointer-events-none"
              style={{
                border: `3px solid ${colors.secondaryColor}`,
              }}
            />

            {/* Top decorative corner - Red Envelope Badge */}
            <div
              className="absolute -top-6 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full flex items-center justify-center shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${colors.primaryColor}, ${colors.primaryColor})`,
                border: `4px solid ${colors.secondaryColor}`,
              }}
            >
              <span className="text-3xl">🧧</span>
            </div>

            {/* Watermark Blossom - Top Right */}
            <div
              className="absolute top-8 right-8 text-8xl opacity-[0.06] pointer-events-none"
              style={{ color: colors.secondaryColor }}
            >
              ✿
            </div>

            {/* Watermark Blossom - Bottom Left */}
            <div
              className="absolute bottom-8 left-8 text-8xl opacity-[0.06] pointer-events-none"
              style={{ color: colors.accentColor }}
            >
              ❀
            </div>

            {/* Description Text - Centered */}
            <p
              className="text-xl sm:text-2xl leading-relaxed text-center relative z-10 mb-10"
              style={{
                fontFamily: colors.fontFamily,
                color: colors.textColor,
                lineHeight: '2',
              }}
            >
              {merchant.description}
            </p>

            {/* Bottom Decoration - Inside the box */}
            <div className="flex items-center justify-center gap-4 pt-8 border-t relative z-10" style={{ borderColor: `${colors.secondaryColor}4D` }}>
              <span className="text-2xl">🏮</span>
              <div
                className="h-1 w-20 rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${colors.primaryColor}, ${colors.secondaryColor})`,
                }}
              />
              <span className="text-2xl">🌸</span>
              <div
                className="h-1 w-20 rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${colors.secondaryColor}, ${colors.primaryColor})`,
                }}
              />
              <span className="text-2xl">🧧</span>
            </div>
          </div>
        </div>

        {/* Decorative Elements Below the Box - Fade in with delay */}
        <div
          className={`flex items-center justify-center gap-6 mt-12 transition-all duration-1000 ease-out delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* Left decoration */}
          <div className="flex items-center gap-2">
            <span className="text-3xl">🍊</span>
            <span className="text-3xl">🍊</span>
          </div>

          {/* Center blessing */}
          <div className="text-center">
            <p
              className="text-2xl font-bold"
              style={{
                fontFamily: colors.fontFamily,
                color: colors.primaryColor,
                textShadow: `0 2px 10px ${colors.secondaryColor}66`,
              }}
            >
              "{t("tetSubtitle") || "Xuân Về - Phúc Lộc Đầy Nhà"}"
            </p>
          </div>

          {/* Right decoration */}
          <div className="flex items-center gap-2">
            <span className="text-3xl">🍊</span>
            <span className="text-3xl">🍊</span>
          </div>
        </div>

        {/* Additional decorative flourish at the very bottom */}
        <div
          className={`flex items-center justify-center gap-3 mt-8 transition-all duration-1000 ease-out delay-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <span className="text-xl">🌸</span>
          <div
            className="h-px w-16"
            style={{
              background: `linear-gradient(90deg, transparent, ${colors.secondaryColor}, transparent)`,
            }}
          />
          <span className="text-2xl">🧧</span>
          <div
            className="h-px w-16"
            style={{
              background: `linear-gradient(90deg, transparent, ${colors.secondaryColor}, transparent)`,
            }}
          />
          <span className="text-xl">✿</span>
        </div>
      </div>
    </section>
  );
}
