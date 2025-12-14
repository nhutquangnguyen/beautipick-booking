import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AccountSidebar } from "@/components/account/AccountSidebar";
import { PublicHeader } from "@/components/PublicHeader";

export default async function AccountLayout({
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

  // Check if user is a customer
  const { data: customerAccount } = await supabase
    .from("customer_accounts")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (!customerAccount) {
    // If no customer account, redirect to home
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Common Header */}
      <PublicHeader showSearch={true} />

      {/* Page Title */}
      <div className="bg-white border-b border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Tài khoản của tôi</h1>
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-3">
            <AccountSidebar customer={customerAccount} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
