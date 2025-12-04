"use client";

import { ProductsSectionProps } from "../types";
import { ShoppingBag, Plus, Minus } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export function ClassicProductsSection({ products, merchant, colors, cart }: ProductsSectionProps) {
  if (products.length === 0) return null;

  return (
    <section id="section-products" className="py-16 px-6 bg-white scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2
            className="text-3xl sm:text-4xl font-serif font-bold mb-4"
            style={{ fontFamily: colors.fontFamily, color: colors.textColor }}
          >
            Our Products
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-12" style={{ backgroundColor: colors.primaryColor }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.primaryColor }} />
            <div className="h-px w-12" style={{ backgroundColor: colors.primaryColor }} />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const quantityInCart = cart.getProductQuantityInCart(product.id);
            return (
              <div
                key={product.id}
                className="bg-white rounded shadow hover:shadow-lg transition-shadow p-4"
                style={{ border: `1px solid ${colors.primaryColor}20` }}
              >
                {product.image_url ? (
                  <div className="mb-4 overflow-hidden rounded">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full aspect-square object-cover"
                    />
                  </div>
                ) : (
                  <div
                    className="w-full aspect-square flex items-center justify-center mb-4 rounded"
                    style={{ backgroundColor: `${colors.primaryColor}10` }}
                  >
                    <ShoppingBag className="h-12 w-12 opacity-20" />
                  </div>
                )}

                <h3
                  className="font-semibold text-sm sm:text-base truncate mb-1"
                  style={{ fontFamily: colors.fontFamily, color: colors.textColor }}
                >
                  {product.name}
                </h3>

                {product.description && (
                  <p className="text-xs opacity-60 truncate mb-3">{product.description}</p>
                )}

                <div className="flex items-center justify-between">
                  <p
                    className="text-lg font-bold"
                    style={{ color: colors.primaryColor, fontFamily: colors.fontFamily }}
                  >
                    {formatCurrency(product.price, merchant?.currency)}
                  </p>

                  {quantityInCart > 0 ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => cart.updateProductQuantity(product.id, quantityInCart - 1)}
                        className="p-1.5 rounded transition-colors"
                        style={{ backgroundColor: `${colors.primaryColor}20`, color: colors.primaryColor }}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="font-semibold min-w-[20px] text-center">{quantityInCart}</span>
                      <button
                        onClick={() => cart.updateProductQuantity(product.id, quantityInCart + 1)}
                        className="p-1.5 rounded transition-colors"
                        style={{ backgroundColor: colors.primaryColor, color: "#fff" }}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => cart.addProductToCart(product)}
                      className="p-2 rounded transition-all hover:scale-110"
                      style={{ backgroundColor: colors.primaryColor, color: "#fff" }}
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
