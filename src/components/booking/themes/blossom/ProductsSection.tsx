"use client";

import { Minus, Plus } from "lucide-react";
import { ProductsSectionProps } from "../types";

export function BlossomProductsSection({ products, merchant, colors, cart }: ProductsSectionProps) {
  if (products.length === 0) return null;

  return (
    <section className="blossom-section py-24 px-6" style={{ backgroundColor: '#FFFFFF' }}>
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
              Sản Phẩm Của Chúng Tôi
            </h2>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.primaryColor }} />
              <div className="w-2 h-2 rounded-full opacity-50" style={{ backgroundColor: colors.primaryColor }} />
              <div className="w-2 h-2 rounded-full opacity-30" style={{ backgroundColor: colors.primaryColor }} />
            </div>
          </div>
          <p className="text-gray-600 mt-6 text-lg max-w-2xl mx-auto" style={{ fontFamily: "'Lato', sans-serif" }}>
            Khám phá bộ sưu tập sản phẩm chăm sóc sắc đẹp cao cấp
          </p>
        </div>

        {/* Premium Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => {
            const quantity = cart.getProductQuantityInCart(product.id);
            const inCart = quantity > 0;

            return (
              <div
                key={product.id}
                className="group relative overflow-hidden transition-all duration-500 hover:-translate-y-3"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '24px',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
                  border: inCart ? `3px solid ${colors.primaryColor}` : '3px solid transparent',
                }}
              >
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  {product.image_url ? (
                    <>
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${colors.primaryColor}15, ${colors.accentColor}25)` }}>
                      <svg className="w-20 h-20 opacity-30" fill="none" stroke={colors.primaryColor} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                  )}

                  {/* In Cart Badge */}
                  {inCart && (
                    <div
                      className="absolute top-4 left-4 px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5"
                      style={{ backgroundColor: colors.primaryColor }}
                    >
                      <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                      </svg>
                      <span className="text-xs font-semibold text-white">{quantity}</span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-5">
                  <h3
                    className="text-lg font-bold mb-2 line-clamp-2 min-h-[3.5rem]"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      color: colors.primaryColor,
                    }}
                  >
                    {product.name}
                  </h3>

                  {product.description && (
                    <p
                      className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[2.5rem]"
                      style={{ fontFamily: "'Lato', sans-serif" }}
                    >
                      {product.description}
                    </p>
                  )}

                  {/* Price */}
                  <div className="mb-4 pb-4 border-b border-gray-100">
                    <div className="text-xs text-gray-500 mb-1">Giá bán</div>
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
                      }).format(product.price)}
                    </span>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">Số lượng:</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          if (quantity > 0) {
                            cart.updateProductQuantity(product.id, quantity - 1);
                          }
                        }}
                        className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{
                          backgroundColor: quantity > 0 ? colors.primaryColor : '#F3F4F6',
                          color: quantity > 0 ? "#fff" : colors.textColor,
                          border: `2px solid ${quantity > 0 ? colors.primaryColor : '#E5E7EB'}`,
                        }}
                        disabled={quantity === 0}
                      >
                        <Minus size={16} />
                      </button>

                      <span
                        className="text-lg font-bold min-w-[2rem] text-center"
                        style={{
                          fontFamily: "'Lato', sans-serif",
                          color: colors.primaryColor,
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
                          backgroundColor: colors.primaryColor,
                          color: "#fff",
                          border: `2px solid ${colors.primaryColor}`,
                        }}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Decorative Corner */}
                <div
                  className="absolute bottom-0 left-0 w-20 h-20 opacity-10"
                  style={{
                    background: `radial-gradient(circle at bottom left, ${colors.primaryColor}, transparent)`,
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
