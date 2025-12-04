"use client";

import { useState, useMemo, useCallback } from "react";
import { Merchant, Service, Staff, Availability, MerchantTheme, MerchantSettings, SocialLink } from "@/types/database";
import { getThemeComponent, ThemeData, ThemeColors, ThemeCartHandlers } from "./themes";
import type { GalleryImage, Product, CartItem, CartServiceItem, CartProductItem } from "./themes/types";

interface BookingPageProps {
  merchant: Merchant;
  services: Service[];
  staff: Array<Staff & { staff_services: { service_id: string }[] }>;
  availability: Availability[];
  gallery: GalleryImage[];
  products: Product[];
  theme: MerchantTheme;
  settings: MerchantSettings;
}

export function BookingPageRefactored({
  merchant,
  services,
  staff,
  availability,
  gallery,
  products,
  theme,
  settings,
}: BookingPageProps) {
  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);

  // Cart helper functions with useCallback
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

  const addServiceToCart = useCallback((service: Service) => {
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
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  }, []);

  const addProductToCart = useCallback((product: Product) => {
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
  }, []);

  // Extract theme colors from MerchantTheme
  const colors: ThemeColors = useMemo(() => ({
    primaryColor: theme.primaryColor,
    secondaryColor: theme.secondaryColor,
    accentColor: theme.accentColor,
    backgroundColor: theme.backgroundColor,
    textColor: theme.textColor,
    fontFamily: theme.fontFamily,
    borderRadius: theme.borderRadius,
    buttonStyle: theme.buttonStyle,
  }), [theme]);

  // Prepare theme data
  const themeData: ThemeData = useMemo(() => ({
    merchant,
    services,
    staff,
    gallery,
    products,
    socialLinks: (merchant.social_links as unknown as SocialLink[]) || [],
  }), [merchant, services, staff, gallery, products]);

  // Cart handlers - no useMemo needed since functions are already memoized with useCallback
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

  // Get the theme component based on layout template
  const ThemeComponent = getThemeComponent(theme.layoutTemplate);

  // TODO: Implement cart sidebar/modal and checkout flow
  // For now, just render the theme
  return (
    <div className="min-h-screen">
      <ThemeComponent
        data={themeData}
        colors={colors}
        cart={cartHandlers}
        locale="en" // TODO: Get from i18n
        currency={merchant.currency}
        onOpenCart={() => setShowCart(true)}
      />

      {/* TODO: Add cart sidebar/modal here */}
      {/* TODO: Add checkout flow here */}
    </div>
  );
}
