"use client";

import { ServicesSectionProps } from "../types";
import { Sparkles, Clock, Check, Plus, X } from "lucide-react";
import { formatCurrency, formatDuration } from "@/lib/utils";
import { useMemo } from "react";
import { Service } from "@/types/database";
import { getBorderRadius } from "../utils";

export function LuxuryServicesSection({ services, merchant, colors, cart }: ServicesSectionProps) {
  if (services.length === 0) return null;

  const cardRadius = getBorderRadius(colors.borderRadius);

  // Group services by category
  const servicesByCategory = useMemo(() => {
    const grouped: Record<string, Service[]> = {};
    services.forEach((service) => {
      const category = service.category || "Services";
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(service);
    });
    return grouped;
  }, [services]);

  return (
    <section id="section-services" className="luxury-section py-16 sm:py-24 px-6 scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <div
          className="relative overflow-hidden rounded-3xl p-12 sm:p-10 backdrop-blur-[30px]"
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
              <Sparkles className="h-6 w-6" style={{ color: colors.primaryColor }} />
            </div>
            <h2
              className="text-2xl sm:text-3xl font-light uppercase tracking-widest"
              style={{ fontFamily: colors.fontFamily, color: colors.textColor }}
            >
              Our Services
            </h2>
          </div>

          {/* Services List */}
          <div className="space-y-8">
            {Object.entries(servicesByCategory).map(([category, categoryServices]) => (
              <div key={category}>
                {/* Category Header */}
                {Object.keys(servicesByCategory).length > 1 && (
                  <div className="flex items-center gap-4 mb-6">
                    <div
                      className="h-px flex-1"
                      style={{
                        background: `linear-gradient(to right, ${colors.primaryColor}30, transparent)`,
                      }}
                    />
                    <h3
                      className="text-sm font-bold uppercase tracking-widest px-4"
                      style={{ color: colors.primaryColor, fontFamily: colors.fontFamily }}
                    >
                      {category}
                    </h3>
                    <div
                      className="h-px flex-1"
                      style={{
                        background: `linear-gradient(to left, ${colors.primaryColor}30, transparent)`,
                      }}
                    />
                  </div>
                )}

                {/* Service Items */}
                <div className="space-y-4">
                  {categoryServices.map((service) => {
                    const inCart = cart.isServiceInCart(service.id);
                    return (
                      <div
                        key={service.id}
                        className="relative group transition-all duration-300 hover:-translate-y-0.5"
                        style={{
                          borderRadius: cardRadius,
                          backgroundColor: colors.backgroundColor,
                          border: inCart
                            ? `2px solid ${colors.primaryColor}`
                            : `1px solid ${colors.primaryColor}12`,
                          boxShadow: inCart
                            ? `0 4px 20px ${colors.primaryColor}25`
                            : `0 4px 20px ${colors.primaryColor}06`,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = `0 8px 32px ${colors.primaryColor}15`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = inCart
                            ? `0 4px 20px ${colors.primaryColor}25`
                            : `0 4px 20px ${colors.primaryColor}06`;
                        }}
                      >
                        <div className="flex items-center justify-between p-6 sm:p-8">
                          {/* Service Info */}
                          <div className="flex-1 min-w-0 pr-4">
                            <div className="flex items-center gap-2 mb-2">
                              <h3
                                className="font-semibold text-base sm:text-lg"
                                style={{ fontFamily: colors.fontFamily, color: colors.textColor }}
                              >
                                {service.name}
                              </h3>
                              {inCart && (
                                <Check className="h-5 w-5 flex-shrink-0" style={{ color: colors.primaryColor }} />
                              )}
                            </div>

                            {service.description && (
                              <p
                                className="text-sm opacity-60 mb-3 line-clamp-2"
                                style={{ fontFamily: colors.fontFamily, color: colors.textColor }}
                              >
                                {service.description}
                              </p>
                            )}

                            {/* Duration Badge */}
                            <div
                              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
                              style={{
                                backgroundColor: `${colors.primaryColor}10`,
                                color: colors.primaryColor,
                                fontFamily: colors.fontFamily,
                              }}
                            >
                              <Clock className="h-3.5 w-3.5" />
                              <span>{formatDuration(service.duration_minutes)}</span>
                            </div>
                          </div>

                          {/* Price and Action */}
                          <div className="flex items-center gap-4 flex-shrink-0">
                            <p
                              className="text-xl sm:text-2xl font-bold"
                              style={{ color: colors.primaryColor, fontFamily: colors.fontFamily }}
                            >
                              {formatCurrency(service.price, merchant.currency)}
                            </p>

                            {inCart ? (
                              <button
                                onClick={() => cart.removeFromCart(service.id)}
                                className="p-3 rounded-full transition-all duration-300 hover:scale-110"
                                style={{ backgroundColor: "#EF4444", color: "#fff" }}
                                aria-label="Remove from cart"
                              >
                                <X className="h-5 w-5" />
                              </button>
                            ) : (
                              <button
                                onClick={() => cart.addServiceToCart(service)}
                                className="relative overflow-hidden p-3 rounded-full transition-all duration-300 hover:scale-110"
                                style={{
                                  backgroundColor: colors.primaryColor,
                                  color: "#fff",
                                  boxShadow: `0 2px 8px rgba(0,0,0,0.15)`,
                                }}
                                aria-label="Add to cart"
                              >
                                <Plus className="h-5 w-5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Left border accent */}
                        <div
                          className="absolute left-0 top-0 w-[3px] h-0 group-hover:h-full transition-all duration-400"
                          style={{ background: `linear-gradient(to bottom, ${colors.primaryColor}80, transparent)` }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
