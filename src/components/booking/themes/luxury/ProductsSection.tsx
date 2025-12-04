"use client";

import { ProductsSectionProps } from "../types";
import { ShoppingBag, Plus, Minus } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { getBorderRadius } from "../utils";

export function LuxuryProductsSection({ products, merchant, colors, cart }: ProductsSectionProps) {
  if (products.length === 0) return null;

  const cardRadius = getBorderRadius(colors.borderRadius);

  return (
    <section id="section-products" className="luxury-section py-16 sm:py-24 px-6 scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <div
          className="rounded-3xl p-12 sm:p-10 backdrop-blur-[30px]"
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
              <ShoppingBag className="h-6 w-6" style={{ color: colors.primaryColor }} />
            </div>
            <h2
              className="text-2xl sm:text-3xl font-light uppercase tracking-widest"
              style={{ fontFamily: colors.fontFamily, color: colors.textColor }}
            >
              Our Products
            </h2>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => {
              const quantityInCart = cart.getProductQuantityInCart(product.id);
              return (
                <div
                  key={product.id}
                  className="group transition-all duration-300 hover:-translate-y-1"
                  style={{
                    borderRadius: cardRadius,
                    backgroundColor: colors.backgroundColor,
                    border: `1px solid ${colors.primaryColor}12`,
                    boxShadow: `0 4px 20px ${colors.primaryColor}08`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `0 12px 40px ${colors.primaryColor}20`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = `0 4px 20px ${colors.primaryColor}08`;
                  }}
                >
                  {/* Product Image */}
                  {product.image_url ? (
                    <div
                      className="relative overflow-hidden mb-4"
                      style={{ borderRadius: `calc(${cardRadius} - 8px)` }}
                    >
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="relative w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  ) : (
                    <div
                      className="w-full aspect-square flex items-center justify-center mb-4"
                      style={{
                        background: `linear-gradient(135deg, ${colors.primaryColor}08 0%, ${colors.secondaryColor}08 100%)`,
                        borderRadius: `calc(${cardRadius} - 8px)`,
                      }}
                    >
                      <ShoppingBag className="h-12 w-12 opacity-20" />
                    </div>
                  )}

                  {/* Product Info */}
                  <div className="p-4">
                    <h3
                      className="font-semibold text-sm sm:text-base truncate mb-1"
                      style={{ fontFamily: colors.fontFamily, color: colors.textColor }}
                    >
                      {product.name}
                    </h3>

                    {product.description && (
                      <p
                        className="text-xs opacity-60 truncate mb-3"
                        style={{ fontFamily: colors.fontFamily, color: colors.textColor }}
                      >
                        {product.description}
                      </p>
                    )}

                    {/* Price and Actions */}
                    <div className="flex items-center justify-between">
                      <p
                        className="text-lg font-bold"
                        style={{ color: colors.primaryColor, fontFamily: colors.fontFamily }}
                      >
                        {formatCurrency(product.price, merchant.currency)}
                      </p>

                      {quantityInCart > 0 ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => cart.updateProductQuantity(product.id, quantityInCart - 1)}
                            className="p-1.5 rounded-full transition-colors"
                            style={{
                              backgroundColor: `${colors.primaryColor}15`,
                              color: colors.primaryColor,
                            }}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span
                            className="font-semibold min-w-[20px] text-center"
                            style={{ fontFamily: colors.fontFamily, color: colors.textColor }}
                          >
                            {quantityInCart}
                          </span>
                          <button
                            onClick={() => cart.updateProductQuantity(product.id, quantityInCart + 1)}
                            className="p-1.5 rounded-full transition-all duration-300 hover:scale-110 hover:-translate-y-0.5"
                            style={{
                              backgroundColor: colors.primaryColor,
                              color: "#fff",
                              boxShadow: `0 2px 8px rgba(0,0,0,0.15)`,
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.boxShadow = `0 4px 16px rgba(0,0,0,0.2), 0 0 0 4px ${colors.primaryColor}20, 0 0 20px ${colors.primaryColor}30`;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.boxShadow = `0 2px 8px rgba(0,0,0,0.15)`;
                            }}
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => cart.addProductToCart(product)}
                          className="p-2 rounded-full transition-all duration-300 hover:scale-110 hover:-translate-y-0.5"
                          style={{
                            backgroundColor: colors.primaryColor,
                            color: "#fff",
                            boxShadow: `0 2px 8px rgba(0,0,0,0.15)`,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = `0 4px 16px rgba(0,0,0,0.2), 0 0 0 4px ${colors.primaryColor}20, 0 0 20px ${colors.primaryColor}30`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = `0 2px 8px rgba(0,0,0,0.15)`;
                          }}
                          aria-label="Add to cart"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
