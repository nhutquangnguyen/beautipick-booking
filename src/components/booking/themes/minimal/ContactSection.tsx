"use client";

import { ContactSectionProps } from "../types";

export function MinimalContactSection({ merchant, colors }: ContactSectionProps) {
  return (
    <section
      id="section-contact"
      className="py-32 px-6"
      style={{ backgroundColor: `${colors.backgroundColor}f8` }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Section title */}
        <h2
          className="text-3xl sm:text-4xl font-extralight tracking-wide text-center mb-24"
          style={{
            fontFamily: colors.fontFamily,
            color: colors.textColor,
          }}
        >
          Contact
        </h2>

        <div className="space-y-12">
          {/* Phone */}
          {merchant.phone && (
            <div className="text-center">
              <p
                className="text-sm uppercase tracking-widest mb-3 opacity-50"
                style={{
                  fontFamily: colors.fontFamily,
                  color: colors.textColor,
                }}
              >
                Phone
              </p>
              <a
                href={`tel:${merchant.phone}`}
                className="text-xl font-light transition-opacity duration-300 hover:opacity-70"
                style={{
                  color: colors.primaryColor,
                  fontFamily: colors.fontFamily,
                }}
              >
                {merchant.phone}
              </a>
            </div>
          )}

          {/* Divider */}
          {merchant.phone && merchant.email && (
            <div className="flex justify-center">
              <div
                className="w-px h-12"
                style={{ backgroundColor: `${colors.primaryColor}20` }}
              />
            </div>
          )}

          {/* Email */}
          {merchant.email && (
            <div className="text-center">
              <p
                className="text-sm uppercase tracking-widest mb-3 opacity-50"
                style={{
                  fontFamily: colors.fontFamily,
                  color: colors.textColor,
                }}
              >
                Email
              </p>
              <a
                href={`mailto:${merchant.email}`}
                className="text-xl font-light transition-opacity duration-300 hover:opacity-70 break-all"
                style={{
                  color: colors.primaryColor,
                  fontFamily: colors.fontFamily,
                }}
              >
                {merchant.email}
              </a>
            </div>
          )}

          {/* Divider */}
          {merchant.email && merchant.address && (
            <div className="flex justify-center">
              <div
                className="w-px h-12"
                style={{ backgroundColor: `${colors.primaryColor}20` }}
              />
            </div>
          )}

          {/* Address */}
          {merchant.address && (
            <div className="text-center">
              <p
                className="text-sm uppercase tracking-widest mb-3 opacity-50"
                style={{
                  fontFamily: colors.fontFamily,
                  color: colors.textColor,
                }}
              >
                Address
              </p>
              <p
                className="text-xl font-light leading-relaxed"
                style={{
                  color: colors.textColor,
                  fontFamily: colors.fontFamily,
                }}
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
