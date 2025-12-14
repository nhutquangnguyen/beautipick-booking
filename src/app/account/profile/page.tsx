import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/account/ProfileForm";

export default async function ProfilePage() {
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

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Hồ sơ của tôi</h2>
        <p className="text-gray-600 mt-1">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
      </div>

      <ProfileForm customer={customerAccount} />
    </div>
  );
}
