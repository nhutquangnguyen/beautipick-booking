"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  LayoutDashboard,
  Calendar,
  Settings,
  Menu,
  X,
  Scissors,
  Clock,
  Palette,
  Images,
  ShoppingBag,
  Store,
  LogOut,
  ChevronDown,
  ChevronRight,
  User,
  ExternalLink,
  Copy,
  Check,
  Link as LinkIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Merchant } from "@/types/database";
import { LanguageSwitcherCompact } from "@/components/language-switcher";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  exact?: boolean;
  children?: NavItem[];
}

export function DashboardSidebar({ merchant }: { merchant: Merchant }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>(["/dashboard/settings"]);
  const [copied, setCopied] = useState(false);
  const pathname = usePathname();
  const t = useTranslations("nav");
  const tSettings = useTranslations("settings");
  const tDashboard = useTranslations("dashboard");
  const router = useRouter();
  const supabase = createClient();

  const bookingPageUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/${merchant.slug}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(bookingPageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const navItems: NavItem[] = [
    { href: "/dashboard", label: t("home"), icon: LayoutDashboard, exact: true },
    { href: "/dashboard/bookings", label: t("bookings"), icon: Calendar },
    {
      href: "/dashboard/settings",
      label: t("settings"),
      icon: Settings,
      children: [
        { href: "/dashboard/settings", label: tSettings("business"), icon: Store, exact: true },
        { href: "/dashboard/settings/services", label: tSettings("services"), icon: Scissors },
        { href: "/dashboard/settings/hours", label: tSettings("hours"), icon: Clock },
        { href: "/dashboard/settings/gallery", label: tSettings("gallery"), icon: Images },
        { href: "/dashboard/settings/products", label: tSettings("products"), icon: ShoppingBag },
        { href: "/dashboard/settings/links", label: tSettings("links"), icon: LinkIcon },
        { href: "/dashboard/settings/design", label: tSettings("design"), icon: Palette },
      ],
    },
  ];

  const toggleExpanded = (href: string) => {
    setExpandedItems((prev) =>
      prev.includes(href) ? prev.filter((h) => h !== href) : [...prev, href]
    );
  };

  const isActive = (item: NavItem) => {
    if (item.exact) {
      return pathname === item.href;
    }
    return pathname.startsWith(item.href);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

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
        onClick={() => setMobileMenuOpen(false)}
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
      <div className="flex h-16 items-center gap-3 px-4">
        {merchant.logo_url ? (
          <img
            src={merchant.logo_url}
            alt={merchant.business_name}
            className="h-10 w-10 rounded-xl object-cover shadow-sm"
          />
        ) : (
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 shadow-sm flex items-center justify-center text-white font-bold">
            {merchant.business_name.charAt(0)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 truncate">{merchant.business_name}</p>
        </div>
      </div>

      {/* Booking Page Actions */}
      <div className="px-3 pb-2">
        <div className="flex gap-1.5">
          <button
            onClick={handleCopy}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium transition-all",
              copied
                ? "bg-green-50 text-green-600"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Copy Link
              </>
            )}
          </button>
          <Link
            href={`/${merchant.slug}`}
            target="_blank"
            className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 py-2 text-xs font-medium text-white hover:opacity-90 transition-opacity"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            {tDashboard("preview")}
          </Link>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-2">
        <div className="space-y-1">
          {navItems.map((item) => renderNavItem(item))}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="px-3 pb-4 space-y-2">
        {/* Language Switcher */}
        <div className="flex items-center justify-between rounded-lg px-3 py-2.5 bg-gray-50">
          <span className="text-sm text-gray-500">Language</span>
          <LanguageSwitcherCompact />
        </div>

        {/* User */}
        <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 bg-gray-50">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-sm font-medium text-purple-600">
            <User className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-700 truncate">{merchant.email}</p>
          </div>
        </div>

        {/* Sign Out */}
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          {t("signOut")}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-white px-4 lg:hidden">
        <div className="flex items-center gap-3">
          {merchant.logo_url ? (
            <img
              src={merchant.logo_url}
              alt={merchant.business_name}
              className="h-8 w-8 rounded-lg object-cover"
            />
          ) : (
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-sm">
              {merchant.business_name.charAt(0)}
            </div>
          )}
          <span className="font-semibold text-gray-900">{merchant.business_name}</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 transform bg-white transition-transform duration-300 lg:hidden",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">{sidebarContent}</div>
      </aside>

      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 bg-white shadow-sm lg:flex lg:flex-col">
        {sidebarContent}
      </aside>
    </>
  );
}
