import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BookingPageDynamic } from "@/components/booking/booking-page-dynamic";
import { MerchantTheme, MerchantSettings, defaultTheme, defaultSettings } from "@/types/database";
import { getCurrentSubscription } from "@/lib/pricing/subscriptions";

const BUCKET_NAME = "images";

// Helper to get public URL if value is a storage path (not already a URL)
function getImageUrl(supabase: Awaited<ReturnType<typeof createClient>>, value: string | null): string | null {
  if (!value) return null;
  if (value.startsWith("http")) return value; // Already a URL (legacy)

  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(value);
  return data.publicUrl;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: merchant } = await supabase
    .from("merchants")
    .select("business_name, description")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!merchant) {
    return { title: "Not Found" };
  }

  return {
    title: `Book with ${merchant.business_name}`,
    description: merchant.description || `Book your appointment with ${merchant.business_name}`,
  };
}

export default async function PublicBookingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: merchant } = await supabase
    .from("merchants")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!merchant) {
    notFound();
  }

  const [servicesResult, staffResult, availabilityResult, galleryResult, productsResult] = await Promise.all([
    supabase
      .from("services")
      .select("*")
      .eq("merchant_id", merchant.id)
      .eq("is_active", true)
      .order("display_order", { ascending: true }),
    supabase
      .from("staff")
      .select("*, staff_services(service_id)")
      .eq("merchant_id", merchant.id)
      .eq("is_active", true),
    supabase
      .from("availability")
      .select("*")
      .eq("merchant_id", merchant.id)
      .is("staff_id", null)
      .eq("is_available", true),
    supabase
      .from("gallery")
      .select("*")
      .eq("merchant_id", merchant.id)
      .order("display_order", { ascending: true }),
    supabase
      .from("products")
      .select("*")
      .eq("merchant_id", merchant.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false }),
  ]);

  // Generate public URLs for merchant images
  const logoUrl = getImageUrl(supabase, merchant.logo_url);
  const coverImageUrl = getImageUrl(supabase, merchant.cover_image_url);
  const coverImage1Url = getImageUrl(supabase, merchant.cover_image_1);
  const coverImage2Url = getImageUrl(supabase, merchant.cover_image_2);
  const coverImage3Url = getImageUrl(supabase, merchant.cover_image_3);

  // Generate public URLs for gallery images
  const galleryWithUrls = (galleryResult.data ?? []).map((image) => ({
    ...image,
    image_url: getImageUrl(supabase, image.image_url) ?? image.image_url,
  }));

  // Generate public URLs for product images
  const productsWithUrls = (productsResult.data ?? []).map((product) => ({
    ...product,
    image_url: getImageUrl(supabase, product.image_url),
  }));

  let theme = (merchant.theme as MerchantTheme) ?? defaultTheme;
  const settings = (merchant.settings as MerchantSettings) ?? defaultSettings;

  // Check subscription and enforce theme restrictions
  const subscription = await getCurrentSubscription(merchant.id);
  const isFree = !subscription || subscription.tier?.tier_key === "free";

  // Force free users to use starter theme
  if (isFree && theme.layoutTemplate !== "starter") {
    theme = {
      ...theme,
      layoutTemplate: "starter",
      themeId: "starter-clean",
    };
  }

  // Handle social links - ensure it's an array format
  let socialLinks = merchant.social_links;
  if (socialLinks && !Array.isArray(socialLinks)) {
    // Convert object format to array format
    // Use deterministic ID based on merchant ID and type for stable keys
    socialLinks = Object.entries(socialLinks).map(([type, url]) => ({
      id: `${merchant.id}-${type}`,
      type: type as any,
      url: url as string,
    }));
  } else if (!socialLinks) {
    socialLinks = [];
  }

  // Pass merchant with public URLs and normalized social links
  const merchantWithUrls = {
    ...merchant,
    logo_url: logoUrl,
    cover_image_url: coverImageUrl,
    cover_image_1: coverImage1Url,
    cover_image_2: coverImage2Url,
    cover_image_3: coverImage3Url,
    social_links: socialLinks,
  };

  return (
    <BookingPageDynamic
      merchant={merchantWithUrls}
      services={servicesResult.data ?? []}
      staff={staffResult.data ?? []}
      availability={availabilityResult.data ?? []}
      gallery={galleryWithUrls}
      products={productsWithUrls}
      theme={theme}
      settings={settings}
    />
  );
}
