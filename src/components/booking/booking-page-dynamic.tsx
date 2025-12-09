"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { Merchant, Service, Staff, Availability, MerchantTheme, MerchantSettings, SocialLink } from "@/types/database";
import type { ThemeData, ThemeColors, ThemeCartHandlers } from "./themes/types";
import type { GalleryImage, Product, CartItem, CartServiceItem, CartProductItem } from "./themes/types";
import { CartDrawer } from "./CartDrawer";
import { PoweredByFooter } from "./PoweredByFooter";
import { FloatingZaloButton } from "./FloatingZaloButton";
import { CheckoutFlow } from "./CheckoutFlow";
import { MobileBottomNav } from "./MobileBottomNav";
import { createClient } from "@/lib/supabase/client";

// Dynamic imports for theme components - Tailwind-based versions
const ChristmasTheme = dynamic(() => import("./themes/christmas").then(mod => ({ default: mod.ChristmasTheme })), {
  ssr: true,
});

const StarterTheme = dynamic(() => import("./themes/starter").then(mod => ({ default: mod.StarterTheme })), {
  ssr: true,
});

const EleganceGridTheme = dynamic(() => import("./themes/elegancegrid").then(mod => ({ default: mod.EleganceGridTheme })), {
  ssr: true,
});

const ShowcaseGridTheme = dynamic(() => import("./themes/showcasegrid").then(mod => ({ default: mod.ShowcaseGridTheme })), {
  ssr: true,
});

const TetHolidayTheme = dynamic(() => import("./themes/tetholiday").then(mod => ({ default: mod.TetHolidayTheme })), {
  ssr: true,
});


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

export function BookingPageDynamic({
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
  const [showCheckout, setShowCheckout] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("services");
  const supabase = createClient();

  // Check subscription tier
  useEffect(() => {
    const checkTier = async () => {
      const { data: subscription } = await supabase
        .from("merchant_subscriptions")
        .select("pricing_tiers(tier_key)")
        .eq("merchant_id", merchant.id)
        .eq("status", "active")
        .maybeSingle();

      const tierKey = (subscription?.pricing_tiers as any)?.tier_key || "free";
      setIsPro(tierKey === "pro");
    };
    checkTier();
  }, [merchant.id, supabase]);

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

  // Handle navigation to sections
  const handleNavigate = useCallback((section: "services" | "products" | "contact") => {
    setActiveSection(section);
    // Scroll to section with offset to show the title
    const sectionId = section === "services" ? "services-section" :
                      section === "products" ? "products-section" :
                      "contact-section";
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -80; // Offset to show the section title
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
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

  // Select theme component based on layout
  const ThemeComponent =
    theme.layoutTemplate === "christmas" ? ChristmasTheme :
    theme.layoutTemplate === "tetholiday" ? TetHolidayTheme :
    theme.layoutTemplate === "elegancegrid" ? EleganceGridTheme :
    theme.layoutTemplate === "showcasegrid" ? ShowcaseGridTheme :
    StarterTheme; // Default fallback

  // Determine if we should show branding
  // Free users: always show
  // Pro users: show only if settings.showBranding is not explicitly false
  const showBranding = !isPro || (settings.showBranding !== false);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 -mt-0">
        <ThemeComponent
          data={themeData}
          colors={colors}
          cart={cartHandlers}
          locale="en"
          currency={merchant.currency}
          onOpenCart={() => setShowCart(true)}
        />
      </div>

      {/* Powered by BeautiPick Footer */}
      <PoweredByFooter
        show={showBranding}
        accentColor={colors.accentColor}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        cart={cartHandlers}
        currency={merchant.currency}
        merchantId={merchant.id}
        merchantName={merchant.business_name}
        accentColor={colors.secondaryColor}
        primaryColor={colors.primaryColor}
        secondaryColor={colors.secondaryColor}
        textColor={colors.textColor}
        onOpenCheckout={() => {
          setShowCart(false);
          setShowCheckout(true);
        }}
      />

      {/* Checkout Flow - Shared across all themes */}
      <CheckoutFlow
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        cart={cartHandlers}
        merchantId={merchant.id}
        merchantName={merchant.business_name}
        currency={merchant.currency}
        primaryColor={colors.primaryColor}
      />

      {/* Floating Zalo Button */}
      {merchant.phone && (
        <FloatingZaloButton
          phoneNumber={merchant.phone}
          accentColor="#0068FF"
        />
      )}

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        hasServices={services.length > 0}
        hasProducts={products.length > 0}
        accentColor={colors.accentColor}
        onNavigate={handleNavigate}
        activeSection={activeSection}
      />
    </div>
  );
}
