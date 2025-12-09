import { ReactNode } from "react";
import { Merchant, Service, Staff, MerchantTheme, SocialLink } from "@/types/database";

// Extended types for booking page
export interface GalleryImage {
  id: string;
  image_url: string;
  caption: string | null;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  images?: string[] | null;
}

export type StaffWithServices = Staff & {
  staff_services: { service_id: string }[];
};

// Cart item types
export interface CartServiceItem {
  type: "service";
  id: string;
  service: Service;
  quantity: 1;
}

export interface CartProductItem {
  type: "product";
  id: string;
  product: Product;
  quantity: number;
}

export type CartItem = CartServiceItem | CartProductItem;

// Theme color configuration - what each theme receives
export interface ThemeColors {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  borderRadius: "none" | "sm" | "md" | "lg" | "full";
  buttonStyle: "solid" | "outline" | "ghost";
}

// Data that all themes receive
export interface ThemeData {
  merchant: Merchant;
  services: Service[];
  staff: StaffWithServices[];
  gallery: GalleryImage[];
  products: Product[];
  socialLinks: SocialLink[];
}

// Cart interactions
export interface ThemeCartHandlers {
  cart: CartItem[];
  isServiceInCart: (serviceId: string) => boolean;
  isProductInCart: (productId: string) => boolean;
  getProductQuantityInCart: (productId: string) => number;
  addServiceToCart: (service: Service) => void;
  removeFromCart: (itemId: string) => void;
  addProductToCart: (product: Product) => void;
  updateProductQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

// Main props that every theme component receives
export interface ThemeComponentProps {
  data: ThemeData;
  colors: ThemeColors;
  cart: ThemeCartHandlers;
  locale: string;
  currency: string;
  onOpenCart: () => void;
}

// Individual section props
export interface HeroSectionProps {
  merchant: Merchant;
  colors: ThemeColors;
  onScrollToServices: () => void;
}

export interface AboutSectionProps {
  merchant: Merchant;
  colors: ThemeColors;
}

export interface ServicesSectionProps {
  services: Service[];
  merchant?: Merchant;
  colors: ThemeColors;
  cart: ThemeCartHandlers;
  locale?: string;
  currency?: string;
}

export interface ProductsSectionProps {
  products: Product[];
  merchant?: Merchant;
  colors: ThemeColors;
  cart: ThemeCartHandlers;
}

export interface GallerySectionProps {
  gallery: GalleryImage[];
  colors: ThemeColors;
  onFullGalleryChange?: (isOpen: boolean) => void;
}

export interface ContactSectionProps {
  merchant: Merchant;
  colors: ThemeColors;
}

export interface SocialSectionProps {
  socialLinks: SocialLink[];
  colors: ThemeColors;
}

export interface VideoSectionProps {
  videoUrl: string;
  colors: ThemeColors;
}
