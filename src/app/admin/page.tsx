import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server-admin";
import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export default async function AdminPage() {
  // Check authentication
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Use admin client to check if user is admin (bypasses RLS)
  const adminClient = createAdminClient();

  const { data: adminRecord } = await adminClient
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .single();

  if (!adminRecord) {
    redirect("/dashboard");
  }

  // Fetch all merchants with their statistics using admin client
  const { data: merchants } = await adminClient
    .from("merchants")
    .select(`
      id,
      email,
      business_name,
      slug,
      phone,
      created_at,
      is_active,
      custom_domain
    `)
    .order("created_at", { ascending: false });

  // Fetch statistics for each merchant using admin client
  const merchantsWithStats = await Promise.all(
    (merchants || []).map(async (merchant: NonNullable<typeof merchants>[number]) => {
      const [bookings, customers, services, staff, settings] = await Promise.all([
        adminClient
          .from("bookings")
          .select("id, total_price", { count: "exact" })
          .eq("merchant_id", merchant.id),
        adminClient
          .from("customers")
          .select("id", { count: "exact" })
          .eq("merchant_id", merchant.id),
        adminClient
          .from("services")
          .select("id", { count: "exact" })
          .eq("merchant_id", merchant.id),
        adminClient
          .from("staff")
          .select("id", { count: "exact" })
          .eq("merchant_id", merchant.id),
        adminClient
          .from("merchants")
          .select("settings")
          .eq("id", merchant.id)
          .single(),
      ]);

      // Count gallery images from settings
      const gallery = (settings.data?.settings as any)?.gallery || [];
      const galleryCount = Array.isArray(gallery) ? gallery.length : 0;

      // Calculate total revenue
      const totalRevenue = bookings.data?.reduce(
        (sum, booking) => sum + (booking.total_price || 0),
        0
      ) || 0;

      return {
        ...merchant,
        total_bookings: bookings.count || 0,
        total_customers: customers.count || 0,
        total_services: services.count || 0,
        total_staff: staff.count || 0,
        total_gallery_images: galleryCount,
        total_revenue: totalRevenue,
      };
    })
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminDashboard merchants={merchantsWithStats} />
    </div>
  );
}
