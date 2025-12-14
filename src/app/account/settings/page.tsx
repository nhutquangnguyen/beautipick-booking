import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SettingsForm } from "@/components/account/SettingsForm";

export default async function SettingsPage() {
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
        <h2 className="text-2xl font-bold text-gray-900">Cài đặt</h2>
        <p className="text-gray-600 mt-1">Quản lý cài đặt tài khoản và tùy chọn của bạn</p>
      </div>

      <SettingsForm customer={customerAccount} user={user} />
    </div>
  );
}
