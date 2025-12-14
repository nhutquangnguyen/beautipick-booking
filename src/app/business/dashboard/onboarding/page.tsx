"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { Check, ChevronRight, Clock, Scissors, Store, Sparkles, Languages, ExternalLink } from "lucide-react";

type Step = "business" | "category" | "hours" | "complete";

// Category-based services and products templates with translations
const CATEGORY_DATA = {
  hair: {
    services: {
      en: [
        { name: "Haircut", duration: 45, price: 35 },
        { name: "Hair Coloring", duration: 120, price: 85 },
        { name: "Blowout", duration: 45, price: 45 },
        { name: "Hair Treatment", duration: 60, price: 55 },
      ],
      vi: [
        { name: "Cắt tóc", duration: 45, price: 35 },
        { name: "Nhuộm tóc", duration: 120, price: 85 },
        { name: "Sấy tóc", duration: 45, price: 45 },
        { name: "Ủ tóc dưỡng sinh", duration: 60, price: 55 },
      ],
    },
    products: {
      en: [
        { name: "Professional Shampoo", price: 28 },
        { name: "Hair Conditioner", price: 25 },
        { name: "Hair Serum", price: 38 },
      ],
      vi: [
        { name: "Dầu gội chuyên nghiệp", price: 28 },
        { name: "Dầu xả dưỡng tóc", price: 25 },
        { name: "Serum dưỡng tóc", price: 38 },
      ],
    },
  },
  nail: {
    services: {
      en: [
        { name: "Manicure", duration: 30, price: 25 },
        { name: "Pedicure", duration: 45, price: 35 },
        { name: "Gel Nails", duration: 60, price: 45 },
        { name: "Nail Art", duration: 30, price: 30 },
      ],
      vi: [
        { name: "Làm móng tay", duration: 30, price: 25 },
        { name: "Làm móng chân", duration: 45, price: 35 },
        { name: "Sơn gel", duration: 60, price: 45 },
        { name: "Vẽ móng nghệ thuật", duration: 30, price: 30 },
      ],
    },
    products: {
      en: [
        { name: "Premium Nail Polish", price: 18 },
        { name: "Cuticle Oil", price: 16 },
        { name: "Hand Cream", price: 20 },
      ],
      vi: [
        { name: "Sơn móng cao cấp", price: 18 },
        { name: "Dầu dưỡng da móng", price: 16 },
        { name: "Kem dưỡng tay", price: 20 },
      ],
    },
  },
  spa: {
    services: {
      en: [
        { name: "Facial Treatment", duration: 60, price: 65 },
        { name: "Body Massage", duration: 90, price: 85 },
        { name: "Hot Stone Massage", duration: 75, price: 95 },
        { name: "Aromatherapy", duration: 60, price: 70 },
      ],
      vi: [
        { name: "Chăm sóc da mặt", duration: 60, price: 65 },
        { name: "Massage toàn thân", duration: 90, price: 85 },
        { name: "Massage đá nóng", duration: 75, price: 95 },
        { name: "Liệu pháp hương thơm", duration: 60, price: 70 },
      ],
    },
    products: {
      en: [
        { name: "Luxury Face Cream", price: 52 },
        { name: "Body Lotion", price: 35 },
        { name: "Essential Oil Set", price: 45 },
      ],
      vi: [
        { name: "Kem dưỡng da mặt cao cấp", price: 52 },
        { name: "Sữa dưỡng thể", price: 35 },
        { name: "Bộ tinh dầu thiên nhiên", price: 45 },
      ],
    },
  },
};

