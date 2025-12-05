"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ServicesSectionProps } from "../types";

export function ChristmasServicesSection({ services, merchant, colors, cart }: ServicesSectionProps) {
  const t = useTranslations("common");
  const [hoveredService, setHoveredService] = useState<string | null>(null);

  if (services.length === 0) return null;

  return (
    <section
      id="section-services"
      className="py-20 px-6"
      style={{ backgroundColor: `${colors.backgroundColor}f8` }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Festive header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-3xl">🎄</span>
            <h2
              className="text-4xl sm:text-5xl font-bold"
              style={{
                fontFamily: colors.fontFamily,
                color: colors.primaryColor,
              }}
            >
              {t("ourServices")}
            </h2>
            <span className="text-3xl">🎄</span>
          </div>
          <p
            className="text-lg"
            style={{ color: colors.secondaryColor }}
          >
            {t("christmasServicesSubtitle")}
          </p>
        </div>

        {/* Services grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const isInCart = cart.isServiceInCart(service.id);
            const isHovered = hoveredService === service.id;

            return (
              <div
                key={service.id}
                className="group relative rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2"
                style={{
                  backgroundColor: "#fff",
                  boxShadow: isHovered
                    ? `0 20px 40px ${colors.primaryColor}40`
                    : '0 8px 20px rgba(0,0,0,0.1)',
                  border: `2px solid ${isHovered ? colors.primaryColor : colors.accentColor}`,
                }}
                onMouseEnter={() => setHoveredService(service.id)}
                onMouseLeave={() => setHoveredService(null)}
              >
                {/* Top festive border */}
                <div
                  className="absolute top-0 left-0 right-0 h-2"
                  style={{
                    background: `linear-gradient(90deg, ${colors.primaryColor}, ${colors.accentColor}, ${colors.secondaryColor})`,
                  }}
                />

                {/* Service image */}
                {service.image_url && (
                  <div className="relative overflow-hidden">
                    <img
                      src={service.image_url}
                      alt={service.name}
                      className="w-full h-56 object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Snowflake overlay */}
                    <div className="absolute top-4 right-4 text-3xl opacity-80">
                      ❄️
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  {/* Service name */}
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
                      className="mb-4 line-clamp-3"
                      style={{
                        fontFamily: colors.fontFamily,
                        color: colors.textColor,
                        opacity: 0.85,
                      }}
                    >
                      {service.description}
                    </p>
                  )}

                  {/* Price and duration */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p
                        className="text-3xl font-bold"
                        style={{ color: colors.secondaryColor }}
                      >
                        {merchant?.currency === "USD" ? "$" : "€"}
                        {service.price}
                      </p>
                      {service.duration_minutes && (
                        <p
                          className="text-sm mt-1"
                          style={{ color: colors.textColor, opacity: 0.7 }}
                        >
                          {service.duration_minutes} min
                        </p>
                      )}
                    </div>
                    <span className="text-2xl">🎁</span>
                  </div>

                  {/* Add to cart button */}
                  <button
                    onClick={() => !isInCart && cart.addServiceToCart(service)}
                    disabled={isInCart}
                    className="w-full py-3 px-6 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: isInCart ? colors.textColor : colors.primaryColor,
                      color: "#fff",
                      border: `2px solid ${isInCart ? colors.textColor : colors.accentColor}`,
                    }}
                  >
                    {isInCart ? t("addedToCart") : t("christmasAddToCartService")}
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
