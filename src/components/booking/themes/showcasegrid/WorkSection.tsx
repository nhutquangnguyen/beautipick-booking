"use client";

import { ServicesSectionProps } from "../types";

export function ShowcaseGridWorkSection({
  services,
  colors,
  cart,
  locale,
  currency,
}: ServicesSectionProps) {
  if (!services || services.length === 0) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
    }).format(price);
  };

  return (
    <section
      id="section-services"
      className="py-32 px-6 relative overflow-hidden"
      style={{
        backgroundColor: '#F8F9FA',
      }}
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-20 right-10 w-40 h-40 rounded-full opacity-10" style={{ background: `linear-gradient(135deg, ${colors.accentColor}, ${colors.primaryColor})` }} />
      <div className="absolute bottom-40 left-10 w-32 h-32 rounded-full opacity-5" style={{ background: `linear-gradient(135deg, ${colors.primaryColor}, ${colors.accentColor})` }} />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Editorial Section Header */}
        <div className="text-center mb-32">
          <div className="inline-block relative">
            <h2
              className="text-6xl lg:text-7xl xl:text-8xl font-black mb-4 tracking-tight"
              style={{
                fontFamily: colors.fontFamily,
                color: colors.primaryColor,
                textTransform: 'uppercase',
                letterSpacing: '-0.02em',
              }}
            >
              Portfolio
            </h2>

            {/* Decorative underline */}
            <div className="relative h-3">
              <div className="absolute bottom-0 left-0 right-0 h-2" style={{
                background: `linear-gradient(90deg, transparent, ${colors.accentColor}40, transparent)`,
                transform: 'skewY(-1deg)'
              }} />
            </div>
          </div>
          <p className="text-gray-500 mt-8 text-sm tracking-widest uppercase font-semibold">
            Khám phá tác phẩm của chúng tôi
          </p>
        </div>

        {/* Editorial Portfolio Grid */}
        <div className="space-y-40">
          {services.map((service, index) => {
            const isEven = index % 2 === 0;
            const isInCart = cart.isServiceInCart(service.id);

            return (
              <div
                key={service.id}
                className={`grid md:grid-cols-5 gap-12 lg:gap-16 items-center relative group/card transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl ${
                  isEven ? "" : "md:grid-flow-dense"
                }`}
                style={{
                  cursor: 'pointer',
                }}
              >
                {/* Decorative Elements */}
                {isEven ? (
                  <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-20 h-20 border-2 border-gray-200 rounded-full hidden lg:block" />
                ) : (
                  <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-16 h-16 hidden lg:block" style={{
                    background: `linear-gradient(135deg, ${colors.accentColor}20, transparent)`,
                    borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%'
                  }} />
                )}

                {/* Portfolio Image - Editorial Style with Enhanced Hover */}
                <div className={`${isEven ? "md:col-start-1" : "md:col-start-3"} md:col-span-3 group relative`}>
                  {/* Image Frame */}
                  <div className="relative transition-all duration-500 group-hover:shadow-2xl">
                    {/* Main Image */}
                    <div className="relative overflow-hidden shadow-2xl transition-shadow duration-500 group-hover:shadow-3xl" style={{
                      borderRadius: isEven ? '200px 200px 20px 20px' : '20px 20px 200px 200px'
                    }}>
                      <img
                        src={
                          service.image_url ||
                          "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=2069"
                        }
                        alt={service.name}
                        className="w-full aspect-[4/3] object-cover transition-all duration-700 group-hover:scale-110"
                      />

                      {/* Subtle overlay on hover */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500" />

                      {/* Duration badge - Position at flat edges, away from rounded corners */}
                      {service.duration_minutes && (
                        <div
                          className={`absolute px-4 py-2 rounded-full backdrop-blur-xl shadow-xl ${
                            isEven ? 'bottom-6 right-6' : 'top-6 left-6'
                          }`}
                          style={{
                            backgroundColor: colors.accentColor,
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="white" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm font-bold text-white">
                              {service.duration_minutes}p
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Accent decoration */}
                    <div
                      className="absolute -bottom-4 -right-4 w-32 h-32 -z-10 opacity-30"
                      style={{
                        background: `linear-gradient(135deg, ${colors.accentColor}, transparent)`,
                        borderRadius: '50%',
                        filter: 'blur(20px)'
                      }}
                    />
                  </div>
                </div>

                {/* Service Details - Editorial Typography */}
                <div className={`${isEven ? "md:col-start-4" : "md:col-start-1"} md:col-span-2 space-y-6 relative`}>

                  {/* Service Name with Number */}
                  <div className="relative pl-3">
                    {/* Background number - Smaller size */}
                    <div className="absolute -top-4 left-4 text-6xl font-black opacity-20 select-none pointer-events-none -z-10 transition-all duration-500 group-hover/card:opacity-35 group-hover/card:scale-105" style={{
                      color: colors.accentColor,
                      fontFamily: colors.fontFamily,
                    }}>
                      {String(index + 1).padStart(2, '0')}
                    </div>

                    {/* Accent mark - animated */}
                    <div className="absolute left-0 top-0 w-1 h-12 transition-all duration-500 group-hover/card:h-16 group-hover/card:w-2" style={{ backgroundColor: colors.accentColor }} />

                    <h3
                      className="text-xl lg:text-2xl font-black leading-tight uppercase tracking-tight pl-3"
                      style={{
                        fontFamily: colors.fontFamily,
                        color: colors.primaryColor,
                        wordBreak: 'break-word',
                        hyphens: 'auto',
                        overflowWrap: 'break-word',
                      }}
                    >
                      {service.name}
                    </h3>
                  </div>

                  {/* Description */}
                  {service.description && (
                    <p className="text-base leading-relaxed text-gray-600 font-light">
                      {service.description}
                    </p>
                  )}

                  {/* Price Block - Redesigned */}
                  <div className="pt-6 space-y-5">
                    {/* Price with elegant styling */}
                    <div className="relative">
                      <div className="flex items-center gap-4">
                        <div
                          className="h-px flex-1"
                          style={{ backgroundColor: `${colors.accentColor}20` }}
                        />
                        <span
                          className="text-4xl font-black tracking-tight"
                          style={{
                            color: colors.accentColor,
                            fontFamily: colors.fontFamily,
                          }}
                        >
                          {formatPrice(service.price)}
                        </span>
                        <div
                          className="h-px flex-1"
                          style={{ backgroundColor: `${colors.accentColor}20` }}
                        />
                      </div>
                    </div>

                    {/* Status Badge - if in cart */}
                    {isInCart && (
                      <div className="flex justify-center">
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2" style={{
                          backgroundColor: `${colors.accentColor}10`,
                          borderColor: colors.accentColor
                        }}>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" style={{ color: colors.accentColor }}>
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: colors.accentColor }}>
                            Đã Chọn
                          </span>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => {
                        if (isInCart) {
                          cart.removeFromCart(service.id);
                        } else {
                          cart.addServiceToCart(service);
                        }
                      }}
                      className="group/btn relative w-full px-6 py-3 text-xs font-bold uppercase tracking-widest overflow-hidden"
                      style={{
                        backgroundColor: isInCart ? 'transparent' : colors.accentColor,
                        color: isInCart ? colors.accentColor : "#FFFFFF",
                        border: `3px solid ${colors.accentColor}`,
                        borderRadius: '0',
                        transition: 'all 0.3s ease',
                        animation: isInCart ? 'none' : 'button-pulse 3s ease-in-out infinite',
                      }}
                    >
                      {/* Continuous glow ring for Book Now button */}
                      {!isInCart && (
                        <div
                          className="absolute -inset-1 blur-lg"
                          style={{
                            backgroundColor: `${colors.accentColor}30`,
                            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                          }}
                        />
                      )}

                      {/* Shine sweep effect on hover */}
                      <div
                        className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 ease-out"
                        style={{
                          background: `linear-gradient(90deg, transparent, ${isInCart ? colors.accentColor + '40' : 'rgba(255,255,255,0.3)'}, transparent)`,
                        }}
                      />

                      {/* Border expansion on hover */}
                      <div className="absolute inset-0 border-2 border-white scale-95 opacity-0 group-hover/btn:scale-100 group-hover/btn:opacity-40 transition-all duration-300" />

                      <span className="relative z-10 inline-block group-hover/btn:scale-110 transition-transform duration-300">
                        {isInCart ? "Remove" : "Book Now"}
                      </span>
                    </button>

                    {/* CSS animation for button pulse */}
                    <style jsx>{`
                      @keyframes button-pulse {
                        0%, 100% {
                          transform: scale(1);
                          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                        }
                        50% {
                          transform: scale(1.08);
                          box-shadow: 0 8px 40px rgba(59, 130, 246, 0.6), 0 0 50px rgba(59, 130, 246, 0.4);
                        }
                      }
                    `}</style>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
