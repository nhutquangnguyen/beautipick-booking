import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProductsManager } from "@/components/dashboard/products/products-manager";
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

export default async function SettingsProductsPage() {
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

  // Generate signed URLs for product images
  const productsWithSignedUrls = await Promise.all(
    (products ?? []).map(async (product) => ({
      ...product,
      display_url: await getImageUrl(product.image_url),
    }))
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Products</h2>
        <p className="text-sm text-gray-600">Sell products alongside your services</p>
      </div>

      <ProductsManager merchantId={user.id} products={productsWithSignedUrls} />
    </div>
  );
}
