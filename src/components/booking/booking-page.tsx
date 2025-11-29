"use client";

import { useState, useMemo } from "react";
import { format, addDays, parseISO, isBefore, startOfDay } from "date-fns";
import { useTranslations } from "next-intl";
import { MapPin, Phone, Clock, ChevronLeft, Check, ShoppingBag, Calendar, Star, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Merchant, Service, Staff, Availability, MerchantTheme, MerchantSettings } from "@/types/database";
import { formatCurrency, formatDuration, formatTime, generateTimeSlots, cn } from "@/lib/utils";
import { LanguageSwitcherCompact } from "@/components/language-switcher";

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
        {/* Hero Section */}
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
              style={{
                background: `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.secondaryColor} 100%)`,
              }}
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
                  <h1 className="text-2xl sm:text-3xl font-bold drop-shadow-lg">
                    {merchant.business_name}
                  </h1>
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

        {/* Main Content */}
        <div className="mx-auto max-w-4xl px-4 py-8">
          {/* Language Switcher */}
          <div className="flex justify-end mb-4">
            <LanguageSwitcherCompact />
          </div>

          {/* About Section */}
          {merchant.description && (
            <section className="mb-8">
              <h2 className="text-lg font-semibold mb-3">{t("aboutUs")}</h2>
              <p className="opacity-80 leading-relaxed">{merchant.description}</p>
            </section>
          )}

          {/* Contact Info */}
          {(merchant.address || merchant.phone) && (
            <section className="mb-8">
              <div className="flex flex-wrap gap-4">
                {merchant.address && (
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(
                      `${merchant.address}, ${merchant.city}, ${merchant.state} ${merchant.zip_code}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-colors"
                    style={{
                      backgroundColor: theme.primaryColor + "15",
                      color: theme.primaryColor,
                    }}
                  >
                    <MapPin className="h-4 w-4" />
                    {merchant.address}
                  </a>
                )}
                {merchant.phone && (
                  <a
                    href={`tel:${merchant.phone}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-colors"
                    style={{
                      backgroundColor: theme.primaryColor + "15",
                      color: theme.primaryColor,
                    }}
                  >
                    <Phone className="h-4 w-4" />
                    {merchant.phone}
                  </a>
                )}
              </div>
            </section>
          )}

          {/* Gallery Section */}
          {gallery.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-semibold mb-4">{t("ourGallery")}</h2>
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
          )}

          {/* Products Section */}
          {products.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                {t("ourProducts")}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="p-3"
                    style={{
                      borderRadius: cardRadius,
                      border: `1px solid ${theme.primaryColor}20`,
                    }}
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
          )}

          {/* Services Section */}
          <section className="mb-24">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Star className="h-5 w-5" />
              {t("ourServices")}
            </h2>
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
                      style={{
                        borderRadius: cardRadius,
                        border: `1px solid ${theme.primaryColor}20`,
                      }}
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
