"use client";

import { useState } from "react";
import { ServicesSectionProps } from "../types";

export function PortfolioServicesSection({ services, merchant, colors, cart }: ServicesSectionProps) {
  const [hoveredService, setHoveredService] = useState<string | null>(null);

  if (services.length === 0) return null;

  return (
    <section
      id="section-services"
      className="py-24 px-6"
      style={{ backgroundColor: `${colors.backgroundColor}f5` }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section title */}
        <div className="mb-16">
          <div
            className="w-20 h-2 mb-6"
            style={{
              background: `linear-gradient(90deg, ${colors.primaryColor}, ${colors.secondaryColor})`,
            }}
          />
          <h2
            className="text-5xl sm:text-6xl font-black uppercase"
            style={{
              fontFamily: colors.fontFamily,
              color: colors.textColor,
            }}
          >
            Services
          </h2>
        </div>

        {/* Services grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const isInCart = cart.isServiceInCart(service.id);
            const isHovered = hoveredService === service.id;

            return (
              <div
                key={service.id}
                className="group relative transition-all duration-300 hover:scale-105"
                style={{
                  borderRadius: colors.borderRadius === "full" ? "24px" : colors.borderRadius === "none" ? "0" : "16px",
                  backgroundColor: colors.backgroundColor,
                  boxShadow: isHovered
                    ? `0 20px 60px ${colors.primaryColor}40`
                    : "0 10px 30px rgba(0,0,0,0.1)",
                }}
                onMouseEnter={() => setHoveredService(service.id)}
                onMouseLeave={() => setHoveredService(null)}
              >
                {/* Service image */}
                {service.image_url && (
                  <div className="relative overflow-hidden mb-6">
                    <img
                      src={service.image_url}
                      alt={service.name}
                      className="w-full h-64 object-cover transform transition-transform duration-500 group-hover:scale-110"
                      style={{
                        borderRadius: colors.borderRadius === "full" ? "24px 24px 0 0" : colors.borderRadius === "none" ? "0" : "16px 16px 0 0",
                      }}
                    />
                    {/* Overlay gradient */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: `linear-gradient(135deg, ${colors.primaryColor}aa, ${colors.secondaryColor}aa)`,
                      }}
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  {/* Service name */}
                  <h3
                    className="text-2xl font-black mb-3 uppercase"
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
                      className="mb-6 opacity-80 line-clamp-3 font-semibold"
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
                    <div>
                      <p
                        className="text-3xl font-black"
                        style={{ color: colors.primaryColor }}
                      >
                        {merchant.currency === "USD" ? "$" : "€"}
                        {service.price}
                      </p>
                      {service.duration_minutes && (
                        <p
                          className="text-sm font-bold opacity-60"
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
                    className="w-full py-4 px-6 font-black uppercase tracking-wider transition-all duration-300 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: isInCart
                        ? `${colors.textColor}40`
                        : `linear-gradient(135deg, ${colors.primaryColor}, ${colors.secondaryColor})`,
                      color: "#fff",
                      borderRadius: colors.borderRadius === "full" ? "9999px" : colors.borderRadius === "none" ? "0" : "12px",
                    }}
                  >
                    {isInCart ? "✓ ADDED" : "ADD TO CART"}
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
