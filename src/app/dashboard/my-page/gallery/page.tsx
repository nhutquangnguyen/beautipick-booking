import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { GalleryManager } from "@/components/dashboard/gallery/gallery-manager";

const BUCKET_NAME = "images";

// Helper to get public URL if value is a storage path (not already a URL)
function getImageUrl(supabase: Awaited<ReturnType<typeof createClient>>, value: string | null): string | null {
  if (!value) return null;
  if (value.startsWith("http")) return value; // Already a URL (legacy)

  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(value);
  return data.publicUrl;
}

export default async function MyPageGalleryPage() {
  const t = await getTranslations("galleryForm");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: gallery } = await supabase
    .from("gallery")
    .select("*")
    .eq("merchant_id", user.id)
    .order("display_order", { ascending: true });

  // Generate public URLs for gallery images
  const galleryWithUrls = (gallery ?? []).map((image) => ({
    ...image,
    display_url: getImageUrl(supabase, image.image_url),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">{t("title")}</h2>
        <p className="text-sm text-gray-600">{t("subtitle")}</p>
      </div>

      <GalleryManager merchantId={user.id} images={galleryWithUrls} />
    </div>
  );
}
