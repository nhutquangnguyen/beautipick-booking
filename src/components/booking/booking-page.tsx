"use client";

import { useState, useMemo, useEffect } from "react";
import { format, addDays, startOfDay, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, getDay } from "date-fns";
import { useTranslations } from "next-intl";
import { MapPin, Phone, Clock, ChevronLeft, Check, ShoppingBag, Calendar, Star, X, ChevronRight, Sparkles, Plus, Minus, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Merchant, Service, Staff, Availability, MerchantTheme, MerchantSettings, SocialLink, SocialLinkType, ContentSection, defaultContentOrder } from "@/types/database";
import { formatCurrency, formatDuration, formatTime, generateTimeSlots, cn } from "@/lib/utils";
import { LanguageSwitcherIcon } from "@/components/language-switcher";

// Social link icons
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  );
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

function ZaloIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
    </svg>
  );
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  );
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  );
}

function ShoppingBagIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  );
}

function LinkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
    </svg>
  );
}

// Helper to extract YouTube video ID from various URL formats
function getYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

const SOCIAL_LINK_CONFIG: Record<SocialLinkType, { icon: React.FC<{ className?: string }>; color: string }> = {
  instagram: { icon: InstagramIcon, color: "#E4405F" },
  facebook: { icon: FacebookIcon, color: "#1877F2" },
  tiktok: { icon: TikTokIcon, color: "#000000" },
  youtube: { icon: YouTubeIcon, color: "#FF0000" },
  twitter: { icon: TwitterIcon, color: "#000000" },
  whatsapp: { icon: WhatsAppIcon, color: "#25D366" },
  zalo: { icon: ZaloIcon, color: "#0068FF" },
  telegram: { icon: TelegramIcon, color: "#0088CC" },
  website: { icon: GlobeIcon, color: "#6366F1" },
  shopee: { icon: ShoppingBagIcon, color: "#EE4D2D" },
  lazada: { icon: ShoppingBagIcon, color: "#0F146D" },
  custom: { icon: LinkIcon, color: "#8B5CF6" },
};

type StaffWithServices = Staff & {
  staff_services: { service_id: string }[];
};

interface GalleryImage {
  id: string;
  image_url: string;
  caption: string | null;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
}

interface BookingPageProps {
  merchant: Merchant;
  services: Service[];
  staff: StaffWithServices[];
  availability: Availability[];
  gallery: GalleryImage[];
  products: Product[];
  theme: MerchantTheme;
  settings: MerchantSettings;
}

// Cart item types
interface CartServiceItem {
  type: "service";
  id: string;
  service: Service;
  quantity: 1; // Services always quantity 1
}

interface CartProductItem {
  type: "product";
  id: string;
  product: Product;
  quantity: number;
}

type CartItem = CartServiceItem | CartProductItem;

type CheckoutStep = "cart" | "datetime" | "details" | "confirmation";

