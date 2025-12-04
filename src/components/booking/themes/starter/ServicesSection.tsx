"use client";

import { useState } from "react";
import { ServicesSectionProps } from "../types";
import { ChevronRight } from "lucide-react";

export function StarterServicesSection({ services, merchant, colors, cart }: ServicesSectionProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (services.length === 0) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: merchant?.currency || 'USD',
    }).format(price);
  };

  return (
    <div className="w-full">
      {/* Section Title */}
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-center" style={{ color: colors.primaryColor }}>
          Services
        </h2>
      </div>

      {/* Services Stack */}
      <div className="flex flex-col gap-3">
        {services.map((service) => {
          const isInCart = cart.isServiceInCart(service.id);
          const isHovered = hoveredId === service.id;

          return (
            <button
              key={service.id}
              onClick={() => {
                if (!isInCart) {
                  cart.addServiceToCart(service);
                } else {
                  cart.removeFromCart(service.id);
                }
              }}
              onMouseEnter={() => setHoveredId(service.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="w-full bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-4 flex items-center justify-between cursor-pointer border border-gray-200"
              style={{
                transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                borderColor: isInCart ? colors.primaryColor : '#E5E7EB',
                backgroundColor: isInCart ? colors.primaryColor + '08' : '#FFFFFF',
              }}
            >
              <div className="flex-1 text-left">
                <div className="font-semibold text-gray-900">{service.name}</div>
                {service.description && (
                  <div className="text-sm text-gray-600 mt-1 line-clamp-1">
                    {service.description}
                  </div>
                )}
                <div className="text-sm font-medium mt-2" style={{ color: colors.primaryColor }}>
                  {formatPrice(service.price)}
                  {service.duration_minutes && ` • ${service.duration_minutes} min`}
                </div>
              </div>

              <div className="ml-4 flex items-center gap-2">
                {isInCart && (
                  <span className="text-xs font-medium px-2 py-1 rounded-full" style={{
                    backgroundColor: colors.primaryColor,
                    color: '#FFFFFF'
                  }}>
                    Added
                  </span>
                )}
                <ChevronRight
                  className="w-5 h-5"
                  style={{ color: isHovered ? colors.primaryColor : '#9CA3AF' }}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
