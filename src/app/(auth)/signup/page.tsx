"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { generateSlug } from "@/lib/utils";
import { defaultTheme, defaultSettings } from "@/types/database";
import { OAuthButtons } from "@/components/auth/OAuthButtons";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      if (!authData.user) {
        setError("Failed to create account");
        return;
      }

      // Create merchant profile
      const slug = generateSlug(businessName);
      const { error: merchantError } = await supabase.from("merchants").insert({
        id: authData.user.id,
        email,
        business_name: businessName,
        slug,
        theme: defaultTheme,
        settings: defaultSettings,
      });

      if (merchantError) {
        setError(merchantError.message);
        return;
      }

      router.push("/dashboard/onboarding");
      router.refresh();
    } catch {
      setError("An unexpected error occurred");
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
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="mt-2 text-gray-600">Start accepting bookings in minutes</p>

          <div className="mt-6">
            <OAuthButtons redirectTo="/dashboard/onboarding" />
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
              <label htmlFor="businessName" className="label">
                Business Name
              </label>
              <input
                id="businessName"
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="input mt-1"
                placeholder="Your Salon Name"
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
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-purple-600 hover:text-purple-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
