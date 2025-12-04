"use client";

import { ContactSectionProps } from "../types";
import { MapPin, Phone, Mail } from "lucide-react";

export function LuxuryContactSection({ merchant, colors }: ContactSectionProps) {
  const hasContactInfo = merchant.address || merchant.phone || merchant.email || merchant.google_maps_url;

  if (!hasContactInfo) return null;

  return (
    <section className="luxury-section py-16 sm:py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div
          className="rounded-3xl p-12 sm:p-10 backdrop-blur-[30px]"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
            border: `1px solid ${colors.primaryColor}15`,
            boxShadow: '0 4px 24px rgba(0,0,0,0.06), 0 16px 56px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)',
          }}
        >
          {/* Section Title */}
          <div className="flex items-center gap-3 mb-12">
            <div
              className="p-3 rounded-xl"
              style={{ backgroundColor: `${colors.primaryColor}15` }}
            >
              <MapPin className="h-6 w-6" style={{ color: colors.primaryColor }} />
            </div>
            <h2
              className="text-2xl sm:text-3xl font-light uppercase tracking-widest"
              style={{ fontFamily: colors.fontFamily, color: colors.textColor }}
            >
              Contact Us
            </h2>
          </div>

          {/* Contact Info Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {merchant.address && (
              <div className="flex items-start gap-4">
                <div
                  className="p-3 rounded-xl flex-shrink-0"
                  style={{ backgroundColor: `${colors.primaryColor}15` }}
                >
                  <MapPin className="h-5 w-5" style={{ color: colors.primaryColor }} />
                </div>
                <div>
                  <h3
                    className="font-semibold mb-1"
                    style={{ fontFamily: colors.fontFamily, color: colors.textColor }}
                  >
                    Address
                  </h3>
                  <p
                    className="text-sm opacity-70"
                    style={{ fontFamily: colors.fontFamily, color: colors.textColor }}
                  >
                    {merchant.address}
                    {merchant.city && `, ${merchant.city}`}
                    {merchant.state && `, ${merchant.state}`}
                    {merchant.zip_code && ` ${merchant.zip_code}`}
                  </p>
                </div>
              </div>
            )}

            {merchant.phone && (
              <div className="flex items-start gap-4">
                <div
                  className="p-3 rounded-xl flex-shrink-0"
                  style={{ backgroundColor: `${colors.primaryColor}15` }}
                >
                  <Phone className="h-5 w-5" style={{ color: colors.primaryColor }} />
                </div>
                <div>
                  <h3
                    className="font-semibold mb-1"
                    style={{ fontFamily: colors.fontFamily, color: colors.textColor }}
                  >
                    Phone
                  </h3>
                  <a
                    href={`tel:${merchant.phone}`}
                    className="text-sm opacity-70 hover:opacity-100 transition-opacity"
                    style={{ fontFamily: colors.fontFamily, color: colors.textColor }}
                  >
                    {merchant.phone}
                  </a>
                </div>
              </div>
            )}

            {merchant.email && (
              <div className="flex items-start gap-4">
                <div
                  className="p-3 rounded-xl flex-shrink-0"
                  style={{ backgroundColor: `${colors.primaryColor}15` }}
                >
                  <Mail className="h-5 w-5" style={{ color: colors.primaryColor }} />
                </div>
                <div>
                  <h3
                    className="font-semibold mb-1"
                    style={{ fontFamily: colors.fontFamily, color: colors.textColor }}
                  >
                    Email
                  </h3>
                  <a
                    href={`mailto:${merchant.email}`}
                    className="text-sm opacity-70 hover:opacity-100 transition-opacity"
                    style={{ fontFamily: colors.fontFamily, color: colors.textColor }}
                  >
                    {merchant.email}
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Google Maps */}
          {merchant.google_maps_url && (
            <div className="mt-8">
              <a
                href={merchant.google_maps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: colors.buttonStyle === "solid" ? colors.primaryColor : "transparent",
                  color: colors.buttonStyle === "solid" ? "#fff" : colors.primaryColor,
                  border: colors.buttonStyle === "outline" ? `2px solid ${colors.primaryColor}` : "none",
                  borderRadius: colors.borderRadius === "full" ? "9999px" : "8px",
                  fontFamily: colors.fontFamily,
                }}
              >
                <MapPin className="h-4 w-4" />
                View on Google Maps
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
