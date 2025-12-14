"use client";

import { useState } from "react";
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Store } from "lucide-react";

export default function BusinessLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
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
    } finally {
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

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
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

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mật khẩu
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>

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
