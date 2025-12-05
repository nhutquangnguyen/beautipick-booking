"use client";

import { useTranslations } from "next-intl";
import { ServicesSectionProps } from "../types";

export function EleganceGridServicesSection({ services, merchant, colors, cart }: ServicesSectionProps) {
  const t = useTranslations("common");
  if (!services || services.length === 0) return null;

  return (
    <section
      id="section-services"
      className="py-20 px-6"
      style={{ backgroundColor: colors.backgroundColor }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2
            className="text-4xl sm:text-5xl font-bold mb-4"
            style={{
              fontFamily: colors.fontFamily,
              color: colors.primaryColor,
            }}
          >
            {t("ourServices")}
          </h2>
          <div
            className="w-20 h-1 mx-auto mb-6"
            style={{ backgroundColor: colors.accentColor }}
          />
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{
              fontFamily: colors.fontFamily,
              color: colors.textColor,
              opacity: 0.8,
            }}
          >
            Professional spa and beauty services tailored for you
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const isInCart = cart.isServiceInCart(service.id);

            return (
              <div
                key={service.id}
                className="group relative overflow-hidden rounded-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2"
                style={{
                  backgroundColor: colors.secondaryColor,
                  boxShadow: `0 4px 20px ${colors.primaryColor}15`,
                  border: `2px solid transparent`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 20px 40px ${colors.accentColor}30`;
                  e.currentTarget.style.borderColor = colors.accentColor;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = `0 4px 20px ${colors.primaryColor}15`;
                  e.currentTarget.style.borderColor = 'transparent';
                }}
              >
                {/* Top Accent Bar */}
                <div
                  className="h-2 w-full"
                  style={{ backgroundColor: colors.accentColor }}
                />

                <div className="p-8">
                  {/* Service Name */}
                  <h3
                    className="text-2xl font-bold mb-3"
                    style={{
                      fontFamily: colors.fontFamily,
                      color: colors.primaryColor,
                    }}
                  >
                    {service.name}
                  </h3>

                  {/* Description */}
                  {service.description && (
                    <p
                      className="text-sm mb-6 line-clamp-3"
                      style={{
                        fontFamily: colors.fontFamily,
                        color: colors.textColor,
                        opacity: 0.7,
                      }}
                    >
                      {service.description}
                    </p>
                  )}

                  {/* Duration and Price */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div
                        className="text-xs uppercase tracking-wide font-semibold mb-1"
                        style={{ color: colors.textColor, opacity: 0.9 }}
                      >
                        Duration
                      </div>
                      <div
                        className="text-lg font-bold"
                        style={{ color: colors.textColor }}
                      >
                        {service.duration_minutes} min
                      </div>
                    </div>

                    <div className="text-right">
                      <div
                        className="text-xs uppercase tracking-wide font-semibold mb-1"
                        style={{ color: colors.textColor, opacity: 0.9 }}
                      >
                        Price
                      </div>
                      <div
                        className="text-2xl font-bold"
                        style={{ color: colors.primaryColor }}
                      >
                        {merchant?.currency} {service.price}
                      </div>
                    </div>
                  </div>

                  {/* Book Button */}
                  <button
                    onClick={() => !isInCart && cart.addServiceToCart(service)}
                    disabled={isInCart}
                    className="w-full py-3 px-6 font-semibold rounded-full text-white transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: isInCart ? colors.primaryColor : colors.accentColor,
                      boxShadow: `0 4px 15px ${colors.accentColor}30`,
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
