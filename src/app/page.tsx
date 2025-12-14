import { createClient } from "@/lib/supabase/server";
import { MerchantCard } from "@/components/directory/MerchantCard";
import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";
import { Search, MapPin, Sparkles } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DirectoryHomepage() {
  const supabase = await createClient();

  // Check if logged-in user is a merchant-only (no customer account), redirect to dashboard
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    // Check if user has a customer account
    const { data: customerAccount, error: customerError } = await supabase
      .from("customer_accounts")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (customerError) {
      console.error('[HomePage] Error querying customer account:', customerError);
    }

    // Only redirect to dashboard if they DON'T have a customer account
    // If they have both merchant and customer accounts, let them browse as customer
    if (!customerAccount) {
      // No customer account, check if they're a merchant
      const { data: merchantAccount } = await supabase
        .from("merchants")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

      if (merchantAccount) {
        // Merchant-only user, redirect to dashboard
        redirect("/business/dashboard");
      }
    }
  }

  // For now, just show all merchants (no featured section yet)
  // You can add a "is_featured" boolean to merchants table later if needed

  // Fetch all active merchants that are visible in directory
  const { data: allMerchants } = await supabase
    .from("merchants")
    .select(`
      id,
      business_name,
      slug,
      logo_url,
      city,
      description
    `)
    .eq("is_active", true)
    .eq("show_in_directory", true)
    .order("business_name")
    .limit(24);

  // Get cities for quick filter from merchants visible in directory
  const { data: cities } = await supabase
    .from("merchants")
    .select("city")
    .eq("is_active", true)
    .eq("show_in_directory", true)
    .not("city", "is", null);

  const uniqueCities = Array.from(new Set(cities?.map((m) => m.city).filter(Boolean)));

  return (
    <>
      <PublicHeader />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
      <section id="hero" className="bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 text-white py-20 pt-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Tìm salon làm đẹp<br />
              <span className="text-pink-200">hoàn hảo cho bạn</span>
            </h1>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Khám phá hàng trăm salon uy tín, đặt lịch dễ dàng trong vài giây
            </p>

            {/* Quick Search */}
            <div id="hero-search" className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-2 flex flex-col sm:flex-row gap-2">
              <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                <Search className="h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm theo tên salon, dịch vụ..."
                  className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400"
                />
              </div>
              <Link
                href="/search"
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:opacity-90 transition text-center"
              >
                Tìm kiếm
              </Link>
            </div>

            {/* Quick City Filters */}
            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              {uniqueCities.slice(0, 6).map((city) => (
                <Link
                  key={city}
                  href={`/search?city=${encodeURIComponent(city!)}`}
                  className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm hover:bg-white/20 transition flex items-center gap-2"
                >
                  <MapPin className="h-4 w-4" />
                  {city}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* All Merchants */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Tất cả salon
            </h2>
            <Link
              href="/search"
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              Xem tất cả →
            </Link>
          </div>

          {allMerchants && allMerchants.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {allMerchants.map((merchant: any) => (
                <MerchantCard
                  key={merchant.id}
                  merchantId={merchant.id}
                  slug={merchant.slug}
                  businessName={merchant.business_name}
                  logoUrl={merchant.logo_url}
                  city={merchant.city}
                  district={null}
                  description={merchant.description}
                  tags={[]}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Chưa có salon nào. Hãy quay lại sau!
            </div>
          )}
        </div>
      </section>

      {/* CTA for Merchants */}
      <section className="py-20 bg-gradient-to-br from-purple-600 to-pink-600 text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Bạn là chủ salon?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Tham gia BeautiPick để tiếp cận hàng ngàn khách hàng tiềm năng
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/business"
              className="px-8 py-4 bg-white text-purple-600 rounded-xl font-semibold hover:bg-gray-100 transition"
            >
              Tìm hiểu thêm
            </Link>
            <Link
              href="/signup"
              className="px-8 py-4 bg-purple-700/50 backdrop-blur-sm rounded-xl font-semibold hover:bg-purple-700/70 transition"
            >
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </section>
      </div>
      <PublicFooter />
    </>
  );
}
