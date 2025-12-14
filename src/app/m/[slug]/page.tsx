import { createClient } from "@/lib/supabase/server";
import { PublicFooter } from "@/components/PublicFooter";
import { MerchantPageWrapper } from "@/components/merchant/MerchantPageWrapper";
import { HeroActions } from "@/components/merchant/HeroActions";
import { MapPin, Phone } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface MerchantProfileProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: MerchantProfileProps) {
  const supabase = await createClient();
  const { slug } = await params;

  const { data: merchant } = await supabase
    .from("merchants")
    .select("business_name, description")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (!merchant) {
    return {
      title: "Salon not found | BeautiPick",
    };
  }

  const description = merchant.description || `Đặt lịch tại ${merchant.business_name}`;

  return {
    title: `${merchant.business_name} | BeautiPick`,
    description,
  };
}

export default async function MerchantProfile({ params }: MerchantProfileProps) {
  const supabase = await createClient();
  const { slug } = await params;

  // Fetch merchant data
  const { data: merchant } = await supabase
    .from("merchants")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (!merchant) {
    notFound();
  }

  // Fetch services
  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("merchant_id", merchant.id)
    .eq("is_active", true)
    .order("display_order", { ascending: true })
    .order("name");

  // Fetch products
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("merchant_id", merchant.id)
    .eq("is_active", true)
    .order("name");

  // Fetch gallery images
  const { data: gallery } = await supabase
    .from("gallery")
    .select("*")
    .eq("merchant_id", merchant.id)
    .order("created_at", { ascending: true });

  // Convert gallery image paths to full URLs
  const galleryWithFullUrls = gallery?.map((image: any) => ({
    ...image,
    image_url: image.image_url.startsWith('http')
      ? image.image_url
      : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${image.image_url}`
  }));

  // Fetch staff with staff_services relation
  const { data: staff } = await supabase
    .from("staff")
    .select("*, staff_services(service_id)")
    .eq("merchant_id", merchant.id)
    .eq("is_active", true)
    .order("name");

  // Fetch business hours
  const { data: availability } = await supabase
    .from("availability")
    .select("*")
    .eq("merchant_id", merchant.id)
    .is("staff_id", null)
    .eq("is_available", true)
    .order("day_of_week");

  // Get logo URL
  let logoDisplayUrl = merchant.logo_url;
  if (logoDisplayUrl && !logoDisplayUrl.startsWith("http")) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/signed-url?key=${encodeURIComponent(logoDisplayUrl)}`
      );
      const data = await response.json();
      if (data.url) logoDisplayUrl = data.url;
    } catch (err) {
      console.error("Failed to fetch logo signed URL");
    }
  }

  // Parse social links
  const socialLinks = Array.isArray(merchant.social_links) ? merchant.social_links : [];

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

  // Check if merchant is currently open
  const isCurrentlyOpen = () => {
    if (!availability || availability.length === 0) return false;

    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = now.toTimeString().slice(0, 5); // "HH:MM"

    const todayAvailability = availability.find(
      (avail: any) => avail.day_of_week === currentDay
    );

    if (!todayAvailability || !todayAvailability.is_available) return false;

    return currentTime >= todayAvailability.start_time.slice(0, 5) &&
           currentTime <= todayAvailability.end_time.slice(0, 5);
  };

  const merchantIsOpen = isCurrentlyOpen();

  const heroSection = (
    <section className="bg-gradient-to-br from-purple-600 to-pink-600 text-white py-12 relative">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Hero Actions - Top Right */}
            <div className="absolute top-6 right-6 md:right-8">
              <HeroActions merchantId={merchant.id} merchantName={merchant.business_name} />
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Logo */}
              <div className="flex-shrink-0">
                {logoDisplayUrl ? (
                  <div className="relative h-32 w-32 rounded-2xl overflow-hidden shadow-2xl bg-white">
                    <Image
                      src={logoDisplayUrl}
                      alt={merchant.business_name}
                      fill
                      className="object-cover"
                      sizes="128px"
                      priority
                    />
                  </div>
                ) : (
                  <div className="h-32 w-32 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-6xl font-bold">
                    {merchant.business_name.charAt(0)}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h1 className="text-3xl md:text-4xl font-bold">
                    {merchant.business_name}
                  </h1>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    merchantIsOpen
                      ? "bg-green-500 text-white"
                      : "bg-gray-400 text-white"
                  }`}>
                    {merchantIsOpen ? "Đang mở cửa" : "Đã đóng cửa"}
                  </span>
                </div>
                {merchant.description && (
                  <p className="text-purple-100 text-lg mb-4">
                    {merchant.description}
                  </p>
                )}

                {/* Meta Info */}
                <div className="flex flex-wrap gap-4 mb-6">
                  {merchant.address && (
                    <div className="flex items-start gap-2 text-purple-100">
                      <MapPin className="h-4 w-4 flex-shrink-0 mt-1" />
                      <span>{merchant.address}</span>
                    </div>
                  )}
                  {merchant.phone && (
                    <div className="flex items-center gap-2 text-purple-100">
                      <Phone className="h-4 w-4" />
                      <a href={`tel:${merchant.phone}`} className="hover:underline">
                        {merchant.phone}
                      </a>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {merchant.google_maps_url && (
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={merchant.google_maps_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-white text-purple-600 rounded-xl font-semibold hover:bg-gray-100 transition flex items-center gap-2"
                    >
                      <MapPin className="h-5 w-5" />
                      Chỉ đường
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
    </section>
  );

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <MerchantPageWrapper
          merchant={merchant}
          services={services || []}
          products={products || []}
          staff={staff || []}
          availability={availability || []}
          galleryWithFullUrls={galleryWithFullUrls || []}
          socialLinks={socialLinks}
          merchantIsOpen={merchantIsOpen}
          heroSection={heroSection}
        />
      </div>
      <PublicFooter />
    </>
  );
}
