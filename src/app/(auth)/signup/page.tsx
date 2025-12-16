"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { createCustomerAccount } from "@/app/actions/auth";
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import { Mail } from "lucide-react";

function SignupContent() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  // Check for error from callback
  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam === "customer_exists") {
      setError("Tài khoản khách hàng đã tồn tại. Vui lòng đăng nhập.");
    }
  }, [searchParams]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validate phone number
      if (!phone || !phone.trim()) {
        setError("Vui lòng cung cấp số điện thoại");
        setLoading(false);
        return;
      }

      // Store customer data in localStorage temporarily
      localStorage.setItem('pending_customer_signup', JSON.stringify({
        email,
        name: name || email.split("@")[0],
        phone,
      }));

      // Send OTP code to email
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
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

      // Check if customer account already exists (in case of re-login)
      const { data: existingCustomer } = await supabase
        .from("customer_accounts")
        .select("id")
        .eq("id", authData.user.id)
        .maybeSingle();

      if (existingCustomer) {
        // Clean up temporary data
        localStorage.removeItem('pending_customer_signup');
        // Customer account already exists, redirect to home
        window.location.href = "/";
        return;
      }

      // Get signup data from localStorage
      const pendingSignup = localStorage.getItem('pending_customer_signup');
      const signupData = pendingSignup ? JSON.parse(pendingSignup) : {
        name: name || email.split("@")[0],
        phone,
      };

      // Create customer account
      const result = await createCustomerAccount({
        userId: authData.user.id,
        email,
        name: signupData.name,
        phone: signupData.phone,
      });

      if (!result.success) {
        setError(result.error || "Failed to create customer account");
        setLoading(false);
        return;
      }

      // Clean up temporary data
      localStorage.removeItem('pending_customer_signup');

      // Redirect to homepage
      window.location.href = "/";
    } catch (err) {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600" />
            <span className="text-xl font-bold text-gray-900">BeautiPick</span>
          </Link>
        </div>

        <div className="card p-8">
          <h1 className="text-2xl font-bold text-gray-900">Tạo tài khoản</h1>
          <p className="mt-2 text-gray-600">Đăng ký để đặt lịch tại các salon yêu thích</p>

          {error && (
            <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="mt-6 space-y-4">
              <div>
                <label htmlFor="name" className="label">
                  Tên của bạn
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input mt-1"
                  placeholder="Nguyễn Văn A"
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
                  placeholder="0901234567"
                  required
                />
              </div>

            {/* Google OAuth Button - only enabled if phone is entered */}
            <div>
              <button
                type="button"
                onClick={async () => {
                  if (!phone || !phone.trim()) {
                    setError("Vui lòng cung cấp số điện thoại trước");
                    return;
                  }
                  setError(null);
                  setLoading(true);
                  try {
                    // Store phone and name in localStorage for OAuth callback
                    localStorage.setItem('pending_customer_signup', JSON.stringify({
                      user_type: "customer",
                      name: name || '',
                      phone: phone,
                    }));

                    const { error } = await supabase.auth.signInWithOAuth({
                      provider: "google",
                      options: {
                        redirectTo: `${window.location.origin}/auth/callback?type=customer&name=${encodeURIComponent(name || '')}&phone=${encodeURIComponent(phone)}`,
                        queryParams: {
                          prompt: 'select_account',
                        },
                      },
                    });

                    if (error) {
                      setError(error.message);
                    }
                  } catch {
                    setError("An unexpected error occurred");
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading || !phone.trim()}
                className="flex w-full items-center justify-center gap-3 rounded-lg border-2 border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                {loading ? "Đang kết nối..." : "Continue with Google"}
              </button>
            </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-500">Or continue with email</span>
                </div>
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
            <form onSubmit={handleVerifyOtp} className="mt-6 space-y-4">
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

          <p className="mt-6 text-center text-sm text-gray-600">
            Đã có tài khoản?{" "}
            <Link href="/login" className="font-medium text-purple-600 hover:text-purple-500">
              Đăng nhập
            </Link>
          </p>

          <p className="mt-4 text-center text-xs text-gray-500">
            Bạn là chủ salon?{" "}
            <Link href="/business/signup" className="font-medium text-purple-600 hover:text-purple-500">
              Đăng ký tại đây
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <div className="animate-pulse text-center">
          <div className="h-12 w-12 rounded-full border-4 border-purple-600 border-r-transparent animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <SignupContent />
    </Suspense>
  );
}
