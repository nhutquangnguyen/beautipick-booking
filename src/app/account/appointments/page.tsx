import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AppointmentsList } from "@/components/account/AppointmentsList";

export default async function AppointmentsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get customer account details
  const { data: customerAccount } = await supabase
    .from("customer_accounts")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!customerAccount) {
    redirect("/");
  }

  // Get customer's bookings - match by customer_id, email, OR phone
  // Build the OR condition dynamically based on what data we have
  const conditions = [`customer_id.eq.${user.id}`];

  if (customerAccount.email) {
    conditions.push(`customer_email.eq.${customerAccount.email}`);
  }

  if (customerAccount.phone) {
    conditions.push(`customer_phone.eq.${customerAccount.phone}`);
  }

  const { data: bookings, error: bookingsError } = await supabase
    .from("bookings")
    .select(
      `
      *,
      merchants (
        business_name,
        slug,
        logo_url,
        currency,
        phone,
        address
      )
    `
    )
    .or(conditions.join(','))
    .order("created_at", { ascending: false });

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Các cuộc hẹn</h2>
        <p className="text-gray-600 mt-1">Quản lý tất cả các cuộc hẹn của bạn</p>
      </div>

      {bookingsError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-800 font-semibold">Error loading bookings:</p>
          <p className="text-red-600 text-sm">{bookingsError.message}</p>
        </div>
      )}

      <AppointmentsList bookings={bookings || []} />
    </div>
  );
}
