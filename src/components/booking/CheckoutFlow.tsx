"use client";

import { useState, useEffect } from "react";
import { X, Check, Calendar, Clock, User, Phone, Mail, MessageSquare, Loader2 } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { ThemeCartHandlers } from "./themes/types";
import { useCheckoutFlow } from "./hooks/useCheckoutFlow";
import { createClient } from "@/lib/supabase/client";

interface CheckoutFlowProps {
  isOpen: boolean;
  onClose: () => void;
  cart: ThemeCartHandlers;
  merchantId: string;
  merchantName: string;
  currency: string;
  primaryColor?: string;
}

export function CheckoutFlow({
  isOpen,
  onClose,
  cart,
  merchantId,
  merchantName,
  currency,
  primaryColor = "#3B82F6",
}: CheckoutFlowProps) {
  const t = useTranslations("checkout");
  const tAccount = useTranslations("customerAccount");
  const locale = useLocale();
  const [showAccountCreation, setShowAccountCreation] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [accountError, setAccountError] = useState<string | null>(null);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [tempEmail, setTempEmail] = useState("");
  const [tempPhone, setTempPhone] = useState("");
  const [tempName, setTempName] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const supabase = createClient();

  const checkout = useCheckoutFlow({
    isOpen,
    cart,
    merchantId,
    merchantName,
    currency,
    locale,
  });

  // Listen for OAuth popup success
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data.type === 'OAUTH_SUCCESS') {
        console.log('[CheckoutFlow] Received OAuth success from popup');
        setIsCreatingAccount(false);

        // Wait a bit for session to be established
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Check if user now has a session
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          console.log('[CheckoutFlow] User authenticated after popup:', user.id);

          // Link pending booking if exists
          const pendingBookingId = localStorage.getItem('pending_booking_id');
          if (pendingBookingId) {
            console.log('[CheckoutFlow] Linking pending booking to new account:', pendingBookingId);
            try {
              const linkResponse = await fetch('/api/bookings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  bookingId: pendingBookingId,
                  customerId: user.id,
                }),
              });

              const linkResult = await linkResponse.json();

              if (linkResponse.ok) {
                console.log('[CheckoutFlow] Successfully linked booking:', linkResult);
                localStorage.removeItem('pending_booking_id');
                document.cookie = 'pending_booking_id=; path=/; max-age=0';
              } else {
                console.error('[CheckoutFlow] Failed to link booking:', linkResult);
              }
            } catch (error) {
              console.error('[CheckoutFlow] Error linking booking:', error);
            }
          }

          // Close checkout and redirect to appointments
          handleCloseCheckout();
          window.location.href = '/account/appointments';
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [supabase]);

  const handleSendMagicLink = async () => {
    const emailToUse = tempEmail;
    const phoneToUse = tempPhone;
    const nameToUse = tempName;

    if (!emailToUse || !emailToUse.trim()) {
      setAccountError(locale === 'vi' ? "Vui lòng cung cấp địa chỉ email" : "Please provide email address");
      return;
    }

    // Only require phone for signup, not login
    if (authMode === 'signup' && (!phoneToUse || !phoneToUse.trim())) {
      setAccountError(locale === 'vi' ? "Vui lòng cung cấp số điện thoại" : "Please provide phone number");
      return;
    }

    setIsCreatingAccount(true);
    setAccountError(null);

    try {
      const signInOptions: any = {
        email: emailToUse,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?type=customer`,
        },
      };

      // Only add user metadata for signup
      if (authMode === 'signup') {
        signInOptions.options.data = {
          user_type: "customer",
          name: nameToUse || emailToUse.split('@')[0],
          phone: phoneToUse,
          first_merchant_id: merchantId,
        };
      }

      const { error: signInError } = await supabase.auth.signInWithOtp(signInOptions);

      if (signInError) throw signInError;

      setEmailSent(true);
      // After email sent, user will verify and come back logged in
    } catch (err) {
      console.error("Error sending magic link:", err);
      setAccountError(err instanceof Error ? err.message : (locale === 'vi' ? "Không thể gửi liên kết đăng nhập" : "Unable to send login link"));
    } finally {
      setIsCreatingAccount(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const phoneToUse = tempPhone;
    const nameToUse = tempName;

    if (!phoneToUse || !phoneToUse.trim()) {
      setAccountError(locale === 'vi' ? "Vui lòng cung cấp số điện thoại" : "Please provide phone number");
      return;
    }

    setIsCreatingAccount(true);
    setAccountError(null);

    try {
      // Store customer info in localStorage for Google OAuth callback
      const customerData = {
        user_type: "customer",
        name: nameToUse,
        phone: phoneToUse,
        first_merchant_id: merchantId,
      };
      localStorage.setItem('pending_customer_signup', JSON.stringify(customerData));

      console.log('[CheckoutFlow] Starting Google OAuth...');

      // Get the OAuth URL first (synchronously before popup)
      const { data, error: signInError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback-popup?type=customer&merchant_id=${merchantId}&name=${encodeURIComponent(nameToUse || '')}&phone=${encodeURIComponent(phoneToUse)}`,
          queryParams: {
            prompt: 'select_account',
          },
          skipBrowserRedirect: true, // Don't redirect main window
        },
      });

      console.log('[CheckoutFlow] OAuth response:', { hasData: !!data, hasUrl: !!data?.url, error: signInError });

      if (signInError) {
        throw signInError;
      }

      if (data?.url) {
        console.log('[CheckoutFlow] Opening popup with URL:', data.url);

        // Open popup AFTER we have the URL
        const width = 500;
        const height = 600;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;

        const popup = window.open(
          data.url,  // Open directly with the OAuth URL
          'googleSignIn',
          `width=${width},height=${height},left=${left},top=${top},popup=1,toolbar=0,location=0,menubar=0`
        );

        console.log('[CheckoutFlow] Popup opened:', !!popup);

        if (!popup) {
          console.error('[CheckoutFlow] Popup was blocked!');
          throw new Error(locale === 'vi' ? "Popup bị chặn. Vui lòng cho phép popup cho trang này." : "Popup blocked. Please allow popups for this site.");
        } else {
          console.log('[CheckoutFlow] Popup successfully opened');
        }
      } else {
        console.error('[CheckoutFlow] No URL received from Supabase');
      }
    } catch (err) {
      console.error("Error with Google sign in:", err);
      setAccountError(err instanceof Error ? err.message : (locale === 'vi' ? "Không thể đăng nhập bằng Google" : "Unable to sign in with Google"));
      setIsCreatingAccount(false);
    }
  };

  const handleSendOtpForAccountCreation = async () => {
    if (!email || !email.trim()) {
      setAccountError(locale === 'vi' ? "Vui lòng nhập email" : "Please enter email");
      return;
    }

    setIsCreatingAccount(true);
    setAccountError(null);

    try {
      // Store customer data in localStorage
      localStorage.setItem('pending_checkout_account', JSON.stringify({
        email,
        name: checkout.customerName,
        phone: checkout.customerPhone,
        merchantId,
      }));

      // Send OTP
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
        },
      });

      if (otpError) throw otpError;

      setEmailSent(true);
    } catch (err) {
      console.error("Error sending OTP:", err);
      setAccountError(err instanceof Error ? err.message : (locale === 'vi' ? "Không thể gửi mã xác nhận" : "Unable to send verification code"));
    } finally {
      setIsCreatingAccount(false);
    }
  };

  const handleVerifyOtpForAccountCreation = async () => {
    if (!otp || otp.trim().length < 4) {
      setAccountError(locale === 'vi' ? "Vui lòng nhập mã xác nhận" : "Please enter verification code");
      return;
    }

    setIsCreatingAccount(true);
    setAccountError(null);

    try {
      // Verify OTP
      const { data: authData, error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "email",
      });

      if (verifyError) throw verifyError;

      if (!authData.user) {
        throw new Error('No user returned from verification');
      }

      // Get customer data from localStorage
      const pendingAccount = localStorage.getItem('pending_checkout_account');
      const accountData = pendingAccount ? JSON.parse(pendingAccount) : {
        name: checkout.customerName,
        phone: checkout.customerPhone,
      };

      // Check if customer account already exists
      const { data: existingCustomer } = await supabase
        .from("customer_accounts")
        .select("id")
        .eq("id", authData.user.id)
        .maybeSingle();

      if (!existingCustomer) {
        // Create customer account
        const response = await fetch('/api/customer-accounts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: authData.user.id,
            email,
            name: accountData.name,
            phone: accountData.phone,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          console.error('Customer account creation error:', errorData);
          throw new Error(errorData.error || 'Failed to create customer account');
        }

        console.log('Customer account created successfully');
      }

      // Clean up temporary data
      localStorage.removeItem('pending_checkout_account');

      // Link pending booking to account
      const pendingBookingId = localStorage.getItem('pending_booking_id');
      if (pendingBookingId && authData.user) {
        console.log('[CheckoutFlow] Linking pending booking to new account:', { bookingId: pendingBookingId, userId: authData.user.id });
        try {
          const linkResponse = await fetch('/api/bookings', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              bookingId: pendingBookingId,
              customerId: authData.user.id,
            }),
          });

          const linkResult = await linkResponse.json();

          if (linkResponse.ok) {
            console.log('[CheckoutFlow] Successfully linked booking:', linkResult);
            localStorage.removeItem('pending_booking_id');
            document.cookie = 'pending_booking_id=; path=/; max-age=0';
          } else {
            console.error('[CheckoutFlow] Failed to link booking:', linkResult);
          }
        } catch (error) {
          console.error('[CheckoutFlow] Error linking booking:', error);
        }
      }

      handleCloseCheckout();
      // Redirect to appointments page to see the booking
      window.location.href = '/account/appointments';
    } catch (err) {
      console.error("Error verifying OTP:", err);
      setAccountError(err instanceof Error ? err.message : (locale === 'vi' ? "Không thể xác nhận mã" : "Unable to verify code"));
    } finally {
      setIsCreatingAccount(false);
    }
  };

  const handleCloseCheckout = () => {
    onClose();
    checkout.resetToInitialStep();
    setShowAccountCreation(false);
    setEmailSent(false);
    setAccountError(null);
    setShowEmailInput(false);
    setTempEmail("");
    setTempPhone("");
    setTempName("");
    setShowPasswordForm(false);
    setOtp("");
    setEmail("");
    setShowAuthForm(false);
    setAuthMode('login');
  };

  // Clean up pending booking ID if user is logged in (booking was linked)
  useEffect(() => {
    if (checkout.isLoggedIn && checkout.currentStep === "success") {
      const pendingBookingId = localStorage.getItem('pending_booking_id');
      if (pendingBookingId) {
        console.log('[CheckoutFlow] Cleaning up pending booking ID after successful sign-in');
        localStorage.removeItem('pending_booking_id');
        // Clear cookie
        document.cookie = 'pending_booking_id=; path=/; max-age=0';
      }
    }
  }, [checkout.isLoggedIn, checkout.currentStep]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
        onClick={handleCloseCheckout}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Success State */}
          {checkout.currentStep === "success" ? (
            <div className="p-8">
              {/* Success Icon */}
              <div
                className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center"
                style={{ backgroundColor: primaryColor }}
              >
                <Check className="w-14 h-14 text-white" strokeWidth={3} />
              </div>

              {/* Success Message */}
              <h2 className="text-2xl font-bold mb-3 text-gray-900 text-center">
                {t("orderSuccess")}
              </h2>
              <p className="text-gray-600 mb-2 text-center">
                {t("thankYouMessage", { merchantName })}
              </p>
              <p className="text-sm text-gray-500 mb-6 text-center">
                {t("merchantWillContact")}
              </p>

              {/* Account Creation Section (for guests only) */}
              {!checkout.isLoggedIn && (
                <div className="space-y-4">
                  {!showPasswordForm ? (
                    <>
                      {/* Info box */}
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                        <p className="text-sm text-gray-900 font-semibold text-center mb-1">
                          {t("trackOrdersAndGetUpdates")}
                        </p>
                        <p className="text-xs text-gray-600 text-center">
                          {t("createAccountToTrack")}
                        </p>
                      </div>

                      {/* Create Account Button */}
                      <button
                        onClick={() => {
                          setShowPasswordForm(true);
                          setEmailSent(false);
                          setOtp("");
                        }}
                        className="w-full py-4 rounded-xl font-bold text-white transition-all hover:opacity-90 flex items-center justify-center gap-2"
                        style={{ backgroundColor: primaryColor }}
                      >
                        <User className="w-5 h-5" />
                        {tAccount("createAccount")}
                      </button>

                      {/* Skip Button */}
                      <button
                        onClick={handleCloseCheckout}
                        className="w-full py-3 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        {t("skipForNow")}
                      </button>
                    </>
                  ) : emailSent ? (
                    <>
                      {/* OTP Verification Screen */}
                      <div className="space-y-4">
                        <div className="text-center mb-4">
                          <Mail className="w-12 h-12 mx-auto mb-3" style={{ color: primaryColor }} />
                          <p className="text-sm font-semibold text-gray-900 mb-1">
                            {tAccount("checkYourEmail")}
                          </p>
                          <p className="text-xs text-gray-600">
                            {locale === 'vi'
                              ? `Mã xác nhận đã được gửi đến ${email}`
                              : `Verification code sent to ${email}`}
                          </p>
                        </div>

                        {accountError && (
                          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 text-center">
                            {accountError}
                          </div>
                        )}

                        {/* OTP Input */}
                        <div>
                          <label className="text-sm font-semibold text-gray-900 mb-2 block">
                            {locale === 'vi' ? "Mã xác nhận" : "Verification Code"}
                          </label>
                          <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.trim())}
                            placeholder={locale === 'vi' ? "Nhập mã từ email" : "Enter code from email"}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 focus:outline-none focus:border-purple-500 focus:bg-white transition-all text-center text-lg tracking-wider font-mono"
                            autoComplete="one-time-code"
                          />
                          <p className="text-xs text-gray-500 mt-1 text-center">
                            {locale === 'vi' ? "Sao chép và dán mã từ email" : "Copy and paste code from email"}
                          </p>
                        </div>

                        {/* Verify Button */}
                        <button
                          onClick={handleVerifyOtpForAccountCreation}
                          disabled={isCreatingAccount || otp.length < 4}
                          className="w-full py-4 rounded-xl font-bold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          style={{ backgroundColor: primaryColor }}
                        >
                          {isCreatingAccount ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              {locale === 'vi' ? "Đang xác nhận..." : "Verifying..."}
                            </>
                          ) : (
                            <>
                              <Check className="w-5 h-5" />
                              {locale === 'vi' ? "Xác nhận và tạo tài khoản" : "Verify and Create Account"}
                            </>
                          )}
                        </button>

                        {/* Back to email */}
                        <button
                          onClick={() => {
                            setEmailSent(false);
                            setOtp("");
                            setAccountError(null);
                          }}
                          className="w-full py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                        >
                          {locale === 'vi' ? "Gửi lại mã hoặc thay đổi email" : "Resend code or change email"}
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Email OTP Account Creation Form */}
                      <div className="space-y-4">
                        {accountError && (
                          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 text-center">
                            {accountError}
                          </div>
                        )}

                        {/* Google Sign In */}
                        <button
                          onClick={async () => {
                            setIsCreatingAccount(true);
                            setAccountError(null);
                            try {
                              // Detect if mobile device
                              const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

                              // Store customer info for OAuth
                              const customerData = {
                                user_type: "customer",
                                name: checkout.customerName,
                                phone: checkout.customerPhone,
                                first_merchant_id: merchantId,
                              };
                              localStorage.setItem('pending_customer_signup', JSON.stringify(customerData));

                              if (isMobile) {
                                // On mobile, use redirect flow
                                console.log('[CheckoutFlow SUCCESS] Mobile detected, using redirect flow');
                                const { error } = await supabase.auth.signInWithOAuth({
                                  provider: "google",
                                  options: {
                                    redirectTo: `${window.location.origin}/auth/callback?type=customer&name=${encodeURIComponent(checkout.customerName || '')}&phone=${encodeURIComponent(checkout.customerPhone)}`,
                                    queryParams: {
                                      prompt: 'select_account',
                                    },
                                  },
                                });

                                if (error) throw error;
                                // Redirect will happen automatically, loading state continues
                              } else {
                                // On desktop, use popup flow
                                console.log('[CheckoutFlow SUCCESS] Desktop detected, using popup flow');
                                const { data, error } = await supabase.auth.signInWithOAuth({
                                  provider: "google",
                                  options: {
                                    redirectTo: `${window.location.origin}/auth/callback-popup?type=customer&name=${encodeURIComponent(checkout.customerName || '')}&phone=${encodeURIComponent(checkout.customerPhone)}`,
                                    queryParams: {
                                      prompt: 'select_account',
                                    },
                                    skipBrowserRedirect: true, // Don't redirect main window
                                  },
                                });

                                console.log('[CheckoutFlow SUCCESS] OAuth response:', { hasData: !!data, hasUrl: !!data?.url, error });

                                if (error) throw error;

                                if (data?.url) {
                                  console.log('[CheckoutFlow SUCCESS] Opening popup with URL');

                                  // Open popup with OAuth URL
                                  const width = 500;
                                  const height = 600;
                                  const left = window.screenX + (window.outerWidth - width) / 2;
                                  const top = window.screenY + (window.outerHeight - height) / 2;

                                  const popup = window.open(
                                    data.url,
                                    'googleSignIn',
                                    `width=${width},height=${height},left=${left},top=${top},popup=1,toolbar=0,location=0,menubar=0`
                                  );

                                  console.log('[CheckoutFlow SUCCESS] Popup opened:', !!popup);

                                  if (!popup) {
                                    throw new Error(locale === 'vi' ? "Popup bị chặn. Vui lòng cho phép popup." : "Popup blocked. Please allow popups.");
                                  } else {
                                    setIsCreatingAccount(false);
                                  }
                                }
                              }
                            } catch (err) {
                              console.error("[CheckoutFlow SUCCESS] Error with Google sign in:", err);
                              setAccountError(err instanceof Error ? err.message : (locale === 'vi' ? "Không thể đăng nhập bằng Google" : "Unable to sign in with Google"));
                              setIsCreatingAccount(false);
                            }
                          }}
                          disabled={isCreatingAccount}
                          className="w-full py-4 rounded-xl font-bold border-2 border-gray-200 bg-white hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                          </svg>
                          <span className="text-gray-700">
                            {isCreatingAccount ? tAccount("sendingLink") : tAccount("continueWithGoogle")}
                          </span>
                        </button>

                        {/* Divider */}
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                          </div>
                          <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">
                              {locale === 'vi' ? "Or continue with email" : "Or continue with email"}
                            </span>
                          </div>
                        </div>

                        {/* Email Input */}
                        <div>
                          <label className="text-sm font-semibold text-gray-900 mb-2 block">Email</label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 focus:outline-none focus:border-purple-500 focus:bg-white transition-all"
                          />
                        </div>

                        {/* Send OTP Button */}
                        <button
                          onClick={handleSendOtpForAccountCreation}
                          disabled={isCreatingAccount || !email.trim()}
                          className="w-full py-4 rounded-xl font-bold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          style={{ backgroundColor: primaryColor }}
                        >
                          {isCreatingAccount ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              {locale === 'vi' ? "Đang gửi..." : "Sending..."}
                            </>
                          ) : (
                            <>
                              <Mail className="w-5 h-5" />
                              {locale === 'vi' ? "Gửi mã xác nhận" : "Send Verification Code"}
                            </>
                          )}
                        </button>

                        {/* Back to options */}
                        <button
                          onClick={() => {
                            setShowPasswordForm(false);
                            setEmail("");
                            setOtp("");
                            setAccountError(null);
                          }}
                          className="w-full py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                        >
                          {t("back")}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Logged in users - just close button */}
              {checkout.isLoggedIn && (
                <button
                  onClick={handleCloseCheckout}
                  className="w-full py-4 rounded-2xl font-bold text-white transition-all hover:opacity-90"
                  style={{ backgroundColor: primaryColor }}
                >
                  {t("close")}
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="px-6 py-5 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    {checkout.currentStep === "datetime" && t("selectDateTime")}
                    {checkout.currentStep === "info" && t("customerInfo")}
                    {checkout.currentStep === "confirm" && t("confirmOrder")}
                  </h2>
                  <button
                    onClick={handleCloseCheckout}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-center gap-2">
                  {checkout.hasServices && (
                    <>
                      <div
                        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                          checkout.currentStep === "datetime" ? "shadow-sm" : ""
                        }`}
                        style={{
                          backgroundColor: checkout.currentStep === "datetime" ? primaryColor :
                                         checkout.getStepStatus("datetime") === "completed" ? "#F3F4F6" : "#F3F4F6",
                          border: `2px solid ${checkout.getStepStatus("datetime") === "completed" ? primaryColor :
                                  checkout.currentStep === "datetime" ? primaryColor : "#E5E7EB"}`,
                        }}
                      >
                        <Calendar
                          className="w-4 h-4"
                          style={{ color: checkout.currentStep === "datetime" ? "white" :
                                  checkout.getStepStatus("datetime") === "completed" ? primaryColor : "#9CA3AF" }}
                        />
                        <span
                          className="text-sm font-semibold"
                          style={{ color: checkout.currentStep === "datetime" ? "white" :
                                  checkout.getStepStatus("datetime") === "completed" ? primaryColor : "#9CA3AF" }}
                        >
                          {t("dateTime")}
                        </span>
                      </div>
                      <div className="w-2 h-0.5 bg-gray-300"></div>
                    </>
                  )}

                  <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                      checkout.currentStep === "info" ? "shadow-sm" : ""
                    }`}
                    style={{
                      backgroundColor: checkout.currentStep === "info" ? primaryColor :
                                     checkout.getStepStatus("info") === "completed" ? "#F3F4F6" : "#F3F4F6",
                      border: `2px solid ${checkout.getStepStatus("info") === "completed" ? primaryColor :
                              checkout.currentStep === "info" ? primaryColor : "#E5E7EB"}`,
                    }}
                  >
                    <User
                      className="w-4 h-4"
                      style={{ color: checkout.currentStep === "info" ? "white" :
                              checkout.getStepStatus("info") === "completed" ? primaryColor : "#9CA3AF" }}
                    />
                    <span
                      className="text-sm font-semibold"
                      style={{ color: checkout.currentStep === "info" ? "white" :
                              checkout.getStepStatus("info") === "completed" ? primaryColor : "#9CA3AF" }}
                    >
                      {t("information")}
                    </span>
                  </div>

                  <div className="w-2 h-0.5 bg-gray-300"></div>

                  <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                      checkout.currentStep === "confirm" ? "shadow-sm" : ""
                    }`}
                    style={{
                      backgroundColor: checkout.currentStep === "confirm" ? primaryColor : "#F3F4F6",
                      border: `2px solid ${checkout.currentStep === "confirm" ? primaryColor : "#E5E7EB"}`,
                    }}
                  >
                    <Check
                      className="w-4 h-4"
                      style={{ color: checkout.currentStep === "confirm" ? "white" : "#9CA3AF" }}
                    />
                    <span
                      className="text-sm font-semibold"
                      style={{ color: checkout.currentStep === "confirm" ? "white" : "#9CA3AF" }}
                    >
                      {t("confirmation")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-6 overflow-y-auto flex-1">
                {/* Date & Time Selection */}
                {checkout.currentStep === "datetime" && (
                  <div className="space-y-6">
                    <div>
                      <label className="flex items-center gap-2 text-base font-semibold text-gray-900 mb-4">
                        <Calendar className="w-5 h-5" style={{ color: primaryColor }} />
                        {t("selectDate")}
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {checkout.availableDates.slice(0, 12).map((date) => {
                          const isSelected = checkout.selectedDate === date;
                          return (
                            <button
                              key={date}
                              onClick={() => checkout.setSelectedDate(date)}
                              className="p-4 rounded-2xl border-2 transition-all text-center"
                              style={{
                                borderColor: isSelected ? primaryColor : '#E5E7EB',
                                backgroundColor: isSelected ? primaryColor : '#FAFAFA',
                              }}
                            >
                              <div
                                className="text-xs font-medium mb-1"
                                style={{ color: isSelected ? 'white' : '#6B7280' }}
                              >
                                {new Date(date).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', { weekday: 'short' })}
                              </div>
                              <div
                                className="text-xl font-bold mb-1"
                                style={{ color: isSelected ? 'white' : '#1F2937' }}
                              >
                                {new Date(date).getDate()}
                              </div>
                              <div
                                className="text-xs"
                                style={{ color: isSelected ? 'white' : '#6B7280' }}
                              >
                                {t("month")} {new Date(date).getMonth() + 1}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {checkout.selectedDate && (
                      <div ref={checkout.timeSelectionRef}>
                        <label className="flex items-center gap-2 text-base font-semibold text-gray-900 mb-4">
                          <Clock className="w-5 h-5" style={{ color: primaryColor }} />
                          {t("selectTime")}
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                          {checkout.timeSlots.map((time) => {
                            const isSelected = checkout.selectedTime === time;
                            return (
                              <button
                                key={time}
                                onClick={() => checkout.setSelectedTime(time)}
                                className="py-3 px-2 rounded-xl border-2 transition-all text-sm font-bold"
                                style={{
                                  backgroundColor: isSelected ? primaryColor : '#FAFAFA',
                                  borderColor: isSelected ? primaryColor : '#E5E7EB',
                                  color: isSelected ? 'white' : '#4B5563',
                                }}
                              >
                                {time}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Choose Step - Guest/Login/Create Account */}
                {checkout.currentStep === "choose" && (
                  <div className="space-y-4">
                    {!showAuthForm ? (
                      <>
                        <div className="text-center mb-6">
                          <p className="text-sm text-gray-600">{t("chooseHowToContinue")}</p>
                        </div>

                        {/* Big Guest Checkout Button */}
                        <button
                          onClick={() => {
                            checkout.setSkippedAuth(true);
                            checkout.goToNextStep();
                          }}
                          className="w-full py-6 rounded-2xl font-bold text-white text-lg transition-all hover:opacity-90 shadow-lg"
                          style={{ backgroundColor: primaryColor }}
                        >
                          {t("checkoutAsGuest")}
                        </button>

                        {/* Divider */}
                        <div className="relative my-6">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                          </div>
                          <div className="relative flex justify-center text-xs">
                            <span className="px-3 bg-white text-gray-500">{t("orContinueAs")}</span>
                          </div>
                        </div>

                        {/* Login Button */}
                        <button
                          onClick={() => {
                            setAuthMode('login');
                            setShowAuthForm(true);
                            setAccountError(null);
                          }}
                          className="w-full py-4 rounded-xl font-semibold border-2 transition-all hover:bg-gray-50 flex items-center justify-center"
                          style={{ borderColor: primaryColor, color: primaryColor }}
                        >
                          {tAccount("login")}
                        </button>

                        {/* Create Account Button */}
                        <button
                          onClick={() => {
                            setAuthMode('signup');
                            setShowAuthForm(true);
                            setAccountError(null);
                          }}
                          className="w-full py-4 rounded-xl font-semibold border-2 border-gray-200 text-gray-700 transition-all hover:bg-gray-50 flex items-center justify-center"
                        >
                          {tAccount("createAccount")}
                        </button>
                      </>
                    ) : (
                      <>
                        {/* Inline Auth Form */}
                        <div className="space-y-4">
                          <div className="text-center mb-4">
                            <h3 className="text-lg font-bold text-gray-900">
                              {authMode === 'login' ? tAccount("login") : tAccount("createAccount")}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {authMode === 'login'
                                ? (locale === 'vi' ? "Đăng nhập để tiếp tục" : "Sign in to continue")
                                : (locale === 'vi' ? "Tạo tài khoản để theo dõi đơn hàng" : "Create account to track your orders")}
                            </p>
                          </div>

                          {accountError && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 text-center">
                              {accountError}
                            </div>
                          )}

                          {emailSent ? (
                            <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-center">
                              <Check className="w-8 h-8 mx-auto mb-2 text-green-600" />
                              <p className="text-sm font-semibold text-green-800 mb-1">
                                {tAccount("checkYourEmail")}
                              </p>
                              <p className="text-xs text-gray-600">
                                {tAccount("magicLinkSent")} {tempEmail}
                              </p>
                              <button
                                onClick={() => {
                                  setShowAuthForm(false);
                                  setEmailSent(false);
                                  setTempEmail("");
                                  setTempPhone("");
                                  setTempName("");
                                }}
                                className="mt-3 text-sm font-medium"
                                style={{ color: primaryColor }}
                              >
                                {t("back")}
                              </button>
                            </div>
                          ) : (
                            <>
                              {/* Name (Optional) - Only for signup */}
                              {authMode === 'signup' && (
                                <div>
                                  <label className="text-sm font-semibold text-gray-900 mb-2 block">
                                    {t("fullName")}
                                  </label>
                                  <input
                                    type="text"
                                    value={tempName}
                                    onChange={(e) => setTempName(e.target.value)}
                                    placeholder={t("fullNamePlaceholder")}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 focus:outline-none focus:border-purple-500 focus:bg-white transition-all"
                                  />
                                </div>
                              )}

                              {/* Phone (Required) - Only for signup */}
                              {authMode === 'signup' && (
                                <div>
                                  <label className="text-sm font-semibold text-gray-900 mb-2 block">
                                    {t("phoneNumber")} <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="tel"
                                    value={tempPhone}
                                    onChange={(e) => setTempPhone(e.target.value)}
                                    placeholder={t("phoneNumberPlaceholder")}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 focus:outline-none focus:border-purple-500 focus:bg-white transition-all"
                                  />
                                </div>
                              )}

                              {/* Google Sign In */}
                              <button
                                onClick={async () => {
                                  if (authMode === 'login') {
                                    // Login with Google - no phone required
                                    setIsCreatingAccount(true);
                                    setAccountError(null);
                                    try {
                                      const { error } = await supabase.auth.signInWithOAuth({
                                        provider: "google",
                                        options: {
                                          redirectTo: `${window.location.origin}/auth/callback?type=customer`,
                                          queryParams: {
                                            access_type: "offline",
                                            prompt: "consent",
                                          },
                                        },
                                      });
                                      if (error) throw error;
                                    } catch (err) {
                                      console.error("Error with Google sign in:", err);
                                      setAccountError(err instanceof Error ? err.message : (locale === 'vi' ? "Không thể đăng nhập bằng Google" : "Unable to sign in with Google"));
                                      setIsCreatingAccount(false);
                                    }
                                  } else {
                                    // Signup - require phone
                                    handleGoogleSignIn();
                                  }
                                }}
                                disabled={isCreatingAccount || (authMode === 'signup' && !tempPhone.trim())}
                                className="w-full py-4 rounded-xl font-bold border-2 border-gray-200 bg-white hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                              >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                <span className="text-gray-700">
                                  {isCreatingAccount ? tAccount("sendingLink") : tAccount("continueWithGoogle")}
                                </span>
                              </button>

                              {/* Divider */}
                              <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                  <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                  <span className="px-3 bg-white text-gray-500">{tAccount("orContinueWith")}</span>
                                </div>
                              </div>

                              {/* Email Input */}
                              <div>
                                <label className="text-sm font-semibold text-gray-900 mb-2 block">
                                  Email
                                </label>
                                <input
                                  type="email"
                                  value={tempEmail}
                                  onChange={(e) => setTempEmail(e.target.value)}
                                  placeholder={t("emailPlaceholder")}
                                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 focus:outline-none focus:border-purple-500 focus:bg-white transition-all"
                                />
                              </div>

                              {/* Send Magic Link Button */}
                              <button
                                onClick={handleSendMagicLink}
                                disabled={isCreatingAccount || !tempEmail.trim() || (authMode === 'signup' && !tempPhone.trim())}
                                className="w-full py-4 rounded-xl font-bold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ backgroundColor: primaryColor }}
                              >
                                {isCreatingAccount ? tAccount("sendingLink") : tAccount("sendMagicLinkSignInOrUp")}
                              </button>

                              {/* Back Button */}
                              <button
                                onClick={() => {
                                  setShowAuthForm(false);
                                  setTempEmail("");
                                  setTempPhone("");
                                  setTempName("");
                                  setAccountError(null);
                                }}
                                className="w-full py-3 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                              >
                                {t("back")}
                              </button>
                            </>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Customer Information */}
                {checkout.currentStep === "info" && (
                  <div className="space-y-5">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                        <User className="w-4 h-4" style={{ color: primaryColor }} />
                        {t("fullName")} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={checkout.customerName}
                        onChange={(e) => checkout.setCustomerName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 focus:outline-none focus:border-current focus:bg-white transition-all"
                        style={{ borderColor: checkout.customerName ? primaryColor : undefined } as React.CSSProperties}
                        placeholder={t("fullNamePlaceholder")}
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                        <Phone className="w-4 h-4" style={{ color: primaryColor }} />
                        {t("phoneNumber")} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={checkout.customerPhone}
                        onChange={(e) => checkout.setCustomerPhone(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 focus:outline-none focus:border-current focus:bg-white transition-all"
                        style={{ borderColor: checkout.customerPhone ? primaryColor : undefined } as React.CSSProperties}
                        placeholder={t("phoneNumberPlaceholder")}
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                        <MessageSquare className="w-4 h-4" style={{ color: primaryColor }} />
                        {t("notesOptional")}
                      </label>
                      <textarea
                        value={checkout.notes}
                        onChange={(e) => checkout.setNotes(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 focus:outline-none focus:border-current focus:bg-white transition-all resize-none"
                        style={{ borderColor: checkout.notes ? primaryColor : undefined } as React.CSSProperties}
                        placeholder={t("notesPlaceholder")}
                      />
                    </div>
                  </div>
                )}

                {/* Confirmation */}
                {checkout.currentStep === "confirm" && (
                  <div className="space-y-4">
                    {checkout.hasServices && (
                      <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
                        <div className="flex items-center gap-2 mb-3">
                          <Calendar className="w-5 h-5" style={{ color: primaryColor }} />
                          <h3 className="font-bold text-gray-900">{t("scheduledTime")}</h3>
                        </div>
                        <p className="text-sm text-gray-700 font-medium">
                          {checkout.formatDate(checkout.selectedDate)}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {t("time")}: {checkout.selectedTime}
                        </p>
                      </div>
                    )}

                    <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
                      <div className="flex items-center gap-2 mb-3">
                        <User className="w-5 h-5" style={{ color: primaryColor }} />
                        <h3 className="font-bold text-gray-900">{t("contactInfo")}</h3>
                      </div>
                      <div className="space-y-1.5 text-sm">
                        <p className="text-gray-900 font-semibold">{checkout.customerName}</p>
                        <p className="text-gray-700">{checkout.customerPhone}</p>
                        {checkout.customerEmail && (
                          <p className="text-gray-700">{checkout.customerEmail}</p>
                        )}
                        {checkout.notes && (
                          <p className="text-gray-600 mt-3 italic border-t border-gray-200 pt-2">
                            "{checkout.notes}"
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
                      <h3 className="font-bold text-gray-900 mb-4">{t("orderDetails")}</h3>
                      <div className="space-y-3">
                        {cart.cart.map((item) => (
                          <div key={item.id} className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900">
                                {item.type === "service" ? item.service.name : item.product.name}
                              </p>
                              {item.type === "product" && (
                                <p className="text-sm text-gray-600">{t("quantity")}: {item.quantity}</p>
                              )}
                            </div>
                            <p className="font-bold text-gray-900 ml-3">
                              {checkout.formatPrice(
                                item.type === "service"
                                  ? item.service.price
                                  : item.product.price * item.quantity
                              )}
                            </p>
                          </div>
                        ))}
                        <div className="pt-3 mt-3 border-t-2 border-gray-200 flex justify-between items-center">
                          <span className="text-lg font-bold text-gray-900">{t("total")}</span>
                          <span
                            className="text-2xl font-bold"
                            style={{ color: primaryColor }}
                          >
                            {checkout.formatPrice(checkout.calculateTotal())}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-5 border-t border-gray-100 bg-white">
                <div className="flex gap-3">
                  {(checkout.currentStep === "info" || checkout.currentStep === "confirm") && (
                    <button
                      onClick={checkout.goToPreviousStep}
                      className="px-6 py-3 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      {t("back")}
                    </button>
                  )}

                  {checkout.currentStep === "datetime" && (
                    <button
                      onClick={checkout.goToNextStep}
                      disabled={!checkout.canProceedFromDateTime()}
                      className="flex-1 py-4 rounded-2xl font-bold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {t("continue")}
                    </button>
                  )}

                  {checkout.currentStep === "info" && (
                    <button
                      onClick={() => {
                        if (!checkout.canProceedFromInfo()) {
                          alert(t("pleaseEnterRequired"));
                          return;
                        }
                        checkout.goToNextStep();
                      }}
                      disabled={!checkout.canProceedFromInfo()}
                      className="flex-1 py-4 rounded-2xl font-bold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {t("continue")}
                    </button>
                  )}

                  {checkout.currentStep === "confirm" && (
                    <button
                      onClick={checkout.goToNextStep}
                      disabled={checkout.isSubmitting}
                      className="flex-1 py-4 rounded-2xl font-bold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {checkout.isSubmitting ? t("processing") : t("confirmPlaceOrder")}
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
