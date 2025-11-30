import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ContactLocationForm } from "@/components/dashboard/settings/contact-location-form";

export default async function SettingsContactPage() {
  const t = await getTranslations("settingsPages.contact");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: merchant } = await supabase
    .from("merchants")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!merchant) redirect("/login");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">{t("title")}</h2>
        <p className="text-sm text-gray-600">{t("subtitle")}</p>
      </div>

      <ContactLocationForm merchant={merchant} />
    </div>
  );
}
