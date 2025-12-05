"use client";

import { useTranslations } from "next-intl";
import { ContactSectionProps } from "../types";

export function ChristmasContactSection({ merchant, colors }: ContactSectionProps) {
  const t = useTranslations("common");
  return (
    <section
      id="section-contact"
      className="py-20 px-6"
      style={{ backgroundColor: colors.backgroundColor }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Festive header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-3xl">🔔</span>
            <h2
              className="text-4xl sm:text-5xl font-bold"
              style={{
                fontFamily: colors.fontFamily,
                color: colors.primaryColor,
              }}
            >
              {t("contactUs")}
            </h2>
            <span className="text-3xl">🔔</span>
          </div>
          <p
            className="text-lg"
            style={{
              fontFamily: colors.fontFamily,
              color: colors.secondaryColor,
            }}
          >
            {t("christmasContactSubtitle")}
          </p>
        </div>

        {/* Contact cards grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Phone */}
          {merchant.phone && (
            <div
              className="group p-8 rounded-2xl transition-all duration-300 hover:-translate-y-2 shadow-lg"
              style={{
                backgroundColor: "#fff",
                border: `3px solid ${colors.primaryColor}`,
              }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-5 shadow-md"
                style={{
                  backgroundColor: colors.primaryColor,
                  border: `3px solid ${colors.accentColor}`,
                }}
              >
                <span className="text-3xl">📞</span>
              </div>
              <h3
                className="text-2xl font-bold mb-3"
                style={{
                  fontFamily: colors.fontFamily,
                  color: colors.primaryColor,
                }}
              >
                {t("phone")}
              </h3>
              <a
                href={`tel:${merchant.phone}`}
                className="text-lg font-semibold hover:underline block"
                style={{ color: colors.textColor }}
              >
                {merchant.phone}
              </a>
              <p className="text-sm mt-2 opacity-70" style={{ color: colors.textColor }}>
                {t("christmasPhoneText")}
              </p>
            </div>
          )}

          {/* Email */}
          {merchant.email && (
            <div
              className="group p-8 rounded-2xl transition-all duration-300 hover:-translate-y-2 shadow-lg"
              style={{
                backgroundColor: "#fff",
                border: `3px solid ${colors.secondaryColor}`,
              }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-5 shadow-md"
                style={{
                  backgroundColor: colors.secondaryColor,
                  border: `3px solid ${colors.accentColor}`,
                }}
              >
                <span className="text-3xl">📧</span>
              </div>
              <h3
                className="text-2xl font-bold mb-3"
                style={{
                  fontFamily: colors.fontFamily,
                  color: colors.secondaryColor,
                }}
              >
                {t("email")}
              </h3>
              <a
                href={`mailto:${merchant.email}`}
                className="text-lg font-semibold hover:underline block break-all"
                style={{ color: colors.textColor }}
              >
                {merchant.email}
              </a>
              <p className="text-sm mt-2 opacity-70" style={{ color: colors.textColor }}>
                {t("christmasEmailText")}
              </p>
            </div>
          )}

          {/* Address */}
          {merchant.address && (
            <div
              className="group p-8 rounded-2xl transition-all duration-300 hover:-translate-y-2 shadow-lg md:col-span-2"
              style={{
                backgroundColor: "#fff",
                border: `3px solid ${colors.accentColor}`,
              }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-5 shadow-md"
                style={{
                  backgroundColor: colors.accentColor,
                  border: `3px solid ${colors.primaryColor}`,
                }}
              >
                <span className="text-3xl">📍</span>
              </div>
              <h3
                className="text-2xl font-bold mb-3"
                style={{
                  fontFamily: colors.fontFamily,
                  color: colors.primaryColor,
                }}
              >
                {t("address")}
              </h3>
              <p
                className="text-lg font-semibold"
                style={{ color: colors.textColor }}
              >
                {merchant.address}
              </p>
              <p className="text-sm mt-2 opacity-70" style={{ color: colors.textColor }}>
                {t("christmasAddressText")}
              </p>
            </div>
          )}
        </div>

        {/* Festive footer decoration */}
        <div className="flex items-center justify-center gap-4 mt-12">
          <span className="text-2xl">⭐</span>
          <div
            className="h-1 w-24 rounded-full"
            style={{ backgroundColor: colors.accentColor }}
          />
          <span className="text-3xl">🎄</span>
          <div
            className="h-1 w-24 rounded-full"
            style={{ backgroundColor: colors.accentColor }}
          />
          <span className="text-2xl">⭐</span>
        </div>
      </div>
    </section>
  );
}
