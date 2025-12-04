"use client";

import { ShoppingCart, Plus, Minus } from "lucide-react";
import { ProductsSectionProps } from "../types";

export function ShowcaseGridProductsSection({ products, colors, cart }: ProductsSectionProps) {
  if (!products || products.length === 0) return null;

  return (
    <section
      id="section-products"
      className="py-32 px-6 relative overflow-hidden"
      style={{
        backgroundColor: '#FFFFFF',
      }}
    >
      {/* Decorative shapes */}
      <div className="absolute top-20 left-10 w-48 h-48 rounded-full opacity-5 blur-3xl" style={{ background: `linear-gradient(135deg, ${colors.accentColor}, ${colors.primaryColor})` }} />
      <div className="absolute bottom-20 right-10 w-64 h-64 opacity-5 blur-3xl" style={{
        background: `linear-gradient(135deg, ${colors.primaryColor}, ${colors.accentColor})`,
        borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%'
      }} />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Editorial Header */}
        <div className="text-center mb-24">
          <div className="inline-block relative">
            <h2
              className="text-5xl lg:text-6xl xl:text-7xl font-black uppercase tracking-tight mb-4"
              style={{
                fontFamily: colors.fontFamily,
                color: colors.primaryColor,
                letterSpacing: '-0.02em',
              }}
            >
              Products
            </h2>

            {/* Decorative underline */}
            <div className="flex justify-center gap-1 mt-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.accentColor }} />
              <div className="w-16 h-2 rounded-full" style={{ backgroundColor: colors.accentColor }} />
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.accentColor }} />
            </div>
          </div>
          <p className="text-gray-500 mt-8 text-sm tracking-widest uppercase font-semibold">
            Premium Selection
          </p>
        </div>

        {/* Premium Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product, index) => {
            const quantity = cart.getProductQuantityInCart(product.id);
            const inCart = quantity > 0;

            return (
              <div
                key={product.id || index}
                className="group"
              >
                {/* Premium Card with colored border and pulse animation */}
                <div
                  className="relative overflow-hidden rounded-3xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-3"
                  style={{
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
                    border: `3px solid ${inCart ? colors.accentColor : `${colors.accentColor}30`}`,
                    ...(inCart ? {} : {
                      animationName: 'card-float',
                      animationDuration: '4s',
                      animationTimingFunction: 'ease-in-out',
                      animationIterationCount: 'infinite',
                      animationDelay: `${index * 0.2}s`,
                    }),
                  }}
                >
                  {/* Gradient glow on hover */}
                  <div className="absolute -inset-1 bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    {product.image_url ? (
                      <>
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </>
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ background: `linear-gradient(135deg, ${colors.primaryColor}10, ${colors.accentColor}15)` }}
                      >
                        <ShoppingCart
                          size={64}
                          className="opacity-20"
                          style={{ color: colors.primaryColor }}
                        />
                      </div>
                    )}

                    {/* Cart Badge */}
                    {inCart && (
                      <div
                        className="absolute top-4 right-4 px-3 py-2 rounded-full shadow-xl flex items-center gap-2 backdrop-blur-sm"
                        style={{ backgroundColor: colors.accentColor }}
                      >
                        <ShoppingCart size={14} className="text-white" />
                        <span className="text-xs font-bold text-white">{quantity}</span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <h3
                      className="text-lg font-bold mb-2 line-clamp-2 min-h-[3.5rem]"
                      style={{
                        fontFamily: colors.fontFamily,
                        color: colors.primaryColor,
                      }}
                    >
                      {product.name}
                    </h3>

                    {product.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[2.5rem]">
                        {product.description}
                      </p>
                    )}

                    {/* Price */}
                    <div className="mb-4 pb-4 border-b border-gray-100">
                      <div className="text-xs text-gray-500 mb-1">Giá bán</div>
                      <span
                        className="text-2xl font-bold"
                        style={{ color: colors.accentColor }}
                      >
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                        }).format(product.price)}
                      </span>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700">Số lượng:</span>
                      {quantity > 0 ? (
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              cart.updateProductQuantity(product.id, quantity - 1);
                            }}
                            className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                            style={{
                              backgroundColor: colors.accentColor,
                              color: "#fff",
                              border: `2px solid ${colors.accentColor}`,
                            }}
                          >
                            <Minus size={16} />
                          </button>

                          <span
                            className="text-lg font-bold min-w-[2rem] text-center"
                            style={{
                              fontFamily: colors.fontFamily,
                              color: colors.accentColor,
                            }}
                          >
                            {quantity}
                          </span>

                          <button
                            onClick={() => {
                              cart.updateProductQuantity(product.id, quantity + 1);
                            }}
                            className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md"
                            style={{
                              backgroundColor: colors.accentColor,
                              color: "#fff",
                              border: `2px solid ${colors.accentColor}`,
                            }}
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            cart.addProductToCart(product);
                          }}
                          className="px-6 py-2 rounded-full flex items-center gap-2 transition-all duration-300 hover:scale-110 shadow-md font-bold text-sm"
                          style={{
                            backgroundColor: colors.accentColor,
                            color: "#fff",
                            border: `2px solid ${colors.accentColor}`,
                          }}
                        >
                          <Plus size={16} />
                          <span>Thêm vào giỏ</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Decorative accent */}
                  <div
                    className="absolute top-0 left-0 w-20 h-20 opacity-10 rounded-br-full"
                    style={{
                      background: `radial-gradient(circle at top left, ${colors.accentColor}, transparent)`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CSS Animations - Enhanced */}
      <style jsx>{`
        @keyframes card-float {
          0%, 100% {
            transform: translateY(0px) scale(1);
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
          }
          50% {
            transform: translateY(-8px) scale(1.02);
            box-shadow: 0 12px 40px rgba(59, 130, 246, 0.15);
          }
        }
      `}</style>
    </section>
  );
}
