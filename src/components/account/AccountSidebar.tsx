"use client";

import { User, Calendar, Heart, Settings, LogOut, Loader2 } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

interface CustomerAccount {
  id: string;
  email: string;
  name: string;
  phone: string | null;
}

interface AccountSidebarProps {
  customer: CustomerAccount;
}

export function AccountSidebar({ customer }: AccountSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await supabase.auth.signOut();
    router.push("/");
  };

  const navItems = [
    {
      href: "/account/profile",
      label: "Hồ sơ",
      icon: User,
    },
    {
      href: "/account/appointments",
      label: "Các cuộc hẹn",
      icon: Calendar,
    },
    {
      href: "/account/favorites",
      label: "Mục yêu thích",
      icon: Heart,
    },
    {
      href: "/account/settings",
      label: "Cài đặt",
      icon: Settings,
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* User Info */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-white text-lg truncate">{customer.name}</h3>
            <p className="text-white/90 text-sm truncate">{customer.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
        >
          {isLoggingOut ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <LogOut className="w-5 h-5" />
          )}
          <span className="font-medium">Đăng xuất</span>
        </button>
      </div>
    </div>
  );
}
