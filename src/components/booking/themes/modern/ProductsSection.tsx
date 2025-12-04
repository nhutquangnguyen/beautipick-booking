"use client";

import { useState } from "react";
import { ProductsSectionProps } from "../types";

export function ModernProductsSection({ products, merchant, colors, cart }: ProductsSectionProps) {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  if (products.length === 0) return null;

  return (
    <section
      id="section-products"
      className="modern-section py-20 px-6"
      style={{ backgroundColor: colors.backgroundColor }}
    >
      <div className="max-w-7xl mx-auto">
        <h2
          className="text-4xl sm:text-5xl font-bold text-center mb-16"
          style={{
            fontFamily: colors.fontFamily,
            background: `linear-gradient(135deg, ${colors.primaryColor}, ${colors.secondaryColor})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Our Products
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => {
            const quantityInCart = cart.getProductQuantityInCart(product.id);
            const isHovered = hoveredProduct === product.id;

            return (
              <div
                key={product.id}
                className="group rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
                style={{
                  backgroundColor: colors.backgroundColor,
                  boxShadow: isHovered
                    ? `0 20px 40px ${colors.secondaryColor}30`
                    : '0 4px 20px rgba(0,0,0,0.08)',
                  border: `2px solid ${isHovered ? colors.secondaryColor : 'transparent'}`,
                }}
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                {/* Product image */}
                {product.image_url && (
                  <div className="mb-4 rounded-xl overflow-hidden">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Product name */}
                <h3
                  className="text-xl font-bold mb-2"
                  style={{
                    fontFamily: colors.fontFamily,
                    color: colors.textColor,
                  }}
                >
                  {product.name}
                </h3>

                {/* Description */}
                {product.description && (
                  <p
                    className="text-sm mb-4 opacity-80 line-clamp-2"
                    style={{
                      fontFamily: colors.fontFamily,
                      color: colors.textColor,
                    }}
                  >
                    {product.description}
                  </p>
                )}

                {/* Price */}
                <p
                  className="text-2xl font-bold mb-4"
                  style={{
                    color: colors.secondaryColor,
                  }}
                >
                  {merchant.currency === "USD" ? "$" : "€"}
                  {product.price}
                </p>

                {/* Add to cart / Quantity controls */}
                {quantityInCart === 0 ? (
                  <button
                    onClick={() => cart.addProductToCart(product)}
                    className="w-full py-3 px-6 font-semibold rounded-xl transition-all duration-300 hover:shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${colors.secondaryColor}, ${colors.accentColor})`,
                      color: "#fff",
                      borderRadius: colors.borderRadius === "full" ? "9999px" : colors.borderRadius === "none" ? "0" : "12px",
                    }}
                  >
                    Add to Cart
                  </button>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <button
                      onClick={() => cart.updateProductQuantity(product.id, quantityInCart - 1)}
                      className="flex-1 py-3 px-4 font-bold rounded-xl transition-all hover:opacity-80"
                      style={{
                        backgroundColor: `${colors.secondaryColor}20`,
                        color: colors.secondaryColor,
                      }}
                    >
                      -
                    </button>
                    <span
                      className="text-xl font-bold"
                      style={{ color: colors.textColor }}
                    >
                      {quantityInCart}
                    </span>
                    <button
                      onClick={() => cart.updateProductQuantity(product.id, quantityInCart + 1)}
                      className="flex-1 py-3 px-4 font-bold rounded-xl transition-all hover:opacity-80"
                      style={{
                        backgroundColor: `${colors.secondaryColor}20`,
                        color: colors.secondaryColor,
                      }}
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
