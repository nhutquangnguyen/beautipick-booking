import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { QRCodeGenerator } from "@/components/dashboard/design/qr-code-generator";

const BUCKET_NAME = "images";

// Helper to get public URL if value is a storage path (not already a URL)
function getImageUrl(supabase: Awaited<ReturnType<typeof createClient>>, value: string | null): string | null {
  if (!value) return null;
  if (value.startsWith("http")) return value; // Already a URL (legacy)

  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(value);
  return data.publicUrl;
}

export default async function MyPageQRCodePage() {
  const t = await getTranslations("myPage.qrCode");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: merchant } = await supabase
    .from("merchants")
    .select("slug, business_name, logo_url")
    .eq("id", user.id)
    .single();

  if (!merchant) redirect("/login");

  const bookingPageUrl = `${process.env.NEXT_PUBLIC_APP_URL || ""}/${merchant.slug}`;
  const logoUrl = getImageUrl(supabase, merchant.logo_url);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">{t("title")}</h2>
        <p className="text-sm text-gray-600">{t("subtitle")}</p>
      </div>

      <QRCodeGenerator
        url={bookingPageUrl}
        businessName={merchant.business_name}
        logoUrl={logoUrl}
      />
    </div>
  );
}
