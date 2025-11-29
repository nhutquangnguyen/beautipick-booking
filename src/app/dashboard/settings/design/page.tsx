import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DesignForm } from "@/components/dashboard/design/design-form";
import { QRCodeGenerator } from "@/components/dashboard/design/qr-code-generator";
import { MerchantTheme, defaultTheme } from "@/types/database";
import { getSignedImageUrl } from "@/lib/wasabi";

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

export default async function SettingsDesignPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [merchantResult, galleryResult, productsResult] = await Promise.all([
    supabase.from("merchants").select("*").eq("id", user.id).single(),
    supabase.from("gallery").select("*").eq("merchant_id", user.id).order("display_order", { ascending: true }).limit(4),
    supabase.from("products").select("*").eq("merchant_id", user.id).eq("is_active", true).limit(2),
  ]);

  const merchant = merchantResult.data;
  if (!merchant) redirect("/login");

  const theme = (merchant.theme as MerchantTheme) ?? defaultTheme;

  // Generate signed URL for logo
  const logoUrl = await getImageUrl(merchant.logo_url);

  // Generate signed URLs for gallery images
  const galleryWithSignedUrls = await Promise.all(
    (galleryResult.data ?? []).map(async (image) => ({
      ...image,
      display_url: await getImageUrl(image.image_url),
    }))
  );

  // Generate signed URLs for product images
  const productsWithSignedUrls = await Promise.all(
    (productsResult.data ?? []).map(async (product) => ({
      ...product,
      display_url: await getImageUrl(product.image_url),
    }))
  );

  const bookingPageUrl = `${process.env.NEXT_PUBLIC_APP_URL || ""}/${merchant.slug}`;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Page Design</h2>
        <p className="text-sm text-gray-600">Customize the look of your booking page</p>
      </div>

      <DesignForm
        merchantId={user.id}
        theme={theme}
        slug={merchant.slug}
        gallery={galleryWithSignedUrls}
        products={productsWithSignedUrls}
      />

      <QRCodeGenerator
        url={bookingPageUrl}
        businessName={merchant.business_name}
        logoUrl={logoUrl}
      />
    </div>
  );
}
