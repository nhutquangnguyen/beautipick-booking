import { createClient } from "@/lib/supabase/server";
import { AvailabilityForm } from "@/components/dashboard/availability/availability-form";

export default async function AvailabilityPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: availability } = await supabase
    .from("availability")
    .select("*")
    .eq("merchant_id", user!.id)
    .is("staff_id", null)
    .order("day_of_week", { ascending: true });

  const { data: staff } = await supabase
    .from("staff")
    .select("id, name")
    .eq("merchant_id", user!.id)
    .eq("is_active", true);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Availability</h1>
        <p className="text-gray-600">Set your business hours and staff schedules</p>
      </div>

      <AvailabilityForm
        merchantId={user!.id}
        availability={availability ?? []}
        staff={staff ?? []}
      />
    </div>
  );
}
