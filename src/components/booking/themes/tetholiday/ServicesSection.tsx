"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { ServicesSectionProps } from "../types";
import { formatCurrency } from "@/lib/utils";

export function TetHolidayServicesSection({ services, merchant, colors, cart }: ServicesSectionProps) {
  const t = useTranslations("common");
  const [hoveredService, setHoveredService] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  if (services.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      id="section-services"
      className="py-20 px-6 relative overflow-hidden"
      style={{ backgroundColor: colors.accentColor }}
    >
      {/* Decorative Background Pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, ${colors.secondaryColor} 4px, transparent 4px)`,
          backgroundSize: '150px 150px',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Tết header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-4xl animate-bounce" style={{ animationDuration: '2s' }}>🏮</span>
            <h2
              className="text-4xl sm:text-5xl font-bold"
              style={{
                fontFamily: colors.fontFamily,
                color: colors.primaryColor,
              }}
            >
              {t("ourServices")}
            </h2>
            <span className="text-4xl animate-bounce" style={{ animationDuration: '2s', animationDelay: '0.3s' }}>🏮</span>
          </div>
          <p
            className="text-lg font-serif italic"
            style={{ color: colors.textColor }}
          >
            {t("tetServicesSubtitle") || "Chào Đón Xuân Mới - Dịch Vụ Đặc Biệt"}
          </p>
        </div>

        {/* Services grid with Golden Bloom effect */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const isInCart = cart.isServiceInCart(service.id);
            const isHovered = hoveredService === service.id;

            return (
              <div
                key={service.id}
                className="group relative rounded-2xl overflow-hidden transition-all duration-300 ease-out"
                style={{
                  backgroundColor: isHovered ? colors.backgroundColor : colors.accentColor,
                  boxShadow: isHovered
                    ? `0 25px 50px ${colors.secondaryColor}50, 0 0 40px ${colors.secondaryColor}30`
                    : `0 8px 20px ${colors.primaryColor}15`,
                  border: `3px solid ${isHovered ? colors.secondaryColor : colors.accentColor}`,
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible
                    ? (isHovered ? 'translateY(-4px)' : 'translateY(0)')
                    : 'translateY(50px)',
                  transition: `all 0.3s ease-out`,
                  willChange: 'transform',
                  marginBottom: '2rem',
                }}
                onMouseEnter={() => setHoveredService(service.id)}
                onMouseLeave={() => setHoveredService(null)}
              >
                {/* Golden top border gradient */}
                <div
                  className="absolute top-0 left-0 right-0 h-2 transition-all duration-500"
                  style={{
                    background: isHovered
                      ? `linear-gradient(90deg, ${colors.primaryColor}, ${colors.secondaryColor}, ${colors.primaryColor})`
                      : `linear-gradient(90deg, ${colors.secondaryColor}, ${colors.accentColor})`,
                  }}
                />

                {/* Decorative Corner Coin - rotates on hover */}
                <div
                  className="absolute top-4 right-4 text-3xl transition-transform duration-500 z-10"
                  style={{
                    transform: isHovered ? 'rotate(12deg) scale(1.2)' : 'rotate(0deg) scale(1)',
                    filter: `drop-shadow(0 2px 4px ${colors.primaryColor}30)`,
                  }}
                >
                  🪙
                </div>

                {/* Service image with zoom effect */}
                {service.image_url && (
                  <div className="relative overflow-hidden h-56">
                    <img
                      src={service.image_url}
                      alt={service.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Blossom overlay */}
                    <div className="absolute bottom-4 left-4 text-4xl opacity-80">
                      ✿
                    </div>
                    {/* Gradient overlay on hover */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                      style={{
                        background: `linear-gradient(135deg, ${colors.secondaryColor}, ${colors.accentColor})`,
                      }}
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  {/* Service name */}
                  <h3
                    className="text-2xl font-bold mb-3 transition-all duration-300"
                    style={{
                      fontFamily: colors.fontFamily,
                      // Bình thường: Đỏ | Hover: Vàng + Viền Nâu Đen + Kim Tuyến
                      color: isHovered ? colors.secondaryColor : colors.primaryColor,
                      textShadow: isHovered
                        ? `1px 1px 0 ${colors.textColor}, -1px -1px 0 ${colors.textColor}, 1px -1px 0 ${colors.textColor}, -1px 1px 0 ${colors.textColor}, 0 2px 5px ${colors.textColor}50, 0 0 5px #fff, 0 0 15px ${colors.secondaryColor}, 0 0 30px ${colors.secondaryColor}` // VIỀN NÂU ĐEN + Tỏa sáng CỰC MẠNH
                        : 'none',
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

                  {/* Price and duration - with continuous GLOW effect */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="relative">
                      <p
                        className="text-3xl font-bold transition-all duration-300 relative z-10"
                        style={{
                          // Bình thường: Vàng + Viền Nâu Đen + Kim Tuyến | Hover: Đỏ
                          color: isHovered ? colors.primaryColor : colors.secondaryColor,
                          textShadow: isHovered
                            ? 'none'
                            : `1px 1px 0 ${colors.textColor}, -1px -1px 0 ${colors.textColor}, 1px -1px 0 ${colors.textColor}, -1px 1px 0 ${colors.textColor}, 0 2px 5px ${colors.textColor}50, 0 0 5px #fff, 0 0 15px ${colors.secondaryColor}, 0 0 30px ${colors.secondaryColor}`, // VIỀN NÂU ĐEN + Tỏa sáng CỰC MẠNH
                          transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                        }}
                      >
                        {formatCurrency(service.price, merchant?.currency || "USD")}
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
                    <span className="text-3xl transition-transform duration-300 group-hover:rotate-12">🧧</span>
                  </div>

                  {/* Add to cart button with golden bloom effect */}
                  <button
                    onClick={() => isInCart ? cart.removeFromCart(service.id) : cart.addServiceToCart(service)}
                    className={`relative w-full py-4 px-6 rounded-xl font-bold transition-all duration-500 shadow-lg hover:shadow-2xl hover:scale-105 overflow-hidden group`}
                    style={{
                      background: isInCart
                        ? 'linear-gradient(135deg, #9E9E9E, #757575)'
                        : `linear-gradient(135deg, ${colors.secondaryColor} 0%, ${colors.secondaryColor}dd 50%, ${colors.accentColor} 100%)`,
                      color: isInCart ? '#fff' : colors.primaryColor,
                      border: `2px solid ${isInCart ? '#757575' : colors.primaryColor}`,
                      animation: isInCart ? 'none' : 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                    }}
                  >
                    {/* Shimmer effect on button */}
                    {!isInCart && (
                      <span
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                        style={{
                          background: 'linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.8) 50%, transparent 100%)',
                          backgroundSize: '200% 100%',
                          animation: 'shimmer-wave 1.5s ease-in-out infinite',
                        }}
                      />
                    )}
                    <span className="relative z-10">
                      {isInCart ? t("addedToCart") : t("tetAddToCartService") || "Thêm Vào Giỏ"}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes shimmer-wave {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </section>
  );
}
