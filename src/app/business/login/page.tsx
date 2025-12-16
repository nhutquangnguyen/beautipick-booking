"use client";

import { useState } from "react";
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Store, Mail } from "lucide-react";

export default function BusinessLoginPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Send OTP code to email
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false, // Don't create user on login
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
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "email",
      });

      if (verifyError) {
        setError(verifyError.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        // Check if merchant account exists
        const { data: merchantAccount } = await supabase
          .from("merchants")
          .select("id")
          .eq("id", data.user.id)
          .maybeSingle();

        if (!merchantAccount) {
          // No merchant account found
          // Check if user has customer account
          const { data: customerAccount } = await supabase
            .from("customer_accounts")
            .select("id")
            .eq("id", data.user.id)
            .maybeSingle();

          if (customerAccount) {
            // User is a customer but doesn't have merchant account yet
            await supabase.auth.signOut();
            setError("Bạn chỉ có tài khoản khách hàng. Vui lòng đăng ký tài khoản salon tại /business/signup hoặc đăng nhập khách hàng tại /login");
          } else {
            // No account at all
            await supabase.auth.signOut();
            setError("Tài khoản salon không tồn tại. Vui lòng đăng ký trước.");
          }
          setLoading(false);
          return;
        }

        // Valid merchant account exists (user may also have customer account, that's ok)
        router.push("/business/dashboard");
        router.refresh();
      }
    } catch {
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
              Đăng nhập Salon
            </h1>
            <p className="text-gray-600">
              Quản lý salon của bạn với BeautiPick
            </p>
          </div>

          {/* OAuth Buttons */}
          <OAuthButtons redirectTo="/business/dashboard" userType="merchant" />

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">Hoặc đăng nhập với email</span>
            </div>
          </div>

          {/* Email OTP Form */}
          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              {error && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                  Mã xác nhận
                </label>
                <input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.trim())}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 text-center text-lg tracking-wider font-mono"
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
                className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Đang xác nhận..." : "Xác nhận và đăng nhập"}
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

          {/* Divider */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              Chưa có tài khoản salon?{" "}
              <Link
                href="/business/signup"
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                Đăng ký ngay
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
