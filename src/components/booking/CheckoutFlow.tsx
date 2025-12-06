"use client";

import { X, Check, Calendar, Clock, User, Phone, Mail, MessageSquare } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { ThemeCartHandlers } from "./themes/types";
import { useCheckoutFlow } from "./hooks/useCheckoutFlow";

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
  const locale = useLocale();
  const checkout = useCheckoutFlow({
    isOpen,
    cart,
    merchantId,
    merchantName,
    currency,
    locale,
  });

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
            <div className="p-8 text-center">
              <div
                className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center"
                style={{ backgroundColor: primaryColor }}
              >
                <Check className="w-14 h-14 text-white" strokeWidth={3} />
              </div>
              <h2 className="text-2xl font-bold mb-3 text-gray-900">
                {t("orderSuccess")}
              </h2>
              <p className="text-gray-600 mb-8">
                {t("thankYouMessage", { merchantName })}
              </p>
              <button
                onClick={() => {
                  onClose();
                  checkout.resetToInitialStep();
                }}
                className="w-full py-4 rounded-2xl font-semibold text-white transition-all hover:opacity-90"
                style={{ backgroundColor: primaryColor }}
              >
                {t("close")}
              </button>
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
