"use client";

import { useState } from "react";
import { ProductsSectionProps } from "../types";
import { ChevronRight, Plus, Minus } from "lucide-react";

export function StarterProductsSection({ products, merchant, colors, cart }: ProductsSectionProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (products.length === 0) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: merchant.currency || 'USD',
    }).format(price);
  };

  return (
    <div className="w-full">
      {/* Section Title */}
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-center" style={{ color: colors.primaryColor }}>
          Products
        </h2>
      </div>

      {/* Products Stack */}
      <div className="flex flex-col gap-3">
        {products.map((product) => {
          const quantityInCart = cart.getProductQuantityInCart(product.id);
          const isInCart = quantityInCart > 0;
          const isHovered = hoveredId === product.id;

          return (
            <div
              key={product.id}
              onMouseEnter={() => setHoveredId(product.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="w-full bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200"
              style={{
                transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                borderColor: isInCart ? colors.primaryColor : '#E5E7EB',
                backgroundColor: isInCart ? colors.primaryColor + '08' : '#FFFFFF',
              }}
            >
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{product.name}</div>
                    {product.description && (
                      <div className="text-sm text-gray-600 mt-1 line-clamp-1">
                        {product.description}
                      </div>
                    )}
                    <div className="text-sm font-medium mt-2" style={{ color: colors.primaryColor }}>
                      {formatPrice(product.price)}
                    </div>
                  </div>

                  {!isInCart ? (
                    <button
                      onClick={() => cart.addProductToCart(product)}
                      className="ml-4 flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white transition-all duration-200"
                      style={{ backgroundColor: colors.primaryColor }}
                    >
                      <Plus className="w-4 h-4" />
                      <span className="hidden sm:inline">Add</span>
                    </button>
                  ) : (
                    <div className="ml-4 flex items-center gap-3">
                      <div className="flex items-center gap-2 bg-white rounded-lg border-2 shadow-sm" style={{ borderColor: colors.primaryColor }}>
                        <button
                          onClick={() => {
                            if (quantityInCart === 1) {
                              cart.removeFromCart(product.id);
                            } else {
                              cart.updateProductQuantity(product.id, quantityInCart - 1);
                            }
                          }}
                          className="p-2 hover:bg-gray-50 rounded-l-lg transition-colors"
                        >
                          <Minus className="w-4 h-4" style={{ color: colors.primaryColor }} />
                        </button>
                        <span className="font-semibold min-w-[24px] text-center" style={{ color: colors.primaryColor }}>
                          {quantityInCart}
                        </span>
                        <button
                          onClick={() => cart.updateProductQuantity(product.id, quantityInCart + 1)}
                          className="p-2 hover:bg-gray-50 rounded-r-lg transition-colors"
                        >
                          <Plus className="w-4 h-4" style={{ color: colors.primaryColor }} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
