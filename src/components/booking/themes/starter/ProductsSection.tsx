"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ProductsSectionProps, Product } from "../types";
import { ChevronRight, Plus, Minus, ShoppingBag } from "lucide-react";
import { ItemDetailModal } from "../../ItemDetailModal";
import { createClient } from "@/lib/supabase/client";

export function StarterProductsSection({ products, merchant, colors, cart }: ProductsSectionProps) {
  const t = useTranslations("common");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const supabase = createClient();

  if (products.length === 0) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: merchant?.currency || 'USD',
    }).format(price);
  };

  const getProductImageUrl = (product: Product): string | null => {
    const images = product.images;
    const imageKey = images && images.length > 0 ? images[0] : product.image_url;

    if (!imageKey) return null;
    if (imageKey.startsWith('http://') || imageKey.startsWith('https://')) {
      return imageKey;
    }

    const { data } = supabase.storage.from('images').getPublicUrl(imageKey);
    return data.publicUrl;
  };

  return (
    <>
      <div className="w-full">
        {/* Section Title */}
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-center" style={{ color: colors.primaryColor }}>
            {t("products")}
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
                onClick={() => setSelectedProduct(product)}
                className="w-full bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 cursor-pointer"
                style={{
                  transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                  borderColor: isInCart ? colors.primaryColor : '#E5E7EB',
                  backgroundColor: isInCart ? colors.primaryColor + '08' : '#FFFFFF',
                }}
              >
                <div className="p-4 flex items-center gap-4">
                  {/* Product Avatar */}
                  {getProductImageUrl(product) ? (
                    <img
                      src={getProductImageUrl(product)!}
                      alt={product.name}
                      className="h-16 w-16 rounded-lg object-cover flex-shrink-0"
                    />
                  ) : (
                    <div
                      className="h-16 w-16 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: colors.primaryColor + '20',
                      }}
                    >
                      <ShoppingBag className="h-7 w-7" style={{ color: colors.primaryColor }} />
                    </div>
                  )}

                  <div className="flex items-center justify-between flex-1 min-w-0">
                    <div className="flex-1 min-w-0">
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
                        onClick={(e) => {
                          e.stopPropagation();
                          cart.addProductToCart(product);
                        }}
                        className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white transition-all duration-200"
                        style={{ backgroundColor: colors.primaryColor }}
                      >
                        <Plus className="w-4 h-4" />
                        <span className="hidden sm:inline">{t("add")}</span>
                      </button>
                    ) : (
                      <div className="flex-shrink-0 flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
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

      {/* Detail Modal */}
      <ItemDetailModal
        item={selectedProduct}
        type="product"
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={() => {
          if (selectedProduct) {
            cart.addProductToCart(selectedProduct);
          }
        }}
        isInCart={selectedProduct ? cart.getProductQuantityInCart(selectedProduct.id) > 0 : false}
        quantity={selectedProduct ? cart.getProductQuantityInCart(selectedProduct.id) : 0}
        onUpdateQuantity={(qty) => {
          if (selectedProduct) {
            if (qty === 0) {
              cart.removeFromCart(selectedProduct.id);
            } else {
              cart.updateProductQuantity(selectedProduct.id, qty);
            }
          }
        }}
        currencyCode={merchant?.currency || "USD"}
      />
    </>
  );
}
