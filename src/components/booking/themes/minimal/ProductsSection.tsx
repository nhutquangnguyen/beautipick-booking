"use client";

import { ProductsSectionProps } from "../types";
import { Plus, Minus } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export function MinimalProductsSection({ products, merchant, colors, cart }: ProductsSectionProps) {
  if (products.length === 0) return null;

  return (
    <section
      id="section-products"
      className="py-32 px-6"
      style={{ backgroundColor: `${colors.backgroundColor}f8` }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Section title */}
        <h2
          className="text-3xl sm:text-4xl font-extralight tracking-wide text-center mb-24"
          style={{
            fontFamily: colors.fontFamily,
            color: colors.textColor,
          }}
        >
          Products
        </h2>

        {/* Products grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => {
            const quantityInCart = cart.getProductQuantityInCart(product.id);

            return (
              <div
                key={product.id}
                className="group transition-all duration-500 hover:opacity-100"
                style={{ opacity: 0.85 }}
              >
                {/* Product Image */}
                {product.image_url ? (
                  <div className="relative overflow-hidden mb-4">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-105"
                      style={{
                        borderRadius: colors.borderRadius === "full" ? "12px" : colors.borderRadius === "none" ? "0" : "6px",
                      }}
                    />
                  </div>
                ) : (
                  <div
                    className="w-full aspect-square flex items-center justify-center mb-4"
                    style={{
                      backgroundColor: `${colors.primaryColor}08`,
                      borderRadius: colors.borderRadius === "full" ? "12px" : colors.borderRadius === "none" ? "0" : "6px",
                    }}
                  >
                    <div
                      className="w-12 h-12 opacity-20"
                      style={{ color: colors.primaryColor }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <path d="M16 10a4 4 0 0 1-8 0" />
                      </svg>
                    </div>
                  </div>
                )}

                {/* Product Info */}
                <h3
                  className="font-light text-base mb-2 truncate"
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
                <div className="flex items-center justify-between mb-4">
                  <p
                    className="text-lg font-light"
                    style={{ color: colors.primaryColor, fontFamily: colors.fontFamily }}
                  >
                    {formatCurrency(product.price, merchant.currency)}
                  </p>

                  {quantityInCart > 0 ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => cart.updateProductQuantity(product.id, quantityInCart - 1)}
                        className="p-1 transition-opacity duration-300 hover:opacity-70"
                        style={{
                          color: colors.primaryColor,
                        }}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span
                        className="font-light min-w-[20px] text-center text-sm"
                        style={{ fontFamily: colors.fontFamily, color: colors.textColor }}
                      >
                        {quantityInCart}
                      </span>
                      <button
                        onClick={() => cart.updateProductQuantity(product.id, quantityInCart + 1)}
                        className="p-1 transition-opacity duration-300 hover:opacity-70"
                        style={{
                          color: colors.primaryColor,
                        }}
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => cart.addProductToCart(product)}
                      className="p-1.5 transition-opacity duration-300 hover:opacity-70"
                      style={{
                        color: colors.primaryColor,
                        border: `1px solid ${colors.primaryColor}`,
                        borderRadius: colors.borderRadius === "full" ? "9999px" : colors.borderRadius === "none" ? "0" : "4px",
                      }}
                      aria-label="Add to cart"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
