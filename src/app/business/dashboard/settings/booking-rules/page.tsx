import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { BookingRulesForm } from "@/components/dashboard/bookings/booking-rules-form";
import { MerchantSettings, defaultSettings } from "@/types/database";

export default async function BookingRulesPage() {
  const t = await getTranslations("settingsPages.bookingRules");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: merchant } = await supabase
    .from("merchants")
    .select("settings")
    .eq("id", user.id)
    .single();

  const settings = (merchant?.settings as MerchantSettings) ?? defaultSettings;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">{t("title")}</h2>
        <p className="text-sm text-gray-600">{t("subtitle")}</p>
      </div>

      <BookingRulesForm merchantId={user.id} settings={settings} />
    </div>
  );
}
