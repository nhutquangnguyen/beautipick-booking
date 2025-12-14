"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { generateSlug } from "@/lib/utils";
import { defaultTheme, defaultSettings } from "@/types/database";
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import { createMerchantAccount } from "@/app/actions/auth";
import { ArrowLeft, Store } from "lucide-react";

function BusinessSignupContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const supabase = createClient();

  // Check for error from callback
  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam === "merchant_exists") {
      setError("Tài khoản salon đã tồn tại. Vui lòng đăng nhập.");
    }
  }, [searchParams]);

  // Set timezone and currency based on locale
  const timezone = locale === "vi" ? "Asia/Ho_Chi_Minh" : "America/New_York";
  const currency = locale === "vi" ? "VND" : "USD";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?type=merchant&next=/business/dashboard/onboarding`,
          data: {
            user_type: "merchant",
            business_name: businessName,
            phone: phone,
          },
        },
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      if (!authData.user) {
        setError("Failed to create account");
        return;
      }

      // Check if email confirmation is required
      if (!authData.session) {
        // Email confirmation enabled - show success message
        // Merchant account will be created after email confirmation in auth callback
        setSuccess(true);
        return;
      }

      // No email confirmation required - create account immediately
      const result = await createMerchantAccount({
        userId: authData.user.id,
        email,
        businessName,
        phone,
        theme: defaultTheme,
        settings: defaultSettings,
        timezone,
        currency,
      });

      if (!result.success) {
        setError(result.error || "Failed to create merchant account");
        setLoading(false);
        return;
      }

      // Redirect to onboarding
      router.push("/business/dashboard/onboarding");
      router.refresh();
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Show success message if email confirmation is required
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="mt-4 text-2xl font-bold text-gray-900">Kiểm tra email</h1>
            <p className="mt-2 text-gray-600">
              Chúng tôi đã gửi link xác nhận đến <strong>{email}</strong>
            </p>
            <p className="mt-4 text-sm text-gray-500">
              Nhấp vào link trong email để xác minh tài khoản và hoàn tất đăng ký.
            </p>
            <div className="mt-6 rounded-lg bg-blue-50 p-4">
              <p className="text-sm text-blue-800">
                <strong>Lưu ý:</strong> Nếu không thấy email, vui lòng kiểm tra thư mục spam.
              </p>
            </div>
            <Link
              href="/business/login"
              className="mt-6 inline-block text-sm font-medium text-purple-600 hover:text-purple-500"
            >
              Quay lại đăng nhập
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Link */}
        <Link
          href="/business"
          className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Link>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl mb-4">
              <Store className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Đăng ký Salon
            </h1>
            <p className="text-gray-600">
              Bắt đầu nhận đặt chỗ trong vài phút
            </p>
          </div>

          {/* OAuth Buttons */}
          <OAuthButtons redirectTo="/business/dashboard/onboarding" userType="merchant" />

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">Hoặc tiếp tục với email</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="businessName" className="label">
                Tên Salon
              </label>
              <input
                id="businessName"
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="input mt-1"
                placeholder="Tên salon của bạn"
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="label">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input mt-1"
                placeholder="0123456789"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Bắt buộc - Để khách hàng liên hệ với bạn
              </p>
            </div>

            <div>
              <label htmlFor="email" className="label">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input mt-1"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="label">
                Mật khẩu
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input mt-1"
                placeholder="••••••••"
                minLength={6}
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Tối thiểu 6 ký tự
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-md w-full"
            >
              {loading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              Đã có tài khoản?{" "}
              <Link
                href="/business/login"
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-white/80 text-sm mt-6">
          Dành cho chủ salon và nhân viên quản lý
        </p>
      </div>
    </div>
  );
}

export default function BusinessSignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-white border-r-transparent"></div>
          <p className="mt-4 text-white">Loading...</p>
        </div>
      </div>
    }>
      <BusinessSignupContent />
    </Suspense>
  );
}
