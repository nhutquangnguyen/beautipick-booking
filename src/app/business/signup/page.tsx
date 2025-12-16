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
import { ArrowLeft, Store, Mail } from "lucide-react";

function BusinessSignupContent() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
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

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Store metadata in localStorage temporarily (since OTP doesn't support metadata directly)
      localStorage.setItem('pending_merchant_signup', JSON.stringify({
        email,
        businessName,
        timezone,
        currency,
      }));

      // Send OTP code to email (this will send actual OTP code if configured)
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          // Note: emailRedirectTo is ignored for OTP codes
        },
      });

      if (otpError) {
        setError(otpError.message);
        setLoading(false);
        return;
      }

      setOtpSent(true);
      setLoading(false);
    } catch (err) {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Verify OTP code
      const { data: authData, error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "email",
      });

      if (verifyError) {
        setError(verifyError.message);
        setLoading(false);
        return;
      }

      if (!authData.user) {
        setError("Failed to verify code");
        setLoading(false);
        return;
      }

      // Check if merchant account already exists (in case of re-login)
      const { data: existingMerchant } = await supabase
        .from("merchants")
        .select("id")
        .eq("id", authData.user.id)
        .maybeSingle();

      if (existingMerchant) {
        // Clean up temporary data
        localStorage.removeItem('pending_merchant_signup');
        // Merchant account already exists, redirect to dashboard
        window.location.href = "/business/dashboard";
        return;
      }

      // Get signup data from localStorage
      const pendingSignup = localStorage.getItem('pending_merchant_signup');
      const signupData = pendingSignup ? JSON.parse(pendingSignup) : {
        businessName,
        timezone,
        currency,
      };

      // Create merchant account
      const result = await createMerchantAccount({
        userId: authData.user.id,
        email,
        businessName: signupData.businessName,
        theme: defaultTheme,
        settings: defaultSettings,
        timezone: signupData.timezone,
        currency: signupData.currency,
      });

      if (!result.success) {
        setError(result.error || "Failed to create merchant account");
        setLoading(false);
        return;
      }

      // Clean up temporary data
      localStorage.removeItem('pending_merchant_signup');

      // Redirect to onboarding
      window.location.href = "/business/dashboard/onboarding";
    } catch (err) {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

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
          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
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

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-md w-full"
              >
                {loading ? "Đang gửi mã..." : "Gửi mã xác nhận"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              {error && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <div className="rounded-lg bg-blue-50 p-4 mb-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      Mã đã được gửi
                    </p>
                    <p className="text-sm text-blue-700 mt-1">
                      Sao chép mã xác thực đã được gửi đến <strong>{email}</strong>
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="otp" className="label">
                  Mã xác nhận
                </label>
                <input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.trim())}
                  className="input mt-1 text-center text-lg tracking-wider font-mono"
                  placeholder="Nhập mã từ email"
                  required
                  autoComplete="one-time-code"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Sao chép và dán mã từ email
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length < 4}
                className="btn btn-primary btn-md w-full"
              >
                {loading ? "Đang xác nhận..." : "Xác nhận và tạo tài khoản"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setOtpSent(false);
                  setOtp("");
                  setError(null);
                }}
                className="w-full text-sm text-gray-600 hover:text-gray-900"
              >
                Gửi lại mã hoặc thay đổi email
              </button>
            </form>
          )}

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
