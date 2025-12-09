import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server-admin";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { getTranslations } from "next-intl/server";

const BUCKET_NAME = "images";

// Helper to get public URL if value is a storage path (not already a URL)
function getImageUrl(value: string | null): string | null {
  if (!value) return null;
  if (value.startsWith("http")) return value; // Already a URL (legacy)

  const supabase = createAdminClient();
  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(value);
  return data.publicUrl;
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check authentication using anon client
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch merchant data using admin client (bypasses RLS)
  const adminClient = createAdminClient();
  const { data: merchant, error: merchantError } = await (adminClient as any)
    .from("merchants")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  // If no merchant profile exists, there might be a race condition from OAuth signup
  // Log the error and redirect to a signup completion page
  if (!merchant) {
    console.error('[Dashboard Layout] No merchant profile found for authenticated user:', user.id);
    console.error('[Dashboard Layout] Error:', merchantError?.message);

    // User is authenticated but has no merchant profile
    // This shouldn't happen in normal flow, redirect to login with error
    redirect("/login?error=no_profile");
  }

  // Generate public URL for merchant logo
  const logoUrl = getImageUrl(merchant.logo_url);
  const merchantWithUrl = {
    ...merchant,
    logo_url: logoUrl,
  };

  // Get translations for sidebar
  const t = await getTranslations("nav");
  const translations = {
    home: t("home"),
    orders: t("orders"),
    settings: t("settings"),
    admin: t("admin"),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSidebar merchant={merchantWithUrl} translations={translations} />
      {/* Main content area - offset by sidebar width on desktop, padding bottom for mobile nav */}
      <main className="lg:pl-64 pb-24 lg:pb-0">
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
