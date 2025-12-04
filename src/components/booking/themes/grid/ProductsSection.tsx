"use client";

import { ProductsSectionProps } from "../types";

export function GridProductsSection({ products, merchant, colors, cart }: ProductsSectionProps) {
  if (!products || products.length === 0) return null;

  return (
    <section
      id="section-products"
      className="py-20 px-6 relative"
      style={{ backgroundColor: colors.backgroundColor }}
    >
      <div className="max-w-7xl mx-auto">
        <h2
          className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 text-center"
          style={{
            fontFamily: colors.fontFamily,
            color: colors.secondaryColor,
          }}
        >
          Our Products
        </h2>
        <p
          className="text-lg text-center mb-12 opacity-80 max-w-2xl mx-auto"
          style={{
            fontFamily: colors.fontFamily,
            color: colors.textColor,
          }}
        >
          Premium products curated for your needs
        </p>

        {/* Masonry-style grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, idx) => {
            const quantity = cart.getProductQuantityInCart(product.id);
            const isInCart = quantity > 0;

            return (
              <div
                key={product.id}
                className={`group overflow-hidden transition-all duration-500 hover:scale-105 ${
                  idx % 3 === 0 ? 'sm:row-span-2' : ''
                }`}
                style={{
                  backgroundColor: colors.backgroundColor,
                  borderRadius: colors.borderRadius === "full" ? "24px" : colors.borderRadius === "none" ? "0" : "16px",
                  border: `2px solid ${colors.secondaryColor}20`,
                  boxShadow: `0 4px 20px ${colors.secondaryColor}15`,
                }}
              >
                {/* Product Image */}
                {product.image_url && (
                  <div className={`relative overflow-hidden ${idx % 3 === 0 ? 'h-80' : 'h-48'}`}>
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: `linear-gradient(to top, ${colors.secondaryColor}cc, transparent)`,
                      }}
                    />
                  </div>
                )}

                <div className="p-5">
                  <h3
                    className="text-xl font-bold mb-2"
                    style={{
                      fontFamily: colors.fontFamily,
                      color: colors.textColor,
                    }}
                  >
                    {product.name}
                  </h3>

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
                  <div
                    className="text-2xl font-bold mb-4"
                    style={{ color: colors.secondaryColor }}
                  >
                    {merchant.currency} {product.price}
                  </div>

                  {/* Add to cart controls */}
                  {isInCart ? (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => cart.updateProductQuantity(product.id, quantity - 1)}
                        className="w-10 h-10 flex items-center justify-center font-bold transition-all duration-300 hover:scale-110"
                        style={{
                          backgroundColor: colors.secondaryColor,
                          color: "#fff",
                          borderRadius: colors.borderRadius === "full" ? "50%" : colors.borderRadius === "none" ? "0" : "8px",
                        }}
                      >
                        -
                      </button>
                      <span
                        className="flex-1 text-center font-bold text-xl"
                        style={{ color: colors.textColor }}
                      >
                        {quantity}
                      </span>
                      <button
                        onClick={() => cart.updateProductQuantity(product.id, quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center font-bold transition-all duration-300 hover:scale-110"
                        style={{
                          backgroundColor: colors.secondaryColor,
                          color: "#fff",
                          borderRadius: colors.borderRadius === "full" ? "50%" : colors.borderRadius === "none" ? "0" : "8px",
                        }}
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => cart.addProductToCart(product)}
                      className="w-full py-3 px-6 font-semibold transition-all duration-300 hover:scale-105"
                      style={{
                        backgroundColor: colors.buttonStyle === "solid" ? colors.secondaryColor : "transparent",
                        color: colors.buttonStyle === "solid" ? "#fff" : colors.secondaryColor,
                        border: colors.buttonStyle === "outline" ? `2px solid ${colors.secondaryColor}` : "none",
                        borderRadius: colors.borderRadius === "full" ? "9999px" : colors.borderRadius === "none" ? "0" : "8px",
                      }}
                    >
                      Add to Cart
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
