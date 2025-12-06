"use client";

import { X, ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import { useTranslations } from "next-intl";
import { CartItem } from "./themes/types";
import { ThemeCartHandlers } from "./themes/types";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: ThemeCartHandlers;
  currency: string;
  merchantId: string;
  merchantName: string;
  accentColor?: string;
  primaryColor?: string;
  secondaryColor?: string;
  textColor?: string;
  onOpenCheckout: () => void;
}

export function CartDrawer({ isOpen, onClose, cart, currency, merchantId, merchantName, accentColor = "#3B82F6", primaryColor = "#C62828", secondaryColor = "#FFD700", textColor = "#4A2C0E", onOpenCheckout }: CartDrawerProps) {
  const t = useTranslations("common");
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const calculateTotal = () => {
    return cart.cart.reduce((total, item) => {
      if (item.type === "service") {
        return total + item.service.price;
      } else {
        return total + (item.product.price * item.quantity);
      }
    }, 0);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white shadow-2xl z-50 flex flex-col"
        style={{
          animation: 'slideInRight 0.3s ease-out',
        }}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="p-2 rounded-full"
                style={{ backgroundColor: primaryColor }}
              >
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900">{t("cart")}</h2>
                <p className="text-sm text-gray-500">{cart.cart.length} {t("cartItems")}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cart.cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div
                className="p-6 rounded-full mb-4 bg-gray-100"
              >
                <ShoppingCart className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg font-medium mb-2">{t("cartEmpty")}</p>
              <p className="text-gray-400 text-sm">{t("cartEmptyDesc")}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-50 rounded-2xl p-4 transition-all duration-300 hover:shadow-md border border-gray-100"
                >
                  {item.type === "service" ? (
                    // Service Item
                    <div className="flex gap-4">
                      <div className="flex-1 relative">
                        {/* Trash icon - absolute positioned at top right */}
                        <button
                          onClick={() => cart.removeFromCart(item.id)}
                          className="absolute top-0 right-0 p-1 hover:bg-red-50 rounded-full transition-colors group"
                        >
                          <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
                        </button>

                        {/* Title */}
                        <div className="pr-8 mb-2">
                          <h3 className="font-bold text-gray-900 text-lg">
                            {item.service.name}
                          </h3>
                          {item.service.description && (
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {item.service.description}
                            </p>
                          )}
                        </div>

                        {/* Price - bottom right */}
                        <div className="flex items-center justify-end">
                          <span
                            className="text-xl font-bold"
                            style={{ color: primaryColor }}
                          >
                            {formatPrice(item.service.price)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Product Item
                    <div className="flex gap-4">
                      {item.product.image_url && (
                        <img
                          src={item.product.image_url}
                          alt={item.product.name}
                          className="w-20 h-20 object-cover rounded-xl"
                        />
                      )}
                      <div className="flex-1 relative">
                        {/* Trash icon - absolute positioned at top right */}
                        <button
                          onClick={() => cart.removeFromCart(item.id)}
                          className="absolute top-0 right-0 p-1 hover:bg-red-50 rounded-full transition-colors group"
                        >
                          <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
                        </button>

                        {/* Title */}
                        <div className="pr-8 mb-2">
                          <h3 className="font-bold text-gray-900">
                            {item.product.name}
                          </h3>
                          {item.product.description && (
                            <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                              {item.product.description}
                            </p>
                          )}
                        </div>

                        {/* Bottom section: Quantity controls and Price */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => cart.updateProductQuantity(item.id, item.quantity - 1)}
                              className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:opacity-80 text-white"
                              style={{ backgroundColor: primaryColor }}
                            >
                              <Minus size={16} />
                            </button>
                            <span
                              className="text-2xl font-bold min-w-[2.5rem] text-center"
                              style={{ color: primaryColor }}
                            >
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => cart.updateProductQuantity(item.id, item.quantity + 1)}
                              className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:opacity-80 text-white"
                              style={{ backgroundColor: primaryColor }}
                            >
                              <Plus size={16} />
                            </button>
                          </div>

                          {/* Price - bottom right */}
                          <span
                            className="text-lg font-bold"
                            style={{ color: primaryColor }}
                          >
                            {formatPrice(item.product.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.cart.length > 0 && (
          <div className="border-t border-gray-200 px-6 py-5 bg-gray-50">
            {/* Total */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-gray-700">{t("totalPrice")}</span>
              <span className="text-3xl font-black" style={{ color: primaryColor }}>
                {formatPrice(calculateTotal())}
              </span>
            </div>

            {/* Checkout Button */}
            <button
              onClick={onOpenCheckout}
              className="w-full py-4 rounded-2xl font-bold text-lg text-white transition-all hover:opacity-90"
              style={{ backgroundColor: primaryColor }}
            >
              {t("proceedToCheckout")}
            </button>

            <button
              onClick={() => cart.clearCart()}
              className="w-full mt-3 py-3 rounded-2xl font-semibold text-sm text-gray-600 hover:bg-gray-100 transition-colors"
            >
              {t("clearCart")}
            </button>
          </div>
        )}
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
