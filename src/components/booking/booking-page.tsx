"use client";

import { useState, useMemo } from "react";
import { format, addDays, parseISO, isBefore, startOfDay } from "date-fns";
import { useTranslations } from "next-intl";
import { MapPin, Phone, Clock, ChevronLeft, Check, ShoppingBag, Calendar, Star, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Merchant, Service, Staff, Availability, MerchantTheme, MerchantSettings, SocialLink, SocialLinkType, ContentSection, defaultContentOrder } from "@/types/database";
import { formatCurrency, formatDuration, formatTime, generateTimeSlots, cn } from "@/lib/utils";
import { LanguageSwitcherCompact } from "@/components/language-switcher";

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

type Step = "service" | "staff" | "datetime" | "details" | "confirmation";

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
  const [step, setStep] = useState<Step>("service");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
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

  // Get staff who can provide selected service
  const availableStaff = useMemo(() => {
    if (!selectedService) return [];
    return staff.filter((s) =>
      s.staff_services.some((ss) => ss.service_id === selectedService.id)
    );
  }, [selectedService, staff]);

  // Generate available dates
  const availableDates = useMemo(() => {
    const dates: Date[] = [];
    const today = startOfDay(new Date());

    for (let i = 0; i < settings.bookingWindow; i++) {
      const date = addDays(today, i);
      const dayOfWeek = date.getDay();
      const isAvailable = availability.some((a) => a.day_of_week === dayOfWeek);

      // Check lead time
      if (i === 0 && settings.bookingLeadTime > 0) {
        const hoursUntilClose = 24 - new Date().getHours();
        if (hoursUntilClose < settings.bookingLeadTime) {
          continue;
        }
      }

      if (isAvailable) {
        dates.push(date);
      }
    }
    return dates;
  }, [availability, settings.bookingWindow, settings.bookingLeadTime]);

  // Generate time slots for selected date
  const timeSlots = useMemo(() => {
    if (!selectedDate || !selectedService) return [];

    const dayOfWeek = selectedDate.getDay();
    const dayAvailability = availability.find((a) => a.day_of_week === dayOfWeek);

    if (!dayAvailability) return [];

    return generateTimeSlots(
      dayAvailability.start_time,
      dayAvailability.end_time,
      selectedService.duration_minutes
    );
  }, [selectedDate, selectedService, availability]);

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setSelectedStaff(null);
    setSelectedDate(null);
    setSelectedTime(null);

    // Skip staff selection if not enabled or no staff
    if (!settings.showStaffSelection || availableStaff.length === 0) {
      setStep("datetime");
    } else {
      setStep("staff");
    }
  };

  const handleStaffSelect = (staffMember: Staff | null) => {
    setSelectedStaff(staffMember);
    setStep("datetime");
  };

  const handleDateTimeSelect = (date: Date, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setStep("details");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !selectedDate || !selectedTime) return;

    setLoading(true);
    setError(null);

    try {
      const [hours, minutes] = selectedTime.split(":").map(Number);
      const endMinutes = hours * 60 + minutes + selectedService.duration_minutes;
      const endTime = `${Math.floor(endMinutes / 60).toString().padStart(2, "0")}:${(endMinutes % 60).toString().padStart(2, "0")}`;

      const { error: bookingError } = await supabase.from("bookings").insert({
        merchant_id: merchant.id,
        service_id: selectedService.id,
        staff_id: selectedStaff?.id ?? null,
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phone || null,
        booking_date: format(selectedDate, "yyyy-MM-dd"),
        start_time: selectedTime,
        end_time: endTime,
        notes: customerInfo.notes || null,
        total_price: selectedService.price,
        status: "pending",
      });

      if (bookingError) {
        setError(bookingError.message);
        return;
      }

      setBookingComplete(true);
      setStep("confirmation");
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const buttonStyle = useMemo(() => {
    const radiusMap = {
      none: "0",
      sm: "4px",
      md: "8px",
      lg: "12px",
      full: "9999px",
    };

    return {
      backgroundColor: theme.buttonStyle === "solid" ? theme.primaryColor : "transparent",
      color: theme.buttonStyle === "solid" ? "#fff" : theme.primaryColor,
      border: theme.buttonStyle === "outline" ? `2px solid ${theme.primaryColor}` : "none",
      borderRadius: radiusMap[theme.borderRadius],
    };
  }, [theme]);

  const cardRadius = useMemo(() => {
    const radiusMap = {
      none: "0",
      sm: "4px",
      md: "8px",
      lg: "12px",
      full: "16px",
    };
    return radiusMap[theme.borderRadius];
  }, [theme.borderRadius]);

  // Group services by category
  const servicesByCategory = useMemo(() => {
    const grouped: Record<string, Service[]> = {};
    services.forEach((service) => {
      const category = service.category || "Other";
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(service);
    });
    return grouped;
  }, [services]);

  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null);
  const t = useTranslations("booking");

  // Get content order from theme or use default
  const contentOrder = theme.contentOrder || defaultContentOrder;
  const headerStyle = theme.headerStyle || "overlay";
  const showSectionTitles = theme.showSectionTitles !== false;

  // Render individual content sections
  const renderSection = (section: ContentSection) => {
    switch (section) {
      case "about":
        if (!merchant.description) return null;
        return (
          <section key="about" className="mb-8">
            {showSectionTitles && <h2 className="text-lg font-semibold mb-3">{t("aboutUs")}</h2>}
            <p className="opacity-80 leading-relaxed">{merchant.description}</p>
          </section>
        );

      case "contact":
        if (!merchant.address && !merchant.phone && !merchant.google_maps_url) return null;
        return (
          <section key="contact" className="mb-8">
            {showSectionTitles && <h2 className="text-lg font-semibold mb-3">{t("contactUs")}</h2>}
            <div className="flex flex-wrap gap-3">
              {merchant.google_maps_url && (
                <a
                  href={merchant.google_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all hover:scale-105"
                  style={{ backgroundColor: theme.primaryColor, color: "#fff" }}
                >
                  <MapPin className="h-4 w-4" />
                  Google Maps
                </a>
              )}
              {merchant.address && (
                <div
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm"
                  style={{ backgroundColor: theme.primaryColor + "15", color: theme.primaryColor }}
                >
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span>
                    {merchant.address}
                    {merchant.city && `, ${merchant.city}`}
                    {merchant.state && `, ${merchant.state}`}
                    {merchant.zip_code && ` ${merchant.zip_code}`}
                  </span>
                </div>
              )}
              {merchant.phone && (
                <a
                  href={`tel:${merchant.phone}`}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-colors"
                  style={{ backgroundColor: theme.primaryColor + "15", color: theme.primaryColor }}
                >
                  <Phone className="h-4 w-4" />
                  {merchant.phone}
                </a>
              )}
            </div>
          </section>
        );

      case "social":
        if (!merchant.social_links || !Array.isArray(merchant.social_links) || merchant.social_links.length === 0) return null;
        return (
          <section key="social" className="mb-8">
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
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all hover:scale-105 hover:shadow-md"
                    style={{ backgroundColor: config.color, color: "#fff" }}
                  >
                    <Icon className="h-4 w-4" />
                    {link.title}
                  </a>
                );
              })}
            </div>
          </section>
        );

      case "video":
        if (!merchant.youtube_url || !getYouTubeVideoId(merchant.youtube_url)) return null;
        return (
          <section key="video" className="mb-8">
            <div
              className="relative w-full overflow-hidden"
              style={{ borderRadius: cardRadius, paddingBottom: "56.25%" }}
            >
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${getYouTubeVideoId(merchant.youtube_url)}`}
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
          <section key="gallery" className="mb-8">
            {showSectionTitles && <h2 className="text-lg font-semibold mb-4">{t("ourGallery")}</h2>}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {gallery.map((image) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedGalleryImage(image.image_url)}
                  className="aspect-square overflow-hidden group"
                  style={{ borderRadius: cardRadius }}
                >
                  <img
                    src={image.image_url}
                    alt={image.caption || "Gallery image"}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                </button>
              ))}
            </div>
          </section>
        );

      case "products":
        if (products.length === 0) return null;
        return (
          <section key="products" className="mb-8">
            {showSectionTitles && (
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                {t("ourProducts")}
              </h2>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="p-3"
                  style={{ borderRadius: cardRadius, border: `1px solid ${theme.primaryColor}20` }}
                >
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full aspect-square object-cover rounded-lg mb-3"
                    />
                  ) : (
                    <div
                      className="w-full aspect-square flex items-center justify-center rounded-lg mb-3"
                      style={{ backgroundColor: theme.primaryColor + "10" }}
                    >
                      <ShoppingBag className="h-10 w-10 opacity-20" />
                    </div>
                  )}
                  <p className="font-medium text-sm truncate">{product.name}</p>
                  {product.description && (
                    <p className="text-xs opacity-60 truncate mt-0.5">{product.description}</p>
                  )}
                  <p className="text-sm font-semibold mt-1" style={{ color: theme.primaryColor }}>
                    {formatCurrency(product.price, merchant.currency)}
                  </p>
                </div>
              ))}
            </div>
          </section>
        );

      case "services":
        return (
          <section key="services" className="mb-24">
            {showSectionTitles && (
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Star className="h-5 w-5" />
                {t("ourServices")}
              </h2>
            )}
            <div className="space-y-3">
              {Object.entries(servicesByCategory).map(([category, categoryServices]) => (
                <div key={category}>
                  {Object.keys(servicesByCategory).length > 1 && (
                    <h3 className="text-sm font-medium opacity-60 mb-2 mt-4">{category}</h3>
                  )}
                  {categoryServices.map((service) => (
                    <div
                      key={service.id}
                      className="flex items-center justify-between p-4 mb-2"
                      style={{ borderRadius: cardRadius, border: `1px solid ${theme.primaryColor}20` }}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{service.name}</p>
                        {service.description && (
                          <p className="text-sm opacity-60 truncate">{service.description}</p>
                        )}
                        <p className="text-sm opacity-60 flex items-center gap-1 mt-1">
                          <Clock className="h-3.5 w-3.5" />
                          {formatDuration(service.duration_minutes)}
                        </p>
                      </div>
                      <div className="ml-4 text-right">
                        <p className="font-semibold" style={{ color: theme.primaryColor }}>
                          {formatCurrency(service.price, merchant.currency)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  // Header components based on style
  const renderHeader = () => {
    if (headerStyle === "minimal") {
      return (
        <header className="border-b" style={{ borderColor: theme.primaryColor + "20" }}>
          <div className="mx-auto max-w-4xl px-4 py-6">
            <div className="flex items-center gap-4">
              {merchant.logo_url ? (
                <img
                  src={merchant.logo_url}
                  alt={merchant.business_name}
                  className="h-14 w-14 rounded-xl object-cover"
                />
              ) : (
                <div
                  className="h-14 w-14 rounded-xl flex items-center justify-center text-xl font-bold text-white"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  {merchant.business_name.charAt(0)}
                </div>
              )}
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">{merchant.business_name}</h1>
                {(merchant.city || merchant.state) && (
                  <p className="text-sm opacity-60 flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3.5 w-3.5" />
                    {merchant.city}{merchant.city && merchant.state && ", "}{merchant.state}
                  </p>
                )}
              </div>
            </div>
          </div>
        </header>
      );
    }

    if (headerStyle === "stacked") {
      return (
        <section>
          {/* Cover Image or Gradient */}
          {merchant.cover_image_url ? (
            <div className="h-40 sm:h-56 w-full overflow-hidden">
              <img
                src={merchant.cover_image_url}
                alt={merchant.business_name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div
              className="h-40 sm:h-56 w-full"
              style={{ background: `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.secondaryColor} 100%)` }}
            />
          )}
          {/* Business Info Below */}
          <div className="mx-auto max-w-4xl px-4 py-6">
            <div className="flex items-center gap-4 -mt-12">
              {merchant.logo_url ? (
                <img
                  src={merchant.logo_url}
                  alt={merchant.business_name}
                  className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl object-cover border-4 shadow-lg"
                  style={{ borderColor: theme.backgroundColor }}
                />
              ) : (
                <div
                  className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl border-4 shadow-lg flex items-center justify-center text-2xl font-bold text-white"
                  style={{ backgroundColor: theme.primaryColor, borderColor: theme.backgroundColor }}
                >
                  {merchant.business_name.charAt(0)}
                </div>
              )}
            </div>
            <div className="mt-3">
              <h1 className="text-2xl sm:text-3xl font-bold">{merchant.business_name}</h1>
              {(merchant.city || merchant.state) && (
                <p className="text-sm opacity-60 flex items-center gap-1 mt-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {merchant.city}{merchant.city && merchant.state && ", "}{merchant.state}
                </p>
              )}
            </div>
          </div>
        </section>
      );
    }

    // Default: overlay style
    return (
      <section className="relative">
        {/* Cover Image or Gradient */}
        {merchant.cover_image_url ? (
          <div className="h-48 sm:h-64 md:h-80 w-full overflow-hidden">
            <img
              src={merchant.cover_image_url}
              alt={merchant.business_name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        ) : (
          <div
            className="h-48 sm:h-64 md:h-80 w-full"
            style={{ background: `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.secondaryColor} 100%)` }}
          />
        )}

        {/* Business Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0">
          <div className="mx-auto max-w-4xl px-4 pb-6">
            <div className="flex items-end gap-4">
              {merchant.logo_url ? (
                <img
                  src={merchant.logo_url}
                  alt={merchant.business_name}
                  className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div
                  className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center text-2xl font-bold text-white"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  {merchant.business_name.charAt(0)}
                </div>
              )}
              <div className="pb-1 text-white">
                <h1 className="text-2xl sm:text-3xl font-bold drop-shadow-lg">{merchant.business_name}</h1>
                {(merchant.city || merchant.state) && (
                  <p className="text-sm opacity-90 flex items-center gap-1 mt-1">
                    <MapPin className="h-3.5 w-3.5" />
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

  // Landing page view (when not in booking flow)
  if (!showBookingModal) {
    return (
      <div
        className="min-h-screen"
        style={{
          backgroundColor: theme.backgroundColor,
          color: theme.textColor,
          fontFamily: theme.fontFamily,
        }}
      >
        {/* Header based on style */}
        {renderHeader()}

        {/* Main Content */}
        <div className="mx-auto max-w-4xl px-4 py-8">
          {/* Language Switcher */}
          <div className="flex justify-end mb-4">
            <LanguageSwitcherCompact />
          </div>

          {/* Render content sections in order */}
          {contentOrder.map((section) => renderSection(section))}
        </div>

        {/* Fixed Book Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent">
          <div className="mx-auto max-w-4xl">
            <button
              onClick={() => setShowBookingModal(true)}
              className="w-full py-4 font-semibold text-lg flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.02]"
              style={{
                ...buttonStyle,
                borderRadius: cardRadius,
              }}
            >
              <Calendar className="h-5 w-5" />
              {t("bookAppointment")}
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
              className="fixed bottom-24 right-4 z-40 flex items-center gap-2 rounded-full bg-[#0068FF] px-4 py-3 text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              title="Chat on Zalo"
            >
              <ZaloIcon className="h-6 w-6" />
              <span className="font-medium text-sm hidden sm:inline">Chat Zalo</span>
            </a>
          );
        })()}

        {/* Gallery Lightbox */}
        {selectedGalleryImage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setSelectedGalleryImage(null)}
          >
            <button
              className="absolute top-4 right-4 text-white p-2"
              onClick={() => setSelectedGalleryImage(null)}
            >
              <X className="h-8 w-8" />
            </button>
            <img
              src={selectedGalleryImage}
              alt="Gallery"
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </div>
    );
  }

  // Booking Modal/Flow
  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
        fontFamily: theme.fontFamily,
      }}
    >
      {/* Booking Header */}
      <header className="sticky top-0 z-10 border-b bg-inherit" style={{ borderColor: theme.primaryColor + "20" }}>
        <div className="mx-auto max-w-3xl px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                if (step === "service") {
                  setShowBookingModal(false);
                } else if (step === "staff") {
                  setStep("service");
                } else if (step === "datetime") {
                  setStep(settings.showStaffSelection && staff.length > 0 ? "staff" : "service");
                } else if (step === "details") {
                  setStep("datetime");
                }
              }}
              className="flex items-center gap-2 text-sm font-medium"
              style={{ color: theme.primaryColor }}
            >
              <ChevronLeft className="h-5 w-5" />
              {step === "service" ? t("backToPage") : t("back")}
            </button>
            <h2 className="font-semibold">{t("bookAppointment")}</h2>
            <button
              onClick={() => setShowBookingModal(false)}
              className="p-1"
            >
              <X className="h-5 w-5 opacity-60" />
            </button>
          </div>

          {/* Progress */}
          {!bookingComplete && (
            <div className="mt-4 flex items-center justify-center gap-2 text-sm">
              {["service", ...(settings.showStaffSelection && staff.length > 0 ? ["staff"] : []), "datetime", "details"].map(
                (s, i, arr) => (
                  <div key={s} className="flex items-center gap-2">
                    <span
                      className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium",
                        step === s || arr.indexOf(step) > i
                          ? "text-white"
                          : "bg-gray-200"
                      )}
                      style={{
                        backgroundColor:
                          step === s || arr.indexOf(step) > i ? theme.primaryColor : undefined,
                      }}
                    >
                      {arr.indexOf(step) > i ? <Check className="h-3 w-3" /> : i + 1}
                    </span>
                    {i < arr.length - 1 && <div className="h-px w-6 bg-gray-200" />}
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </header>

      {/* Booking Content */}
      <main className="mx-auto max-w-3xl px-4 py-6">
        {/* Service Selection */}
        {step === "service" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t("selectService")}</h3>
            {Object.entries(servicesByCategory).map(([category, categoryServices]) => (
              <div key={category}>
                {Object.keys(servicesByCategory).length > 1 && (
                  <h4 className="text-sm font-medium opacity-60 mb-2 mt-4">{category}</h4>
                )}
                <div className="space-y-2">
                  {categoryServices.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => handleServiceSelect(service)}
                      className="w-full p-4 text-left transition-all hover:shadow-md flex items-center justify-between"
                      style={{
                        borderRadius: cardRadius,
                        border: `1px solid ${theme.primaryColor}30`,
                        backgroundColor: theme.backgroundColor,
                      }}
                    >
                      <div>
                        <span className="font-medium">{service.name}</span>
                        <div className="flex items-center gap-2 text-sm opacity-60 mt-1">
                          <Clock className="h-3.5 w-3.5" />
                          {formatDuration(service.duration_minutes)}
                        </div>
                      </div>
                      <span className="font-semibold" style={{ color: theme.primaryColor }}>
                        {formatCurrency(service.price, merchant.currency)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Staff Selection */}
        {step === "staff" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t("selectStaff")}</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                onClick={() => handleStaffSelect(null)}
                className="p-4 text-left transition-all hover:shadow-md"
                style={{
                  borderRadius: cardRadius,
                  border: `1px solid ${theme.primaryColor}30`,
                }}
              >
                <span className="font-medium">{t("anyStaff")}</span>
                <p className="mt-1 text-sm opacity-70">{t("anyStaff")}</p>
              </button>

              {availableStaff.map((member) => (
                <button
                  key={member.id}
                  onClick={() => handleStaffSelect(member)}
                  className="p-4 text-left transition-all hover:shadow-md"
                  style={{
                    borderRadius: cardRadius,
                    border: `1px solid ${theme.primaryColor}30`,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium text-white"
                      style={{ backgroundColor: theme.primaryColor }}
                    >
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </div>
                    <div>
                      <span className="font-medium">{member.name}</span>
                      {member.bio && (
                        <p className="mt-0.5 text-sm opacity-70 line-clamp-1">{member.bio}</p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Date & Time Selection */}
        {step === "datetime" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t("selectDateTime")}</h3>
            <div className="space-y-4">
              <div>
                <p className="mb-2 text-sm opacity-70">Available Dates</p>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {availableDates.slice(0, 14).map((date) => (
                    <button
                      key={date.toISOString()}
                      onClick={() => {
                        setSelectedDate(date);
                        setSelectedTime(null);
                      }}
                      className={cn(
                        "flex min-w-[65px] flex-col items-center rounded-lg border p-2.5 transition-colors",
                        selectedDate?.toDateString() === date.toDateString()
                          ? "border-transparent text-white"
                          : "hover:border-gray-300"
                      )}
                      style={{
                        backgroundColor:
                          selectedDate?.toDateString() === date.toDateString()
                            ? theme.primaryColor
                            : "transparent",
                        borderColor:
                          selectedDate?.toDateString() === date.toDateString()
                            ? theme.primaryColor
                            : theme.primaryColor + "30",
                      }}
                    >
                      <span className="text-xs opacity-70">{format(date, "EEE")}</span>
                      <span className="text-lg font-bold">{format(date, "d")}</span>
                      <span className="text-xs opacity-70">{format(date, "MMM")}</span>
                    </button>
                  ))}
                </div>
              </div>

              {selectedDate && (
                <div>
                  <p className="mb-2 text-sm opacity-70">Available Times</p>
                  <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => handleDateTimeSelect(selectedDate, time)}
                        className={cn(
                          "rounded-lg border px-2 py-2 text-sm font-medium transition-colors",
                          selectedTime === time ? "border-transparent text-white" : ""
                        )}
                        style={{
                          backgroundColor:
                            selectedTime === time ? theme.primaryColor : "transparent",
                          borderColor:
                            selectedTime === time ? theme.primaryColor : theme.primaryColor + "30",
                        }}
                      >
                        {formatTime(time)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Customer Details */}
        {step === "details" && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t("yourDetails")}</h3>

            {/* Booking Summary */}
            <div
              className="p-4"
              style={{
                borderRadius: cardRadius,
                backgroundColor: theme.primaryColor + "10",
              }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{selectedService?.name}</p>
                  {selectedStaff && <p className="text-sm opacity-70">with {selectedStaff.name}</p>}
                  <p className="text-sm opacity-70 mt-1">
                    {selectedDate && format(selectedDate, "EEE, MMM d")} at {selectedTime && formatTime(selectedTime)}
                  </p>
                </div>
                <p className="font-semibold" style={{ color: theme.primaryColor }}>
                  {selectedService && formatCurrency(selectedService.price, merchant.currency)}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">{t("name")} *</label>
                <input
                  type="text"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:outline-none"
                  style={{ borderRadius: cardRadius }}
                  placeholder={t("namePlaceholder")}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">{t("email")} *</label>
                <input
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:outline-none"
                  style={{ borderRadius: cardRadius }}
                  placeholder={t("emailPlaceholder")}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("phone")} {settings.requirePhoneNumber ? "*" : ""}
                </label>
                <input
                  type="tel"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:outline-none"
                  style={{ borderRadius: cardRadius }}
                  placeholder={t("phonePlaceholder")}
                  required={settings.requirePhoneNumber}
                />
              </div>

              {settings.allowNotes && (
                <div>
                  <label className="block text-sm font-medium mb-1">{t("notes")}</label>
                  <textarea
                    value={customerInfo.notes}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 focus:outline-none"
                    style={{ borderRadius: cardRadius }}
                    rows={2}
                    placeholder={t("notesPlaceholder")}
                  />
                </div>
              )}

              {settings.cancellationPolicy && (
                <p className="text-xs opacity-60">{settings.cancellationPolicy}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 font-semibold transition-colors disabled:opacity-50"
                style={{ ...buttonStyle, borderRadius: cardRadius }}
              >
                {loading ? t("loading") : t("confirmBooking")}
              </button>
            </form>
          </div>
        )}

        {/* Confirmation */}
        {step === "confirmation" && (
          <div className="text-center py-8">
            <div
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-full"
              style={{ backgroundColor: theme.primaryColor + "20" }}
            >
              <Check className="h-8 w-8" style={{ color: theme.primaryColor }} />
            </div>
            <h2 className="mt-4 text-2xl font-bold">{t("bookingConfirmed")}</h2>
            <p className="mt-2 opacity-70">
              {t("bookingConfirmedDesc")}
            </p>

            <div
              className="mx-auto mt-6 max-w-sm p-4 text-left"
              style={{
                borderRadius: cardRadius,
                backgroundColor: theme.primaryColor + "10",
              }}
            >
              <p className="font-semibold">{selectedService?.name}</p>
              {selectedStaff && <p className="text-sm opacity-70">with {selectedStaff.name}</p>}
              <p className="mt-2">
                {selectedDate && format(selectedDate, "EEEE, MMMM d, yyyy")}
              </p>
              <p className="text-sm opacity-70">
                {selectedTime && formatTime(selectedTime)} • {selectedService && formatDuration(selectedService.duration_minutes)}
              </p>
              <p className="mt-2 font-semibold" style={{ color: theme.primaryColor }}>
                {selectedService && formatCurrency(selectedService.price, merchant.currency)}
              </p>
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={() => {
                  setStep("service");
                  setSelectedService(null);
                  setSelectedStaff(null);
                  setSelectedDate(null);
                  setSelectedTime(null);
                  setCustomerInfo({ name: "", email: "", phone: "", notes: "" });
                  setBookingComplete(false);
                }}
                className="w-full py-3 font-medium"
                style={{ ...buttonStyle, borderRadius: cardRadius }}
              >
                {t("bookAnother")}
              </button>
              <button
                onClick={() => {
                  setShowBookingModal(false);
                  setStep("service");
                  setSelectedService(null);
                  setSelectedStaff(null);
                  setSelectedDate(null);
                  setSelectedTime(null);
                  setCustomerInfo({ name: "", email: "", phone: "", notes: "" });
                  setBookingComplete(false);
                }}
                className="w-full py-3 font-medium opacity-70"
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
