"use client";

import { useState } from "react";
import { ProductsSectionProps } from "../types";

export function ChristmasProductsSection({ products, merchant, colors, cart }: ProductsSectionProps) {
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  if (products.length === 0) return null;

  return (
    <section
      id="section-products"
      className="py-20 px-6"
      style={{ backgroundColor: colors.backgroundColor }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Festive header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-3xl">🎁</span>
            <h2
              className="text-4xl sm:text-5xl font-bold"
              style={{
                fontFamily: colors.fontFamily,
                color: colors.primaryColor,
              }}
            >
              Holiday Products
            </h2>
            <span className="text-3xl">🎁</span>
          </div>
          <p
            className="text-lg"
            style={{ color: colors.secondaryColor }}
          >
            Perfect gifts for the season!
          </p>
        </div>

        {/* Products grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const quantityInCart = cart.getProductQuantityInCart(product.id);
            const isHovered = hoveredProduct === product.id;

            return (
              <div
                key={product.id}
                className="group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2"
                style={{
                  backgroundColor: "#fff",
                  boxShadow: isHovered
                    ? `0 15px 35px ${colors.secondaryColor}40`
                    : '0 8px 20px rgba(0,0,0,0.1)',
                  border: `2px solid ${isHovered ? colors.secondaryColor : colors.accentColor}`,
                }}
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                {/* Top border decoration */}
                <div
                  className="h-1.5"
                  style={{
                    background: `repeating-linear-gradient(90deg, ${colors.primaryColor} 0px, ${colors.primaryColor} 10px, ${colors.accentColor} 10px, ${colors.accentColor} 20px, ${colors.secondaryColor} 20px, ${colors.secondaryColor} 30px)`,
                  }}
                />

                {/* Product image */}
                {product.image_url && (
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-52 object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Star decoration */}
                    <div className="absolute top-3 right-3 text-2xl">
                      ⭐
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="p-5">
                  {/* Product name */}
                  <h3
                    className="text-xl font-bold mb-2"
                    style={{
                      fontFamily: colors.fontFamily,
                      color: colors.primaryColor,
                    }}
                  >
                    {product.name}
                  </h3>

                  {/* Description */}
                  {product.description && (
                    <p
                      className="text-sm mb-4 line-clamp-2"
                      style={{
                        fontFamily: colors.fontFamily,
                        color: colors.textColor,
                        opacity: 0.8,
                      }}
                    >
                      {product.description}
                    </p>
                  )}

                  {/* Price with festive styling */}
                  <div className="flex items-center gap-2 mb-5">
                    <p
                      className="text-2xl font-bold"
                      style={{ color: colors.secondaryColor }}
                    >
                      {merchant?.currency === "USD" ? "$" : "€"}
                      {product.price}
                    </p>
                    <span className="text-lg">🎄</span>
                  </div>

                  {/* Add to cart / Quantity controls */}
                  {quantityInCart === 0 ? (
                    <button
                      onClick={() => cart.addProductToCart(product)}
                      className="w-full py-3 px-4 rounded-xl font-bold transition-all duration-300 shadow-md hover:shadow-lg"
                      style={{
                        backgroundColor: colors.secondaryColor,
                        color: "#fff",
                        border: `2px solid ${colors.accentColor}`,
                      }}
                    >
                      Add to Cart 🔔
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <button
                          onClick={() => cart.updateProductQuantity(product.id, quantityInCart - 1)}
                          className="flex-1 py-2.5 px-3 rounded-xl font-bold transition-all hover:opacity-90"
                          style={{
                            backgroundColor: `${colors.primaryColor}20`,
                            color: colors.primaryColor,
                            border: `2px solid ${colors.primaryColor}40`,
                          }}
                        >
                          -
                        </button>
                        <span
                          className="text-xl font-bold px-4"
                          style={{ color: colors.textColor }}
                        >
                          {quantityInCart}
                        </span>
                        <button
                          onClick={() => cart.updateProductQuantity(product.id, quantityInCart + 1)}
                          className="flex-1 py-2.5 px-3 rounded-xl font-bold transition-all hover:opacity-90"
                          style={{
                            backgroundColor: `${colors.secondaryColor}20`,
                            color: colors.secondaryColor,
                            border: `2px solid ${colors.secondaryColor}40`,
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
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
