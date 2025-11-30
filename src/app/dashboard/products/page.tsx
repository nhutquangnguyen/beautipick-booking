import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ProductsManager } from "@/components/dashboard/products/products-manager";

const BUCKET_NAME = "images";

// Helper to get public URL if value is a storage path (not already a URL)
function getImageUrl(supabase: Awaited<ReturnType<typeof createClient>>, value: string | null): string | null {
  if (!value) return null;
  if (value.startsWith("http")) return value; // Already a URL (legacy)

  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(value);
  return data.publicUrl;
}

export default async function ProductsPage() {
  const t = await getTranslations("productsForm");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("merchant_id", user.id)
    .order("created_at", { ascending: false });

  // Generate public URLs for product images
  const productsWithUrls = (products ?? []).map((product) => ({
    ...product,
    display_url: getImageUrl(supabase, product.image_url),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">{t("title")}</h2>
        <p className="text-sm text-gray-600">{t("subtitle")}</p>
      </div>

      <ProductsManager merchantId={user.id} products={productsWithUrls} />
    </div>
  );
}
