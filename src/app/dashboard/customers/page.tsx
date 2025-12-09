import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import { CustomersView } from "@/components/dashboard/customers/customers-view";

export default async function CustomersPage() {
  const t = await getTranslations("customers");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch merchant currency
  const { data: merchant } = await supabase
    .from("merchants")
    .select("currency")
    .eq("id", user!.id)
    .single();

  // Fetch customers from the dedicated customers table
  const { data: customers } = await supabase
    .from("customers")
    .select("*")
    .eq("merchant_id", user!.id)
    .eq("is_active", true)
    .order("last_booking_date", { ascending: false, nullsFirst: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
        <p className="text-gray-600">{t("subtitle")}</p>
      </div>

      <CustomersView customers={customers || []} currency={merchant?.currency || "VND"} />
    </div>
  );
}
