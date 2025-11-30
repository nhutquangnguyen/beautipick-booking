import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import { BookingsView } from "@/components/dashboard/bookings/bookings-view";

export default async function BookingsPage() {
  const t = await getTranslations("bookings");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: bookings } = await supabase
    .from("bookings")
    .select("*, services(name), staff(name)")
    .eq("merchant_id", user!.id)
    .order("booking_date", { ascending: false, nullsFirst: false })
    .order("start_time", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
        <p className="text-gray-600">{t("subtitle")}</p>
      </div>

      <BookingsView bookings={bookings ?? []} />
    </div>
  );
}
