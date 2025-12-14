import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CustomerDashboard } from "@/components/customer/CustomerDashboard";

export default async function CustomerDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  // Check if user is a customer
  const { data: userType } = await supabase
    .from("user_types")
    .select("user_type")
    .eq("user_id", user.id)
    .single();

  // If user is a merchant, redirect to merchant dashboard
  if (userType?.user_type === "merchant") {
    redirect("/business/dashboard");
  }

  // Get customer account details
  const { data: customerAccount } = await supabase
    .from("customer_accounts")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!customerAccount) {
    // If no customer account found, redirect to home
    redirect("/");
  }

  // Get customer's bookings
  const { data: bookings } = await supabase
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
    .or(`customer_id.eq.${user.id},customer_email.eq.${customerAccount.email}`)
    .order("created_at", { ascending: false });

  return (
    <CustomerDashboard
      customer={customerAccount}
      bookings={bookings || []}
    />
  );
}
