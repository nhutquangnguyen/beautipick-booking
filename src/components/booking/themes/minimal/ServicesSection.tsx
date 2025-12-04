"use client";

import { useState } from "react";
import { ServicesSectionProps } from "../types";

export function MinimalServicesSection({ services, merchant, colors, cart }: ServicesSectionProps) {
  const [hoveredService, setHoveredService] = useState<string | null>(null);

  if (services.length === 0) return null;

  return (
    <section
      id="section-services"
      className="py-32 px-6"
      style={{ backgroundColor: colors.backgroundColor }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Section title */}
        <h2
          className="text-3xl sm:text-4xl font-extralight tracking-wide text-center mb-24"
          style={{
            fontFamily: colors.fontFamily,
            color: colors.textColor,
          }}
        >
          Services
        </h2>

        {/* Services grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {services.map((service) => {
            const isInCart = cart.isServiceInCart(service.id);
            const isHovered = hoveredService === service.id;

            return (
              <div
                key={service.id}
                className="group transition-all duration-500"
                style={{
                  opacity: isHovered ? 1 : 0.85,
                }}
                onMouseEnter={() => setHoveredService(service.id)}
                onMouseLeave={() => setHoveredService(null)}
              >
                {/* Service image */}
                {service.image_url && (
                  <div className="mb-6 overflow-hidden">
                    <img
                      src={service.image_url}
                      alt={service.name}
                      className="w-full h-56 object-cover transition-all duration-700 group-hover:scale-105"
                      style={{
                        borderRadius: colors.borderRadius === "full" ? "16px" : colors.borderRadius === "none" ? "0" : "8px",
                      }}
                    />
                  </div>
                )}

                {/* Service name */}
                <h3
                  className="text-2xl font-light mb-3"
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
                    className="mb-6 opacity-70 leading-relaxed text-sm"
                    style={{
                      fontFamily: colors.fontFamily,
                      color: colors.textColor,
                    }}
                  >
                    {service.description}
                  </p>
                )}

                {/* Price and duration */}
                <div className="flex items-center gap-6 mb-8">
                  <p
                    className="text-xl font-light"
                    style={{ color: colors.primaryColor }}
                  >
                    {merchant.currency === "USD" ? "$" : "€"}
                    {service.price}
                  </p>
                  {service.duration_minutes && (
                    <p
                      className="text-sm opacity-50"
                      style={{ color: colors.textColor }}
                    >
                      {service.duration_minutes} min
                    </p>
                  )}
                </div>

                {/* Add to cart button */}
                <button
                  onClick={() => !isInCart && cart.addServiceToCart(service)}
                  disabled={isInCart}
                  className="w-full py-3 px-6 font-light tracking-wide transition-all duration-500 disabled:opacity-40"
                  style={{
                    backgroundColor: isInCart ? `${colors.textColor}20` : "transparent",
                    color: isInCart ? colors.textColor : colors.primaryColor,
                    border: `1px solid ${isInCart ? `${colors.textColor}20` : colors.primaryColor}`,
                    borderRadius: colors.borderRadius === "full" ? "9999px" : colors.borderRadius === "none" ? "0" : "4px",
                    opacity: isHovered && !isInCart ? 1 : 0.7,
                  }}
                >
                  {isInCart ? "Added" : "Add to Cart"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
