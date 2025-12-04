"use client";

import { ServicesSectionProps } from "../types";
import { Clock, Check, Plus, X } from "lucide-react";
import { formatCurrency, formatDuration } from "@/lib/utils";
import { useMemo } from "react";
import { Service } from "@/types/database";

export function ClassicServicesSection({ services, merchant, colors, cart }: ServicesSectionProps) {
  if (services.length === 0) return null;

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
    <section id="section-services" className="py-16 px-6 bg-gray-50 scroll-mt-20">
      <div className="max-w-5xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2
            className="text-3xl sm:text-4xl font-serif font-bold mb-4"
            style={{ fontFamily: colors.fontFamily, color: colors.textColor }}
          >
            Our Services
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-12" style={{ backgroundColor: colors.primaryColor }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.primaryColor }} />
            <div className="h-px w-12" style={{ backgroundColor: colors.primaryColor }} />
          </div>
        </div>

        {/* Services List */}
        <div className="space-y-12">
          {Object.entries(servicesByCategory).map(([category, categoryServices]) => (
            <div key={category}>
              {/* Category Header */}
              {Object.keys(servicesByCategory).length > 1 && (
                <h3
                  className="text-xl font-serif font-bold mb-6 text-center"
                  style={{ color: colors.primaryColor, fontFamily: colors.fontFamily }}
                >
                  {category}
                </h3>
              )}

              {/* Service Items - Menu Style */}
              <div className="bg-white rounded shadow-lg overflow-hidden">
                {categoryServices.map((service, index) => {
                  const inCart = cart.isServiceInCart(service.id);
                  return (
                    <div
                      key={service.id}
                      className={`transition-colors duration-200 ${index !== categoryServices.length - 1 ? 'border-b' : ''}`}
                      style={{
                        borderColor: `${colors.primaryColor}15`,
                        backgroundColor: inCart ? `${colors.primaryColor}08` : 'transparent',
                      }}
                      onMouseEnter={(e) => {
                        if (!inCart) {
                          e.currentTarget.style.backgroundColor = `${colors.primaryColor}05`;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!inCart) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      <div className="flex items-start justify-between p-6 gap-4">
                        {/* Service Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3
                              className="font-serif font-bold text-lg"
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
                              className="text-sm mb-3 opacity-70"
                              style={{ fontFamily: colors.fontFamily, color: colors.textColor }}
                            >
                              {service.description}
                            </p>
                          )}

                          {/* Duration */}
                          <div
                            className="inline-flex items-center gap-2 text-xs"
                            style={{ color: colors.primaryColor, fontFamily: colors.fontFamily }}
                          >
                            <Clock className="h-3.5 w-3.5" />
                            <span>{formatDuration(service.duration_minutes)}</span>
                          </div>
                        </div>

                        {/* Price and Action */}
                        <div className="flex items-center gap-4 flex-shrink-0">
                          <p
                            className="text-2xl font-bold"
                            style={{ color: colors.primaryColor, fontFamily: colors.fontFamily }}
                          >
                            {formatCurrency(service.price, merchant?.currency)}
                          </p>

                          {inCart ? (
                            <button
                              onClick={() => cart.removeFromCart(service.id)}
                              className="p-2.5 rounded transition-all duration-300"
                              style={{ backgroundColor: "#EF4444", color: "#fff" }}
                              aria-label="Remove from cart"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => cart.addServiceToCart(service)}
                              className="p-2.5 rounded transition-all duration-300"
                              style={{ backgroundColor: colors.primaryColor, color: "#fff" }}
                              aria-label="Add to cart"
                            >
                              <Plus className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
