"use client";

import { ContactSectionProps } from "../types";

export function GridContactSection({ merchant, colors }: ContactSectionProps) {
  return (
    <section
      id="section-contact"
      className="py-20 px-6 relative"
      style={{ backgroundColor: colors.backgroundColor }}
    >
      <div className="max-w-7xl mx-auto">
        <h2
          className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-12 text-center"
          style={{
            fontFamily: colors.fontFamily,
            color: colors.primaryColor,
          }}
        >
          Contact Us
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Info Cards */}
          <div className="space-y-6">
            {/* Address */}
            {merchant.address && (
              <div
                className="p-6 transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: `${colors.primaryColor}10`,
                  borderLeft: `4px solid ${colors.primaryColor}`,
                  borderRadius: colors.borderRadius === "full" ? "24px" : colors.borderRadius === "none" ? "0" : "12px",
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: colors.primaryColor,
                      color: "#fff",
                      borderRadius: colors.borderRadius === "full" ? "50%" : colors.borderRadius === "none" ? "0" : "8px",
                    }}
                  >
                    📍
                  </div>
                  <div className="flex-1">
                    <h3
                      className="font-bold text-lg mb-1"
                      style={{
                        fontFamily: colors.fontFamily,
                        color: colors.primaryColor,
                      }}
                    >
                      Address
                    </h3>
                    <p
                      className="opacity-90"
                      style={{
                        fontFamily: colors.fontFamily,
                        color: colors.textColor,
                      }}
                    >
                      {merchant.address}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Phone */}
            {merchant.phone && (
              <div
                className="p-6 transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: `${colors.secondaryColor}10`,
                  borderLeft: `4px solid ${colors.secondaryColor}`,
                  borderRadius: colors.borderRadius === "full" ? "24px" : colors.borderRadius === "none" ? "0" : "12px",
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: colors.secondaryColor,
                      color: "#fff",
                      borderRadius: colors.borderRadius === "full" ? "50%" : colors.borderRadius === "none" ? "0" : "8px",
                    }}
                  >
                    📞
                  </div>
                  <div className="flex-1">
                    <h3
                      className="font-bold text-lg mb-1"
                      style={{
                        fontFamily: colors.fontFamily,
                        color: colors.secondaryColor,
                      }}
                    >
                      Phone
                    </h3>
                    <a
                      href={`tel:${merchant.phone}`}
                      className="opacity-90 hover:underline"
                      style={{
                        fontFamily: colors.fontFamily,
                        color: colors.textColor,
                      }}
                    >
                      {merchant.phone}
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Email */}
            {merchant.email && (
              <div
                className="p-6 transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: `${colors.accentColor}10`,
                  borderLeft: `4px solid ${colors.accentColor}`,
                  borderRadius: colors.borderRadius === "full" ? "24px" : colors.borderRadius === "none" ? "0" : "12px",
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: colors.accentColor,
                      color: "#fff",
                      borderRadius: colors.borderRadius === "full" ? "50%" : colors.borderRadius === "none" ? "0" : "8px",
                    }}
                  >
                    ✉️
                  </div>
                  <div className="flex-1">
                    <h3
                      className="font-bold text-lg mb-1"
                      style={{
                        fontFamily: colors.fontFamily,
                        color: colors.accentColor,
                      }}
                    >
                      Email
                    </h3>
                    <a
                      href={`mailto:${merchant.email}`}
                      className="opacity-90 hover:underline"
                      style={{
                        fontFamily: colors.fontFamily,
                        color: colors.textColor,
                      }}
                    >
                      {merchant.email}
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Map or Decorative Grid */}
          <div className="relative h-96 lg:h-auto">
            <div className="grid grid-cols-4 grid-rows-4 gap-3 h-full">
              {[...Array(16)].map((_, idx) => (
                <div
                  key={idx}
                  className="transition-all duration-500 hover:scale-110 hover:rotate-12"
                  style={{
                    backgroundColor: idx % 4 === 0 ? colors.primaryColor : idx % 4 === 1 ? colors.secondaryColor : idx % 4 === 2 ? colors.accentColor : `${colors.primaryColor}30`,
                    opacity: 0.1 + (idx * 0.04),
                    borderRadius: colors.borderRadius === "full" ? "50%" : colors.borderRadius === "none" ? "0" : "8px",
                  }}
                />
              ))}
            </div>
            {/* Center text overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="text-center p-8 backdrop-blur-sm"
                style={{
                  backgroundColor: `${colors.backgroundColor}e0`,
                  borderRadius: colors.borderRadius === "full" ? "24px" : colors.borderRadius === "none" ? "0" : "16px",
                }}
              >
                <h3
                  className="text-3xl font-bold mb-2"
                  style={{
                    fontFamily: colors.fontFamily,
                    color: colors.primaryColor,
                  }}
                >
                  Visit Us
                </h3>
                <p
                  className="opacity-80"
                  style={{
                    fontFamily: colors.fontFamily,
                    color: colors.textColor,
                  }}
                >
                  We'd love to see you!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
