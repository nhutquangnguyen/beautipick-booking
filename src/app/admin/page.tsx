import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server-admin";
import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

// Force dynamic rendering (no caching)
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface MerchantData {
  id: string;
  email: string;
  business_name: string;
  slug: string;
  phone: string | null;
  created_at: string;
  is_active: boolean;
  custom_domain: string | null;
  merchant_subscriptions?: Array<{
    id: string;
    status: string;
    subscription_started_at: string;
    expires_at: string | null;
    notes: string | null;
    pricing_tiers: Array<{
      tier_key: string;
      tier_name: string;
      tier_name_vi: string;
    }> | {
      tier_key: string;
      tier_name: string;
      tier_name_vi: string;
    };
  }>;
  subscription_usage?: Array<{
    services_count: number;
    products_count: number;
    gallery_images_count: number;
  }>;
}

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

  // Fetch all merchants with their statistics and subscriptions using admin client
  const { data: merchants, error: merchantsFetchError } = await adminClient
    .from("merchants")
    .select(`
      id,
      email,
      business_name,
      slug,
      phone,
      created_at,
      is_active,
      custom_domain,
      merchant_subscriptions (
        id,
        status,
        subscription_started_at,
        expires_at,
        notes,
        pricing_tiers (
          tier_key,
          tier_name,
          tier_name_vi
        )
      ),
      subscription_usage (
        services_count,
        products_count,
        gallery_images_count
      )
    `)
    .order("created_at", { ascending: false });

  if (merchantsFetchError) {
    console.error("Error fetching merchants:", merchantsFetchError);
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Merchants</h1>
          <p className="text-gray-700">{merchantsFetchError.message}</p>
          <pre className="mt-4 p-4 bg-gray-100 rounded text-sm overflow-auto">
            {JSON.stringify(merchantsFetchError, null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  if (!merchants || merchants.length === 0) {
    console.log("No merchants found");
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Merchants Found</h1>
          <p className="text-gray-600">There are no merchants in the system yet.</p>
        </div>
      </div>
    );
  }

  console.log(`Fetched ${merchants.length} merchants`);

  // Fetch statistics for each merchant using admin client
  const merchantsWithStats = await Promise.all(
    (merchants as MerchantData[] || []).map(async (merchant: MerchantData) => {
      const [bookings, customers, services, products, staff, gallery] = await Promise.all([
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
          .from("products")
          .select("id", { count: "exact" })
          .eq("merchant_id", merchant.id),
        adminClient
          .from("staff")
          .select("id", { count: "exact" })
          .eq("merchant_id", merchant.id),
        adminClient
          .from("gallery")
          .select("id", { count: "exact" })
          .eq("merchant_id", merchant.id),
      ]) as any[];

      // Count gallery images from gallery table
      const galleryCount = gallery.count || 0;

      // Calculate total revenue
      const totalRevenue = bookings.data?.reduce(
        (sum: number, booking: any) => sum + (booking.total_price || 0),
        0
      ) || 0;

      return {
        ...merchant,
        total_bookings: bookings.count || 0,
        total_customers: customers.count || 0,
        total_services: services.count || 0,
        total_products: products.count || 0,
        total_staff: staff.count || 0,
        total_gallery_images: galleryCount,
        total_revenue: totalRevenue,
        merchant_subscriptions: merchant.merchant_subscriptions,
        subscription_usage: merchant.subscription_usage,
      };
    })
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminDashboard merchants={merchantsWithStats} />
    </div>
  );
}
