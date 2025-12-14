import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { FavoritesList } from "@/components/account/FavoritesList";

export default async function FavoritesPage() {
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

  // Get customer's favorite merchants
  const { data: favorites } = await supabase
    .from("favorites")
    .select(
      `
      id,
      merchant_id,
      merchants (
        id,
        business_name,
        slug,
        logo_url,
        address,
        phone,
        description
      )
    `
    )
    .eq("customer_id", user.id)
    .order("created_at", { ascending: false });

  // Extract merchants from favorites (merchants is a single object, not an array)
  const favoriteMerchants = favorites
    ? favorites
        .filter((f: any) => f.merchants)
        .map((f: any) => f.merchants as any)
    : [];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Mục yêu thích</h2>
        <p className="text-gray-600 mt-1">Các salon yêu thích của bạn</p>
      </div>

      <FavoritesList merchants={favoriteMerchants} />
    </div>
  );
}