export function BookingPage({
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
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>("cart");

  // Booking state
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });

  const supabase = createClient();

  // UI state
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null);
  const [showFloatingHeader, setShowFloatingHeader] = useState(false);
  const t = useTranslations("booking");

  // Show floating header on scroll
  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingHeader(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cart functions
  const addServiceToCart = (service: Service) => {
    // Check if service already in cart
    const exists = cart.find(item => item.type === "service" && item.id === service.id);
    if (exists) return; // Services can only be added once

    setCart([...cart, { type: "service", id: service.id, service, quantity: 1 }]);
  };

  const addProductToCart = (product: Product) => {
    const existingIndex = cart.findIndex(item => item.type === "product" && item.id === product.id);
    if (existingIndex >= 0) {
      // Increase quantity
      const newCart = [...cart];
      (newCart[existingIndex] as CartProductItem).quantity += 1;
      setCart(newCart);
    } else {
      setCart([...cart, { type: "product", id: product.id, product, quantity: 1 }]);
    }
  };

  const updateProductQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const newCart = cart.map(item => {
      if (item.type === "product" && item.id === productId) {
        return { ...item, quantity };
      }
      return item;
    });
    setCart(newCart);
  };

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const isServiceInCart = (serviceId: string) => {
    return cart.some(item => item.type === "service" && item.id === serviceId);
  };

  const getProductQuantityInCart = (productId: string) => {
    const item = cart.find(item => item.type === "product" && item.id === productId);
    return item ? (item as CartProductItem).quantity : 0;
  };

  // Cart totals
  const cartTotals = useMemo(() => {
    let totalPrice = 0;
    let totalDuration = 0;
    let serviceCount = 0;
    let productCount = 0;

    cart.forEach(item => {
      if (item.type === "service") {
        totalPrice += item.service.price;
        totalDuration += item.service.duration_minutes;
        serviceCount += 1;
      } else {
        totalPrice += item.product.price * item.quantity;
        productCount += item.quantity;
      }
    });

    return { totalPrice, totalDuration, serviceCount, productCount, itemCount: cart.length };
  }, [cart]);

  const hasServices = cartTotals.serviceCount > 0;

  // Generate available dates for calendar
  const getAvailableDaysOfWeek = useMemo(() => {
    return availability.map(a => a.day_of_week);
  }, [availability]);

  const isDateAvailable = (date: Date) => {
    const today = startOfDay(new Date());
    if (date < today) return false;

    const dayOfWeek = getDay(date);
    if (!getAvailableDaysOfWeek.includes(dayOfWeek)) return false;

    // Check booking window
    const maxDate = addDays(today, settings.bookingWindow);
    if (date > maxDate) return false;

    // Check lead time for today
    if (isSameDay(date, today) && settings.bookingLeadTime > 0) {
      const hoursUntilClose = 24 - new Date().getHours();
      if (hoursUntilClose < settings.bookingLeadTime) return false;
    }

    return true;
  };

  // Generate time slots for selected date
  const timeSlots = useMemo(() => {
    if (!selectedDate || !hasServices) return [];

    const dayOfWeek = getDay(selectedDate);
    const dayAvailability = availability.find((a) => a.day_of_week === dayOfWeek);

    if (!dayAvailability) return [];

    return generateTimeSlots(
      dayAvailability.start_time,
      dayAvailability.end_time,
      cartTotals.totalDuration || 30 // Default 30 min if only products
    );
  }, [selectedDate, hasServices, availability, cartTotals.totalDuration]);

  // Calendar days for current month
  const calendarDays = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start, end });

    // Add padding days for start of month
    const startPadding = getDay(start);
    const paddingDays: (Date | null)[] = Array(startPadding).fill(null);

    return [...paddingDays, ...days];
  }, [currentMonth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setLoading(true);
    setError(null);

    try {
      // Calculate end time based on total service duration
      let endTime = selectedTime;
      if (selectedTime && cartTotals.totalDuration > 0) {
        const [hours, minutes] = selectedTime.split(":").map(Number);
        const endMinutes = hours * 60 + minutes + cartTotals.totalDuration;
        endTime = `${Math.floor(endMinutes / 60).toString().padStart(2, "0")}:${(endMinutes % 60).toString().padStart(2, "0")}`;
      }

      // Prepare cart items for storage
      const cartItemsData = cart.map(item => {
        if (item.type === "service") {
          return {
            type: "service",
            id: item.service.id,
            name: item.service.name,
            price: item.service.price,
            duration_minutes: item.service.duration_minutes,
            quantity: 1,
          };
        } else {
          return {
            type: "product",
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
          };
        }
      });

      // Create booking with cart items
      const { error: bookingError } = await supabase.from("bookings").insert({
        merchant_id: merchant.id,
        service_id: cart.find(i => i.type === "service")?.id || null,
        staff_id: null,
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phone || null,
        booking_date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : null,
        start_time: selectedTime || null,
        end_time: endTime || null,
        notes: customerInfo.notes || null,
        total_price: cartTotals.totalPrice,
        status: "pending",
        cart_items: cartItemsData,
      });

      if (bookingError) {
        setError(bookingError.message);
        return;
      }

      setBookingComplete(true);
      setCheckoutStep("confirmation");
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Premium styling helpers
  const cardRadius = useMemo(() => {
    const radiusMap = { none: "0", sm: "8px", md: "16px", lg: "20px", full: "24px" };
    return radiusMap[theme.borderRadius];
  }, [theme.borderRadius]);

  const buttonRadius = useMemo(() => {
    const radiusMap = { none: "0", sm: "8px", md: "12px", lg: "16px", full: "9999px" };
    return radiusMap[theme.borderRadius];
  }, [theme.borderRadius]);

  // Group services by category
  const servicesByCategory = useMemo(() => {
    const grouped: Record<string, Service[]> = {};
    services.forEach((service) => {
      const category = service.category || "Services";
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(service);
    });
    return grouped;
  }, [services]);

  // Get content order from theme or use default
  const contentOrder = theme.contentOrder || defaultContentOrder;
  const headerStyle = theme.headerStyle || "overlay";
  const showSectionTitles = theme.showSectionTitles !== false;

  // Premium section title component
  const SectionTitle = ({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) => (
    <div className="flex items-center gap-3 mb-6">
      {icon && (
        <div
          className="p-2 rounded-xl"
          style={{ backgroundColor: theme.primaryColor + "15" }}
        >
          <span style={{ color: theme.primaryColor }}>{icon}</span>
        </div>
      )}
      <h2 className="text-xl sm:text-2xl font-bold tracking-tight">{children}</h2>
    </div>
  );

  // Render individual content sections with premium styling
  const renderSection = (section: ContentSection) => {
    switch (section) {
      case "about":
        if (!merchant.description) return null;
        return (
          <section key="about" className="mb-12">
            {showSectionTitles && <SectionTitle icon={<Sparkles className="h-5 w-5" />}>{t("aboutUs")}</SectionTitle>}
            <div
              className="relative p-6 sm:p-8 overflow-hidden"
              style={{
                borderRadius: cardRadius,
                background: `linear-gradient(135deg, ${theme.primaryColor}08 0%, ${theme.secondaryColor}05 100%)`,
                border: `1px solid ${theme.primaryColor}12`,
                boxShadow: `0 4px 24px ${theme.primaryColor}08`
              }}
            >
              <div
                className="absolute top-0 left-0 w-1 h-full rounded-full"
                style={{
                  background: `linear-gradient(to bottom, ${theme.primaryColor}, ${theme.secondaryColor})`
                }}
              />
              <p className="text-base sm:text-lg leading-relaxed opacity-85 pl-4">{merchant.description}</p>
            </div>
          </section>
        );

      case "contact":
        if (!merchant.address && !merchant.phone && !merchant.google_maps_url) return null;
        return (
          <section key="contact" className="mb-12">
            {showSectionTitles && <SectionTitle icon={<Phone className="h-5 w-5" />}>{t("contactUs")}</SectionTitle>}
            <div className="flex flex-wrap gap-3">
              {merchant.google_maps_url && (
                <a
                  href={merchant.google_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 px-5 py-3 text-sm font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                  style={{
                    backgroundColor: theme.primaryColor,
                    color: "#fff",
                    borderRadius: buttonRadius,
                    boxShadow: `0 4px 14px ${theme.primaryColor}40`
                  }}
                >
                  <MapPin className="h-4 w-4" />
                  <span>View on Maps</span>
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              )}
              {merchant.address && (
                <div
                  className="flex items-center gap-3 px-5 py-3 text-sm font-medium"
                  style={{
                    backgroundColor: theme.primaryColor + "10",
                    color: theme.textColor,
                    borderRadius: buttonRadius,
                    border: `1px solid ${theme.primaryColor}20`
                  }}
                >
                  <MapPin className="h-4 w-4 flex-shrink-0" style={{ color: theme.primaryColor }} />
                  <span className="opacity-80">
                    {merchant.address}
                    {merchant.city && `, ${merchant.city}`}
                    {merchant.state && `, ${merchant.state}`}
                  </span>
                </div>
              )}
              {merchant.phone && (
                <a
                  href={`tel:${merchant.phone}`}
                  className="flex items-center gap-3 px-5 py-3 text-sm font-medium transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    backgroundColor: theme.primaryColor + "10",
                    color: theme.textColor,
                    borderRadius: buttonRadius,
                    border: `1px solid ${theme.primaryColor}20`
                  }}
                >
                  <Phone className="h-4 w-4" style={{ color: theme.primaryColor }} />
                  <span>{merchant.phone}</span>
                </a>
              )}
            </div>
          </section>
        );

      case "social":
        if (!merchant.social_links || !Array.isArray(merchant.social_links) || merchant.social_links.length === 0) return null;
        return (
          <section key="social" className="mb-12">
            <div className="flex flex-wrap gap-3">
              {(merchant.social_links as unknown as SocialLink[]).map((link) => {
                const config = SOCIAL_LINK_CONFIG[link.type];
                const Icon = config.icon;
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2.5 px-5 py-3 text-sm font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                    style={{
                      backgroundColor: config.color,
                      color: "#fff",
                      borderRadius: buttonRadius,
                      boxShadow: `0 4px 14px ${config.color}30`
                    }}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{link.title}</span>
                  </a>
                );
              })}
            </div>
          </section>
        );

      case "video":
        if (!merchant.youtube_url || !getYouTubeVideoId(merchant.youtube_url)) return null;
        return (
          <section key="video" className="mb-12">
            <div
              className="relative w-full overflow-hidden shadow-2xl"
              style={{ borderRadius: cardRadius, paddingBottom: "56.25%" }}
            >
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${getYouTubeVideoId(merchant.youtube_url)}?rel=0&modestbranding=1`}
                title="YouTube video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </section>
        );

      case "gallery":
        if (gallery.length === 0) return null;
        return (
          <section id="section-gallery" key="gallery" className="mb-12 scroll-mt-20">
            {showSectionTitles && <SectionTitle icon={<Star className="h-5 w-5" />}>{t("ourGallery")}</SectionTitle>}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {gallery.map((image) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedGalleryImage(image.image_url)}
                  className="group relative aspect-square overflow-hidden transition-all duration-500 hover:shadow-2xl hover:z-10 hover:scale-[1.02]"
                  style={{
                    borderRadius: cardRadius,
                    boxShadow: `0 4px 20px ${theme.primaryColor}10`
                  }}
                >
                  <div
                    className="absolute inset-0 animate-pulse"
                    style={{ backgroundColor: theme.primaryColor + "10" }}
                  />
                  <img
                    src={image.image_url}
                    alt={image.caption || "Gallery image"}
                    className="relative w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {image.caption && (
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                      {image.caption}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </section>
        );

      case "products":
        if (products.length === 0) return null;
        return (
          <section id="section-products" key="products" className="mb-12 scroll-mt-20">
            {showSectionTitles && <SectionTitle icon={<ShoppingBag className="h-5 w-5" />}>{t("ourProducts")}</SectionTitle>}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product) => {
                const quantityInCart = getProductQuantityInCart(product.id);
                return (
                  <div
                    key={product.id}
                    className="group p-4 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1"
                    style={{
                      borderRadius: cardRadius,
                      backgroundColor: theme.backgroundColor,
                      border: `1px solid ${theme.primaryColor}12`,
                      boxShadow: `0 4px 20px ${theme.primaryColor}08`
                    }}
                  >
                    {product.image_url ? (
                      <div className="relative overflow-hidden mb-4" style={{ borderRadius: `calc(${cardRadius} - 8px)` }}>
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="relative w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                    ) : (
                      <div
                        className="w-full aspect-square flex items-center justify-center mb-4"
                        style={{
                          background: `linear-gradient(135deg, ${theme.primaryColor}08 0%, ${theme.secondaryColor}08 100%)`,
                          borderRadius: `calc(${cardRadius} - 8px)`
                        }}
                      >
                        <ShoppingBag className="h-12 w-12 opacity-20" />
                      </div>
                    )}
                    <h3 className="font-semibold text-sm sm:text-base truncate">{product.name}</h3>
                    {product.description && (
                      <p className="text-xs opacity-60 truncate mt-1">{product.description}</p>
                    )}
                    <div className="flex items-center justify-between mt-3">
                      <p
                        className="text-lg font-bold"
                        style={{ color: theme.primaryColor }}
                      >
                        {formatCurrency(product.price, merchant.currency)}
                      </p>
                      {quantityInCart > 0 ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateProductQuantity(product.id, quantityInCart - 1)}
                            className="p-1.5 rounded-full transition-colors"
                            style={{ backgroundColor: theme.primaryColor + "15", color: theme.primaryColor }}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="font-semibold min-w-[20px] text-center">{quantityInCart}</span>
                          <button
                            onClick={() => updateProductQuantity(product.id, quantityInCart + 1)}
                            className="p-1.5 rounded-full transition-colors"
                            style={{ backgroundColor: theme.primaryColor, color: "#fff" }}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addProductToCart(product)}
                          className="p-2 rounded-full transition-all duration-300 hover:scale-110"
                          style={{ backgroundColor: theme.primaryColor, color: "#fff" }}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );

      case "services":
        return (
          <section id="section-services" key="services" className="mb-12 scroll-mt-20">
            {showSectionTitles && <SectionTitle icon={<Sparkles className="h-5 w-5" />}>{t("ourServices")}</SectionTitle>}
            <div className="space-y-4">
              {Object.entries(servicesByCategory).map(([category, categoryServices]) => (
                <div key={category}>
                  {Object.keys(servicesByCategory).length > 1 && (
                    <div className="flex items-center gap-3 mb-4 mt-8">
                      <div
                        className="h-1 flex-1 rounded-full"
                        style={{
                          background: `linear-gradient(to right, ${theme.primaryColor}30, transparent)`
                        }}
                      />
                      <h3
                        className="text-sm font-bold uppercase tracking-widest px-4"
                        style={{ color: theme.primaryColor }}
                      >
                        {category}
                      </h3>
                      <div
                        className="h-1 flex-1 rounded-full"
                        style={{
                          background: `linear-gradient(to left, ${theme.primaryColor}30, transparent)`
                        }}
                      />
                    </div>
                  )}
                  <div className="space-y-3">
                    {categoryServices.map((service) => {
                      const inCart = isServiceInCart(service.id);
                      return (
                        <div
                          key={service.id}
                          className="group flex items-center justify-between p-5 sm:p-6 transition-all duration-300 hover:shadow-xl"
                          style={{
                            borderRadius: cardRadius,
                            backgroundColor: theme.backgroundColor,
                            border: inCart ? `2px solid ${theme.primaryColor}` : `1px solid ${theme.primaryColor}12`,
                            boxShadow: inCart ? `0 4px 20px ${theme.primaryColor}25` : `0 4px 20px ${theme.primaryColor}06`
                          }}
                        >
                          <div className="flex-1 min-w-0 pr-4">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-base sm:text-lg">{service.name}</h3>
                              {inCart && (
                                <Check className="h-5 w-5" style={{ color: theme.primaryColor }} />
                              )}
                            </div>
                            {service.description && (
                              <p className="text-sm opacity-60 mt-1 line-clamp-2">{service.description}</p>
                            )}
                            <div
                              className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-full text-xs font-medium"
                              style={{
                                backgroundColor: theme.primaryColor + "10",
                                color: theme.primaryColor
                              }}
                            >
                              <Clock className="h-3.5 w-3.5" />
                              <span>{formatDuration(service.duration_minutes)}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <p
                              className="text-xl sm:text-2xl font-bold"
                              style={{ color: theme.primaryColor }}
                            >
                              {formatCurrency(service.price, merchant.currency)}
                            </p>
                            {inCart ? (
                              <button
                                onClick={() => removeFromCart(service.id)}
                                className="p-3 rounded-full transition-all duration-300 hover:scale-110"
                                style={{ backgroundColor: "#EF4444", color: "#fff" }}
                              >
                                <X className="h-5 w-5" />
                              </button>
                            ) : (
                              <button
                                onClick={() => addServiceToCart(service)}
                                className="p-3 rounded-full transition-all duration-300 hover:scale-110"
                                style={{ backgroundColor: theme.primaryColor, color: "#fff" }}
                              >
                                <Plus className="h-5 w-5" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  // Premium header component
  const renderHeader = () => {
    if (headerStyle === "minimal") {
      return (
        <header
          className="sticky top-0 z-40 backdrop-blur-xl border-b"
          style={{
            backgroundColor: theme.backgroundColor + "e6",
            borderColor: theme.primaryColor + "15"
          }}
        >
          <div className="mx-auto max-w-5xl px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {merchant.logo_url ? (
                  <img
                    src={merchant.logo_url}
                    alt={merchant.business_name}
                    className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl object-cover shadow-lg ring-2 ring-white/20"
                  />
                ) : (
                  <div
                    className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.secondaryColor} 100%)`
                    }}
                  >
                    {merchant.business_name.charAt(0)}
                  </div>
                )}
                <div>
                  <h1 className="text-lg sm:text-xl font-bold tracking-tight">{merchant.business_name}</h1>
                  {(merchant.city || merchant.state) && (
                    <p className="text-xs sm:text-sm opacity-50 flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3" />
                      {merchant.city}{merchant.city && merchant.state && ", "}{merchant.state}
                    </p>
                  )}
                </div>
              </div>
              <LanguageSwitcherIcon />
            </div>
          </div>
        </header>
      );
    }

    if (headerStyle === "stacked") {
      return (
        <section className="relative">
          {merchant.cover_image_url ? (
            <div className="h-48 sm:h-64 md:h-72 w-full overflow-hidden">
              <img
                src={merchant.cover_image_url}
                alt={merchant.business_name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div
              className="h-48 sm:h-64 md:h-72 w-full"
              style={{
                background: `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.secondaryColor} 50%, ${theme.accentColor} 100%)`
              }}
            />
          )}
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="relative -mt-16 sm:-mt-20 flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6 pb-6">
              {merchant.logo_url ? (
                <img
                  src={merchant.logo_url}
                  alt={merchant.business_name}
                  className="h-28 w-28 sm:h-36 sm:w-36 rounded-3xl object-cover shadow-2xl ring-4 ring-white"
                />
              ) : (
                <div
                  className="h-28 w-28 sm:h-36 sm:w-36 rounded-3xl shadow-2xl ring-4 ring-white flex items-center justify-center text-4xl font-bold text-white"
                  style={{
                    background: `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.secondaryColor} 100%)`
                  }}
                >
                  {merchant.business_name.charAt(0)}
                </div>
              )}
              <div className="flex-1 pb-2">
                <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">{merchant.business_name}</h1>
                {(merchant.city || merchant.state) && (
                  <p className="text-sm sm:text-base opacity-60 flex items-center gap-1.5 mt-2">
                    <MapPin className="h-4 w-4" />
                    {merchant.city}{merchant.city && merchant.state && ", "}{merchant.state}
                  </p>
                )}
              </div>
              <div className="sm:pb-2">
                <LanguageSwitcherIcon />
              </div>
            </div>
          </div>
        </section>
      );
    }

    // Default: overlay style - Premium version
    return (
      <section className="relative">
        {merchant.cover_image_url ? (
          <div className="h-64 sm:h-80 md:h-96 w-full overflow-hidden">
            <img
              src={merchant.cover_image_url}
              alt={merchant.business_name}
              className="w-full h-full object-cover scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          </div>
        ) : (
          <div
            className="h-64 sm:h-80 md:h-96 w-full relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.secondaryColor} 50%, ${theme.accentColor || theme.primaryColor} 100%)`
            }}
          >
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white/20 blur-3xl" />
              <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full bg-white/10 blur-3xl" />
            </div>
          </div>
        )}

        <div className="absolute top-4 right-4 z-10">
          <LanguageSwitcherIcon />
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 pb-8">
            <div className="flex items-end gap-5 sm:gap-6">
              {merchant.logo_url ? (
                <img
                  src={merchant.logo_url}
                  alt={merchant.business_name}
                  className="h-24 w-24 sm:h-32 sm:w-32 rounded-3xl object-cover shadow-2xl ring-4 ring-white/30 backdrop-blur"
                />
              ) : (
                <div
                  className="h-24 w-24 sm:h-32 sm:w-32 rounded-3xl ring-4 ring-white/30 shadow-2xl backdrop-blur flex items-center justify-center text-3xl sm:text-4xl font-bold text-white"
                  style={{ backgroundColor: theme.primaryColor + "80" }}
                >
                  {merchant.business_name.charAt(0)}
                </div>
              )}
              <div className="pb-1 sm:pb-2 text-white">
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight drop-shadow-lg">
                  {merchant.business_name}
                </h1>
                {(merchant.city || merchant.state) && (
                  <p className="text-sm sm:text-base opacity-90 flex items-center gap-1.5 mt-2 drop-shadow">
                    <MapPin className="h-4 w-4" />
                    {merchant.city}{merchant.city && merchant.state && ", "}{merchant.state}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  // Full Calendar Component
  const CalendarPicker = () => (
    <div
      className="p-4 sm:p-6"
      style={{
        borderRadius: cardRadius,
        backgroundColor: theme.backgroundColor,
        border: `1px solid ${theme.primaryColor}15`
      }}
    >
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-2 rounded-full transition-colors hover:bg-gray-100"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h3 className="text-lg font-bold">
          {format(currentMonth, "MMMM yyyy")}
        </h3>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2 rounded-full transition-colors hover:bg-gray-100"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center text-xs font-semibold py-2 opacity-60"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          if (!day) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const isAvailable = isDateAvailable(day);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isToday = isSameDay(day, new Date());

          return (
            <button
              key={day.toISOString()}
              onClick={() => isAvailable && setSelectedDate(day)}
              disabled={!isAvailable}
              className={cn(
                "aspect-square flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-200",
                !isCurrentMonth && "opacity-30",
                !isAvailable && "opacity-30 cursor-not-allowed",
                isAvailable && !isSelected && "hover:bg-gray-100",
                isSelected && "text-white shadow-lg scale-105"
              )}
              style={{
                backgroundColor: isSelected ? theme.primaryColor : undefined,
                outline: isToday && !isSelected ? `2px solid ${theme.primaryColor}` : undefined,
                outlineOffset: isToday && !isSelected ? "2px" : undefined,
                boxShadow: isSelected ? `0 4px 14px ${theme.primaryColor}40` : undefined
              }}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>
    </div>
  );

  // Cart/Checkout Modal
  if (showCart) {
    return (
      <div
        className="fixed inset-0 z-50 overflow-y-auto"
        style={{
          backgroundColor: theme.backgroundColor,
          color: theme.textColor,
          fontFamily: theme.fontFamily,
        }}
      >
        {/* Header */}
        <header
          className="sticky top-0 z-10 border-b backdrop-blur-xl"
          style={{
            backgroundColor: theme.backgroundColor + "e6",
            borderColor: theme.primaryColor + "15"
          }}
        >
          <div className="mx-auto max-w-3xl px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  if (checkoutStep === "cart") {
                    setShowCart(false);
                  } else if (checkoutStep === "datetime") {
                    setCheckoutStep("cart");
                  } else if (checkoutStep === "details") {
                    setCheckoutStep("datetime");
                  }
                }}
                className="flex items-center gap-2 text-sm font-semibold transition-colors hover:opacity-70"
                style={{ color: theme.primaryColor }}
              >
                <ChevronLeft className="h-5 w-5" />
                {checkoutStep === "cart" ? t("backToPage") : t("back")}
              </button>
              <h2 className="font-bold text-lg">
                {checkoutStep === "cart" && "Your Cart"}
                {checkoutStep === "datetime" && "Choose Date & Time"}
                {checkoutStep === "details" && "Your Details"}
                {checkoutStep === "confirmation" && "Confirmed!"}
              </h2>
              <button
                onClick={() => setShowCart(false)}
                className="p-2 rounded-full transition-colors hover:bg-gray-100"
              >
                <X className="h-5 w-5 opacity-60" />
              </button>
            </div>

            {/* Progress Indicator */}
            {!bookingComplete && (
              <div className="mt-6 flex items-center justify-center gap-3">
                {["cart", ...(hasServices ? ["datetime"] : []), "details"].map((s, i, arr) => (
                  <div key={s} className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all duration-300",
                        checkoutStep === s || arr.indexOf(checkoutStep) > i
                          ? "text-white shadow-lg"
                          : "bg-gray-100"
                      )}
                      style={{
                        backgroundColor: checkoutStep === s || arr.indexOf(checkoutStep) > i ? theme.primaryColor : undefined,
                        boxShadow: checkoutStep === s ? `0 4px 14px ${theme.primaryColor}50` : undefined
                      }}
                    >
                      {arr.indexOf(checkoutStep) > i ? <Check className="h-5 w-5" /> : i + 1}
                    </div>
                    {i < arr.length - 1 && (
                      <div
                        className="h-1 w-8 sm:w-12 rounded-full transition-colors"
                        style={{
                          backgroundColor: arr.indexOf(checkoutStep) > i ? theme.primaryColor : theme.primaryColor + "20"
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
          {/* Cart Step */}
          {checkoutStep === "cart" && (
            <div className="space-y-6">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="h-16 w-16 mx-auto opacity-20 mb-4" />
                  <p className="text-lg font-medium opacity-60">Your cart is empty</p>
                  <button
                    onClick={() => setShowCart(false)}
                    className="mt-4 px-6 py-2 rounded-full text-sm font-semibold"
                    style={{ backgroundColor: theme.primaryColor + "15", color: theme.primaryColor }}
                  >
                    Browse Services
                  </button>
                </div>
              ) : (
                <>
                  {/* Cart Items */}
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 p-4"
                        style={{
                          borderRadius: cardRadius,
                          backgroundColor: theme.primaryColor + "05",
                          border: `1px solid ${theme.primaryColor}15`
                        }}
                      >
                        {item.type === "service" ? (
                          <>
                            <div
                              className="p-3 rounded-xl"
                              style={{ backgroundColor: theme.primaryColor + "15" }}
                            >
                              <Sparkles className="h-5 w-5" style={{ color: theme.primaryColor }} />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold">{item.service.name}</p>
                              <p className="text-sm opacity-60">{formatDuration(item.service.duration_minutes)}</p>
                            </div>
                            <p className="font-bold" style={{ color: theme.primaryColor }}>
                              {formatCurrency(item.service.price, merchant.currency)}
                            </p>
                          </>
                        ) : (
                          <>
                            {item.product.image_url ? (
                              <img
                                src={item.product.image_url}
                                alt={item.product.name}
                                className="h-14 w-14 rounded-xl object-cover"
                              />
                            ) : (
                              <div
                                className="h-14 w-14 rounded-xl flex items-center justify-center"
                                style={{ backgroundColor: theme.primaryColor + "15" }}
                              >
                                <ShoppingBag className="h-6 w-6" style={{ color: theme.primaryColor }} />
                              </div>
                            )}
                            <div className="flex-1">
                              <p className="font-semibold">{item.product.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <button
                                  onClick={() => updateProductQuantity(item.id, item.quantity - 1)}
                                  className="p-1 rounded-full"
                                  style={{ backgroundColor: theme.primaryColor + "15" }}
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="text-sm font-medium">{item.quantity}</span>
                                <button
                                  onClick={() => updateProductQuantity(item.id, item.quantity + 1)}
                                  className="p-1 rounded-full"
                                  style={{ backgroundColor: theme.primaryColor + "15" }}
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                            <p className="font-bold" style={{ color: theme.primaryColor }}>
                              {formatCurrency(item.product.price * item.quantity, merchant.currency)}
                            </p>
                          </>
                        )}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 rounded-full hover:bg-red-50 text-red-500 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Cart Summary */}
                  <div
                    className="p-6"
                    style={{
                      borderRadius: cardRadius,
                      background: `linear-gradient(135deg, ${theme.primaryColor}10 0%, ${theme.secondaryColor}10 100%)`,
                      border: `1px solid ${theme.primaryColor}20`
                    }}
                  >
                    {hasServices && (
                      <div className="flex justify-between text-sm mb-2">
                        <span className="opacity-70">Total Duration</span>
                        <span className="font-semibold">{formatDuration(cartTotals.totalDuration)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold pt-2 border-t" style={{ borderColor: theme.primaryColor + "20" }}>
                      <span>Total</span>
                      <span style={{ color: theme.primaryColor }}>
                        {formatCurrency(cartTotals.totalPrice, merchant.currency)}
                      </span>
                    </div>
                  </div>

                  {/* Continue Button */}
                  <button
                    onClick={() => setCheckoutStep(hasServices ? "datetime" : "details")}
                    className="w-full py-4 font-bold text-lg transition-all duration-300 hover:scale-[1.02]"
                    style={{
                      background: `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.secondaryColor} 100%)`,
                      color: "#fff",
                      borderRadius: buttonRadius,
                      boxShadow: `0 8px 32px ${theme.primaryColor}40`
                    }}
                  >
                    {hasServices ? "Choose Date & Time" : "Continue to Checkout"}
                  </button>
                </>
              )}
            </div>
          )}

          {/* DateTime Step */}
          {checkoutStep === "datetime" && (
            <div className="space-y-8">
              {/* Calendar */}
              <CalendarPicker />

              {/* Time Slots */}
              {selectedDate && (
                <div>
                  <h3 className="text-lg font-bold mb-4">
                    Available Times for {format(selectedDate, "MMMM d")}
                  </h3>
                  {timeSlots.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={cn(
                            "rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300",
                            selectedTime === time
                              ? "text-white shadow-lg scale-105"
                              : "hover:bg-gray-50"
                          )}
                          style={{
                            backgroundColor: selectedTime === time ? theme.primaryColor : theme.backgroundColor,
                            border: `1px solid ${selectedTime === time ? 'transparent' : theme.primaryColor + '15'}`,
                            boxShadow: selectedTime === time ? `0 4px 14px ${theme.primaryColor}40` : undefined
                          }}
                        >
                          {formatTime(time)}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-8 opacity-60">No available times for this date</p>
                  )}
                </div>
              )}

              {/* Continue Button */}
              {selectedDate && selectedTime && (
                <button
                  onClick={() => setCheckoutStep("details")}
                  className="w-full py-4 font-bold text-lg transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    background: `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.secondaryColor} 100%)`,
                    color: "#fff",
                    borderRadius: buttonRadius,
                    boxShadow: `0 8px 32px ${theme.primaryColor}40`
                  }}
                >
                  Continue
                </button>
              )}
            </div>
          )}

          {/* Details Step */}
          {checkoutStep === "details" && (
            <div className="space-y-6">
              {/* Order Summary */}
              <div
                className="p-6"
                style={{
                  borderRadius: cardRadius,
                  background: `linear-gradient(135deg, ${theme.primaryColor}10 0%, ${theme.secondaryColor}10 100%)`,
                  border: `1px solid ${theme.primaryColor}20`
                }}
              >
                <h3 className="font-bold mb-4">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span className="opacity-70">
                        {item.type === "service" ? item.service.name : `${item.product.name} x${item.quantity}`}
                      </span>
                      <span>
                        {formatCurrency(
                          item.type === "service" ? item.service.price : item.product.price * item.quantity,
                          merchant.currency
                        )}
                      </span>
                    </div>
                  ))}
                </div>
                {selectedDate && selectedTime && (
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t text-sm" style={{ borderColor: theme.primaryColor + "20" }}>
                    <span className="flex items-center gap-1.5 opacity-70">
                      <Calendar className="h-4 w-4" />
                      {format(selectedDate, "EEE, MMM d")}
                    </span>
                    <span className="flex items-center gap-1.5 opacity-70">
                      <Clock className="h-4 w-4" />
                      {formatTime(selectedTime)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold mt-4 pt-4 border-t" style={{ borderColor: theme.primaryColor + "20" }}>
                  <span>Total</span>
                  <span style={{ color: theme.primaryColor }}>
                    {formatCurrency(cartTotals.totalPrice, merchant.currency)}
                  </span>
                </div>
              </div>

              {/* Customer Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div
                    className="p-4 text-sm font-medium"
                    style={{
                      borderRadius: buttonRadius,
                      backgroundColor: '#FEE2E2',
                      color: '#DC2626'
                    }}
                  >
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold mb-2">{t("name")} *</label>
                  <input
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    className="w-full px-5 py-4 text-base focus:outline-none transition-shadow focus:shadow-lg"
                    style={{
                      borderRadius: buttonRadius,
                      border: `1px solid ${theme.primaryColor}20`,
                      backgroundColor: theme.backgroundColor
                    }}
                    placeholder={t("namePlaceholder")}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">{t("email")} *</label>
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                    className="w-full px-5 py-4 text-base focus:outline-none transition-shadow focus:shadow-lg"
                    style={{
                      borderRadius: buttonRadius,
                      border: `1px solid ${theme.primaryColor}20`,
                      backgroundColor: theme.backgroundColor
                    }}
                    placeholder={t("emailPlaceholder")}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    {t("phone")} {settings.requirePhoneNumber ? "*" : ""}
                  </label>
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    className="w-full px-5 py-4 text-base focus:outline-none transition-shadow focus:shadow-lg"
                    style={{
                      borderRadius: buttonRadius,
                      border: `1px solid ${theme.primaryColor}20`,
                      backgroundColor: theme.backgroundColor
                    }}
                    placeholder={t("phonePlaceholder")}
                    required={settings.requirePhoneNumber}
                  />
                </div>

                {settings.allowNotes && (
                  <div>
                    <label className="block text-sm font-semibold mb-2">{t("notes")}</label>
                    <textarea
                      value={customerInfo.notes}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
                      className="w-full px-5 py-4 text-base focus:outline-none transition-shadow focus:shadow-lg resize-none"
                      style={{
                        borderRadius: buttonRadius,
                        border: `1px solid ${theme.primaryColor}20`,
                        backgroundColor: theme.backgroundColor
                      }}
                      rows={3}
                      placeholder={t("notesPlaceholder")}
                    />
                  </div>
                )}

                {settings.cancellationPolicy && (
                  <p className="text-xs opacity-50 leading-relaxed">{settings.cancellationPolicy}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 font-bold text-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                  style={{
                    background: `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.secondaryColor} 100%)`,
                    color: "#fff",
                    borderRadius: buttonRadius,
                    boxShadow: `0 8px 32px ${theme.primaryColor}40`
                  }}
                >
                  {loading ? t("loading") : t("confirmBooking")}
                </button>
              </form>
            </div>
          )}

          {/* Confirmation Step */}
          {checkoutStep === "confirmation" && (
            <div className="text-center py-8">
              <div
                className="mx-auto flex h-24 w-24 items-center justify-center rounded-full mb-6"
                style={{
                  background: `linear-gradient(135deg, ${theme.primaryColor}20 0%, ${theme.secondaryColor}20 100%)`
                }}
              >
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-full"
                  style={{
                    background: `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.secondaryColor} 100%)`,
                    boxShadow: `0 8px 24px ${theme.primaryColor}40`
                  }}
                >
                  <Check className="h-8 w-8 text-white" />
                </div>
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold">{t("bookingConfirmed")}</h2>
              <p className="mt-3 opacity-60 text-base">{t("bookingConfirmedDesc")}</p>

              <div
                className="mx-auto mt-8 max-w-sm p-6 text-left"
                style={{
                  borderRadius: cardRadius,
                  background: `linear-gradient(135deg, ${theme.primaryColor}08 0%, ${theme.secondaryColor}08 100%)`,
                  border: `1px solid ${theme.primaryColor}15`
                }}
              >
                <div className="space-y-2 text-sm">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span className="opacity-70">
                        {item.type === "service" ? item.service.name : `${item.product.name} x${item.quantity}`}
                      </span>
                      <span>
                        {formatCurrency(
                          item.type === "service" ? item.service.price : item.product.price * item.quantity,
                          merchant.currency
                        )}
                      </span>
                    </div>
                  ))}
                </div>
                {selectedDate && selectedTime && (
                  <div className="mt-4 pt-4 border-t" style={{ borderColor: theme.primaryColor + '15' }}>
                    <p className="font-medium">{format(selectedDate, "EEEE, MMMM d, yyyy")}</p>
                    <p className="text-sm opacity-60 mt-1">
                      {formatTime(selectedTime)} • {formatDuration(cartTotals.totalDuration)}
                    </p>
                  </div>
                )}
                <p className="mt-4 pt-4 border-t text-2xl font-bold" style={{ borderColor: theme.primaryColor + '15', color: theme.primaryColor }}>
                  {formatCurrency(cartTotals.totalPrice, merchant.currency)}
                </p>
              </div>

              <div className="mt-8 space-y-3 max-w-sm mx-auto">
                <button
                  onClick={() => {
                    setCart([]);
                    setSelectedDate(null);
                    setSelectedTime(null);
                    setCustomerInfo({ name: "", email: "", phone: "", notes: "" });
                    setBookingComplete(false);
                    setCheckoutStep("cart");
                    setShowCart(false);
                  }}
                  className="w-full py-4 font-bold text-base transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    background: `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.secondaryColor} 100%)`,
                    color: "#fff",
                    borderRadius: buttonRadius,
                    boxShadow: `0 4px 14px ${theme.primaryColor}30`
                  }}
                >
                  {t("backToPage")}
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  // Landing page view
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
        fontFamily: theme.fontFamily,
      }}
    >
      {renderHeader()}

      {/* Floating Header - appears on scroll */}
      <div
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          showFloatingHeader
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0 pointer-events-none"
        )}
      >
        <div
          className="backdrop-blur-xl border-b"
          style={{
            backgroundColor: theme.backgroundColor + "f0",
            borderColor: theme.primaryColor + "15"
          }}
        >
          <div className="mx-auto max-w-5xl px-4 sm:px-6 py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {merchant.logo_url ? (
                  <img
                    src={merchant.logo_url}
                    alt={merchant.business_name}
                    className="h-10 w-10 rounded-xl object-cover shadow-md"
                  />
                ) : (
                  <div
                    className="h-10 w-10 rounded-xl flex items-center justify-center text-sm font-bold text-white shadow-md"
                    style={{
                      background: `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.secondaryColor} 100%)`
                    }}
                  >
                    {merchant.business_name.charAt(0)}
                  </div>
                )}
                <span className="font-semibold text-base truncate max-w-[120px] sm:max-w-none">
                  {merchant.business_name}
                </span>
              </div>

              {/* Navigation Shortcuts */}
              <div className="hidden md:flex items-center gap-2">
                {contentOrder.map((section) => {
                  let label = "";
                  let visible = false;

                  if (section === "services" && services.length > 0) {
                    label = t("ourServices");
                    visible = true;
                  } else if (section === "gallery" && gallery.length > 0) {
                    label = t("ourGallery");
                    visible = true;
                  } else if (section === "products" && products.length > 0) {
                    label = t("ourProducts");
                    visible = true;
                  }

                  if (!visible) return null;

                  return (
                    <button
                      key={section}
                      onClick={() => {
                        const element = document.getElementById(`section-${section}`);
                        element?.scrollIntoView({ behavior: "smooth", block: "start" });
                      }}
                      className="px-3 py-1.5 text-sm font-medium rounded-lg transition-colors hover:opacity-80"
                      style={{
                        color: theme.primaryColor,
                        backgroundColor: theme.primaryColor + "10"
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              {merchant.google_maps_url && (
                <a
                  href={merchant.google_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-semibold transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    backgroundColor: theme.primaryColor,
                    color: "#fff",
                    borderRadius: buttonRadius,
                    boxShadow: `0 4px 14px ${theme.primaryColor}30`
                  }}
                >
                  <MapPin className="h-4 w-4" />
                  <span className="hidden sm:inline">View on Maps</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10 sm:py-12 pb-32 sm:pb-36">
        {contentOrder.map((section) => renderSection(section))}
      </div>

      {/* Fixed Cart Button */}
      <div
        className="fixed bottom-0 left-0 right-0 p-4 sm:p-6 z-50"
        style={{
          background: `linear-gradient(to top, ${theme.backgroundColor} 60%, transparent)`
        }}
      >
        <div className="mx-auto max-w-5xl">
          <button
            onClick={() => setShowCart(true)}
            className="w-full py-4 sm:py-5 font-bold text-lg sm:text-xl flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.secondaryColor} 100%)`,
              color: "#fff",
              borderRadius: buttonRadius,
              boxShadow: `0 8px 32px ${theme.primaryColor}50`
            }}
          >
            <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6" />
            {cart.length > 0 ? (
              <>
                View Cart ({cart.length}) • {formatCurrency(cartTotals.totalPrice, merchant.currency)}
              </>
            ) : (
              t("bookAppointment")
            )}
          </button>
        </div>
      </div>

      {/* Zalo Chat Button */}
      {(() => {
        if (!merchant.social_links || !Array.isArray(merchant.social_links)) return null;
        const zaloLink = (merchant.social_links as unknown as SocialLink[]).find(
          (link) => link.type === "zalo"
        );
        if (!zaloLink) return null;
        return (
          <a
            href={zaloLink.url}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-28 sm:bottom-32 right-4 sm:right-6 z-40 flex items-center gap-2 rounded-full bg-[#0068FF] px-5 py-3.5 text-white shadow-xl transition-all duration-300 hover:scale-105"
            style={{ boxShadow: '0 8px 24px rgba(0, 104, 255, 0.4)' }}
            title="Chat on Zalo"
          >
            <ZaloIcon className="h-6 w-6" />
            <span className="font-semibold text-sm hidden sm:inline">Chat Zalo</span>
          </a>
        );
      })()}

      {/* Gallery Lightbox */}
      {selectedGalleryImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4"
          onClick={() => setSelectedGalleryImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white p-3 rounded-full bg-white/10 backdrop-blur transition-colors"
            onClick={() => setSelectedGalleryImage(null)}
          >
            <X className="h-6 w-6" />
          </button>
          <img
            src={selectedGalleryImage}
            alt="Gallery"
            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
