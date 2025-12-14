"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { OAuthButtons } from "@/components/auth/OAuthButtons";

export default function LoginPage() {
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
        console.error('[Login] Auth error:', error);
        setError(`Đăng nhập thất bại: ${error.message}`);
        setLoading(false);
        return;
      }

      if (data.user) {
        console.log('[Login] User logged in:', data.user.id);

        // Check if customer account exists
        const { data: customerAccount, error: customerError } = await supabase
          .from("customer_accounts")
          .select("id")
          .eq("id", data.user.id)
          .maybeSingle();

        console.log('[Login] Customer account query result:', { customerAccount, customerError });

        if (customerError) {
          console.error('[Login] Error querying customer account:', customerError);
          await supabase.auth.signOut();
          setError(`Lỗi kết nối cơ sở dữ liệu: ${customerError.message}`);
          setLoading(false);
          return;
        }

        if (!customerAccount) {
          console.log('[Login] No customer account found, checking for merchant account');

          // No customer account found
          // Check if user has merchant account
          const { data: merchantAccount, error: merchantError } = await supabase
            .from("merchants")
            .select("id")
            .eq("id", data.user.id)
            .maybeSingle();

          console.log('[Login] Merchant account query result:', { merchantAccount, merchantError });

          if (merchantAccount) {
            // User is a merchant but doesn't have customer account yet
            await supabase.auth.signOut();
            setError("Bạn chỉ có tài khoản salon. Vui lòng đăng ký tài khoản khách hàng tại /signup hoặc đăng nhập salon tại /business/login");
            setLoading(false);
            return;
          } else {
            // No account at all - user needs to sign up first
            console.log('[Login] No customer or merchant account found');
            await supabase.auth.signOut();
            setError("Tài khoản chưa được đăng ký. Vui lòng đăng ký tại trang /signup trước khi đăng nhập.");
            setLoading(false);
            return;
          }
        }

        console.log('[Login] Valid customer account found, redirecting to home');
        // Valid customer account exists (user may also have merchant account, that's ok)
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      console.error('[Login] Unexpected error:', err);
      setError(`Lỗi không mong đợi: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
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
          <h1 className="text-2xl font-bold text-gray-900">Chào mừng trở lại</h1>
          <p className="mt-2 text-gray-600">Đăng nhập vào tài khoản của bạn</p>

          <div className="mt-6">
            <OAuthButtons redirectTo="/" userType="customer" />
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

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
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-md w-full"
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Chưa có tài khoản?{" "}
            <Link href="/signup" className="font-medium text-purple-600 hover:text-purple-500">
              Đăng ký
            </Link>
          </p>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-center text-xs text-gray-500">
              Bạn là chủ salon?{" "}
              <Link href="/business/login" className="font-medium text-purple-600 hover:text-purple-500">
                Đăng nhập tại đây
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
