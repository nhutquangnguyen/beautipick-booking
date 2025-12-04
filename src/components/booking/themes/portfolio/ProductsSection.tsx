"use client";

import { ProductsSectionProps } from "../types";
import { Plus, Minus } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export function PortfolioProductsSection({ products, merchant, colors, cart }: ProductsSectionProps) {
  if (products.length === 0) return null;

  return (
    <section
      id="section-products"
      className="py-24 px-6"
      style={{ backgroundColor: colors.backgroundColor }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section title */}
        <div className="mb-16">
          <div
            className="w-20 h-2 mb-6"
            style={{
              background: `linear-gradient(90deg, ${colors.primaryColor}, ${colors.secondaryColor})`,
            }}
          />
          <h2
            className="text-5xl sm:text-6xl font-black uppercase"
            style={{
              fontFamily: colors.fontFamily,
              color: colors.textColor,
            }}
          >
            Products
          </h2>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const quantityInCart = cart.getProductQuantityInCart(product.id);

            return (
              <div
                key={product.id}
                className="group transition-all duration-300 hover:scale-105"
                style={{
                  borderRadius: colors.borderRadius === "full" ? "20px" : colors.borderRadius === "none" ? "0" : "12px",
                  backgroundColor: colors.backgroundColor,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                }}
              >
                {/* Product Image */}
                {product.image_url ? (
                  <div className="relative overflow-hidden mb-4">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110"
                      style={{
                        borderRadius: colors.borderRadius === "full" ? "20px 20px 0 0" : colors.borderRadius === "none" ? "0" : "12px 12px 0 0",
                      }}
                    />
                    {/* Overlay on hover */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: `linear-gradient(135deg, ${colors.primaryColor}80, ${colors.secondaryColor}80)`,
                      }}
                    />
                  </div>
                ) : (
                  <div
                    className="w-full aspect-square flex items-center justify-center mb-4"
                    style={{
                      background: `linear-gradient(135deg, ${colors.primaryColor}20, ${colors.secondaryColor}20)`,
                      borderRadius: colors.borderRadius === "full" ? "20px 20px 0 0" : colors.borderRadius === "none" ? "0" : "12px 12px 0 0",
                    }}
                  >
                    <div
                      className="w-16 h-16 opacity-30"
                      style={{ color: colors.primaryColor }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <path d="M16 10a4 4 0 0 1-8 0" />
                      </svg>
                    </div>
                  </div>
                )}

                {/* Product Info */}
                <div className="p-4">
                  <h3
                    className="font-black text-base mb-2 truncate uppercase"
                    style={{ fontFamily: colors.fontFamily, color: colors.textColor }}
                  >
                    {product.name}
                  </h3>

                  {product.description && (
                    <p
                      className="text-xs opacity-70 truncate mb-4 font-semibold"
                      style={{ fontFamily: colors.fontFamily, color: colors.textColor }}
                    >
                      {product.description}
                    </p>
                  )}

                  {/* Price and Actions */}
                  <div className="flex items-center justify-between">
                    <p
                      className="text-xl font-black"
                      style={{ color: colors.primaryColor, fontFamily: colors.fontFamily }}
                    >
                      {formatCurrency(product.price, merchant.currency)}
                    </p>

                    {quantityInCart > 0 ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => cart.updateProductQuantity(product.id, quantityInCart - 1)}
                          className="p-1.5 transition-all duration-300 hover:scale-110"
                          style={{
                            backgroundColor: `${colors.primaryColor}20`,
                            color: colors.primaryColor,
                            borderRadius: colors.borderRadius === "full" ? "9999px" : colors.borderRadius === "none" ? "0" : "6px",
                          }}
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span
                          className="font-black min-w-[20px] text-center"
                          style={{ fontFamily: colors.fontFamily, color: colors.textColor }}
                        >
                          {quantityInCart}
                        </span>
                        <button
                          onClick={() => cart.updateProductQuantity(product.id, quantityInCart + 1)}
                          className="p-1.5 transition-all duration-300 hover:scale-110"
                          style={{
                            background: `linear-gradient(135deg, ${colors.primaryColor}, ${colors.secondaryColor})`,
                            color: "#fff",
                            borderRadius: colors.borderRadius === "full" ? "9999px" : colors.borderRadius === "none" ? "0" : "6px",
                          }}
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => cart.addProductToCart(product)}
                        className="p-2 transition-all duration-300 hover:scale-110"
                        style={{
                          background: `linear-gradient(135deg, ${colors.primaryColor}, ${colors.secondaryColor})`,
                          color: "#fff",
                          borderRadius: colors.borderRadius === "full" ? "9999px" : colors.borderRadius === "none" ? "0" : "8px",
                          boxShadow: `0 4px 15px ${colors.primaryColor}40`,
                        }}
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
    </section>
  );
}
