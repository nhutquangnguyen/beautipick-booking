"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Youtube, Globe, Info, MapPin, Phone, Clock, Link2, ChevronDown, ChevronUp } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Merchant, SocialLink } from "@/types/database";
import { generateSlug } from "@/lib/utils";
import { ImageUpload } from "@/components/ui/image-upload";

// Social Media Icon Components
function InstagramIconBrand({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <defs>
        <linearGradient id="instagram-gradient-dashboard" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#FED373', stopOpacity: 1 }} />
          <stop offset="25%" style={{ stopColor: '#F15245', stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: '#D92E7F', stopOpacity: 1 }} />
          <stop offset="75%" style={{ stopColor: '#9B36B7', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#515ECF', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <path fill="url(#instagram-gradient-dashboard)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

function FacebookIconBrand({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function TikTokIconBrand({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path fill="#000000" d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  );
}

function YoutubeIconBrand({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path fill="#FF0000" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

function TwitterIconBrand({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path fill="#000000" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

function WhatsAppIconBrand({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path fill="#25D366" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

function ZaloIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 50 50" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M22.782 0.166016H27.199C33.2653 0.166016 36.8103 1.05701 39.9572 2.74421C43.1041 4.4314 45.5875 6.89585 47.2557 10.0428C48.9429 13.1897 49.8339 16.7347 49.8339 22.801V27.1991C49.8339 33.2654 48.9429 36.8104 47.2557 39.9573C45.5685 43.1042 43.1041 45.5877 39.9572 47.2559C36.8103 48.9431 33.2653 49.8341 27.199 49.8341H22.8009C16.7346 49.8341 13.1896 48.9431 10.0427 47.2559C6.89583 45.5687 4.41243 43.1042 2.7442 39.9573C1.057 36.8104 0.166016 33.2654 0.166016 27.1991V22.801C0.166016 16.7347 1.057 13.1897 2.7442 10.0428C4.43139 6.89585 6.89583 4.41245 10.0427 2.74421C13.1707 1.05701 16.7346 0.166016 22.782 0.166016Z" fill="#0068FF"/>
      <path opacity="0.12" fillRule="evenodd" clipRule="evenodd" d="M49.8336 26.4736V27.1994C49.8336 33.2657 48.9427 36.8107 47.2555 39.9576C45.5683 43.1045 43.1038 45.5879 39.9569 47.2562C36.81 48.9434 33.265 49.8344 27.1987 49.8344H22.8007C17.8369 49.8344 14.5612 49.2378 11.8104 48.0966L7.27539 43.4267L49.8336 26.4736Z" fill="#001A33"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M7.779 43.5892C10.1019 43.846 13.0061 43.1836 15.0682 42.1825C24.0225 47.1318 38.0197 46.8954 46.4923 41.4732C46.8209 40.9803 47.1279 40.4677 47.4128 39.9363C49.1062 36.7779 50.0004 33.22 50.0004 27.1316V22.7175C50.0004 16.629 49.1062 13.0711 47.4128 9.91273C45.7385 6.75436 43.2461 4.28093 40.0877 2.58758C36.9293 0.894239 33.3714 0 27.283 0H22.8499C17.6644 0 14.2982 0.652754 11.4699 1.89893C11.3153 2.03737 11.1636 2.17818 11.0151 2.32135C2.71734 10.3203 2.08658 27.6593 9.12279 37.0782C9.13064 37.0921 9.13933 37.1061 9.14889 37.1203C10.2334 38.7185 9.18694 41.5154 7.55068 43.1516C7.28431 43.399 7.37944 43.5512 7.779 43.5892Z" fill="white"/>
      <path d="M20.5632 17H10.8382V19.0853H17.5869L10.9329 27.3317C10.7244 27.635 10.5728 27.9194 10.5728 28.5639V29.0947H19.748C20.203 29.0947 20.5822 28.7156 20.5822 28.2606V27.1421H13.4922L19.748 19.2938C19.8428 19.1801 20.0134 18.9716 20.0893 18.8768L20.1272 18.8199C20.4874 18.2891 20.5632 17.8341 20.5632 17.2844V17Z" fill="#0068FF"/>
      <path d="M32.9416 29.0947H34.3255V17H32.2402V28.3933C32.2402 28.7725 32.5435 29.0947 32.9416 29.0947Z" fill="#0068FF"/>
      <path d="M25.814 19.6924C23.1979 19.6924 21.0747 21.8156 21.0747 24.4317C21.0747 27.0478 23.1979 29.171 25.814 29.171C28.4301 29.171 30.5533 27.0478 30.5533 24.4317C30.5723 21.8156 28.4491 19.6924 25.814 19.6924ZM25.814 27.2184C24.2785 27.2184 23.0273 25.9672 23.0273 24.4317C23.0273 22.8962 24.2785 21.645 25.814 21.645C27.3495 21.645 28.6007 22.8962 28.6007 24.4317C28.6007 25.9672 27.3685 27.2184 25.814 27.2184Z" fill="#0068FF"/>
      <path d="M40.4867 19.6162C37.8516 19.6162 35.7095 21.7584 35.7095 24.3934C35.7095 27.0285 37.8516 29.1707 40.4867 29.1707C43.1217 29.1707 45.2639 27.0285 45.2639 24.3934C45.2639 21.7584 43.1217 19.6162 40.4867 19.6162ZM40.4867 27.2181C38.9322 27.2181 37.681 25.9669 37.681 24.4124C37.681 22.8579 38.9322 21.6067 40.4867 21.6067C42.0412 21.6067 43.2924 22.8579 43.2924 24.4124C43.2924 25.9669 42.0412 27.2181 40.4867 27.2181Z" fill="#0068FF"/>
      <path d="M29.4562 29.0944H30.5747V19.957H28.6221V28.2793C28.6221 28.7153 29.0012 29.0944 29.4562 29.0944Z" fill="#0068FF"/>
    </svg>
  );
}

function TelegramIconBrand({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path fill="#0088cc" d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  );
}

interface DayHours {
  is_available: boolean;
  start_time: string;
  end_time: string;
}

export function CombinedBusinessInfoForm({ merchant }: { merchant: Merchant }) {
  const t = useTranslations("businessForm");
  const DAY_NAMES = [
    t("sunday"),
    t("monday"),
    t("tuesday"),
    t("wednesday"),
    t("thursday"),
    t("friday"),
    t("saturday"),
  ];
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [origin, setOrigin] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(merchant.logo_url);
  const [coverUrl, setCoverUrl] = useState<string | null>(merchant.cover_image_url);
  const [coverUrl1, setCoverUrl1] = useState<string | null>(merchant.cover_image_1);
  const [coverUrl2, setCoverUrl2] = useState<string | null>(merchant.cover_image_2);
  const [coverUrl3, setCoverUrl3] = useState<string | null>(merchant.cover_image_3);

  // Collapsible sections state
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["branding", "details"])
  );

  // Business Info
  const [businessInfo, setBusinessInfo] = useState({
    business_name: merchant.business_name,
    slug: merchant.slug,
    description: merchant.description ?? "",
    youtube_url: merchant.youtube_url ?? "",
    timezone: merchant.timezone ?? "Asia/Ho_Chi_Minh",
    currency: merchant.currency ?? "VND",
  });

  // Contact & Location
  const [contactInfo, setContactInfo] = useState({
    phone: merchant.phone ?? "",
    address: merchant.address ?? "",
    city: merchant.city ?? "",
    state: merchant.state ?? "",
    zip_code: merchant.zip_code ?? "",
    google_maps_url: merchant.google_maps_url ?? "",
  });

  // Business Hours
  const [businessHours, setBusinessHours] = useState<Record<number, DayHours>>({});
  const [hoursLoading, setHoursLoading] = useState(true);

  // Social Links
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    setOrigin(window.location.origin);
    loadBusinessHours();
    loadSocialLinks();
  }, []);

  const loadBusinessHours = async () => {
    const { data } = await supabase
      .from("availability")
      .select("*")
      .eq("merchant_id", merchant.id)
      .is("staff_id", null)
      .order("day_of_week");

    const hours: Record<number, DayHours> = {};
    for (let i = 0; i < 7; i++) {
      const existing = data?.find((a) => a.day_of_week === i);
      hours[i] = existing
        ? {
            is_available: existing.is_available,
            start_time: existing.start_time,
            end_time: existing.end_time,
          }
        : {
            is_available: i !== 0 && i !== 6, // Closed weekends by default
            start_time: "09:00",
            end_time: "17:00",
          };
    }
    setBusinessHours(hours);
    setHoursLoading(false);
  };

  const loadSocialLinks = async () => {
    const { data } = await supabase
      .from("merchants")
      .select("social_links")
      .eq("id", merchant.id)
      .single();

    // Handle both array and object formats for backward compatibility
    const links = data?.social_links;
    if (Array.isArray(links)) {
      setSocialLinks(links as SocialLink[]);
    } else if (links && typeof links === 'object') {
      // Convert old object format to array format
      const linksArray: SocialLink[] = Object.entries(links).map(([type, url]) => ({
        id: crypto.randomUUID(),
        type: type as any,
        title: type.charAt(0).toUpperCase() + type.slice(1),
        url: url as string,
      }));
      setSocialLinks(linksArray);
    } else {
      setSocialLinks([]);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      // Update merchant info, contact, and social links
      await supabase
        .from("merchants")
        .update({
          business_name: businessInfo.business_name,
          slug: businessInfo.slug,
          description: businessInfo.description || null,
          youtube_url: businessInfo.youtube_url || null,
          timezone: businessInfo.timezone,
          currency: businessInfo.currency,
          logo_url: logoUrl,
          cover_image_url: coverUrl,
          cover_image_1: coverUrl1,
          cover_image_2: coverUrl2,
          cover_image_3: coverUrl3,
          phone: contactInfo.phone || null,
          address: contactInfo.address || null,
          city: contactInfo.city || null,
          state: contactInfo.state || null,
          zip_code: contactInfo.zip_code || null,
          google_maps_url: contactInfo.google_maps_url || null,
          social_links: socialLinks,
        })
        .eq("id", merchant.id);

      // Update business hours
      await supabase
        .from("availability")
        .delete()
        .eq("merchant_id", merchant.id)
        .is("staff_id", null);

      const hoursRecords = Object.entries(businessHours).map(([day, data]) => ({
        merchant_id: merchant.id,
        staff_id: null,
        day_of_week: parseInt(day),
        start_time: data.start_time,
        end_time: data.end_time,
        is_available: data.is_available,
      }));

      await supabase.from("availability").insert(hoursRecords);

      setSuccess(true);
      router.refresh();
      setTimeout(() => setSuccess(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  const removeSocialLink = (id: string) => {
    setSocialLinks(socialLinks.filter((link) => link.id !== id));
  };

  const updateSocialLink = (id: string, field: keyof SocialLink, value: string) => {
    setSocialLinks(
      socialLinks.map((link) =>
        link.id === id ? { ...link, [field]: value } : link
      )
    );
  };

  const SectionHeader = ({ title, section, icon: Icon }: { title: string; section: string; icon: any }) => {
    const isExpanded = expandedSections.has(section);
    return (
      <button
        type="button"
        onClick={() => toggleSection(section)}
        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors rounded-lg"
      >
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5 text-gray-600" />
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        )}
      </button>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Branding Section */}
      <div className="card overflow-hidden">
        <SectionHeader title={t("branding")} section="branding" icon={Globe} />
        {expandedSections.has("branding") && (
          <div className="p-6 space-y-6">
            <div>
              <label className="label mb-2">{t("coverImageLegacy")}</label>
              <ImageUpload
                value={coverUrl}
                onChange={setCoverUrl}
                folder={`merchants/${merchant.id}/cover`}
                aspectRatio="cover"
                placeholder={t("uploadImage")}
              />
              <p className="mt-2 text-xs text-gray-500">
                {t("coverImageLegacyDesc")}
              </p>
            </div>

            {/* 3 Slideshow Cover Images for Showcase Grid Theme */}
            <div className="space-y-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                  ✨
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{t("slideshowCoverImages")}</h4>
                  <p className="text-xs text-gray-600">{t("slideshowDesc")}</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="label mb-2 text-sm">{t("coverImage1")}</label>
                  <ImageUpload
                    value={coverUrl1}
                    onChange={setCoverUrl1}
                    folder={`merchants/${merchant.id}/covers`}
                    aspectRatio="cover"
                    placeholder={t("uploadImage")}
                  />
                </div>

                <div>
                  <label className="label mb-2 text-sm">{t("coverImage2")}</label>
                  <ImageUpload
                    value={coverUrl2}
                    onChange={setCoverUrl2}
                    folder={`merchants/${merchant.id}/covers`}
                    aspectRatio="cover"
                    placeholder={t("uploadImage")}
                  />
                </div>

                <div>
                  <label className="label mb-2 text-sm">{t("coverImage3")}</label>
                  <ImageUpload
                    value={coverUrl3}
                    onChange={setCoverUrl3}
                    folder={`merchants/${merchant.id}/covers`}
                    aspectRatio="cover"
                    placeholder={t("uploadImage")}
                  />
                </div>
              </div>

              <p className="text-xs text-gray-600 mt-2">
                {t("slideshowTip")}
              </p>
            </div>

            <div>
              <label className="label mb-2">{t("logo")}</label>
              <ImageUpload
                value={logoUrl}
                onChange={setLogoUrl}
                folder={`merchants/${merchant.id}/logo`}
                aspectRatio="square"
                placeholder={t("uploadLogo")}
              />
              <p className="mt-2 text-xs text-gray-500">
                {t("logoDesc")}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Business Details Section */}
      <div className="card overflow-hidden">
        <SectionHeader title={t("businessDetails")} section="details" icon={Info} />
        {expandedSections.has("details") && (
          <div className="p-6 space-y-4">
            <div>
              <label className="label">{t("businessName")}</label>
              <input
                type="text"
                value={businessInfo.business_name}
                onChange={(e) => {
                  setBusinessInfo({
                    ...businessInfo,
                    business_name: e.target.value,
                    slug: generateSlug(e.target.value),
                  });
                }}
                className="input mt-1"
                required
              />
            </div>

            <div>
              <label className="label">{t("bookingPageUrl")}</label>
              <div className="mt-1 flex flex-col sm:flex-row">
                <span className="flex items-center rounded-t-md sm:rounded-l-md sm:rounded-tr-none border border-b-0 sm:border-b sm:border-r-0 border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-500">
                  {origin}/
                </span>
                <input
                  type="text"
                  value={businessInfo.slug}
                  onChange={(e) =>
                    setBusinessInfo({ ...businessInfo, slug: generateSlug(e.target.value) })
                  }
                  className="input rounded-t-none sm:rounded-l-none sm:rounded-tr-md"
                  required
                />
              </div>
            </div>

            <div>
              <label className="label">{t("description")}</label>
              <textarea
                value={businessInfo.description}
                onChange={(e) => setBusinessInfo({ ...businessInfo, description: e.target.value })}
                className="input mt-1 min-h-[150px] resize-y"
                rows={6}
                placeholder={t("describeYourBusiness")}
              />
              <p className="mt-2 text-xs text-gray-500">
                {businessInfo.description.length} {t("characters")}
              </p>
            </div>

            <div>
              <label className="label flex items-center gap-2">
                <Youtube className="h-4 w-4" />
                {t("youtubeVideo")}
              </label>
              <input
                type="url"
                value={businessInfo.youtube_url}
                onChange={(e) => setBusinessInfo({ ...businessInfo, youtube_url: e.target.value })}
                className="input mt-1"
                placeholder={t("youtubeVideoPlaceholder")}
              />
              <p className="mt-2 text-xs text-gray-500">
                {t("videoDesc")}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">{t("timezone")}</label>
                <select
                  value={businessInfo.timezone}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, timezone: e.target.value })}
                  className="input mt-1"
                >
                  <option value="Asia/Ho_Chi_Minh">Vietnam (GMT+7)</option>
                  <option value="Asia/Bangkok">Thailand (GMT+7)</option>
                  <option value="Asia/Singapore">Singapore (GMT+8)</option>
                  <option value="Asia/Jakarta">Indonesia (GMT+7)</option>
                  <option value="Asia/Manila">Philippines (GMT+8)</option>
                  <option value="Asia/Kuala_Lumpur">Malaysia (GMT+8)</option>
                  <option value="America/New_York">New York (GMT-5)</option>
                  <option value="America/Los_Angeles">Los Angeles (GMT-8)</option>
                  <option value="Europe/London">London (GMT+0)</option>
                  <option value="Australia/Sydney">Sydney (GMT+11)</option>
                </select>
              </div>

              <div>
                <label className="label">{t("currency")}</label>
                <select
                  value={businessInfo.currency}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, currency: e.target.value })}
                  className="input mt-1"
                >
                  <option value="VND">₫ Vietnamese Dong (VND)</option>
                  <option value="THB">฿ Thai Baht (THB)</option>
                  <option value="SGD">$ Singapore Dollar (SGD)</option>
                  <option value="IDR">Rp Indonesian Rupiah (IDR)</option>
                  <option value="PHP">₱ Philippine Peso (PHP)</option>
                  <option value="MYR">RM Malaysian Ringgit (MYR)</option>
                  <option value="USD">$ US Dollar (USD)</option>
                  <option value="EUR">€ Euro (EUR)</option>
                  <option value="GBP">£ British Pound (GBP)</option>
                  <option value="AUD">$ Australian Dollar (AUD)</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Contact & Location Section */}
      <div className="card overflow-hidden">
        <SectionHeader title={t("contactLocation")} section="contact" icon={Phone} />
        {expandedSections.has("contact") && (
          <div className="p-6 space-y-4">
            <div>
              <label className="label">{t("phone")}</label>
              <input
                type="tel"
                value={contactInfo.phone}
                onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                className="input mt-1"
                placeholder={t("phonePlaceholder")}
              />
            </div>

            <div>
              <label className="label">{t("streetAddress")}</label>
              <input
                type="text"
                value={contactInfo.address}
                onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                className="input mt-1"
                placeholder={t("streetAddressPlaceholder")}
              />
            </div>

            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
              <div>
                <label className="label">{t("city")}</label>
                <input
                  type="text"
                  value={contactInfo.city}
                  onChange={(e) => setContactInfo({ ...contactInfo, city: e.target.value })}
                  className="input mt-1"
                />
              </div>
              <div>
                <label className="label">{t("stateProvince")}</label>
                <input
                  type="text"
                  value={contactInfo.state}
                  onChange={(e) => setContactInfo({ ...contactInfo, state: e.target.value })}
                  className="input mt-1"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="label">{t("zipCode")}</label>
                <input
                  type="text"
                  value={contactInfo.zip_code}
                  onChange={(e) => setContactInfo({ ...contactInfo, zip_code: e.target.value })}
                  className="input mt-1"
                />
              </div>
            </div>

            <div>
              <label className="label flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {t("googleMapsLink")}
              </label>
              <input
                type="url"
                value={contactInfo.google_maps_url}
                onChange={(e) => setContactInfo({ ...contactInfo, google_maps_url: e.target.value })}
                className="input mt-1"
                placeholder={t("googleMapsPlaceholder")}
              />
              <p className="mt-2 text-xs text-gray-500">
                {t("googleMapsDesc")}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Business Hours Section */}
      <div className="card overflow-hidden">
        <SectionHeader title={t("businessHours")} section="hours" icon={Clock} />
        {expandedSections.has("hours") && !hoursLoading && (
          <div className="p-6 space-y-2">
            {Object.entries(businessHours).map(([day, hours]) => (
              <div
                key={day}
                className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-3 rounded-lg border ${
                  hours.is_available ? "border-gray-200 bg-white" : "border-gray-100 bg-gray-50"
                }`}
              >
                <label className="flex items-center gap-2 sm:w-28 flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={hours.is_available}
                    onChange={(e) =>
                      setBusinessHours({
                        ...businessHours,
                        [day]: { ...hours, is_available: e.target.checked },
                      })
                    }
                    className="h-4 w-4 rounded text-purple-600 flex-shrink-0"
                  />
                  <span className={`text-sm font-medium ${hours.is_available ? "text-gray-900" : "text-gray-400"}`}>
                    {DAY_NAMES[parseInt(day)]}
                  </span>
                </label>

                {hours.is_available ? (
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <input
                      type="time"
                      value={hours.start_time}
                      onChange={(e) =>
                        setBusinessHours({
                          ...businessHours,
                          [day]: { ...hours, start_time: e.target.value },
                        })
                      }
                      className="input py-2 text-sm flex-1 min-w-0"
                    />
                    <span className="text-gray-400 text-sm flex-shrink-0">{t("to")}</span>
                    <input
                      type="time"
                      value={hours.end_time}
                      onChange={(e) =>
                        setBusinessHours({
                          ...businessHours,
                          [day]: { ...hours, end_time: e.target.value },
                        })
                      }
                      className="input py-2 text-sm flex-1 min-w-0"
                    />
                  </div>
                ) : (
                  <span className="text-sm text-gray-400">{t("closed")}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Social Links Section */}
      <div className="card overflow-hidden">
        <SectionHeader title={t("socialLinks")} section="social" icon={Link2} />
        {expandedSections.has("social") && (
          <div className="p-6 space-y-4">
            <p className="text-sm text-gray-600">
              {t("socialLinksDesc")}
            </p>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {([
                { type: "instagram" as const, label: "Instagram", Icon: InstagramIconBrand },
                { type: "facebook" as const, label: "Facebook", Icon: FacebookIconBrand },
                { type: "tiktok" as const, label: "TikTok", Icon: TikTokIconBrand },
                { type: "youtube" as const, label: "YouTube", Icon: YoutubeIconBrand },
                { type: "twitter" as const, label: "Twitter", Icon: TwitterIconBrand },
                { type: "whatsapp" as const, label: "WhatsApp", Icon: WhatsAppIconBrand },
                { type: "zalo" as const, label: "Zalo", Icon: ZaloIcon },
                { type: "telegram" as const, label: "Telegram", Icon: TelegramIconBrand },
                { type: "website" as const, label: "Website", Icon: Globe },
                { type: "custom" as const, label: "Custom", Icon: Link2 },
              ] as const).map((platform) => {
                const existingLink = socialLinks.find((l) => l.type === platform.type);
                const isActive = !!existingLink;

                return (
                  <button
                    key={platform.type}
                    type="button"
                    onClick={() => {
                      if (existingLink) {
                        // Edit existing - show modal/prompt
                        const newUrl = prompt(t("editUrl", { platform: platform.label }), existingLink.url);
                        if (newUrl !== null) {
                          if (newUrl.trim() === "") {
                            // Remove if empty
                            removeSocialLink(existingLink.id);
                          } else {
                            updateSocialLink(existingLink.id, "url", newUrl);
                          }
                        }
                      } else {
                        // Add new
                        const newUrl = prompt(t("addUrl", { platform: platform.label }));
                        if (newUrl && newUrl.trim()) {
                          setSocialLinks([
                            ...socialLinks,
                            {
                              id: crypto.randomUUID(),
                              type: platform.type,
                              title: platform.label,
                              url: newUrl.trim(),
                            },
                          ]);
                        }
                      }
                    }}
                    className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                      isActive
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {isActive && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                    <platform.Icon className="h-8 w-8 mb-1" />
                    <span className={`text-xs font-medium ${isActive ? "text-purple-700" : "text-gray-600"}`}>
                      {platform.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="card p-6">
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg"
          >
            {loading ? t("saving") : t("saveAllChanges")}
          </button>
          {success && (
            <span className="text-sm text-green-600 font-medium">{t("savedSuccessfully")}</span>
          )}
        </div>
      </div>
    </form>
  );
}
