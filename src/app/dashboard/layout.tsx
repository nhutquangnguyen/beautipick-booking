import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { getSignedImageUrl } from "@/lib/wasabi";

// Helper to get signed URL if value is a key (not already a URL)
async function getImageUrl(value: string | null): Promise<string | null> {
  if (!value) return null;
  if (value.startsWith("http")) return value; // Already a URL (legacy)
  return getSignedImageUrl(value, 3600); // Generate signed URL for key
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: merchant } = await supabase
    .from("merchants")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!merchant) {
    redirect("/login");
  }

  // Generate signed URL for merchant logo
  const logoUrl = await getImageUrl(merchant.logo_url);
  const merchantWithSignedUrl = {
    ...merchant,
    logo_url: logoUrl,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSidebar merchant={merchantWithSignedUrl} />
      {/* Main content area - offset by sidebar width on desktop */}
      <main className="lg:pl-64">
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
