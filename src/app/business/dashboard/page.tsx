import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  Calendar,
  Plus,
  Scissors,
  Users,
  Clock,
  TrendingUp,
  CheckCircle2,
  Package,
  Image,
  Store,
  ExternalLink,
  ShoppingBag,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { RevenueAnalytics } from "@/components/dashboard/revenue-analytics";

export default async function DashboardPage() {
  const t = await getTranslations("dashboard");
  const tNav = await getTranslations("nav");
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

  // Check if onboarding needed
  const [servicesCheckResult, availabilityResult] = await Promise.all([
    supabase.from("services").select("id").eq("merchant_id", user.id).limit(1),
    supabase.from("availability").select("id").eq("merchant_id", user.id).limit(1),
  ]);

  const hasServices = (servicesCheckResult.data?.length ?? 0) > 0;
  const hasAvailability = (availabilityResult.data?.length ?? 0) > 0;

  // If no services or availability, redirect to onboarding
  if (!hasServices || !hasAvailability) {
    redirect("/business/dashboard/onboarding");
  }

  // Get stats
  const today = new Date().toISOString().split("T")[0];
  const now = new Date();

  // Calculate start of this week (Monday) and this month
  const dayOfWeek = now.getDay();
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() + diff);
  startOfWeek.setHours(0, 0, 0, 0);
  const startOfWeekStr = startOfWeek.toISOString().split("T")[0];

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfMonthStr = startOfMonth.toISOString().split("T")[0];

  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
  const startOfLastMonthStr = startOfLastMonth.toISOString().split("T")[0];
  const endOfLastMonthStr = endOfLastMonth.toISOString().split("T")[0];

  // Calculate date for 90 days ago (to support all time period options)
  const ninetyDaysAgo = new Date(now);
  ninetyDaysAgo.setDate(now.getDate() - 90);
  const ninetyDaysAgoStr = ninetyDaysAgo.toISOString().split("T")[0];

  const [
    todayBookingsResult,
    pendingBookingsResult,
    recentBookingsResult,
    todayRevenueResult,
    thisMonthRevenueResult,
    thisMonthBookingsResult,
    lastMonthRevenueResult,
    servicesResult,
    productsResult,
    last90DaysBookingsResult,
  ] = await Promise.all([
    supabase
      .from("bookings")
      .select("*", { count: "exact" })
      .eq("merchant_id", user.id)
      .eq("booking_date", today)
      .in("status", ["confirmed", "pending"]),
    supabase
      .from("bookings")
      .select("*", { count: "exact" })
      .eq("merchant_id", user.id)
      .eq("status", "pending"),
    supabase
      .from("bookings")
      .select("*, services(name)")
      .eq("merchant_id", user.id)
      .order("created_at", { ascending: false})
      .limit(10),
    supabase
      .from("bookings")
      .select("total_price")
      .eq("merchant_id", user.id)
      .eq("booking_date", today)
      .eq("status", "completed"),
    supabase
      .from("bookings")
      .select("total_price")
      .eq("merchant_id", user.id)
      .gte("booking_date", startOfMonthStr)
      .eq("status", "completed"),
    supabase
      .from("bookings")
      .select("*", { count: "exact" })
      .eq("merchant_id", user.id)
      .gte("booking_date", startOfMonthStr),
    supabase
      .from("bookings")
      .select("total_price")
      .eq("merchant_id", user.id)
      .gte("booking_date", startOfLastMonthStr)
      .lte("booking_date", endOfLastMonthStr)
      .eq("status", "completed"),
    supabase
      .from("services")
      .select("id, name, price, image_url")
      .eq("merchant_id", user.id)
      .eq("is_active", true),
    supabase
      .from("products")
      .select("id, name, image_url")
      .eq("merchant_id", user.id)
      .eq("is_active", true),
    supabase
      .from("bookings")
      .select("booking_date, total_price, services(name)")
      .eq("merchant_id", user.id)
      .gte("booking_date", ninetyDaysAgoStr)
      .eq("status", "completed")
      .order("booking_date", { ascending: true }),
  ]);

  const todayBookings = todayBookingsResult.count ?? 0;
  const pendingBookings = pendingBookingsResult.count ?? 0;
  const allRecentBookings = recentBookingsResult.data ?? [];

  // Calculate revenues
  const todayRevenue = (todayRevenueResult.data ?? []).reduce(
    (sum, booking) => sum + (booking.total_price ?? 0),
    0
  );

  const thisMonthRevenue = (thisMonthRevenueResult.data ?? []).reduce(
    (sum, booking) => sum + (booking.total_price ?? 0),
    0
  );

  const lastMonthRevenue = (lastMonthRevenueResult.data ?? []).reduce(
    (sum, booking) => sum + (booking.total_price ?? 0),
    0
  );

  // Calculate revenue trend
  const revenueTrend = lastMonthRevenue > 0
    ? Math.round(((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100)
    : 0;

  // Smart sorting for activity feed: pending first, then today's, then recent
  const pendingItems = allRecentBookings.filter(b => b.status === "pending");
  const todayItems = allRecentBookings.filter(b => b.booking_date === today && b.status !== "pending");
  const otherItems = allRecentBookings.filter(b => b.booking_date !== today && b.status !== "pending");
  const smartBookings = [...pendingItems, ...todayItems, ...otherItems].slice(0, 5);

  // Check services and products without images
  const services = servicesResult.data ?? [];
  const servicesWithoutImages = services.filter(s => !s.image_url).length;

  const products = productsResult.data ?? [];
  const productsWithoutImages = products.filter(p => !p.image_url).length;

  // Process chart data for last 90 days
  const last90DaysBookings = last90DaysBookingsResult.data ?? [];

  // Revenue by day (last 90 days)
  const revenueByDay: Record<string, number> = {};
  last90DaysBookings.forEach(booking => {
    const date = booking.booking_date;
    revenueByDay[date] = (revenueByDay[date] || 0) + (booking.total_price || 0);
  });

  // Fill in missing days with 0 for all 90 days
  const revenueChartData = [];
  for (let i = 89; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    revenueChartData.push({
      date: dateStr,
      revenue: revenueByDay[dateStr] || 0,
    });
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {t("welcome")}
        </h1>
        <p className="text-gray-600">{t("subtitle")}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Calendar className="h-6 w-6" />}
          label={t("todayBookings")}
          value={todayBookings.toString()}
          color="blue"
        />
        <StatCard
          icon={<Clock className="h-6 w-6" />}
          label={t("pendingConfirmations")}
          value={pendingBookings.toString()}
          color="amber"
          alert={pendingBookings > 0}
          href={pendingBookings > 0 ? "/business/dashboard/bookings?status=pending" : undefined}
        />
        <StatCard
          icon={<TrendingUp className="h-6 w-6" />}
          label={t("todayRevenue")}
          value={formatCurrency(todayRevenue, merchant.currency)}
          color="green"
        />
        <StatCard
          icon={<TrendingUp className="h-6 w-6" />}
          label={t("thisMonthRevenue")}
          value={formatCurrency(thisMonthRevenue, merchant.currency)}
          color="purple"
          trend={revenueTrend}
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">{t("quickActions")}</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        <QuickActionButton
          href={`/m/${merchant.slug}`}
          icon={<ExternalLink className="h-5 w-5" />}
          label={t("preview")}
          external
        />
        <QuickActionButton
          href="/business/dashboard/store"
          icon={<ShoppingBag className="h-5 w-5" />}
          label={tNav("store")}
        />
        <QuickActionButton
          href="/business/dashboard/customers"
          icon={<Users className="h-5 w-5" />}
          label={tNav("customers")}
        />
        <QuickActionButton
          href="/business/dashboard/services"
          icon={<Scissors className="h-5 w-5" />}
          label={tNav("services")}
        />
        <QuickActionButton
          href="/business/dashboard/products"
          icon={<Package className="h-5 w-5" />}
          label={tNav("products")}
        />
        <QuickActionButton
          href="/business/dashboard/themes/gallery"
          icon={<Image className="h-5 w-5" />}
          label={tNav("gallery")}
        />
        <QuickActionButton
          href="/business/dashboard/business-info"
          icon={<Store className="h-5 w-5" />}
          label={tNav("businessInfo")}
        />
        </div>
      </div>

      {/* Growth Insights */}
      {(pendingBookings > 0 || servicesWithoutImages > 0 || productsWithoutImages > 0 || thisMonthRevenue === 0) && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="h-5 w-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            {t("growthInsights")}
          </h2>
          <div className="space-y-3">
            {pendingBookings > 0 && (
              <Link
                href="/business/dashboard/bookings?status=pending"
                className="flex items-start gap-3 p-3 bg-white rounded-lg hover:shadow-sm transition-shadow"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                  <span className="text-amber-600 font-bold text-sm">{pendingBookings}</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{t("pendingBookingsNeedAction")}</p>
                  <p className="text-sm text-gray-600">{t("confirmToSecureRevenue")}</p>
                </div>
                <svg className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}

            {servicesWithoutImages > 0 && (
              <Link
                href="/business/dashboard/services"
                className="flex items-start gap-3 p-3 bg-white rounded-lg hover:shadow-sm transition-shadow"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="h-4 w-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{t("addPhotosToServices", { count: servicesWithoutImages })}</p>
                  <p className="text-sm text-gray-600">{t("photosIncrease3x")}</p>
                </div>
                <svg className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}

            {productsWithoutImages > 0 && (
              <Link
                href="/business/dashboard/products"
                className="flex items-start gap-3 p-3 bg-white rounded-lg hover:shadow-sm transition-shadow"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{t("addPhotosToProducts", { count: productsWithoutImages })}</p>
                  <p className="text-sm text-gray-600">{t("productsPhotosIncrease")}</p>
                </div>
                <svg className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}

            {thisMonthRevenue === 0 && (
              <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{t("getFirstBooking")}</p>
                  <p className="text-sm text-gray-600 mb-2">{t("shareYourLink")}</p>
                  <div className="flex flex-wrap gap-2 text-sm">
                    <span className="text-gray-500">💡 {t("suggestShare")}:</span>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded">Instagram</span>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded">WhatsApp</span>
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded">Facebook</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Revenue Analytics */}
      {last90DaysBookings.length > 0 && (
        <RevenueAnalytics
          currency={merchant.currency}
          allRevenueData={revenueChartData}
        />
      )}

    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
  href,
  alert,
  trend,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: "blue" | "purple" | "pink" | "green" | "amber";
  href?: string;
  alert?: boolean;
  trend?: number;
}) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    pink: "bg-pink-50 text-pink-600",
    green: "bg-green-50 text-green-600",
    amber: "bg-amber-50 text-amber-600",
  };

  const borderColors = {
    blue: "border-gray-200",
    purple: "border-gray-200",
    pink: "border-gray-200",
    green: "border-gray-200",
    amber: alert ? "border-amber-300 ring-2 ring-amber-100" : "border-gray-200",
  };

  const content = (
    <div className={`rounded-xl border ${borderColors[color]} bg-white p-5 relative`}>
      {alert && (
        <div className="absolute top-3 right-3">
          <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></div>
        </div>
      )}
      <div className="flex items-center gap-3">
        <div className={`rounded-lg p-2 ${colors[color]}`}>{icon}</div>
        <div className="flex-1">
          <p className="text-sm text-gray-500">{label}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {trend !== undefined && trend !== 0 && (
              <span className={`text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block transition-shadow hover:shadow-md">
        {content}
      </Link>
    );
  }

  return content;
}

function QuickActionButton({
  href,
  icon,
  label,
  external,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  external?: boolean;
}) {
  return (
    <Link
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-purple-300 hover:shadow-md"
    >
      <div className="text-gray-600">{icon}</div>
      <span className="text-xs font-medium text-gray-700 text-center">{label}</span>
    </Link>
  );
}
