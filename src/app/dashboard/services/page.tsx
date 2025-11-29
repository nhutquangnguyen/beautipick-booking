import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Plus, Scissors } from "lucide-react";
import { SimpleServiceList } from "@/components/dashboard/services/simple-service-list";
import { AddServiceModal } from "@/components/dashboard/services/add-service-modal";

export default async function ServicesPage() {
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
          <h1 className="text-2xl font-bold text-gray-900">Services</h1>
          <p className="text-gray-600">Add the services you offer to customers</p>
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
          <h3 className="mt-4 text-lg font-medium text-gray-900">No services yet</h3>
          <p className="mt-2 text-gray-500">
            Add your first service to start accepting bookings
          </p>
          <AddServiceModal merchantId={user.id} isEmptyState />
        </div>
      )}

      {/* Tips */}
      <div className="rounded-xl bg-blue-50 p-4">
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> Add all the services you offer with accurate prices and durations.
          This helps customers know exactly what to expect when booking.
        </p>
      </div>
    </div>
  );
}
