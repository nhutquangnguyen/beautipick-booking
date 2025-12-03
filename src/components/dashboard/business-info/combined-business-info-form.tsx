"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Youtube, Globe, Info, MapPin, Phone, Clock, Link2, ChevronDown, ChevronUp, Instagram, Facebook, Music, Twitter, MessageCircle, Send } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Merchant, SocialLink } from "@/types/database";
import { generateSlug } from "@/lib/utils";
import { ImageUpload } from "@/components/ui/image-upload";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

interface DayHours {
  is_available: boolean;
  start_time: string;
  end_time: string;
}

export function CombinedBusinessInfoForm({ merchant }: { merchant: Merchant }) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [origin, setOrigin] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(merchant.logo_url);
  const [coverUrl, setCoverUrl] = useState<string | null>(merchant.cover_image_url);

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

    setSocialLinks((data?.social_links as SocialLink[]) ?? []);
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
        <SectionHeader title="Branding" section="branding" icon={Globe} />
        {expandedSections.has("branding") && (
          <div className="p-6 space-y-6">
            <div>
              <label className="label mb-2">Cover Image</label>
              <ImageUpload
                value={coverUrl}
                onChange={setCoverUrl}
                folder={`merchants/${merchant.id}/cover`}
                aspectRatio="cover"
                placeholder="Upload cover image"
              />
              <p className="mt-2 text-xs text-gray-500">
                Recommended: 1200x400px. Appears at the top of your booking page.
              </p>
            </div>

            <div>
              <label className="label mb-2">Logo</label>
              <ImageUpload
                value={logoUrl}
                onChange={setLogoUrl}
                folder={`merchants/${merchant.id}/logo`}
                aspectRatio="square"
                placeholder="Upload logo"
              />
              <p className="mt-2 text-xs text-gray-500">
                Recommended: 400x400px. Square format works best.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Business Details Section */}
      <div className="card overflow-hidden">
        <SectionHeader title="Business Details" section="details" icon={Info} />
        {expandedSections.has("details") && (
          <div className="p-6 space-y-4">
            <div>
              <label className="label">Business Name</label>
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
              <label className="label">Booking Page URL</label>
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
              <label className="label">Description</label>
              <textarea
                value={businessInfo.description}
                onChange={(e) => setBusinessInfo({ ...businessInfo, description: e.target.value })}
                className="input mt-1 min-h-[150px] resize-y"
                rows={6}
                placeholder="Describe your business, services, and what makes you special..."
              />
              <p className="mt-2 text-xs text-gray-500">
                {businessInfo.description.length} characters
              </p>
            </div>

            <div>
              <label className="label flex items-center gap-2">
                <Youtube className="h-4 w-4" />
                YouTube Video
              </label>
              <input
                type="url"
                value={businessInfo.youtube_url}
                onChange={(e) => setBusinessInfo({ ...businessInfo, youtube_url: e.target.value })}
                className="input mt-1"
                placeholder="https://youtube.com/watch?v=..."
              />
              <p className="mt-2 text-xs text-gray-500">
                Add a video tour or introduction to your business
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Timezone</label>
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
                <label className="label">Currency</label>
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
        <SectionHeader title="Contact & Location" section="contact" icon={Phone} />
        {expandedSections.has("contact") && (
          <div className="p-6 space-y-4">
            <div>
              <label className="label">Phone Number</label>
              <input
                type="tel"
                value={contactInfo.phone}
                onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                className="input mt-1"
                placeholder="+84 123 456 789"
              />
            </div>

            <div>
              <label className="label">Street Address</label>
              <input
                type="text"
                value={contactInfo.address}
                onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
                className="input mt-1"
                placeholder="123 Main Street"
              />
            </div>

            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
              <div>
                <label className="label">City</label>
                <input
                  type="text"
                  value={contactInfo.city}
                  onChange={(e) => setContactInfo({ ...contactInfo, city: e.target.value })}
                  className="input mt-1"
                />
              </div>
              <div>
                <label className="label">State/Province</label>
                <input
                  type="text"
                  value={contactInfo.state}
                  onChange={(e) => setContactInfo({ ...contactInfo, state: e.target.value })}
                  className="input mt-1"
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="label">Zip Code</label>
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
                Google Maps Link
              </label>
              <input
                type="url"
                value={contactInfo.google_maps_url}
                onChange={(e) => setContactInfo({ ...contactInfo, google_maps_url: e.target.value })}
                className="input mt-1"
                placeholder="https://maps.google.com/..."
              />
              <p className="mt-2 text-xs text-gray-500">
                Customers can click to get directions
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Business Hours Section */}
      <div className="card overflow-hidden">
        <SectionHeader title="Business Hours" section="hours" icon={Clock} />
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
                    <span className="text-gray-400 text-sm flex-shrink-0">to</span>
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
                  <span className="text-sm text-gray-400">Closed</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Social Links Section */}
      <div className="card overflow-hidden">
        <SectionHeader title="Social Links" section="social" icon={Link2} />
        {expandedSections.has("social") && (
          <div className="p-6 space-y-4">
            <p className="text-sm text-gray-600">
              Click on a social platform icon to add or edit your link
            </p>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {([
                { type: "instagram" as const, label: "Instagram", Icon: Instagram },
                { type: "facebook" as const, label: "Facebook", Icon: Facebook },
                { type: "tiktok" as const, label: "TikTok", Icon: Music },
                { type: "youtube" as const, label: "YouTube", Icon: Youtube },
                { type: "twitter" as const, label: "Twitter", Icon: Twitter },
                { type: "whatsapp" as const, label: "WhatsApp", Icon: MessageCircle },
                { type: "zalo" as const, label: "Zalo", Icon: MessageCircle },
                { type: "telegram" as const, label: "Telegram", Icon: Send },
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
                        const newUrl = prompt(`Edit ${platform.label} URL:`, existingLink.url);
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
                        const newUrl = prompt(`Add ${platform.label} URL:`);
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
            {loading ? "Saving..." : "Save All Changes"}
          </button>
          {success && (
            <span className="text-sm text-green-600 font-medium">✓ Saved successfully!</span>
          )}
        </div>
      </div>
    </form>
  );
}
