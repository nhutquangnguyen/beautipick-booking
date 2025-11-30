import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import { StaffList } from "@/components/dashboard/staff/staff-list";
import { StaffForm } from "@/components/dashboard/staff/staff-form";

export default async function StaffPage() {
  const t = await getTranslations("staffForm");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: staff } = await supabase
    .from("staff")
    .select("*, staff_services(service_id)")
    .eq("merchant_id", user!.id)
    .order("created_at", { ascending: true });

  const { data: services } = await supabase
    .from("services")
    .select("id, name")
    .eq("merchant_id", user!.id)
    .eq("is_active", true);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
          <p className="text-gray-600">{t("subtitle")}</p>
        </div>
        <StaffForm merchantId={user!.id} services={services ?? []} />
      </div>

      <StaffList staff={staff ?? []} services={services ?? []} />
    </div>
  );
}
