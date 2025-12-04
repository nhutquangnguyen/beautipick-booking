"use client";

import { X, ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
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
  onOpenCheckout: () => void;
}

export function CartDrawer({ isOpen, onClose, cart, currency, merchantId, merchantName, accentColor = "#3B82F6", onOpenCheckout }: CartDrawerProps) {
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
        <div
          className="px-6 py-5 border-b border-gray-200"
          style={{ backgroundColor: `${accentColor}05` }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="p-2 rounded-full"
                style={{ backgroundColor: accentColor }}
              >
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900">Giỏ hàng</h2>
                <p className="text-sm text-gray-500">{cart.cart.length} mục</p>
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
                className="p-6 rounded-full mb-4"
                style={{ backgroundColor: `${accentColor}10` }}
              >
                <ShoppingCart className="w-12 h-12 opacity-30" style={{ color: accentColor }} />
              </div>
              <p className="text-gray-500 text-lg font-medium mb-2">Giỏ hàng trống</p>
              <p className="text-gray-400 text-sm">Thêm dịch vụ hoặc sản phẩm để tiếp tục</p>
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
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg">
                              {item.service.name}
                            </h3>
                            {item.service.description && (
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {item.service.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold" style={{ color: accentColor }}>
                            {formatPrice(item.service.price)}
                          </span>
                          <button
                            onClick={() => cart.removeFromCart(item.id)}
                            className="p-2 hover:bg-red-50 rounded-full transition-colors group"
                          >
                            <Trash2 className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
                          </button>
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
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-bold text-gray-900">
                              {item.product.name}
                            </h3>
                            {item.product.description && (
                              <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                                {item.product.description}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => cart.removeFromCart(item.id)}
                            className="p-1 hover:bg-red-50 rounded-full transition-colors group"
                          >
                            <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => cart.updateProductQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                              style={{
                                backgroundColor: accentColor,
                                color: "#fff",
                              }}
                            >
                              <Minus size={14} />
                            </button>
                            <span className="text-sm font-bold min-w-[2rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => cart.updateProductQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                              style={{
                                backgroundColor: accentColor,
                                color: "#fff",
                              }}
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <span className="text-lg font-bold" style={{ color: accentColor }}>
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
              <span className="text-lg font-semibold text-gray-700">Tổng cộng:</span>
              <span className="text-3xl font-black" style={{ color: accentColor }}>
                {formatPrice(calculateTotal())}
              </span>
            </div>

            {/* Checkout Button */}
            <button
              onClick={onOpenCheckout}
              className="w-full py-4 rounded-2xl font-black text-lg text-white transition-all duration-300 hover:scale-105 hover:shadow-xl"
              style={{
                backgroundColor: accentColor,
              }}
            >
              Tiến hành thanh toán
            </button>

            <button
              onClick={() => cart.clearCart()}
              className="w-full mt-3 py-3 rounded-2xl font-semibold text-sm text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Xóa toàn bộ giỏ hàng
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
