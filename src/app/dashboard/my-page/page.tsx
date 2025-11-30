import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { DesignForm } from "@/components/dashboard/design/design-form";
import { MerchantTheme, defaultTheme } from "@/types/database";

const BUCKET_NAME = "images";

// Helper to get public URL if value is a storage path (not already a URL)
function getImageUrl(supabase: Awaited<ReturnType<typeof createClient>>, value: string | null): string | null {
  if (!value) return null;
  if (value.startsWith("http")) return value; // Already a URL (legacy)

  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(value);
  return data.publicUrl;
}

export default async function MyPageDesignPage() {
  const t = await getTranslations("designForm");
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

  // Generate public URLs for gallery images
  const galleryWithUrls = (galleryResult.data ?? []).map((image) => ({
    ...image,
    display_url: getImageUrl(supabase, image.image_url),
  }));

  // Generate public URLs for product images
  const productsWithUrls = (productsResult.data ?? []).map((product) => ({
    ...product,
    display_url: getImageUrl(supabase, product.image_url),
  }));

  // Generate public URLs for logo and cover
  const logoUrl = getImageUrl(supabase, merchant.logo_url);
  const coverUrl = getImageUrl(supabase, merchant.cover_image_url);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">{t("title")}</h2>
        <p className="text-sm text-gray-600">{t("subtitle")}</p>
      </div>

      <DesignForm
        merchantId={user.id}
        theme={theme}
        slug={merchant.slug}
        gallery={galleryWithUrls}
        products={productsWithUrls}
        logoUrl={logoUrl}
        coverUrl={coverUrl}
      />
    </div>
  );
}
