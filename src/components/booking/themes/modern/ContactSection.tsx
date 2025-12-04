"use client";

import { ContactSectionProps } from "../types";

export function ModernContactSection({ merchant, colors }: ContactSectionProps) {
  return (
    <section
      id="section-contact"
      className="modern-section py-20 px-6"
      style={{ backgroundColor: colors.backgroundColor }}
    >
      <div className="max-w-4xl mx-auto text-center">
        <h2
          className="text-4xl sm:text-5xl font-bold mb-8"
          style={{
            fontFamily: colors.fontFamily,
            background: `linear-gradient(135deg, ${colors.primaryColor}, ${colors.secondaryColor})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Get in Touch
        </h2>

        <p
          className="text-lg mb-12 opacity-80"
          style={{
            fontFamily: colors.fontFamily,
            color: colors.textColor,
          }}
        >
          Ready to book your appointment? Contact us today!
        </p>

        <div className="grid md:grid-cols-2 gap-8 text-left">
          {/* Phone */}
          {merchant.phone && (
            <div
              className="p-8 rounded-2xl transition-all duration-300 hover:-translate-y-1"
              style={{
                backgroundColor: `${colors.primaryColor}10`,
                border: `2px solid ${colors.primaryColor}30`,
              }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                style={{
                  background: `linear-gradient(135deg, ${colors.primaryColor}, ${colors.secondaryColor})`,
                }}
              >
                <span className="text-2xl text-white">📞</span>
              </div>
              <h3
                className="text-xl font-bold mb-2"
                style={{
                  fontFamily: colors.fontFamily,
                  color: colors.textColor,
                }}
              >
                Phone
              </h3>
              <a
                href={`tel:${merchant.phone}`}
                className="text-lg hover:underline"
                style={{ color: colors.primaryColor }}
              >
                {merchant.phone}
              </a>
            </div>
          )}

          {/* Email */}
          {merchant.email && (
            <div
              className="p-8 rounded-2xl transition-all duration-300 hover:-translate-y-1"
              style={{
                backgroundColor: `${colors.secondaryColor}10`,
                border: `2px solid ${colors.secondaryColor}30`,
              }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                style={{
                  background: `linear-gradient(135deg, ${colors.secondaryColor}, ${colors.accentColor})`,
                }}
              >
                <span className="text-2xl text-white">📧</span>
              </div>
              <h3
                className="text-xl font-bold mb-2"
                style={{
                  fontFamily: colors.fontFamily,
                  color: colors.textColor,
                }}
              >
                Email
              </h3>
              <a
                href={`mailto:${merchant.email}`}
                className="text-lg hover:underline break-all"
                style={{ color: colors.secondaryColor }}
              >
                {merchant.email}
              </a>
            </div>
          )}

          {/* Address */}
          {merchant.address && (
            <div
              className="p-8 rounded-2xl transition-all duration-300 hover:-translate-y-1 md:col-span-2"
              style={{
                backgroundColor: `${colors.accentColor}10`,
                border: `2px solid ${colors.accentColor}30`,
              }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                style={{
                  background: `linear-gradient(135deg, ${colors.accentColor}, ${colors.primaryColor})`,
                }}
              >
                <span className="text-2xl text-white">📍</span>
              </div>
              <h3
                className="text-xl font-bold mb-2"
                style={{
                  fontFamily: colors.fontFamily,
                  color: colors.textColor,
                }}
              >
                Address
              </h3>
              <p
                className="text-lg"
                style={{ color: colors.textColor }}
              >
                {merchant.address}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
