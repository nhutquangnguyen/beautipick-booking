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
  CheckCircle2
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default async function DashboardPage() {
  const t = await getTranslations("dashboard");
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
  const [servicesResult, availabilityResult] = await Promise.all([
    supabase.from("services").select("id").eq("merchant_id", user.id).limit(1),
    supabase.from("availability").select("id").eq("merchant_id", user.id).limit(1),
  ]);

  const hasServices = (servicesResult.data?.length ?? 0) > 0;
  const hasAvailability = (availabilityResult.data?.length ?? 0) > 0;

  // If no services or availability, redirect to onboarding
  if (!hasServices || !hasAvailability) {
    redirect("/dashboard/onboarding");
  }

  // Get stats
  const today = new Date().toISOString().split("T")[0];
  const [
    todayBookingsResult,
    upcomingBookingsResult,
    servicesCountResult,
    recentBookingsResult,
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
      .gte("booking_date", today)
      .in("status", ["confirmed", "pending"]),
    supabase
      .from("services")
      .select("*", { count: "exact" })
      .eq("merchant_id", user.id)
      .eq("is_active", true),
    supabase
      .from("bookings")
      .select("*, services(name)")
      .eq("merchant_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const todayBookings = todayBookingsResult.count ?? 0;
  const upcomingBookings = upcomingBookingsResult.count ?? 0;
  const servicesCount = servicesCountResult.count ?? 0;
  const recentBookings = recentBookingsResult.data ?? [];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t("welcome")}
          </h1>
          <p className="text-gray-600">{t("subtitle")}</p>
        </div>
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
          label={t("upcoming")}
          value={upcomingBookings.toString()}
          color="purple"
        />
        <StatCard
          icon={<Scissors className="h-6 w-6" />}
          label={t("services")}
          value={servicesCount.toString()}
          color="pink"
          href="/dashboard/settings/services"
        />
        <StatCard
          icon={<TrendingUp className="h-6 w-6" />}
          label={t("thisWeek")}
          value="$0"
          color="green"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">{t("quickActions")}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <QuickActionCard
            href="/dashboard/settings/services"
            icon={<Plus className="h-5 w-5" />}
            title={t("addService")}
            description={t("createService")}
            color="purple"
          />
          <QuickActionCard
            href="/dashboard/bookings"
            icon={<Calendar className="h-5 w-5" />}
            title={t("viewBookings")}
            description={t("manageAppointments")}
            color="blue"
          />
          <QuickActionCard
            href="/dashboard/settings/hours"
            icon={<Clock className="h-5 w-5" />}
            title={t("setHours")}
            description={t("updateAvailability")}
            color="green"
          />
          <QuickActionCard
            href="/dashboard/settings/design"
            icon={<Users className="h-5 w-5" />}
            title={t("customize")}
            description={t("changeLook")}
            color="pink"
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">{t("recentBookings")}</h2>
          <Link
            href="/dashboard/bookings"
            className="text-sm font-medium text-purple-600 hover:text-purple-500"
          >
            {t("viewAll")}
          </Link>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          {recentBookings.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {recentBookings.map((booking, index) => (
                <div
                  key={booking.id}
                  className={`flex items-center justify-between p-4 transition-colors hover:bg-gray-50 ${
                    index === 0 ? "" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-pink-100 text-sm font-medium text-purple-600">
                      {booking.customer_name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {booking.customer_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {booking.services?.name} · {booking.booking_date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-900">
                      {formatCurrency(booking.total_price)}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        booking.status === "confirmed"
                          ? "bg-green-50 text-green-600 ring-1 ring-green-500/20"
                          : booking.status === "pending"
                            ? "bg-amber-50 text-amber-600 ring-1 ring-amber-500/20"
                            : booking.status === "completed"
                              ? "bg-blue-50 text-blue-600 ring-1 ring-blue-500/20"
                              : "bg-gray-50 text-gray-600 ring-1 ring-gray-500/20"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <Calendar className="h-6 w-6 text-gray-400" />
              </div>
              <p className="mt-3 font-medium text-gray-900">{t("noBookings")}</p>
              <p className="mt-1 text-sm text-gray-500">
                {t("noBookingsDesc")}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Setup Checklist */}
      <SetupChecklist merchant={merchant} hasServices={hasServices} translations={{
        completeSetup: t("completeSetup"),
        addYourServices: t("addYourServices"),
        setYourHours: t("setYourHours"),
        addBusinessInfo: t("addBusinessInfo"),
        customizePage: t("customizePage"),
      }} />
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: "blue" | "purple" | "pink" | "green";
  href?: string;
}) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    pink: "bg-pink-50 text-pink-600",
    green: "bg-green-50 text-green-600",
  };

  const content = (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-center gap-3">
        <div className={`rounded-lg p-2 ${colors[color]}`}>{icon}</div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
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

function QuickActionCard({
  href,
  icon,
  title,
  description,
  color,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "purple" | "blue" | "green" | "pink";
}) {
  const colors = {
    purple: "bg-purple-100 text-purple-600",
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    pink: "bg-pink-100 text-pink-600",
  };

  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-gray-300 hover:shadow-sm"
    >
      <div className={`rounded-lg p-2 ${colors[color]}`}>{icon}</div>
      <div>
        <p className="font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </Link>
  );
}

function SetupChecklist({
  merchant,
  hasServices,
  translations,
}: {
  merchant: { phone: string | null; address: string | null; description: string | null };
  hasServices: boolean;
  translations: {
    completeSetup: string;
    addYourServices: string;
    setYourHours: string;
    addBusinessInfo: string;
    customizePage: string;
  };
}) {
  const items = [
    { label: translations.addYourServices, done: hasServices, href: "/dashboard/settings/services" },
    { label: translations.setYourHours, done: true, href: "/dashboard/settings/hours" },
    { label: translations.addBusinessInfo, done: !!merchant.phone || !!merchant.address, href: "/dashboard/settings" },
    { label: translations.customizePage, done: false, href: "/dashboard/settings/design" },
  ];

  const completedCount = items.filter((i) => i.done).length;

  if (completedCount === items.length) return null;

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-gray-900">
        {translations.completeSetup} ({completedCount}/{items.length})
      </h2>
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="space-y-3">
          {items.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg p-2 transition-colors ${
                item.done
                  ? "text-gray-400"
                  : "text-gray-900 hover:bg-gray-50"
              }`}
            >
              <CheckCircle2
                className={`h-5 w-5 ${
                  item.done ? "text-green-500" : "text-gray-300"
                }`}
              />
              <span className={item.done ? "line-through" : ""}>
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

