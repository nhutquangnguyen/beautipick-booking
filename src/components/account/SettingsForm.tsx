"use client";

import { useState } from "react";
import { Bell, Globe, Lock, Trash2, Save, Loader2, AlertTriangle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";

interface CustomerAccount {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  preferences?: any;
}

interface SettingsFormProps {
  customer: CustomerAccount;
  user: User;
}

export function SettingsForm({ customer, user }: SettingsFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Get preferences or set defaults
  const preferences = customer.preferences || {};

  const [settings, setSettings] = useState({
    emailNotifications: preferences.emailNotifications ?? true,
    smsNotifications: preferences.smsNotifications ?? false,
    language: preferences.language || "vi",
  });

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { error: updateError } = await supabase
        .from("customer_accounts")
        .update({
          preferences: settings,
        })
        .eq("id", customer.id);

      if (updateError) {
        setError(updateError.message);
        return;
      }

      // Set locale cookie for next-intl
      document.cookie = `locale=${settings.language}; path=/; max-age=31536000`; // 1 year

      setSuccess(true);

      // Refresh the page to apply new locale
      window.location.reload();
    } catch (err) {
      setError("Có lỗi xảy ra khi lưu cài đặt");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    setError(null);

    try {
      // First, delete customer account record
      const { error: deleteError } = await supabase
        .from("customer_accounts")
        .delete()
        .eq("id", customer.id);

      if (deleteError) {
        setError(deleteError.message);
        setDeleting(false);
        return;
      }

      // Then sign out and redirect
      await supabase.auth.signOut();
      router.push("/");
    } catch (err) {
      setError("Có lỗi xảy ra khi xóa tài khoản");
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Success Message */}
      {success && (
        <div className="rounded-lg bg-green-50 p-4 text-sm text-green-600">
          Cập nhật cài đặt thành công!
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Notifications Section */}
      <div className="border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Thông báo</h3>
        </div>

        <div className="space-y-4">
          {/* Email Notifications */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Thông báo qua Email</p>
              <p className="text-sm text-gray-600">Nhận thông báo về cuộc hẹn qua email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) =>
                  setSettings({ ...settings, emailNotifications: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          {/* SMS Notifications */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Thông báo qua SMS</p>
              <p className="text-sm text-gray-600">Nhận thông báo về cuộc hẹn qua SMS</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.smsNotifications}
                onChange={(e) =>
                  setSettings({ ...settings, smsNotifications: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Language Section */}
      <div className="border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Ngôn ngữ</h3>
        </div>

        <select
          value={settings.language}
          onChange={(e) => setSettings({ ...settings, language: e.target.value })}
          className="w-full md:w-auto rounded-lg border border-gray-300 px-4 py-2.5 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
        >
          <option value="vi">Tiếng Việt</option>
          <option value="en">English</option>
        </select>
      </div>

      {/* Account Security Section */}
      <div className="border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Lock className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Bảo mật tài khoản</h3>
        </div>

        <div className="space-y-3">
          <div className="text-sm text-gray-600">
            <p className="font-medium text-gray-900 mb-1">Email đăng nhập</p>
            <p>{user.email}</p>
          </div>

          <button
            type="button"
            onClick={() => {
              // Navigate to password reset
              window.location.href = "/reset-password";
            }}
            className="text-purple-600 hover:text-purple-700 font-medium text-sm"
          >
            Đổi mật khẩu
          </button>
        </div>
      </div>

      {/* Save Settings Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveSettings}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Đang lưu...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Lưu cài đặt
            </>
          )}
        </button>
      </div>

      {/* Danger Zone */}
      <div className="border-2 border-red-200 rounded-xl p-6 bg-red-50">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <h3 className="text-lg font-semibold text-red-900">Vùng nguy hiểm</h3>
        </div>

        <p className="text-sm text-red-800 mb-4">
          Xóa tài khoản sẽ xóa vĩnh viễn tất cả dữ liệu của bạn. Hành động này không thể hoàn tác.
        </p>

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-red-300 text-red-700 font-medium hover:bg-red-100 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Xóa tài khoản
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-red-900">
              Bạn có chắc chắn muốn xóa tài khoản?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang xóa...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Xác nhận xóa
                  </>
                )}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50"
              >
                Hủy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
