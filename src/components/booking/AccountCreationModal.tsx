"use client";

import { useState } from "react";
import { X, Mail, Check, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

interface AccountCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  merchantId: string;
  primaryColor?: string;
}

export function AccountCreationModal({
  isOpen,
  onClose,
  customerEmail,
  customerName,
  customerPhone,
  merchantId,
  primaryColor = "#3B82F6",
}: AccountCreationModalProps) {
  const t = useTranslations("customerAccount");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const handleSendMagicLink = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Send magic link with metadata
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email: customerEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            user_type: "customer",
            name: customerName,
            phone: customerPhone,
            first_merchant_id: merchantId,
          },
        },
      });

      if (signInError) throw signInError;

      setEmailSent(true);
    } catch (err) {
      console.error("Error sending magic link:", err);
      setError(err instanceof Error ? err.message : "Failed to send magic link");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
          // Pass customer data as state
          skipBrowserRedirect: false,
        },
      });

      if (signInError) throw signInError;
    } catch (err) {
      console.error("Error with Google sign in:", err);
      setError(err instanceof Error ? err.message : "Failed to sign in with Google");
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden pointer-events-auto transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {emailSent ? (
            // Email Sent Success State
            <div className="p-8 text-center">
              <div
                className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                style={{ backgroundColor: `${primaryColor}20` }}
              >
                <Mail className="w-10 h-10" style={{ color: primaryColor }} />
              </div>
              <h2 className="text-2xl font-bold mb-3 text-gray-900">
                {t("checkYourEmail")}
              </h2>
              <p className="text-gray-600 mb-2">
                {t("magicLinkSent")}
              </p>
              <p className="text-sm text-gray-500 mb-8">
                {customerEmail}
              </p>
              <button
                onClick={onClose}
                className="w-full py-3 rounded-2xl font-semibold text-white transition-all hover:opacity-90"
                style={{ backgroundColor: primaryColor }}
              >
                {t("gotIt")}
              </button>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="px-6 py-5 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {t("createAccount")}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {t("trackYourBookings")}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                    {error}
                  </div>
                )}

                {/* Email Preview */}
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${primaryColor}20` }}
                    >
                      <Mail className="w-5 h-5" style={{ color: primaryColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{customerName}</p>
                      <p className="text-sm text-gray-600 truncate">{customerEmail}</p>
                    </div>
                  </div>
                </div>

                {/* Magic Link Button */}
                <button
                  onClick={handleSendMagicLink}
                  disabled={isLoading}
                  className="w-full py-4 rounded-2xl font-bold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ backgroundColor: primaryColor }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {t("sendingLink")}
                    </>
                  ) : (
                    <>
                      <Mail className="w-5 h-5" />
                      {t("sendMagicLink")}
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">{t("orContinueWith")}</span>
                  </div>
                </div>

                {/* Google Sign In Button */}
                <button
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full py-4 rounded-2xl font-bold border-2 border-gray-200 bg-white hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span className="text-gray-700">{t("continueWithGoogle")}</span>
                </button>

                {/* Skip Option */}
                <button
                  onClick={onClose}
                  className="w-full text-center text-sm text-gray-500 hover:text-gray-700 transition-colors py-2"
                >
                  {t("skipForNow")}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
