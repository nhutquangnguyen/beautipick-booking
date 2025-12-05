"use client";

import { useTranslations } from "next-intl";
import { ProductsSectionProps } from "../types";

export function EleganceGridProductsSection({ products, merchant, colors, cart }: ProductsSectionProps) {
  const t = useTranslations("common");
  if (!products || products.length === 0) return null;

  return (
    <section
      id="section-products"
      className="py-20 px-6"
      style={{ backgroundColor: colors.secondaryColor }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2
            className="text-4xl sm:text-5xl font-bold mb-4"
            style={{
              fontFamily: colors.fontFamily,
              color: colors.primaryColor,
            }}
          >
            {t("ourProducts")}
          </h2>
          <div
            className="w-20 h-1 mx-auto mb-6"
            style={{ backgroundColor: colors.accentColor }}
          />
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{
              fontFamily: colors.fontFamily,
              color: colors.textColor,
              opacity: 0.8,
            }}
          >
            Premium beauty products curated for you
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => {
            const quantity = cart.getProductQuantityInCart(product.id);
            const isInCart = quantity > 0;

            return (
              <div
                key={product.id}
                className="group overflow-hidden rounded-2xl transition-all duration-500 hover:scale-[1.03] hover:-translate-y-3 border-2"
                style={{
                  backgroundColor: colors.backgroundColor,
                  boxShadow: `0 4px 20px ${colors.accentColor}15`,
                  borderColor: 'transparent',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 25px 50px ${colors.accentColor}35`;
                  e.currentTarget.style.borderColor = colors.accentColor;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = `0 4px 20px ${colors.accentColor}15`;
                  e.currentTarget.style.borderColor = 'transparent';
                }}
              >
                {/* Product Image */}
                {product.image_url && (
                  <div className="relative h-72 overflow-hidden">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                    />
                    {/* Gradient Overlay on hover */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: `linear-gradient(to top, ${colors.primaryColor}80, transparent 60%)`,
                      }}
                    />
                    {/* Accent Corner on hover */}
                    <div
                      className="absolute top-4 right-4 w-12 h-12 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center"
                      style={{
                        backgroundColor: colors.accentColor,
                        boxShadow: `0 4px 15px ${colors.accentColor}60`,
                      }}
                    >
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </div>
                  </div>
                )}

                <div className="p-6">
                  {/* Product Name */}
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
                        opacity: 0.7,
                      }}
                    >
                      {product.description}
                    </p>
                  )}

                  {/* Price */}
                  <div
                    className="text-2xl font-bold mb-4"
                    style={{ color: colors.accentColor }}
                  >
                    {merchant?.currency} {product.price}
                  </div>

                  {/* Add to Cart Controls */}
                  {isInCart ? (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => cart.updateProductQuantity(product.id, quantity - 1)}
                        className="w-10 h-10 flex items-center justify-center font-bold rounded-full transition-all duration-300 hover:scale-110"
                        style={{
                          backgroundColor: colors.primaryColor,
                          color: '#fff',
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
                        className="w-10 h-10 flex items-center justify-center font-bold rounded-full transition-all duration-300 hover:scale-110"
                        style={{
                          backgroundColor: colors.primaryColor,
                          color: '#fff',
                        }}
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => cart.addProductToCart(product)}
                      className="w-full py-3 px-6 font-semibold rounded-full text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                      style={{
                        backgroundColor: colors.accentColor,
                        boxShadow: `0 4px 15px ${colors.accentColor}30`,
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
