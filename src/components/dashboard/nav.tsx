"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Merchant } from "@/types/database";
import { LanguageSwitcherCompact } from "@/components/language-switcher";

export function DashboardNav({ merchant }: { merchant: Merchant }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations("nav");

  const navItems = [
    { href: "/business/dashboard", label: t("home"), icon: LayoutDashboard },
    { href: "/business/dashboard/bookings", label: t("bookings"), icon: Calendar },
    { href: "/business/dashboard/customers", label: t("customers"), icon: Users },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/business/dashboard" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600" />
              <span className="font-bold text-gray-900 hidden sm:block">
                {merchant.business_name}
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex md:items-center md:gap-1">
              {navItems.map((item) => {
                const isActive =
                  item.href === "/business/dashboard"
                    ? pathname === "/business/dashboard"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-purple-50 text-purple-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* Language Switcher */}
              <LanguageSwitcherCompact className="hidden md:flex" />

              {/* Settings button */}
              <Link
                href="/business/dashboard/settings"
                className={cn(
                  "hidden md:flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  pathname.startsWith("/business/dashboard/settings")
                    ? "bg-purple-50 text-purple-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <Settings className="h-4 w-4" />
                {t("settings")}
              </Link>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden rounded-lg p-2 text-gray-600 hover:bg-gray-50"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="space-y-1 px-4 py-3">
              {navItems.map((item) => {
                const isActive =
                  item.href === "/business/dashboard"
                    ? pathname === "/business/dashboard"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors",
                      isActive
                        ? "bg-purple-50 text-purple-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
              <Link
                href="/business/dashboard/settings"
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors",
                  pathname.startsWith("/business/dashboard/settings")
                    ? "bg-purple-50 text-purple-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <Settings className="h-5 w-5" />
                {t("settings")}
              </Link>
              <div className="px-3 py-3 flex items-center justify-between">
                <span className="text-sm text-gray-500">{t("language")}</span>
                <LanguageSwitcherCompact />
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
