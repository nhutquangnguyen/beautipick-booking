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
  const supabase = createClient();

  const checkout = useCheckoutFlow({
    isOpen,
    cart,
    merchantId,
    merchantName,
    currency,
    locale,
  });

  const handleSendMagicLink = async () => {
    if (!checkout.customerEmail || !checkout.customerEmail.trim()) {
      setAccountError("Please provide an email address");
      return;
    }

    setIsCreatingAccount(true);
    setAccountError(null);

    try {
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email: checkout.customerEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            user_type: "customer",
            name: checkout.customerName,
            phone: checkout.customerPhone,
            first_merchant_id: merchantId,
          },
        },
      });

      if (signInError) throw signInError;

      setEmailSent(true);
    } catch (err) {
      console.error("Error sending magic link:", err);
      setAccountError(err instanceof Error ? err.message : "Failed to send magic link");
    } finally {
      setIsCreatingAccount(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsCreatingAccount(true);
    setAccountError(null);

    try {
      // Store customer info in localStorage for Google OAuth callback
      const customerData = {
        user_type: "customer",
        name: checkout.customerName,
        phone: checkout.customerPhone,
        email: checkout.customerEmail,
        first_merchant_id: merchantId,
      };
      localStorage.setItem('pending_customer_signup', JSON.stringify(customerData));

      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (signInError) throw signInError;
    } catch (err) {
      console.error("Error with Google sign in:", err);
      setAccountError(err instanceof Error ? err.message : "Failed to sign in with Google");
      setIsCreatingAccount(false);
    }
  };

  const handleCloseCheckout = () => {
    onClose();
    checkout.resetToInitialStep();
    setShowAccountCreation(false);
    setEmailSent(false);
    setAccountError(null);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
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
              <p className="text-gray-600 mb-6 text-center">
                {t("thankYouMessage", { merchantName })}
              </p>

              {/* Account Creation Section */}
              {!showAccountCreation && !emailSent ? (
                // Show CTA Button First
                <div className="space-y-3">
                  <button
                    onClick={() => setShowAccountCreation(true)}
                    className="w-full py-4 rounded-2xl font-bold text-white transition-all hover:opacity-90 flex items-center justify-center gap-2"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <User className="w-5 h-5" />
                    {tAccount("createAccount")}
                  </button>
                  <button
                    onClick={handleCloseCheckout}
                    className="w-full py-3 rounded-xl font-semibold text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    {t("close")}
                  </button>
                </div>
              ) : emailSent ? (
                // Email Sent State
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl text-center">
                  <Mail className="w-12 h-12 mx-auto mb-3" style={{ color: primaryColor }} />
                  <p className="text-sm font-semibold text-gray-900 mb-1">
                    {tAccount("checkYourEmail")}
                  </p>
                  <p className="text-xs text-gray-600">
                    {tAccount("magicLinkSent")}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{checkout.customerEmail}</p>
                </div>
              ) : (
                // Account Creation Options
                <div className="mb-6">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900">{tAccount("createAccount")}</h3>
                    <p className="text-sm text-gray-600">{tAccount("trackYourBookings")}</p>
                  </div>

                  {accountError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 text-center">
                      {accountError}
                    </div>
                  )}

                  {/* Customer Info Preview */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${primaryColor}20` }}
                      >
                        <User className="w-5 h-5" style={{ color: primaryColor }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">{checkout.customerName}</p>
                        {checkout.customerPhone && (
                          <p className="text-xs text-gray-600 flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {checkout.customerPhone}
                          </p>
                        )}
                      </div>
                    </div>
                    {checkout.customerEmail ? (
                      <div className="flex items-center gap-2 text-xs text-gray-600 pl-[46px]">
                        <Mail className="w-3 h-3" />
                        <p className="truncate">{checkout.customerEmail}</p>
                      </div>
                    ) : (
                      <p className="text-xs text-orange-600 italic pl-[46px]">{tAccount("emailRequired")}</p>
                    )}
                  </div>

                  {/* Magic Link Button */}
                  <button
                    onClick={handleSendMagicLink}
                    disabled={isCreatingAccount || !checkout.customerEmail}
                    className="w-full mb-3 py-3 rounded-xl font-bold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {isCreatingAccount ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {tAccount("sendingLink")}
                      </>
                    ) : (
                      <>
                        <Mail className="w-5 h-5" />
                        {tAccount("sendMagicLink")}
                      </>
                    )}
                  </button>

                  {/* Divider */}
                  <div className="relative mb-3">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="px-3 bg-white text-gray-500">{tAccount("orContinueWith")}</span>
                    </div>
                  </div>

                  {/* Google Sign In Button */}
                  <button
                    onClick={handleGoogleSignIn}
                    disabled={isCreatingAccount}
                    className="w-full mb-3 py-3 rounded-xl font-bold border-2 border-gray-200 bg-white hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    <span className="text-gray-700">{tAccount("continueWithGoogle")}</span>
                  </button>

                  {/* Skip Link */}
                  <div className="text-center">
                    <button
                      onClick={handleCloseCheckout}
                      className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {tAccount("skipForNow")}
                    </button>
                  </div>
                </div>
              )}

              {/* Close Button (always visible) */}
              {emailSent && (
                <button
                  onClick={handleCloseCheckout}
                  className="w-full py-4 rounded-2xl font-semibold text-white transition-all hover:opacity-90"
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
                    onClick={onClose}
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
                        style={{ "--tw-border-opacity": "1", borderColor: checkout.customerName ? primaryColor : undefined } as React.CSSProperties}
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
                        <Mail className="w-4 h-4" style={{ color: primaryColor }} />
                        {t("emailOptional")}
                      </label>
                      <input
                        type="email"
                        value={checkout.customerEmail}
                        onChange={(e) => checkout.setCustomerEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 focus:outline-none focus:border-current focus:bg-white transition-all"
                        style={{ borderColor: checkout.customerEmail ? primaryColor : undefined } as React.CSSProperties}
                        placeholder={t("emailPlaceholder")}
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
                  {((checkout.currentStep === "info" && checkout.hasServices) || checkout.currentStep === "confirm") && (
                    <button
                      onClick={checkout.goToPreviousStep}
                      className="px-6 py-3 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      {t("back")}
                    </button>
                  )}

                  <button
                    onClick={() => {
                      if (checkout.currentStep === "info" && !checkout.canProceedFromInfo()) {
                        alert(t("pleaseEnterRequired"));
                        return;
                      }
                      checkout.goToNextStep();
                    }}
                    disabled={
                      (checkout.currentStep === "datetime" && !checkout.canProceedFromDateTime()) ||
                      (checkout.currentStep === "info" && !checkout.canProceedFromInfo()) ||
                      checkout.isSubmitting
                    }
                    className="flex-1 py-4 rounded-2xl font-bold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {checkout.isSubmitting
                      ? t("processing")
                      : checkout.currentStep === "confirm"
                      ? t("confirmPlaceOrder")
                      : t("continue")}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
