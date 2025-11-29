import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DesignForm } from "@/components/dashboard/design/design-form";
import { MerchantTheme, defaultTheme } from "@/types/database";

export default async function DesignPage() {
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
  const theme = (merchant?.theme as MerchantTheme) ?? defaultTheme;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Design</h1>
        <p className="text-gray-600">Customize the look of your booking page</p>
      </div>

      <DesignForm
        merchantId={user.id}
        theme={theme}
        slug={merchant?.slug ?? ""}
        gallery={galleryResult.data ?? []}
        products={productsResult.data ?? []}
      />
    </div>
  );
}
