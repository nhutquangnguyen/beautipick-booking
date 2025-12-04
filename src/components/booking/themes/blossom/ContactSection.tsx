"use client";

import { Phone, Mail, MapPin } from "lucide-react";
import { ContactSectionProps } from "../types";

export function BlossomContactSection({ merchant, colors }: ContactSectionProps) {
  const hasContactInfo = merchant.phone || merchant.email || merchant.address;

  if (!hasContactInfo) return null;

  return (
    <section className="blossom-section py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h2
          className="text-4xl sm:text-5xl font-bold mb-12 text-center"
          style={{
            fontFamily: "'Dancing Script', cursive",
            color: colors.textColor,
          }}
        >
          Get in Touch
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {merchant.phone && (
            <a
              href={`tel:${merchant.phone}`}
              className="p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg"
              style={{
                backgroundColor: colors.accentColor,
                borderRadius: "16px",
                boxShadow: `0 4px 12px ${colors.primaryColor}20`,
              }}
            >
              <div
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: colors.primaryColor,
                }}
              >
                <Phone size={28} color="#fff" />
              </div>
              <h3
                className="text-lg font-semibold mb-2"
                style={{
                  fontFamily: "'Lato', sans-serif",
                  color: colors.textColor,
                }}
              >
                Phone
              </h3>
              <p
                className="text-sm"
                style={{
                  fontFamily: "'Lato', sans-serif",
                  color: colors.textColor,
                  opacity: 0.9,
                }}
              >
                {merchant.phone}
              </p>
            </a>
          )}

          {merchant.email && (
            <a
              href={`mailto:${merchant.email}`}
              className="p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg"
              style={{
                backgroundColor: colors.accentColor,
                borderRadius: "16px",
                boxShadow: `0 4px 12px ${colors.primaryColor}20`,
              }}
            >
              <div
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: colors.primaryColor,
                }}
              >
                <Mail size={28} color="#fff" />
              </div>
              <h3
                className="text-lg font-semibold mb-2"
                style={{
                  fontFamily: "'Lato', sans-serif",
                  color: colors.textColor,
                }}
              >
                Email
              </h3>
              <p
                className="text-sm break-words"
                style={{
                  fontFamily: "'Lato', sans-serif",
                  color: colors.textColor,
                  opacity: 0.9,
                }}
              >
                {merchant.email}
              </p>
            </a>
          )}

          {merchant.address && (
            <a
              href={merchant.google_maps_url || `https://maps.google.com/?q=${encodeURIComponent(merchant.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg"
              style={{
                backgroundColor: colors.accentColor,
                borderRadius: "16px",
                boxShadow: `0 4px 12px ${colors.primaryColor}20`,
              }}
            >
              <div
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: colors.primaryColor,
                }}
              >
                <MapPin size={28} color="#fff" />
              </div>
              <h3
                className="text-lg font-semibold mb-2"
                style={{
                  fontFamily: "'Lato', sans-serif",
                  color: colors.textColor,
                }}
              >
                Address
              </h3>
              <p
                className="text-sm"
                style={{
                  fontFamily: "'Lato', sans-serif",
                  color: colors.textColor,
                  opacity: 0.9,
                }}
              >
                {merchant.address}
              </p>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
