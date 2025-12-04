"use client";

import { ServicesSectionProps } from "../types";

export function BlossomServicesSection({ services, merchant, colors, cart }: ServicesSectionProps) {
  if (services.length === 0) return null;

  return (
    <section id="section-services" className="blossom-section py-24 px-6" style={{ backgroundColor: '#FFF9F5' }}>
      <div className="max-w-7xl mx-auto">
        {/* Elegant Header */}
        <div className="text-center mb-16">
          <div className="inline-block relative">
            <h2
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4"
              style={{
                fontFamily: "'Playfair Display', 'Dancing Script', serif",
                color: colors.primaryColor,
                letterSpacing: '0.02em',
              }}
            >
              Dịch Vụ Của Chúng Tôi
            </h2>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primaryColor }} />
              <div className="w-2 h-2 rounded-full opacity-50" style={{ backgroundColor: colors.primaryColor }} />
              <div className="w-2 h-2 rounded-full opacity-30" style={{ backgroundColor: colors.primaryColor }} />
            </div>
          </div>
          <p className="text-gray-600 mt-6 text-lg max-w-2xl mx-auto" style={{ fontFamily: "'Lato', sans-serif" }}>
            Trải nghiệm những dịch vụ chăm sóc sắc đẹp đẳng cấp
          </p>
        </div>

        {/* Premium Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const isInCart = cart.isServiceInCart(service.id);

            return (
              <div
                key={service.id}
                className="group relative overflow-hidden transition-all duration-500 hover:-translate-y-3 cursor-pointer"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '24px',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
                  border: isInCart ? `3px solid ${colors.primaryColor}` : '3px solid transparent',
                }}
                onClick={() => {
                  if (isInCart) {
                    cart.removeFromCart(service.id);
                  } else {
                    cart.addServiceToCart(service);
                  }
                }}
              >
                {/* Service Image or Gradient */}
                <div
                  className="relative h-48 overflow-hidden"
                  style={{
                    background: service.image_url
                      ? 'transparent'
                      : `linear-gradient(135deg, ${colors.primaryColor}15, ${colors.accentColor}25)`,
                  }}
                >
                  {service.image_url ? (
                    <img
                      src={service.image_url}
                      alt={service.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-20 h-20 opacity-30" fill="none" stroke={colors.primaryColor} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                  {/* Duration Badge */}
                  <div className="absolute top-4 right-4 px-4 py-2 rounded-full backdrop-blur-md bg-white/90 shadow-lg">
                    <span className="text-sm font-semibold" style={{ color: colors.primaryColor }}>
                      {service.duration_minutes} phút
                    </span>
                  </div>

                  {/* Cart Status Badge */}
                  {isInCart && (
                    <div
                      className="absolute top-4 left-4 px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
                      style={{ backgroundColor: colors.primaryColor }}
                    >
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-semibold text-white">Đã chọn</span>
                    </div>
                  )}
                </div>

                {/* Service Info */}
                <div className="p-6">
                  <h3
                    className="text-xl font-bold mb-3 line-clamp-2 min-h-[3.5rem]"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      color: colors.primaryColor,
                    }}
                  >
                    {service.name}
                  </h3>

                  {service.description && (
                    <p
                      className="text-sm text-gray-600 mb-4 line-clamp-3 min-h-[4rem]"
                      style={{
                        fontFamily: "'Lato', sans-serif",
                      }}
                    >
                      {service.description}
                    </p>
                  )}

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <div className="text-xs text-gray-500 mb-1" style={{ fontFamily: "'Lato', sans-serif" }}>
                        Giá dịch vụ
                      </div>
                      <span
                        className="text-2xl font-bold"
                        style={{
                          fontFamily: "'Playfair Display', serif",
                          color: colors.primaryColor,
                        }}
                      >
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                        }).format(service.price)}
                      </span>
                    </div>

                    <button
                      className="px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 hover:scale-105 shadow-md"
                      style={{
                        backgroundColor: isInCart ? 'transparent' : colors.primaryColor,
                        color: isInCart ? colors.primaryColor : '#FFFFFF',
                        border: isInCart ? `2px solid ${colors.primaryColor}` : 'none',
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isInCart) {
                          cart.removeFromCart(service.id);
                        } else {
                          cart.addServiceToCart(service);
                        }
                      }}
                    >
                      {isInCart ? 'Bỏ chọn' : 'Đặt ngay'}
                    </button>
                  </div>
                </div>

                {/* Decorative Corner */}
                <div
                  className="absolute top-0 right-0 w-20 h-20 opacity-10"
                  style={{
                    background: `radial-gradient(circle at top right, ${colors.primaryColor}, transparent)`,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
