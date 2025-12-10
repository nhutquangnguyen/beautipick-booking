"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  LayoutDashboard,
  Calendar,
  Settings,
  ChevronDown,
  ChevronRight,
  Shield,
  Crown,
  Home,
  ClipboardList,
  User,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Merchant } from "@/types/database";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LanguageSwitcher } from "@/components/language-switcher";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  exact?: boolean;
  children?: NavItem[];
  separator?: boolean;
}

interface Translations {
  home: string;
  orders: string;
  settings: string;
  admin: string;
  signOut: string;
}

export function DashboardSidebar({
  merchant,
  translations
}: {
  merchant: Merchant;
  translations: Translations;
}) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [logoDisplayUrl, setLogoDisplayUrl] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  // Fetch user email
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setUserEmail(user.email);
      }
    };
    getUser();
  }, [supabase]);

  // Close account menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };

    if (isAccountMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isAccountMenuOpen]);

  // Check if user is admin and Pro tier (combined for better performance)
  useEffect(() => {
    const checkAdminAndTier = async () => {
      // Run both queries in parallel for better performance
      const [adminResult, subscriptionResult] = await Promise.all([
        supabase
          .from("admins")
          .select("user_id")
          .eq("user_id", merchant.id)
          .maybeSingle(),
        supabase
          .from("merchant_subscriptions")
          .select("pricing_tiers(tier_key)")
          .eq("merchant_id", merchant.id)
          .eq("status", "active")
          .maybeSingle()
      ]);

      setIsAdmin(!!adminResult.data);
      const tierKey = (subscriptionResult.data?.pricing_tiers as any)?.tier_key || "free";
      setIsPro(tierKey === "pro");
    };
    checkAdminAndTier();
  }, [merchant.id, supabase]);

  // Fetch signed URL for logo if it's a storage key
  useEffect(() => {
    if (!merchant.logo_url) {
      setLogoDisplayUrl(null);
      return;
    }

    // If it's already a full URL, use it directly
    if (merchant.logo_url.startsWith("http")) {
      setLogoDisplayUrl(merchant.logo_url);
      return;
    }

    // Otherwise, fetch a signed URL
    const fetchSignedUrl = async () => {
      try {
        const response = await fetch(`/api/signed-url?key=${encodeURIComponent(merchant.logo_url!)}`);
        const data = await response.json();
        if (response.ok && data.url) {
          setLogoDisplayUrl(data.url);
        }
      } catch (err) {
        console.error("Failed to fetch logo signed URL:", err);
      }
    };

    fetchSignedUrl();
  }, [merchant.logo_url]);

  // Memoize navItems to prevent recreation on every render
  const navItems: NavItem[] = useMemo(() => [
    { href: "/dashboard", label: translations.home, icon: LayoutDashboard, exact: true },
    { href: "/dashboard/bookings", label: translations.orders, icon: Calendar },
    { href: "/dashboard/settings", label: translations.settings, icon: Settings },
    // Add admin link if user is admin
    ...(isAdmin ? [{ href: "/admin", label: translations.admin, icon: Shield }] : []),
  ], [isAdmin, translations]);

  const toggleExpanded = useCallback((href: string) => {
    setExpandedItems((prev) =>
      prev.includes(href) ? prev.filter((h) => h !== href) : [...prev, href]
    );
  }, []);

  const isActive = useCallback((item: NavItem) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname.startsWith(item.href);
  }, [pathname]);

  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut();
    router.push("/login");
  }, [supabase, router]);

  const renderNavItem = (item: NavItem, depth = 0) => {
    const active = isActive(item);
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.href);

    if (hasChildren) {
      return (
        <div key={item.href}>
          <button
            onClick={() => toggleExpanded(item.href)}
            className={cn(
              "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-purple-50 text-purple-600"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            )}
          >
            <div className="flex items-center gap-3">
              <item.icon className="h-5 w-5" />
              {item.label}
            </div>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          {isExpanded && (
            <div className="ml-8 mt-1 space-y-0.5">
              {item.children!.map((child) => renderNavItem(child, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
          active
            ? "bg-purple-50 text-purple-600"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        )}
      >
        <item.icon className="h-5 w-5" />
        {item.label}
      </Link>
    );
  };

  const sidebarContent = (
    <>
      {/* Logo */}
      <Link href="/dashboard" className="flex h-16 items-center gap-3 px-4 hover:bg-gray-50 transition-colors cursor-pointer">
        {logoDisplayUrl ? (
          <div className="relative h-10 w-10 rounded-xl overflow-hidden shadow-sm">
            <Image
              src={logoDisplayUrl}
              alt={merchant.business_name}
              fill
              className="object-cover"
              sizes="40px"
              priority
            />
          </div>
        ) : (
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 shadow-sm flex items-center justify-center text-white font-bold">
            {merchant.business_name.charAt(0)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {isPro && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold rounded">
                <Crown className="h-3 w-3" />
              </span>
            )}
            <p className="font-semibold text-gray-900 truncate">{merchant.business_name}</p>
          </div>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-2">
        <div className="space-y-1">
          {navItems.map((item) => renderNavItem(item))}
        </div>
      </nav>

      {/* Bottom Section - Account Menu */}
      <div ref={accountMenuRef} className="relative px-3 pb-4 border-t border-gray-200 pt-4">
        {/* Account Button */}
        <button
          onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600">
            <User className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-medium text-gray-900 truncate">{userEmail}</p>
          </div>
          <ChevronDown className={cn(
            "h-4 w-4 text-gray-600 transition-transform",
            isAccountMenuOpen && "rotate-180"
          )} />
        </button>

        {/* Dropdown Menu */}
        {isAccountMenuOpen && (
          <div className="absolute bottom-full left-0 right-0 mb-2 mx-3 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            {/* Language Switcher */}
            <div className="p-3 border-b border-gray-200">
              <LanguageSwitcher />
            </div>

            {/* Sign Out */}
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>{translations.signOut}</span>
            </button>
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Top Header */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between bg-white px-4 lg:hidden shadow-sm">
        <Link href="/dashboard" className="flex items-center gap-2">
          {logoDisplayUrl ? (
            <div className="relative h-8 w-8 rounded-lg overflow-hidden">
              <Image
                src={logoDisplayUrl}
                alt={merchant.business_name}
                fill
                className="object-cover"
                sizes="32px"
                priority
              />
            </div>
          ) : (
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-sm">
              {merchant.business_name.charAt(0)}
            </div>
          )}
          {isPro && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold rounded">
              <Crown className="h-3 w-3" />
            </span>
          )}
          <span className="font-semibold text-gray-900">{merchant.business_name}</span>
        </Link>

        {/* Mobile Account Button */}
        <div ref={accountMenuRef} className="relative">
          <button
            onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
          >
            <User className="h-5 w-5" />
          </button>

          {/* Mobile Dropdown Menu */}
          {isAccountMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
              {/* User Email */}
              <div className="p-3 border-b border-gray-100">
                <p className="text-sm text-gray-900 truncate">{userEmail}</p>
              </div>

              {/* Language Switcher */}
              <div className="p-3 border-b border-gray-200">
                <LanguageSwitcher />
              </div>

              {/* Sign Out */}
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>{translations.signOut}</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden px-4 pb-6">
        <nav className="bg-white rounded-3xl shadow-lg border border-gray-200 max-w-md mx-auto">
          <div className="grid grid-cols-3 h-14">
            <Link
              href="/dashboard"
              className={cn(
                "flex items-center justify-center transition-colors",
                pathname === "/dashboard"
                  ? "text-purple-600"
                  : "text-gray-600"
              )}
            >
              <Home
                className="h-7 w-7"
                strokeWidth={pathname === "/dashboard" ? 2.5 : 2}
              />
            </Link>
            <Link
              href="/dashboard/bookings"
              className={cn(
                "flex items-center justify-center transition-colors",
                pathname.startsWith("/dashboard/bookings")
                  ? "text-purple-600"
                  : "text-gray-600"
              )}
            >
              <ClipboardList
                className="h-7 w-7"
                strokeWidth={pathname.startsWith("/dashboard/bookings") ? 2.5 : 2}
              />
            </Link>
            <Link
              href="/dashboard/settings"
              className={cn(
                "flex items-center justify-center transition-colors",
                pathname.startsWith("/dashboard/settings")
                  ? "text-purple-600"
                  : "text-gray-600"
              )}
            >
              <Settings
                className="h-7 w-7"
                strokeWidth={pathname.startsWith("/dashboard/settings") ? 2.5 : 2}
              />
            </Link>
          </div>
        </nav>
      </div>

      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 bg-white shadow-sm lg:flex lg:flex-col">
        {sidebarContent}
      </aside>
    </>
  );
}
