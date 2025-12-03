import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CombinedBusinessInfoForm } from "@/components/dashboard/business-info/combined-business-info-form";

export default async function BusinessInfoPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: merchant } = await supabase
    .from("merchants")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!merchant) redirect("/login");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Business Information</h2>
        <p className="text-sm text-gray-600">
          Manage your logo, cover image, business details, contact information, and location
        </p>
      </div>

      <CombinedBusinessInfoForm merchant={merchant} />
    </div>
  );
}