const DEFAULT_HOURS = [
  { day: 1, name: "Monday", open: "09:00", close: "18:00", enabled: true },
  { day: 2, name: "Tuesday", open: "09:00", close: "18:00", enabled: true },
  { day: 3, name: "Wednesday", open: "09:00", close: "18:00", enabled: true },
  { day: 4, name: "Thursday", open: "09:00", close: "18:00", enabled: true },
  { day: 5, name: "Friday", open: "09:00", close: "18:00", enabled: true },
  { day: 6, name: "Saturday", open: "10:00", close: "16:00", enabled: true },
  { day: 0, name: "Sunday", open: "10:00", close: "16:00", enabled: false },
];

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>("business");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const defaultLocale = useLocale();
  const t = useTranslations("onboarding");
  const supabase = createClient();

  // Language selection state (default to Vietnamese)
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "vi">("vi");

  // Set currency and timezone - default to VND and GMT+7
  const currency = "VND";
  const timezone = "Asia/Ho_Chi_Minh"; // GMT+7
  const priceMultiplier = 25000;

  // Dynamic labels based on selected language
  const labels = {
    setupTitle: selectedLanguage === "vi" ? "Thiết lập doanh nghiệp của bạn" : "Set up your business",
    setupSubtitle: selectedLanguage === "vi" ? "Hãy cho chúng tôi biết về doanh nghiệp của bạn" : "Tell us about your business",
    languageLabel: selectedLanguage === "vi" ? "Ngôn ngữ" : "Language",
    businessNameLabel: selectedLanguage === "vi" ? "Tên doanh nghiệp" : "Business Name",
    businessNamePlaceholder: selectedLanguage === "vi" ? "VD: Salon Bella" : "e.g., Bella Salon",
    phoneLabel: selectedLanguage === "vi" ? "Số điện thoại" : "Phone Number",
    phonePlaceholder: selectedLanguage === "vi" ? "0xxx xxx xxx" : "(555) 123-4567",
    addressLabel: selectedLanguage === "vi" ? "Địa chỉ" : "Address",
    addressPlaceholder: selectedLanguage === "vi" ? "123 Nguyễn Huệ, Q.1" : "123 Main St, City",
    continue: selectedLanguage === "vi" ? "Tiếp tục" : "Continue",
    skipForNow: selectedLanguage === "vi" ? "Bỏ qua bây giờ" : "Skip for now",
  };

  // Business info
  const [businessInfo, setBusinessInfo] = useState({
    businessName: "",
    phone: "",
    address: "",
  });

  // Category selection (hair, nail, spa)
  const [selectedCategory, setSelectedCategory] = useState<"hair" | "nail" | "spa" | null>(null);

  // Hours
  const [hours, setHours] = useState(DEFAULT_HOURS);

  // Merchant slug for booking page URL
  const [merchantSlug, setMerchantSlug] = useState<string>("");

  // Fetch merchant slug on component mount
  useEffect(() => {
    const fetchMerchantSlug = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: merchant } = await supabase
          .from("merchants")
          .select("slug")
          .eq("id", user.id)
          .single();

        if (merchant?.slug) {
          setMerchantSlug(merchant.slug);
        }
      }
    };

    fetchMerchantSlug();
  }, [supabase]);

  const handleBusinessSubmit = async () => {
    // Validate required fields
    if (!businessInfo.businessName || !businessInfo.phone) {
      alert(selectedLanguage === "vi" ? "Vui lòng nhập tên doanh nghiệp và số điện thoại" : "Please enter business name and phone number");
      return;
    }

    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const updates: any = {
        business_name: businessInfo.businessName || null,
        phone: businessInfo.phone || null,
        address: businessInfo.address || null,
        currency: currency,
        timezone: timezone,
        // Apply default theme automatically
        theme: {
          layoutTemplate: "starter",
          primaryColor: "#7c3aed",
          secondaryColor: "#a78bfa",
          accentColor: "#ec4899",
          backgroundColor: "#ffffff",
          textColor: "#1f2937",
          fontFamily: "Inter",
          borderRadius: "lg",
          buttonStyle: "solid",
          headerStyle: "stacked",
          contentOrder: ["about", "services", "gallery", "products", "video", "contact", "social"],
          showSectionTitles: true,
        }
      };

      // Auto-add Zalo link if phone number is provided (for Vietnamese users)
      if (businessInfo.phone && selectedLanguage === "vi") {
        const phoneNumber = businessInfo.phone.replace(/\D/g, ''); // Remove non-digits
        updates.social_links = [
          {
            type: "zalo",
            url: `https://zalo.me/${phoneNumber}`,
          },
        ];
      }

      await supabase.from("merchants").update(updates).eq("id", user.id);
    }

    setLoading(false);
    setStep("category");
  };

  const handleCategorySubmit = async () => {
    if (!selectedCategory) {
      setStep("hours");
      return;
    }

    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const categoryData = CATEGORY_DATA[selectedCategory];

      // Set default images based on category
      const defaultImages = {
        hair: {
          logo: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=400&fit=crop",
          cover: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=1200&h=600&fit=crop",
          gallery: [
            "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?w=800&h=600&fit=crop",
          ],
        },
        nail: {
          logo: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=400&fit=crop",
          cover: "https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=1200&h=600&fit=crop",
          gallery: [
            "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=800&h=600&fit=crop",
          ],
        },
        spa: {
          logo: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=400&fit=crop",
          cover: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200&h=600&fit=crop",
          gallery: [
            "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
            "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800&h=600&fit=crop",
          ],
        },
      };

      // Update merchant with logo and cover image
      await supabase.from("merchants").update({
        logo_url: defaultImages[selectedCategory].logo,
        cover_image_url: defaultImages[selectedCategory].cover,
      }).eq("id", user.id);

      // Get services and products in selected language
      const services = categoryData.services[selectedLanguage];
      const products = categoryData.products[selectedLanguage];

      // Insert services with translated names
      const servicesToInsert = services.map((service, index) => ({
        merchant_id: user.id,
        name: service.name,
        duration_minutes: service.duration,
        price: Math.round(service.price * priceMultiplier),
        category: selectedCategory === "hair" ? (selectedLanguage === "vi" ? "Tóc" : "Hair") :
                 selectedCategory === "nail" ? (selectedLanguage === "vi" ? "Móng" : "Nails") :
                 (selectedLanguage === "vi" ? "Spa" : "Spa"),
        display_order: index,
      }));

      await supabase.from("services").insert(servicesToInsert);

      // Insert products with translated names
      const productsToInsert = products.map((product) => ({
        merchant_id: user.id,
        name: product.name,
        price: Math.round(product.price * priceMultiplier),
      }));

      await supabase.from("products").insert(productsToInsert);

      // Insert gallery images
      const galleryToInsert = defaultImages[selectedCategory].gallery.map((imageUrl, index) => ({
        merchant_id: user.id,
        image_url: imageUrl,
        display_order: index,
      }));

      await supabase.from("gallery").insert(galleryToInsert);
    }

    setLoading(false);
    setStep("hours");
  };

  const handleHoursSubmit = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const availabilityToInsert = hours.map((h) => ({
        merchant_id: user.id,
        day_of_week: h.day,
        start_time: h.open,
        end_time: h.close,
        is_available: h.enabled,
      }));

      await supabase.from("availability").insert(availabilityToInsert);
    }

    setLoading(false);
    setStep("complete");
  };

  const handleComplete = () => {
    router.push("/business/dashboard");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="mx-auto px-4 py-6 sm:py-12 max-w-2xl">
        {/* Progress */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-1.5 sm:gap-2">
            {[
              { key: "business", icon: Store, label: "Info" },
              { key: "category", icon: Sparkles, label: "Category" },
              { key: "hours", icon: Clock, label: "Hours" },
            ].map((s, i, arr) => (
              <div key={s.key} className="flex items-center">
                <div
                  className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full ${
                    step === s.key
                      ? "bg-purple-600 text-white"
                      : arr.findIndex((x) => x.key === step) > i
                        ? "bg-green-500 text-white"
                        : "bg-white text-gray-400"
                  }`}
                >
                  {arr.findIndex((x) => x.key === step) > i ? (
                    <Check className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <s.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </div>
                {i < arr.length - 1 && (
                  <div
                    className={`h-1 w-6 sm:w-8 ${
                      arr.findIndex((x) => x.key === step) > i
                        ? "bg-green-500"
                        : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step: Business Info */}
        {step === "business" && (
          <div className="rounded-2xl bg-white p-4 sm:p-8 shadow-sm">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              {labels.setupTitle}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              {labels.setupSubtitle}
            </p>

            <div className="mt-8 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {labels.businessNameLabel} *
                </label>
                <input
                  type="text"
                  value={businessInfo.businessName}
                  onChange={(e) =>
                    setBusinessInfo({ ...businessInfo, businessName: e.target.value })
                  }
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-lg sm:text-2xl font-bold focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                  placeholder={labels.businessNamePlaceholder}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {labels.phoneLabel} *
                </label>
                <input
                  type="tel"
                  value={businessInfo.phone}
                  onChange={(e) =>
                    setBusinessInfo({ ...businessInfo, phone: e.target.value })
                  }
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                  placeholder={labels.phonePlaceholder}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {labels.addressLabel}
                </label>
                <input
                  type="text"
                  value={businessInfo.address}
                  onChange={(e) =>
                    setBusinessInfo({ ...businessInfo, address: e.target.value })
                  }
                  className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                  placeholder={labels.addressPlaceholder}
                />
              </div>
            </div>

            <button
              onClick={handleBusinessSubmit}
              disabled={loading}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 py-4 font-semibold text-white hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? (selectedLanguage === "vi" ? "Đang lưu..." : "Saving...") : labels.continue}
              <ChevronRight className="h-5 w-5" />
            </button>

            <button
              onClick={() => setStep("category")}
              className="mt-3 w-full py-2 text-sm text-gray-500 hover:text-gray-700"
            >
              {labels.skipForNow}
            </button>
          </div>
        )}

        {/* Step: Category Selection */}
        {step === "category" && (
          <div className="rounded-2xl bg-white p-4 sm:p-8 shadow-sm">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              {t("categoryTitle")}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              {t("categorySubtitle")}
            </p>

            <div className="mt-8 grid gap-4">
              {[
                {
                  key: "hair" as const,
                  icon: "💇",
                  title: t("hairSalon"),
                  description: t("hairSalonDesc"),
                  services: t("servicesAndProducts")
                },
                {
                  key: "nail" as const,
                  icon: "💅",
                  title: t("nailSalon"),
                  description: t("nailSalonDesc"),
                  services: t("servicesAndProducts")
                },
                {
                  key: "spa" as const,
                  icon: "🧖",
                  title: t("spaWellness"),
                  description: t("spaWellnessDesc"),
                  services: t("servicesAndProducts")
                },
              ].map((category) => (
                <button
                  key={category.key}
                  onClick={() => setSelectedCategory(category.key)}
                  className={`relative rounded-xl border-2 p-6 text-left transition-all ${
                    selectedCategory === category.key
                      ? "border-purple-600 bg-purple-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{category.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">{category.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                          <p className="text-xs text-gray-500 mt-2">{category.services}</p>
                        </div>
                        {selectedCategory === category.key && (
                          <Check className="h-6 w-6 text-purple-600 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleCategorySubmit}
              disabled={loading}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 py-4 font-semibold text-white hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? t("saving") : selectedCategory ? t("continue") : t("skipForNow")}
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Step: Hours */}
        {step === "hours" && (
          <div className="rounded-2xl bg-white p-4 sm:p-8 shadow-sm">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              {t("hoursTitle")}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              {t("hoursSubtitle")}
            </p>

            <div className="mt-6 space-y-2">
              {hours.map((day, index) => {
                const dayKeys = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
                const dayKey = dayKeys[day.day] as "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";
                return (
                  <div
                    key={day.day}
                    className={`flex items-center gap-2 rounded-lg sm:rounded-xl border p-2.5 sm:p-4 ${
                      day.enabled ? "border-gray-200" : "border-gray-100 bg-gray-50"
                    }`}
                  >
                    <label className="flex w-12 sm:w-20 items-center gap-1 sm:gap-2 flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={day.enabled}
                        onChange={(e) => {
                          const newHours = [...hours];
                          newHours[index].enabled = e.target.checked;
                          setHours(newHours);
                        }}
                        className="h-3.5 w-3.5 sm:h-4 sm:w-4 rounded text-purple-600"
                      />
                      <span
                        className={`font-medium text-xs sm:text-base ${
                          day.enabled ? "text-gray-900" : "text-gray-400"
                        }`}
                      >
                        {t(dayKey)}
                      </span>
                    </label>

                    {day.enabled ? (
                      <div className="flex items-center gap-1 sm:gap-2 flex-1 min-w-0">
                        <input
                          type="time"
                          value={day.open}
                          onChange={(e) => {
                            const newHours = [...hours];
                            newHours[index].open = e.target.value;
                            setHours(newHours);
                          }}
                          className="rounded-md sm:rounded-lg border border-gray-200 px-1.5 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm w-full"
                        />
                        <span className="text-gray-400 text-[10px] sm:text-sm flex-shrink-0">{t("to")}</span>
                        <input
                          type="time"
                          value={day.close}
                          onChange={(e) => {
                            const newHours = [...hours];
                            newHours[index].close = e.target.value;
                            setHours(newHours);
                          }}
                          className="rounded-md sm:rounded-lg border border-gray-200 px-1.5 py-1 sm:px-3 sm:py-2 text-xs sm:text-sm w-full"
                        />
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs sm:text-base">{t("closed")}</span>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleHoursSubmit}
              disabled={loading}
              className="mt-6 sm:mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 py-3 sm:py-4 font-semibold text-white hover:bg-purple-700"
            >
              {loading ? t("saving") : t("finishSetup")}
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Step: Complete */}
        {step === "complete" && (
          <div className="rounded-2xl bg-white p-4 sm:p-8 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="mt-6 text-xl sm:text-2xl font-bold text-gray-900">
              {t("completeTitle")}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              {t("completeSubtitle")}
            </p>

            <div className="mt-6 sm:mt-8 space-y-3">
              {merchantSlug && (
                <a
                  href={`/m/${merchantSlug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3 sm:py-4 font-semibold text-white hover:bg-green-700 transition-colors"
                >
                  {t("viewBookingPage")}
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}

              <button
                onClick={handleComplete}
                className="w-full rounded-xl bg-purple-600 py-3 sm:py-4 font-semibold text-white hover:bg-purple-700"
              >
                {t("goToDashboard")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
