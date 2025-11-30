import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { AvailabilityForm } from "@/components/dashboard/availability/availability-form";

export default async function HoursPage() {
  const t = await getTranslations("settingsPages.hours");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: availability } = await supabase
    .from("availability")
    .select("*")
    .eq("merchant_id", user.id)
    .is("staff_id", null)
    .order("day_of_week", { ascending: true });

  const { data: staff } = await supabase
    .from("staff")
    .select("id, name")
    .eq("merchant_id", user.id)
    .eq("is_active", true);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">{t("title")}</h2>
        <p className="text-sm text-gray-600">{t("subtitle")}</p>
      </div>

      <AvailabilityForm
        merchantId={user.id}
        availability={availability ?? []}
        staff={staff ?? []}
      />
    </div>
  );
}
