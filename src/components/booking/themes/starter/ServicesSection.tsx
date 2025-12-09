"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ServicesSectionProps } from "../types";
import { Calendar, Scissors } from "lucide-react";
import { ItemDetailModal } from "../../ItemDetailModal";
import { Service } from "@/types/database";
import { createClient } from "@/lib/supabase/client";

export function StarterServicesSection({ services, merchant, colors, cart }: ServicesSectionProps) {
  const t = useTranslations("common");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const supabase = createClient();

  if (services.length === 0) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: merchant?.currency || 'USD',
    }).format(price);
  };

  const getServiceImageUrl = (service: Service): string | null => {
    const images = (service as any).images;
    const imageKey = images && images.length > 0 ? images[0] : service.image_url;

    if (!imageKey) return null;
    if (imageKey.startsWith('http://') || imageKey.startsWith('https://')) {
      return imageKey;
    }

    const { data } = supabase.storage.from('images').getPublicUrl(imageKey);
    return data.publicUrl;
  };

  return (
    <>
      <div className="w-full">
        {/* Section Title */}
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-center" style={{ color: colors.primaryColor }}>
            {t("services")}
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
                onClick={() => setSelectedService(service)}
                onMouseEnter={() => setHoveredId(service.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="w-full bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-4 flex items-center gap-4 cursor-pointer border border-gray-200"
                style={{
                  transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                  borderColor: isInCart ? colors.primaryColor : '#E5E7EB',
                  backgroundColor: isInCart ? colors.primaryColor + '08' : '#FFFFFF',
                }}
              >
                {/* Service Avatar */}
                {getServiceImageUrl(service) ? (
                  <img
                    src={getServiceImageUrl(service)!}
                    alt={service.name}
                    className="h-16 w-16 rounded-lg object-cover flex-shrink-0"
                  />
                ) : (
                  <div
                    className="h-16 w-16 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: colors.primaryColor + '20',
                    }}
                  >
                    <Scissors className="h-7 w-7" style={{ color: colors.primaryColor }} />
                  </div>
                )}

                <div className="flex-1 text-left min-w-0">
                  <div className="font-semibold text-gray-900">{service.name}</div>
                  {service.description && (
                    <div className="text-sm text-gray-600 mt-1 line-clamp-1">
                      {service.description}
                    </div>
                  )}
                  <div className="text-sm font-medium mt-2" style={{ color: colors.primaryColor }}>
                    {formatPrice(service.price)}
                    {service.duration_minutes && ` • ${service.duration_minutes} ${t("min")}`}
                  </div>
                </div>

                <div className="ml-4 flex items-center gap-2">
                  {isInCart ? (
                    <span className="text-xs font-medium px-3 py-1.5 rounded-lg border-2" style={{
                      backgroundColor: '#FFFFFF',
                      color: colors.primaryColor,
                      borderColor: colors.primaryColor
                    }}>
                      {t("added")}
                    </span>
                  ) : (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200" style={{
                      backgroundColor: colors.primaryColor,
                      color: '#FFFFFF',
                    }}>
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm font-medium">{t("book")}</span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detail Modal */}
      <ItemDetailModal
        item={selectedService}
        type="service"
        isOpen={!!selectedService}
        onClose={() => setSelectedService(null)}
        onAddToCart={() => {
          if (selectedService) {
            if (!cart.isServiceInCart(selectedService.id)) {
              cart.addServiceToCart(selectedService);
            } else {
              cart.removeFromCart(selectedService.id);
            }
          }
        }}
        isInCart={selectedService ? cart.isServiceInCart(selectedService.id) : false}
        currencyCode={merchant?.currency || "USD"}
      />
    </>
  );
}
