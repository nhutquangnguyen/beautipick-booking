"use client";

import { useState, useCallback, useEffect } from "react";
import { MapPin, Phone, Clock, Users, Youtube } from "lucide-react";
import Image from "next/image";
import { BusinessHours } from "./BusinessHours";
import { SocialLinks } from "./SocialLinks";
import { ImageGallery } from "./ImageGallery";
import { CartDrawer } from "@/components/booking/CartDrawer";
import { CheckoutFlow } from "@/components/booking/CheckoutFlow";
import {
  CartItem,
  CartServiceItem,
  CartProductItem,
  ThemeCartHandlers
} from "@/components/booking/themes/types";

interface MerchantProfileClientProps {
  merchant: any;
  services: any[];
  products: any[];
  staff: any[];
  availability: any[];
  galleryWithFullUrls: any[];
  socialLinks: any[];
  merchantIsOpen: boolean;
  externalShowCart?: boolean;
  onShowCartChange?: (show: boolean) => void;
  onCartCountChange?: (count: number) => void;
}

export function MerchantProfileClient({
  merchant,
  services,
  products,
  staff,
  availability,
  galleryWithFullUrls,
  socialLinks,
  merchantIsOpen,
  externalShowCart,
  onShowCartChange,
  onCartCountChange,
}: MerchantProfileClientProps) {
  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [internalShowCart, setInternalShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const storageKey = `beautipick_cart_${merchant.id}`;
    const savedCart = localStorage.getItem(storageKey);
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error);
        localStorage.removeItem(storageKey);
      }
    }
  }, [merchant.id]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    const storageKey = `beautipick_cart_${merchant.id}`;
    if (cart.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(cart));
    } else {
      localStorage.removeItem(storageKey);
    }
  }, [cart, merchant.id]);

  // Use external or internal cart visibility
  const showCart = externalShowCart !== undefined ? externalShowCart : internalShowCart;
  const setShowCart = (show: boolean) => {
    if (onShowCartChange) {
      onShowCartChange(show);
    } else {
      setInternalShowCart(show);
    }
  };

  // Update cart count when cart changes
  useEffect(() => {
    if (onCartCountChange) {
      onCartCountChange(cart.length);
    }
  }, [cart.length, onCartCountChange]);

  // Format currency
  const formatPrice = (price: number) => {
    if (merchant.currency === "VND") {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(price);
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: merchant.currency || "USD",
    }).format(price);
  };

  // Extract YouTube video ID from URL
  const getYoutubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Cart helper functions
  const isServiceInCart = useCallback((serviceId: string): boolean => {
    return cart.some((item) => item.type === "service" && item.id === serviceId);
  }, [cart]);

  const isProductInCart = useCallback((productId: string): boolean => {
    return cart.some((item) => item.type === "product" && item.id === productId);
  }, [cart]);

  const getProductQuantityInCart = useCallback((productId: string): number => {
    const item = cart.find((i) => i.type === "product" && i.id === productId);
    return item && item.type === "product" ? item.quantity : 0;
  }, [cart]);

  const addServiceToCart = useCallback((service: any) => {
    setCart((prevCart) => {
      const alreadyInCart = prevCart.some((item) => item.type === "service" && item.id === service.id);
      if (alreadyInCart) return prevCart;

      const newItem: CartServiceItem = {
        type: "service",
        id: service.id,
        service,
        quantity: 1,
      };
      return [...prevCart, newItem];
    });
    // Don't auto-show cart drawer
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  }, []);

  const addProductToCart = useCallback((product: any) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.type === "product" && item.id === product.id);

      if (existingItem && existingItem.type === "product") {
        return prevCart.map((item) =>
          item.id === product.id && item.type === "product"
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        const newItem: CartProductItem = {
          type: "product",
          id: product.id,
          product,
          quantity: 1,
        };
        return [...prevCart, newItem];
      }
    });
    // Don't auto-show cart drawer
  }, []);

  const updateProductQuantity = useCallback((productId: string, quantity: number) => {
    setCart((prevCart) => {
      if (quantity <= 0) {
        return prevCart.filter((item) => item.id !== productId);
      } else {
        return prevCart.map((item) =>
          item.id === productId && item.type === "product"
            ? { ...item, quantity }
            : item
        );
      }
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setShowCart(false);
    // Don't close checkout modal here - let the success screen handle that
    // setShowCheckout(false);
  }, []);

  // Create cart handlers object for CheckoutFlow
  const cartHandlers: ThemeCartHandlers = {
    cart,
    isServiceInCart,
    isProductInCart,
    getProductQuantityInCart,
    addServiceToCart,
    removeFromCart,
    addProductToCart,
    updateProductQuantity,
    clearCart,
  };

  return (
    <>
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Services */}
              {services && services.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Dịch vụ</h2>
                  <div className="space-y-3">
                    {services.map((service: any) => (
                      <div key={service.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{service.name}</h3>
                          {service.description && (
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{service.description}</p>
                          )}
                          <div className="flex items-center gap-4 mt-2">
                            {service.duration_minutes && (
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Clock className="h-4 w-4" />
                                <span>{service.duration_minutes} phút</span>
                              </div>
                            )}
                            {service.price && (
                              <div className="text-lg font-bold text-purple-600">
                                {formatPrice(service.price)}
                              </div>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => addServiceToCart(service)}
                          disabled={isServiceInCart(service.id)}
                          className={`ml-4 px-6 py-2 rounded-xl font-medium transition flex-shrink-0 ${
                            isServiceInCart(service.id)
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90"
                          }`}
                        >
                          {isServiceInCart(service.id) ? "Đã thêm" : "Đặt lịch"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Products */}
              {products && products.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Sản phẩm</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {products.map((product: any) => {
                      const quantityInCart = getProductQuantityInCart(product.id);
                      return (
                        <div key={product.id} className="border border-gray-200 rounded-xl p-4 hover:border-purple-300 hover:shadow-md transition">
                          {product.image_url && (
                            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-3">
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          )}
                          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">{product.name}</h3>
                          {product.description && (
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">{product.description}</p>
                          )}
                          {product.price && (
                            <div className="text-purple-600 font-bold mt-2">
                              {formatPrice(product.price)}
                            </div>
                          )}

                          {/* Quantity Controls or Add Button */}
                          {quantityInCart > 0 ? (
                            <div className="mt-3 flex items-center justify-center gap-3 border-2 border-purple-600 rounded-lg p-2">
                              <button
                                onClick={() => updateProductQuantity(product.id, quantityInCart - 1)}
                                className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition"
                                aria-label="Giảm số lượng"
                              >
                                −
                              </button>
                              <span className="text-lg font-bold text-purple-600 min-w-[2rem] text-center">
                                {quantityInCart}
                              </span>
                              <button
                                onClick={() => updateProductQuantity(product.id, quantityInCart + 1)}
                                className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold transition"
                                aria-label="Tăng số lượng"
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => addProductToCart(product)}
                              className="mt-3 w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:opacity-90 transition"
                            >
                              Thêm vào giỏ
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Gallery */}
              {galleryWithFullUrls && galleryWithFullUrls.length > 0 && (
                <ImageGallery images={galleryWithFullUrls} businessName={merchant.business_name} />
              )}

              {/* YouTube Video */}
              {merchant.youtube_url && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <Youtube className="h-5 w-5 text-red-600" />
                    <h2 className="text-2xl font-bold text-gray-900">Video giới thiệu</h2>
                  </div>
                  <div className="aspect-video rounded-xl overflow-hidden">
                    {getYoutubeVideoId(merchant.youtube_url) ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${getYoutubeVideoId(merchant.youtube_url)}`}
                        title="YouTube video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    ) : (
                      <a
                        href={merchant.youtube_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-full h-full bg-gray-100 hover:bg-gray-200 transition"
                      >
                        <Youtube className="h-16 w-16 text-red-600" />
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Staff */}
              {staff && staff.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="h-5 w-5 text-purple-600" />
                    <h2 className="text-2xl font-bold text-gray-900">Đội ngũ nhân viên</h2>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {staff.map((member: any) => (
                      <div key={member.id} className="text-center">
                        {member.avatar_url ? (
                          <div className="relative h-24 w-24 mx-auto rounded-full overflow-hidden mb-3 border-2 border-purple-100">
                            <Image
                              src={member.avatar_url}
                              alt={member.name}
                              fill
                              className="object-cover"
                              sizes="96px"
                            />
                          </div>
                        ) : (
                          <div className="h-24 w-24 mx-auto rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mb-3 text-2xl font-bold text-purple-600">
                            {member.name.charAt(0)}
                          </div>
                        )}
                        <h3 className="font-semibold text-gray-900">{member.name}</h3>
                        {member.bio && (
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{member.bio}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Info */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">Thông tin liên hệ</h3>
                <div className="space-y-4">
                  {merchant.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <span className="text-gray-700 block mb-2">{merchant.address}</span>
                        {merchant.google_maps_url && (
                          <a
                            href={merchant.google_maps_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                          >
                            Xem bản đồ →
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                  {merchant.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <a href={`tel:${merchant.phone}`} className="text-purple-600 hover:text-purple-700 font-medium">
                        {merchant.phone}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Business Hours */}
              {availability && availability.length > 0 && (
                <BusinessHours availability={availability} />
              )}

              {/* Social Media */}
              {(socialLinks.length > 0 || merchant.youtube_url) && (
                <SocialLinks socialLinks={socialLinks} youtubeUrl={merchant.youtube_url} />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        cart={cartHandlers}
        currency={merchant.currency || "VND"}
        merchantId={merchant.id}
        merchantName={merchant.business_name}
        primaryColor={merchant.primary_color || "#9333EA"}
        onOpenCheckout={() => {
          setShowCart(false);
          setShowCheckout(true);
        }}
      />

      {/* Checkout Flow */}
      <CheckoutFlow
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        cart={cartHandlers}
        merchantId={merchant.id}
        merchantName={merchant.business_name}
        currency={merchant.currency || "VND"}
        primaryColor={merchant.primary_color || "#9333EA"}
      />
    </>
  );
}
