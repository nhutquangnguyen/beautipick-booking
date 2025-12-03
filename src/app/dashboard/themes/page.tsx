import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DesignForm } from "@/components/dashboard/design/design-form";
import { MerchantTheme, defaultTheme } from "@/types/database";

export default async function MyPageThemesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: merchant } = await supabase
    .from("merchants")
    .select("theme")
    .eq("id", user.id)
    .single();

  if (!merchant) redirect("/login");

  const theme = (merchant.theme as MerchantTheme) ?? defaultTheme;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Themes</h2>
        <p className="text-sm text-gray-600">
          Choose a professional theme for your booking page
        </p>
      </div>

      <DesignForm merchantId={user.id} theme={theme} />
    </div>
  );
}
