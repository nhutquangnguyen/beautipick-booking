import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { GalleryManager } from "@/components/dashboard/gallery/gallery-manager";
import { getSignedImageUrl } from "@/lib/wasabi";

// Helper to get signed URL if value is a key (not already a URL)
async function getImageUrl(value: string | null): Promise<string | null> {
  if (!value) return null;
  if (value.startsWith("http")) return value; // Already a URL (legacy)
  return getSignedImageUrl(value, 3600); // Generate signed URL for key
}

export default async function SettingsGalleryPage() {
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

  // Generate signed URLs for gallery images
  const galleryWithSignedUrls = await Promise.all(
    (gallery ?? []).map(async (image) => ({
      ...image,
      display_url: await getImageUrl(image.image_url),
    }))
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Gallery</h2>
        <p className="text-sm text-gray-600">Showcase your work to attract customers</p>
      </div>

      <GalleryManager merchantId={user.id} images={galleryWithSignedUrls} />
    </div>
  );
}
