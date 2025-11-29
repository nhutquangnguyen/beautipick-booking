import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BookingPage } from "@/components/booking/booking-page";
import { MerchantTheme, MerchantSettings, defaultTheme, defaultSettings } from "@/types/database";
import { getSignedImageUrl } from "@/lib/wasabi";

// Disable caching to ensure fresh signed URLs
export const dynamic = "force-dynamic";

// Helper to get signed URL if value is a key (not already a URL)
async function getImageUrl(value: string | null): Promise<string | null> {
  if (!value) return null;
  if (value.startsWith("http")) return value; // Already a URL (legacy)
  try {
    return await getSignedImageUrl(value, 3600); // Generate signed URL for key
  } catch (error) {
    console.error("Failed to generate signed URL for:", value, error);
    return null;
  }
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

  // Generate signed URLs for merchant images
  const [logoUrl, coverImageUrl] = await Promise.all([
    getImageUrl(merchant.logo_url),
    getImageUrl(merchant.cover_image_url),
  ]);

  // Generate signed URLs for gallery images
  const galleryWithSignedUrls = await Promise.all(
    (galleryResult.data ?? []).map(async (image) => ({
      ...image,
      image_url: await getImageUrl(image.image_url) ?? image.image_url,
    }))
  );

  // Generate signed URLs for product images
  const productsWithSignedUrls = await Promise.all(
    (productsResult.data ?? []).map(async (product) => ({
      ...product,
      image_url: await getImageUrl(product.image_url),
    }))
  );

  const theme = (merchant.theme as MerchantTheme) ?? defaultTheme;
  const settings = (merchant.settings as MerchantSettings) ?? defaultSettings;

  // Pass merchant with signed URLs
  const merchantWithSignedUrls = {
    ...merchant,
    logo_url: logoUrl,
    cover_image_url: coverImageUrl,
  };

  return (
    <BookingPage
      merchant={merchantWithSignedUrls}
      services={servicesResult.data ?? []}
      staff={staffResult.data ?? []}
      availability={availabilityResult.data ?? []}
      gallery={galleryWithSignedUrls}
      products={productsWithSignedUrls}
      theme={theme}
      settings={settings}
    />
  );
}
