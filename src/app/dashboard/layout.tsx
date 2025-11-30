import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardSidebar } from "@/components/dashboard/sidebar";

const BUCKET_NAME = "images";

// Helper to get public URL if value is a storage path (not already a URL)
function getImageUrl(supabase: Awaited<ReturnType<typeof createClient>>, value: string | null): string | null {
  if (!value) return null;
  if (value.startsWith("http")) return value; // Already a URL (legacy)

  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(value);
  return data.publicUrl;
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

  // Generate public URL for merchant logo
  const logoUrl = getImageUrl(supabase, merchant.logo_url);
  const merchantWithUrl = {
    ...merchant,
    logo_url: logoUrl,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSidebar merchant={merchantWithUrl} />
      {/* Main content area - offset by sidebar width on desktop */}
      <main className="lg:pl-64">
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
