"use client";

import { ContactSectionProps } from "../types";

export function PortfolioContactSection({ merchant, colors }: ContactSectionProps) {
  return (
    <section
      id="section-contact"
      className="py-24 px-6"
      style={{ backgroundColor: colors.backgroundColor }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Section title */}
        <div className="mb-16">
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
            Contact
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Phone */}
          {merchant.phone && (
            <div
              className="p-8 transition-all duration-300 hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${colors.primaryColor}15, ${colors.secondaryColor}15)`,
                borderRadius: colors.borderRadius === "full" ? "24px" : colors.borderRadius === "none" ? "0" : "16px",
                border: `3px solid ${colors.primaryColor}`,
              }}
            >
              <div
                className="w-16 h-16 flex items-center justify-center mb-6 font-black text-3xl"
                style={{
                  background: `linear-gradient(135deg, ${colors.primaryColor}, ${colors.secondaryColor})`,
                  color: "#fff",
                  borderRadius: colors.borderRadius === "full" ? "9999px" : "8px",
                }}
              >
                📞
              </div>
              <h3
                className="text-xl font-black mb-3 uppercase"
                style={{
                  fontFamily: colors.fontFamily,
                  color: colors.textColor,
                }}
              >
                Phone
              </h3>
              <a
                href={`tel:${merchant.phone}`}
                className="text-lg font-bold hover:underline"
                style={{ color: colors.primaryColor }}
              >
                {merchant.phone}
              </a>
            </div>
          )}

          {/* Email */}
          {merchant.email && (
            <div
              className="p-8 transition-all duration-300 hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${colors.secondaryColor}15, ${colors.accentColor}15)`,
                borderRadius: colors.borderRadius === "full" ? "24px" : colors.borderRadius === "none" ? "0" : "16px",
                border: `3px solid ${colors.secondaryColor}`,
              }}
            >
              <div
                className="w-16 h-16 flex items-center justify-center mb-6 font-black text-3xl"
                style={{
                  background: `linear-gradient(135deg, ${colors.secondaryColor}, ${colors.accentColor})`,
                  color: "#fff",
                  borderRadius: colors.borderRadius === "full" ? "9999px" : "8px",
                }}
              >
                📧
              </div>
              <h3
                className="text-xl font-black mb-3 uppercase"
                style={{
                  fontFamily: colors.fontFamily,
                  color: colors.textColor,
                }}
              >
                Email
              </h3>
              <a
                href={`mailto:${merchant.email}`}
                className="text-lg font-bold hover:underline break-all"
                style={{ color: colors.secondaryColor }}
              >
                {merchant.email}
              </a>
            </div>
          )}

          {/* Address */}
          {merchant.address && (
            <div
              className="p-8 transition-all duration-300 hover:scale-105 md:col-span-2 lg:col-span-1"
              style={{
                background: `linear-gradient(135deg, ${colors.accentColor}15, ${colors.primaryColor}15)`,
                borderRadius: colors.borderRadius === "full" ? "24px" : colors.borderRadius === "none" ? "0" : "16px",
                border: `3px solid ${colors.accentColor}`,
              }}
            >
              <div
                className="w-16 h-16 flex items-center justify-center mb-6 font-black text-3xl"
                style={{
                  background: `linear-gradient(135deg, ${colors.accentColor}, ${colors.primaryColor})`,
                  color: "#fff",
                  borderRadius: colors.borderRadius === "full" ? "9999px" : "8px",
                }}
              >
                📍
              </div>
              <h3
                className="text-xl font-black mb-3 uppercase"
                style={{
                  fontFamily: colors.fontFamily,
                  color: colors.textColor,
                }}
              >
                Address
              </h3>
              <p
                className="text-lg font-bold"
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
