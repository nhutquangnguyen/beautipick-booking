import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import { BookingsView } from "@/components/dashboard/bookings/bookings-view";

interface BookingsPageProps {
  searchParams: Promise<{ customer?: string }>;
}

export default async function BookingsPage({ searchParams }: BookingsPageProps) {
  const t = await getTranslations("bookings");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const params = await searchParams;
  const customerPhone = params.customer;

  // Build query
  let query = supabase
    .from("bookings")
    .select("*, services(name), staff(name), customers(name, phone)")
    .eq("merchant_id", user!.id);

  // Filter by customer phone if provided
  if (customerPhone) {
    query = query.eq("customer_phone", customerPhone);
  }

  const { data: bookings } = await query
    .order("booking_date", { ascending: false, nullsFirst: false })
    .order("start_time", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
        <p className="text-gray-600">{t("subtitle")}</p>
      </div>

      <BookingsView bookings={bookings ?? []} customerFilter={customerPhone} />
    </div>
  );
}
