"use client";

import { useTranslations } from "next-intl";
import { LogOut, Mail, User } from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function AccountSettings() {
  const t = useTranslations("settings");
  const tNav = useTranslations("nav");
  const router = useRouter();
  const supabase = createClient();
  const [userEmail, setUserEmail] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setUserEmail(user.email);
      }
      setLoading(false);
    };
    getUser();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      <div className="p-6 space-y-6">
        {/* Account Email */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <Mail className="h-4 w-4" />
            {t("accountEmail")}
          </label>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-sm font-medium text-purple-600">
              <User className="h-5 w-5" />
            </div>
            <p className="text-sm text-gray-700">{userEmail}</p>
          </div>
          <p className="mt-2 text-xs text-gray-500">{t("emailCannotBeChanged")}</p>
        </div>

        {/* Language Setting */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-3 block">
            {t("language")}
          </label>
          <LanguageSwitcher />
        </div>

        {/* Sign Out */}
        <div className="pt-6 border-t border-gray-200">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" />
            {tNav("signOut")}
          </button>
        </div>
      </div>
    </div>
  );
}
