"use client";

import { ContactSectionProps } from "../types";
import { MapPin, Phone, Mail } from "lucide-react";

export function ClassicContactSection({ merchant, colors }: ContactSectionProps) {
  const hasContactInfo = merchant.address || merchant.phone || merchant.email || merchant.google_maps_url;
  if (!hasContactInfo) return null;

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2
            className="text-3xl sm:text-4xl font-serif font-bold mb-4"
            style={{ fontFamily: colors.fontFamily, color: colors.textColor }}
          >
            Contact Us
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-12" style={{ backgroundColor: colors.primaryColor }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.primaryColor }} />
            <div className="h-px w-12" style={{ backgroundColor: colors.primaryColor }} />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {merchant.address && (
            <div className="text-center">
              <div
                className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                style={{ backgroundColor: `${colors.primaryColor}15` }}
              >
                <MapPin className="h-6 w-6" style={{ color: colors.primaryColor }} />
              </div>
              <h3
                className="font-serif font-bold mb-2"
                style={{ fontFamily: colors.fontFamily, color: colors.textColor }}
              >
                Address
              </h3>
              <p className="text-sm opacity-70">
                {merchant.address}
                {merchant.city && `, ${merchant.city}`}
                {merchant.state && `, ${merchant.state}`}
                {merchant.zip_code && ` ${merchant.zip_code}`}
              </p>
            </div>
          )}

          {merchant.phone && (
            <div className="text-center">
              <div
                className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                style={{ backgroundColor: `${colors.primaryColor}15` }}
              >
                <Phone className="h-6 w-6" style={{ color: colors.primaryColor }} />
              </div>
              <h3
                className="font-serif font-bold mb-2"
                style={{ fontFamily: colors.fontFamily, color: colors.textColor }}
              >
                Phone
              </h3>
              <a
                href={`tel:${merchant.phone}`}
                className="text-sm opacity-70 hover:opacity-100 transition-opacity"
              >
                {merchant.phone}
              </a>
            </div>
          )}

          {merchant.email && (
            <div className="text-center">
              <div
                className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                style={{ backgroundColor: `${colors.primaryColor}15` }}
              >
                <Mail className="h-6 w-6" style={{ color: colors.primaryColor }} />
              </div>
              <h3
                className="font-serif font-bold mb-2"
                style={{ fontFamily: colors.fontFamily, color: colors.textColor }}
              >
                Email
              </h3>
              <a
                href={`mailto:${merchant.email}`}
                className="text-sm opacity-70 hover:opacity-100 transition-opacity"
              >
                {merchant.email}
              </a>
            </div>
          )}
        </div>

        {merchant.google_maps_url && (
          <div className="text-center mt-10">
            <a
              href={merchant.google_maps_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-all hover:shadow-lg"
              style={{
                backgroundColor: colors.buttonStyle === "solid" ? colors.primaryColor : "transparent",
                color: colors.buttonStyle === "solid" ? "#fff" : colors.primaryColor,
                border: colors.buttonStyle === "outline" ? `2px solid ${colors.primaryColor}` : "none",
                borderRadius: "4px",
                fontFamily: colors.fontFamily,
              }}
            >
              <MapPin className="h-4 w-4" />
              View on Google Maps
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
