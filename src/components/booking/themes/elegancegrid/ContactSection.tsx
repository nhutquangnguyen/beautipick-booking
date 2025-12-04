"use client";

import { ContactSectionProps } from "../types";

export function EleganceGridContactSection({ merchant, colors }: ContactSectionProps) {
  return (
    <section
      id="section-contact"
      className="py-20 px-6"
      style={{ backgroundColor: colors.backgroundColor }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2
            className="text-4xl sm:text-5xl font-bold mb-4"
            style={{
              fontFamily: colors.fontFamily,
              color: colors.primaryColor,
            }}
          >
            Contact Us
          </h2>
          <div
            className="w-20 h-1 mx-auto mb-6"
            style={{ backgroundColor: colors.accentColor }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Address */}
          {merchant.address && (
            <div
              className="p-8 rounded-2xl transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: colors.secondaryColor,
                boxShadow: `0 4px 20px ${colors.accentColor}15`,
              }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: colors.accentColor }}
              >
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3
                className="text-xl font-bold mb-2"
                style={{
                  fontFamily: colors.fontFamily,
                  color: colors.primaryColor,
                }}
              >
                Address
              </h3>
              <p
                className="text-base"
                style={{
                  fontFamily: colors.fontFamily,
                  color: colors.textColor,
                  opacity: 0.8,
                }}
              >
                {merchant.address}
              </p>
            </div>
          )}

          {/* Phone */}
          {merchant.phone && (
            <div
              className="p-8 rounded-2xl transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: colors.secondaryColor,
                boxShadow: `0 4px 20px ${colors.accentColor}15`,
              }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: colors.accentColor }}
              >
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3
                className="text-xl font-bold mb-2"
                style={{
                  fontFamily: colors.fontFamily,
                  color: colors.primaryColor,
                }}
              >
                Phone
              </h3>
              <a
                href={`tel:${merchant.phone}`}
                className="text-base hover:underline"
                style={{
                  fontFamily: colors.fontFamily,
                  color: colors.textColor,
                  opacity: 0.8,
                }}
              >
                {merchant.phone}
              </a>
            </div>
          )}

          {/* Email */}
          {merchant.email && (
            <div
              className="p-8 rounded-2xl transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: colors.secondaryColor,
                boxShadow: `0 4px 20px ${colors.accentColor}15`,
              }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: colors.accentColor }}
              >
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3
                className="text-xl font-bold mb-2"
                style={{
                  fontFamily: colors.fontFamily,
                  color: colors.primaryColor,
                }}
              >
                Email
              </h3>
              <a
                href={`mailto:${merchant.email}`}
                className="text-base hover:underline"
                style={{
                  fontFamily: colors.fontFamily,
                  color: colors.textColor,
                  opacity: 0.8,
                }}
              >
                {merchant.email}
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
