import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Scissors } from "lucide-react";
import { SimpleServiceList } from "@/components/dashboard/services/simple-service-list";
import { AddServiceModal } from "@/components/dashboard/services/add-service-modal";

export default async function ServicesPage() {
  const t = await getTranslations("servicesForm");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("merchant_id", user.id)
    .order("display_order", { ascending: true });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
          <p className="text-gray-600">{t("subtitle")}</p>
        </div>
        <AddServiceModal merchantId={user.id} />
      </div>

      {/* Services List */}
      {services && services.length > 0 ? (
        <SimpleServiceList services={services} />
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
            <Scissors className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">{t("noServices")}</h3>
          <p className="mt-2 text-gray-500">
            {t("noServicesDesc")}
          </p>
          <AddServiceModal merchantId={user.id} isEmptyState />
        </div>
      )}
    </div>
  );
}
