"use client";

import { AboutSectionProps } from "../types";

export function ModernAboutSection({ merchant, colors }: AboutSectionProps) {
  if (!merchant.description) return null;

  return (
    <section
      id="section-about"
      className="modern-section py-20 px-6"
      style={{ backgroundColor: colors.backgroundColor }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          {merchant.cover_image_url && (
            <div className="relative group">
              <div
                className="absolute -inset-4 rounded-3xl opacity-30 group-hover:opacity-50 blur-xl transition-opacity duration-300"
                style={{
                  background: `linear-gradient(135deg, ${colors.primaryColor}, ${colors.secondaryColor})`,
                }}
              />
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={merchant.cover_image_url}
                  alt={merchant.business_name}
                  className="w-full h-[400px] object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          )}

          {/* Content */}
          <div className={merchant.cover_image_url ? '' : 'lg:col-span-2 max-w-4xl mx-auto text-center'}>
            <h2
              className="text-4xl sm:text-5xl font-bold mb-6"
              style={{
                fontFamily: colors.fontFamily,
                background: `linear-gradient(135deg, ${colors.primaryColor}, ${colors.secondaryColor})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              About Us
            </h2>
            <div
              className="text-lg leading-relaxed space-y-4"
              style={{
                fontFamily: colors.fontFamily,
                color: colors.textColor,
              }}
            >
              {merchant.description.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
