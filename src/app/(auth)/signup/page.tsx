"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { createCustomerAccount } from "@/app/actions/auth";
import { OAuthButtons } from "@/components/auth/OAuthButtons";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
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

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?type=customer`,
          data: {
            user_type: "customer",
            name: name || email.split("@")[0],
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
        // Customer account will be created after email confirmation in auth callback
        setSuccess(true);
        return;
      }

      // No email confirmation required - create account immediately
      const result = await createCustomerAccount({
        userId: authData.user.id,
        email,
        name: name || email.split("@")[0],
        phone: phone,
      });

      if (!result.success) {
        setError(result.error || "Failed to create customer account");
        setLoading(false);
        return;
      }

      // Redirect to homepage
      router.push("/");
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
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 px-4">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600" />
              <span className="text-xl font-bold text-gray-900">BeautiPick</span>
            </Link>
          </div>

          <div className="card p-8 text-center">
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
              href="/login"
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

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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

            <div>
              <label htmlFor="password" className="label">
                Password
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
                At least 6 characters
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
