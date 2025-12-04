"use client";

import { useState } from "react";
import { ServicesSectionProps } from "../types";

export function ModernServicesSection({ services, merchant, colors, cart }: ServicesSectionProps) {
  const [hoveredService, setHoveredService] = useState<string | null>(null);

  if (services.length === 0) return null;

  return (
    <section
      id="section-services"
      className="modern-section py-20 px-6"
      style={{ backgroundColor: `${colors.backgroundColor}f5` }}
    >
      <div className="max-w-7xl mx-auto">
        <h2
          className="text-4xl sm:text-5xl font-bold text-center mb-16"
          style={{
            fontFamily: colors.fontFamily,
            background: `linear-gradient(135deg, ${colors.primaryColor}, ${colors.secondaryColor})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Our Services
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const isInCart = cart.isServiceInCart(service.id);
            const isHovered = hoveredService === service.id;

            return (
              <div
                key={service.id}
                className="group relative rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1"
                style={{
                  backgroundColor: colors.backgroundColor,
                  boxShadow: isHovered
                    ? `0 20px 40px ${colors.primaryColor}30`
                    : '0 4px 20px rgba(0,0,0,0.08)',
                  border: `2px solid ${isHovered ? colors.primaryColor : 'transparent'}`,
                }}
                onMouseEnter={() => setHoveredService(service.id)}
                onMouseLeave={() => setHoveredService(null)}
              >
                {/* Gradient accent bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                  style={{
                    background: `linear-gradient(90deg, ${colors.primaryColor}, ${colors.secondaryColor})`,
                  }}
                />

                {/* Service image */}
                {service.image_url && (
                  <div className="mb-6 rounded-xl overflow-hidden">
                    <img
                      src={service.image_url}
                      alt={service.name}
                      className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

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
                    className="mb-4 opacity-80 line-clamp-3"
                    style={{
                      fontFamily: colors.fontFamily,
                      color: colors.textColor,
                    }}
                  >
                    {service.description}
                  </p>
                )}

                {/* Price and duration */}
                <div className="flex items-center justify-between mb-6">
                  <div className="space-y-1">
                    <p
                      className="text-2xl font-bold"
                      style={{ color: colors.primaryColor }}
                    >
                      {merchant.currency === "USD" ? "$" : "€"}
                      {service.price}
                    </p>
                    {service.duration_minutes && (
                      <p
                        className="text-sm opacity-60"
                        style={{ color: colors.textColor }}
                      >
                        {service.duration_minutes} min
                      </p>
                    )}
                  </div>
                </div>

                {/* Add to cart button */}
                <button
                  onClick={() => !isInCart && cart.addServiceToCart(service)}
                  disabled={isInCart}
                  className="w-full py-3 px-6 font-semibold rounded-xl transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: isInCart
                      ? colors.textColor
                      : `linear-gradient(135deg, ${colors.primaryColor}, ${colors.secondaryColor})`,
                    color: "#fff",
                    borderRadius: colors.borderRadius === "full" ? "9999px" : colors.borderRadius === "none" ? "0" : "12px",
                  }}
                >
                  {isInCart ? "✓ Added" : "Add to Cart"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
