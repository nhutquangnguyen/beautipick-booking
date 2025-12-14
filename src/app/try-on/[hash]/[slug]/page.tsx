import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BookingPageDynamic } from "@/components/booking/booking-page-dynamic";
import { MerchantTheme, MerchantSettings, defaultTheme, defaultSettings } from "@/types/database";
import Link from "next/link";
import { Crown, Eye } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

const BUCKET_NAME = "images";

// Helper to get public URL if value is a storage path (not already a URL)
function getImageUrl(supabase: Awaited<ReturnType<typeof createClient>>, value: string | null): string | null {
  if (!value) return null;
  if (value.startsWith("http")) return value; // Already a URL (legacy)

  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(value);
  return data.publicUrl;
}

export async function generateMetadata({ params }: { params: Promise<{ hash: string; slug: string }> }) {
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
    title: `Theme Preview - ${merchant.business_name}`,
    description: `Preview theme for ${merchant.business_name}`,
  };
}

export default async function ThemePreviewPage({
  params,
}: {
  params: Promise<{ hash: string; slug: string }>;
}) {
  const { hash, slug } = await params;
  const supabase = await createClient();
  const t = await getTranslations("themePreview");

  // Fetch the preview data
  const { data: preview, error: previewError } = await supabase
    .from("theme_previews")
    .select("*")
    .eq("hash", hash)
    .single();

  console.log("=== Theme Preview Debug ===");
  console.log("Hash:", hash);
  console.log("Slug:", slug);
  console.log("Preview data:", preview);
  console.log("Preview error:", previewError);
  console.log("========================");

  if (previewError || !preview) {
    console.error("Preview not found or error:", previewError);
    notFound();
  }

  // Check if preview has expired
  if (new Date(preview.expires_at) < new Date()) {
    console.error("Preview expired:", preview.expires_at);
    notFound();
  }

  // Fetch merchant data
  const { data: merchant } = await supabase
    .from("merchants")
    .select("*")
    .eq("id", preview.merchant_id)
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!merchant) {
    notFound();
  }

  // Fetch all merchant data (same as regular booking page)
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

  // Use the preview theme data
  const theme = (preview.theme_data as MerchantTheme) ?? defaultTheme;
  const settings = (merchant.settings as MerchantSettings) ?? defaultSettings;

  // Pass merchant with public URLs
  const merchantWithUrls = {
    ...merchant,
    logo_url: logoUrl,
    cover_image_url: coverImageUrl,
    cover_image_1: coverImage1Url,
    cover_image_2: coverImage2Url,
    cover_image_3: coverImage3Url,
  };

  return (
    <>
      {/* Floating Preview Badge - Bottom Left */}
      <div
        className="fixed bottom-6 left-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-2xl rounded-2xl overflow-hidden"
        style={{ zIndex: 999999 }}
      >
        <div className="px-5 py-3">
          <div className="flex items-center gap-2 mb-3">
            <Eye className="h-5 w-5 animate-pulse" />
            <div>
              <p className="font-bold text-sm">{t("previewMode")}</p>
              <p className="text-xs text-white/80">{t("notLivePage")}</p>
            </div>
          </div>
          <Link
            href="/business/dashboard/settings"
            className="w-full px-4 py-2 bg-white text-purple-600 hover:bg-white/90 rounded-lg transition-colors font-bold text-sm flex items-center justify-center gap-2 shadow-lg"
          >
            <Crown className="h-4 w-4" />
            {t("upgrade")}
          </Link>
        </div>
      </div>

      {/* Booking page content - no overlay */}
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
    </>
  );
}
