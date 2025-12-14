import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { CombinedBusinessInfoForm } from "@/components/dashboard/business-info/combined-business-info-form";

export default async function BusinessInfoPage() {
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

  const t = await getTranslations("businessForm");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">{t("title")}</h2>
        <p className="text-sm text-gray-600">
          {t("pageSubtitle")}
        </p>
      </div>

      <CombinedBusinessInfoForm merchant={merchant} />
    </div>
  );
}
