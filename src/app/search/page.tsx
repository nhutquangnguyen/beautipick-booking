import { createClient } from "@/lib/supabase/server";
import { MerchantCard } from "@/components/directory/MerchantCard";
import { PublicHeader } from "@/components/PublicHeader";
import { PublicFooter } from "@/components/PublicFooter";
import { SearchFilters } from "@/components/directory/SearchFilters";
import { Search } from "lucide-react";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

interface SearchPageProps {
  searchParams: {
    q?: string;
    city?: string;
    tag?: string;
    sort?: string;
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const supabase = await createClient();

  // Check if logged-in user is a merchant-only (no customer account), redirect to dashboard
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    // Check if user has a customer account
    const { data: customerAccount } = await supabase
      .from("customer_accounts")
      .select("id")
      .eq("id", user.id)
      .single();

    // Only redirect to dashboard if they DON'T have a customer account
    // If they have both merchant and customer accounts, let them browse as customer
    if (!customerAccount) {
      // No customer account, check if they're a merchant
      const { data: merchantAccount } = await supabase
        .from("merchants")
        .select("id")
        .eq("id", user.id)
        .single();

      if (merchantAccount) {
        // Merchant-only user, redirect to dashboard
        redirect("/business/dashboard");
      }
    }
  }

  const query = searchParams.q || "";
  const city = searchParams.city || "";
  const tag = searchParams.tag || "";
  const sort = searchParams.sort || "name";

  // Build query - only show active merchants visible in directory
  let merchantsQuery = supabase
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
    .eq("show_in_directory", true);

  // Apply filters
  if (query) {
    merchantsQuery = merchantsQuery.ilike("business_name", `%${query}%`);
  }

  if (city) {
    merchantsQuery = merchantsQuery.eq("city", city);
  }

  // Apply sorting
  switch (sort) {
    case "name":
      merchantsQuery = merchantsQuery.order("business_name");
      break;
    case "newest":
      merchantsQuery = merchantsQuery.order("created_at", { ascending: false });
      break;
    default:
      merchantsQuery = merchantsQuery.order("business_name");
  }

  const { data: merchants } = await merchantsQuery.limit(48);

  // Get unique cities for filter from directory-visible merchants
  const { data: cities } = await supabase
    .from("merchants")
    .select("city")
    .eq("is_active", true)
    .eq("show_in_directory", true)
    .not("city", "is", null);

  const uniqueCities = Array.from(new Set(cities?.map((m) => m.city).filter(Boolean))).sort();

  // Get popular tags
  const popularTags = ["Nails", "Spa", "Massage", "Hair", "Makeup", "Waxing"];

  return (
    <>
      <PublicHeader showSearch={true} />
      <div className="min-h-screen bg-gray-50 mt-16">
        {/* Search Header */}
        <section className="bg-gradient-to-br from-purple-600 to-pink-600 text-white py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">
              Tìm salon làm đẹp
            </h1>

            {/* Search Bar */}
            <form action="/search" method="get" className="max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl shadow-2xl p-2 flex gap-2">
                <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                  <Search className="h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="q"
                    defaultValue={query}
                    placeholder="Tìm theo tên salon..."
                    className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400"
                  />
                </div>
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:opacity-90 transition"
                >
                  Tìm
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Filters & Results */}
        <section className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-4 lg:gap-8">
              {/* Sidebar Filters */}
              <aside className="hidden lg:block">
                <SearchFilters
                  cities={uniqueCities as string[]}
                  tags={popularTags}
                  selectedCity={city}
                  selectedTag={tag}
                  selectedSort={sort}
                />
              </aside>

              {/* Results */}
              <div className="lg:col-span-3">
                {/* Results Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {merchants && merchants.length > 0
                        ? `${merchants.length} salon`
                        : "Không tìm thấy salon nào"}
                    </h2>
                    {query && (
                      <p className="text-gray-600 mt-1">
                        Kết quả cho "{query}"
                      </p>
                    )}
                  </div>

                  {/* Mobile Filter Toggle */}
                  <button className="lg:hidden px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium">
                    Bộ lọc
                  </button>
                </div>

                {/* Results Grid */}
                {merchants && merchants.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {merchants.map((merchant: any) => (
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
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <Search className="h-16 w-16 mx-auto" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Không tìm thấy kết quả
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc
                    </p>
                    <a
                      href="/search"
                      className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                    >
                      Xóa bộ lọc
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
      <PublicFooter />
    </>
  );
}
