"use client";

import { ServicesSectionProps } from "../types";

export function GridServicesSection({ services, merchant, colors, cart }: ServicesSectionProps) {
  if (!services || services.length === 0) return null;

  return (
    <section
      id="section-services"
      className="py-20 px-6 relative"
      style={{
        backgroundColor: `${colors.backgroundColor}f8`,
      }}
    >
      <div className="max-w-7xl mx-auto">
        <h2
          className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 text-center"
          style={{
            fontFamily: colors.fontFamily,
            color: colors.primaryColor,
          }}
        >
          Our Services
        </h2>
        <p
          className="text-lg text-center mb-12 opacity-80 max-w-2xl mx-auto"
          style={{
            fontFamily: colors.fontFamily,
            color: colors.textColor,
          }}
        >
          Discover our range of professional services designed just for you
        </p>

        {/* Grid layout for services */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, idx) => {
            const isInCart = cart.isServiceInCart(service.id);
            const accentColors = [colors.primaryColor, colors.secondaryColor, colors.accentColor];
            const serviceColor = accentColors[idx % 3];

            return (
              <div
                key={service.id}
                className="group relative overflow-hidden transition-all duration-500 hover:scale-105"
                style={{
                  backgroundColor: colors.backgroundColor,
                  borderRadius: colors.borderRadius === "full" ? "24px" : colors.borderRadius === "none" ? "0" : "16px",
                  border: `2px solid ${serviceColor}30`,
                  boxShadow: `0 4px 20px ${serviceColor}20`,
                }}
              >
                {/* Top accent bar */}
                <div
                  className="h-2 w-full transition-all duration-300 group-hover:h-3"
                  style={{ backgroundColor: serviceColor }}
                />

                <div className="p-6">
                  {/* Service name */}
                  <h3
                    className="text-2xl font-bold mb-3"
                    style={{
                      fontFamily: colors.fontFamily,
                      color: colors.textColor,
                    }}
                  >
                    {service.name}
                  </h3>

                  {/* Description */}
                  {service.description && (
                    <p
                      className="text-sm mb-4 opacity-80 line-clamp-3"
                      style={{
                        fontFamily: colors.fontFamily,
                        color: colors.textColor,
                      }}
                    >
                      {service.description}
                    </p>
                  )}

                  {/* Duration and Price Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div
                      className="p-3 text-center"
                      style={{
                        backgroundColor: `${serviceColor}10`,
                        borderRadius: colors.borderRadius === "full" ? "9999px" : colors.borderRadius === "none" ? "0" : "8px",
                      }}
                    >
                      <div className="text-xs opacity-70" style={{ color: colors.textColor }}>
                        Duration
                      </div>
                      <div className="font-bold" style={{ color: serviceColor }}>
                        {service.duration_minutes} min
                      </div>
                    </div>

                    <div
                      className="p-3 text-center"
                      style={{
                        backgroundColor: `${serviceColor}10`,
                        borderRadius: colors.borderRadius === "full" ? "9999px" : colors.borderRadius === "none" ? "0" : "8px",
                      }}
                    >
                      <div className="text-xs opacity-70" style={{ color: colors.textColor }}>
                        Price
                      </div>
                      <div className="font-bold" style={{ color: serviceColor }}>
                        {merchant.currency} {service.price}
                      </div>
                    </div>
                  </div>

                  {/* Book button */}
                  <button
                    onClick={() => !isInCart && cart.addServiceToCart(service)}
                    disabled={isInCart}
                    className="w-full py-3 px-6 font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: colors.buttonStyle === "solid" ? serviceColor : "transparent",
                      color: colors.buttonStyle === "solid" ? "#fff" : serviceColor,
                      border: colors.buttonStyle === "outline" ? `2px solid ${serviceColor}` : "none",
                      borderRadius: colors.borderRadius === "full" ? "9999px" : colors.borderRadius === "none" ? "0" : "8px",
                    }}
                  >
                    {isInCart ? "✓ Added to Cart" : "Book Now"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
