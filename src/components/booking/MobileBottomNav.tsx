"use client";

import { Scissors, Package, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface MobileBottomNavProps {
  hasServices: boolean;
  hasProducts: boolean;
  accentColor?: string;
  onNavigate: (section: "services" | "products" | "contact") => void;
  activeSection?: string;
}

export function MobileBottomNav({
  hasServices,
  hasProducts,
  accentColor = "#9333ea",
  onNavigate,
  activeSection,
}: MobileBottomNavProps) {
  const t = useTranslations("common");

  // Only show if there are services or products
  if (!hasServices && !hasProducts) {
    return null;
  }

  const navItems = [
    ...(hasServices ? [{ id: "services" as const, icon: Scissors, label: t("services") }] : []),
    ...(hasProducts ? [{ id: "products" as const, icon: Package, label: t("products") }] : []),
    { id: "contact" as const, icon: Phone, label: t("contact") },
  ];

  // Don't render if less than 2 items
  if (navItems.length < 2) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden px-4 pb-6">
      <nav className="bg-white rounded-3xl shadow-lg border border-gray-200 max-w-md mx-auto">
        <div className={cn(
          "grid h-16",
          navItems.length === 2 ? "grid-cols-2" : "grid-cols-3"
        )}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="flex flex-col items-center justify-center gap-1 transition-colors py-2"
                style={{
                  color: isActive ? accentColor : "#6b7280",
                }}
              >
                <Icon
                  className="h-6 w-6"
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className="text-xs font-medium">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
