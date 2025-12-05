"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Plus, Minus } from "lucide-react";
import { ProductsSectionProps } from "../types";

export function TetHolidayProductsSection({ products, merchant, colors, cart }: ProductsSectionProps) {
  const t = useTranslations("common");
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const getQuantity = (productId: string) => {
    const inCartQuantity = cart.getProductQuantityInCart(productId);
    return inCartQuantity > 0 ? inCartQuantity : 1;
  };

  const handleQuantityChange = (productId: string, delta: number) => {
    const currentQuantity = cart.getProductQuantityInCart(productId);
    const newQuantity = currentQuantity + delta;

    if (newQuantity <= 0) {
      // Remove product from cart if quantity goes to 0 or below
      cart.removeFromCart(productId);
    } else {
      // Update quantity in cart
      cart.updateProductQuantity(productId, newQuantity);
    }
  };

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

  if (products.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="py-20 px-6 relative overflow-hidden"
      style={{ backgroundColor: colors.backgroundColor }}
    >
      {/* Decorative coin pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 40%, ${colors.secondaryColor} 5px, transparent 5px)`,
          backgroundSize: '180px 180px',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Tết header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-4xl animate-bounce" style={{ animationDuration: '2.2s' }}>🍊</span>
            <h2
              className="text-4xl sm:text-5xl font-bold"
              style={{
                fontFamily: colors.fontFamily,
                color: colors.primaryColor,
              }}
            >
              {t("ourProducts")}
            </h2>
            <span className="text-4xl animate-bounce" style={{ animationDuration: '2.2s', animationDelay: '0.4s' }}>🍊</span>
          </div>
          <p
            className="text-lg font-serif italic"
            style={{ color: colors.textColor }}
          >
            {t("tetProductsSubtitle") || "Quà Tặng May Mắn - Đón Tài Lộc"}
          </p>
        </div>

        {/* Products grid with Lucky Shimmer effect */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => {
            const isInCart = cart.isProductInCart(product.id);
            const isHovered = hoveredProduct === product.id;

            return (
              <div
                key={product.id}
                className="group relative rounded-2xl overflow-hidden transition-all duration-300 ease-out"
                style={{
                  backgroundColor: '#fff',
                  boxShadow: isHovered
                    ? `0 30px 60px ${colors.secondaryColor}99, 0 0 50px ${colors.primaryColor}4D`
                    : `0 8px 20px ${colors.primaryColor}26`,
                  border: `3px solid ${isHovered ? colors.secondaryColor : colors.accentColor}`,
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible
                    ? (isHovered ? 'translateY(-4px)' : 'translateY(0)')
                    : 'translateY(50px)',
                  transition: `all 0.3s ease-out`,
                  willChange: 'transform',
                  marginBottom: '2rem',
                }}
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                {/* Lucky Shimmer Wave Effect - Diagonal sweeping light */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none z-20 transition-opacity duration-700"
                  style={{
                    background: 'linear-gradient(135deg, transparent 0%, transparent 40%, rgba(255,255,255,0.9) 50%, transparent 60%, transparent 100%)',
                    backgroundSize: '200% 200%',
                    animation: 'lucky-shimmer-wave 2s ease-in-out infinite',
                  }}
                />

                {/* Golden top border */}
                <div
                  className="absolute top-0 left-0 right-0 h-2"
                  style={{
                    background: `linear-gradient(90deg, ${colors.primaryColor}, ${colors.secondaryColor}, ${colors.primaryColor})`,
                  }}
                />

                {/* Product image with zoom */}
                {product.image_url && (
                  <div className="relative overflow-hidden h-56">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Blossom decoration */}
                    <div className="absolute top-4 right-4 text-4xl opacity-80 transition-transform duration-500 group-hover:rotate-12">
                      🌸
                    </div>
                    {/* Golden overlay on hover */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-25 transition-opacity duration-500"
                      style={{
                        background: `radial-gradient(circle, ${colors.secondaryColor}, transparent)`,
                      }}
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
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
                    {product.name}
                  </h3>

                  {product.description && (
                    <p
                      className="mb-4 line-clamp-3"
                      style={{
                        fontFamily: colors.fontFamily,
                        color: colors.textColor,
                        opacity: 0.85,
                      }}
                    >
                      {product.description}
                    </p>
                  )}

                  {/* Price with glow effect */}
                  <div className="flex items-center justify-between mb-4">
                    <p
                      className="text-3xl font-bold transition-all duration-300"
                      style={{
                        // Bình thường: Vàng + Viền Nâu Đen + Kim Tuyến | Hover: Đỏ
                        color: isHovered ? colors.primaryColor : colors.secondaryColor,
                        textShadow: isHovered
                          ? 'none'
                          : `1px 1px 0 ${colors.textColor}, -1px -1px 0 ${colors.textColor}, 1px -1px 0 ${colors.textColor}, -1px 1px 0 ${colors.textColor}, 0 2px 5px ${colors.textColor}50, 0 0 5px #fff, 0 0 15px ${colors.secondaryColor}, 0 0 30px ${colors.secondaryColor}`, // VIỀN NÂU ĐEN + Tỏa sáng CỰC MẠNH
                        transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                      }}
                    >
                      {merchant?.currency === "USD" ? "$" : "€"}
                      {product.price}
                    </p>
                    <span className="text-3xl transition-transform duration-300 group-hover:scale-125">🎁</span>
                  </div>

                  {/* Show either quantity selector OR button, not both */}
                  {isInCart ? (
                    // Quantity selector - show when product is in cart
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => handleQuantityChange(product.id, -1)}
                        className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                        style={{
                          backgroundColor: colors.secondaryColor,
                          color: colors.primaryColor,
                        }}
                      >
                        <Minus size={18} />
                      </button>
                      <span className="text-xl font-bold min-w-[3rem] text-center" style={{ color: colors.primaryColor }}>
                        {cart.getProductQuantityInCart(product.id)}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(product.id, 1)}
                        className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                        style={{
                          backgroundColor: colors.secondaryColor,
                          color: colors.primaryColor,
                        }}
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  ) : (
                    // "Mua Ngay" Button - show when product is NOT in cart
                    <button
                      onClick={() => cart.addProductToCart(product)}
                      className="relative w-full py-4 px-6 rounded-xl font-bold transition-all duration-500 shadow-lg hover:shadow-2xl overflow-hidden group animate-pulse"
                      style={{
                        background: `linear-gradient(135deg, ${colors.primaryColor} 0%, ${colors.primaryColor} 100%)`,
                        color: colors.secondaryColor,
                        border: `3px solid ${colors.secondaryColor}`,
                        animation: isHovered ? 'wiggle 0.5s ease-in-out' : 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                      }}
                    >
                      {/* Golden shimmer on button */}
                      <span
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                        style={{
                          background: `linear-gradient(120deg, transparent 0%, ${colors.secondaryColor}80 50%, transparent 100%)`,
                          backgroundSize: '200% 100%',
                          animation: 'button-shimmer 1.5s ease-in-out infinite',
                        }}
                      />
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {t("tetAddToCartProduct") || "Mua Ngay"} 🧧
                      </span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes lucky-shimmer-wave {
          0% {
            background-position: -200% -200%;
          }
          100% {
            background-position: 200% 200%;
          }
        }
        @keyframes button-shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(-2deg) scale(1.02); }
          50% { transform: rotate(2deg) scale(1.05); }
          75% { transform: rotate(-2deg) scale(1.02); }
        }
      `}</style>
    </section>
  );
}
