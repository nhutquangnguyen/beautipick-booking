"use client";

import { useState, useEffect, useRef } from "react";
import { X, Calendar, Clock, User, Phone, Mail, MessageSquare, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";
import { CartItem } from "./themes/types";
import { ThemeCartHandlers } from "./themes/types";

interface CheckoutFlowProps {
  isOpen: boolean;
  onClose: () => void;
  cart: ThemeCartHandlers;
  merchantId: string;
  merchantName: string;
  currency: string;
  accentColor?: string;
  primaryColor?: string;
  secondaryColor?: string;
  textColor?: string;
}

type Step = "datetime" | "info" | "confirm" | "success";

export function CheckoutFlow({
  isOpen,
  onClose,
  cart,
  merchantId,
  merchantName,
  currency,
  accentColor = "#3B82F6",
  primaryColor = "#C62828",
  secondaryColor = "#FFD700",
  textColor = "#4A2C0E"
}: CheckoutFlowProps) {
  const hasServices = cart.cart.some(item => item.type === "service");

  // Determine starting step based on cart contents
  const initialStep: Step = hasServices ? "datetime" : "info";

  const [currentStep, setCurrentStep] = useState<Step>(initialStep);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ref for time selection section
  const timeSelectionRef = useRef<HTMLDivElement>(null);

  // Reset step when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(initialStep);
    }
  }, [isOpen, initialStep]);

  // Form data
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  // Auto-scroll to time selection when date is selected
  useEffect(() => {
    if (selectedDate && timeSelectionRef.current) {
      setTimeout(() => {
        timeSelectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  }, [selectedDate]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [notes, setNotes] = useState("");

  // Calculate total
  const calculateTotal = () => {
    return cart.cart.reduce((total, item) => {
      if (item.type === "service") {
        return total + item.service.price;
      } else {
        return total + (item.product.price * item.quantity);
      }
    }, 0);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  // Generate time slots (9:00 - 18:00, 30 min intervals)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (hour === 18 && minute > 0) break;
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Generate next 30 days
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const availableDates = generateDates();

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const calculateEndTime = () => {
    if (!hasServices || !selectedTime) return null;

    // Get total duration from all services in cart
    const totalDuration = cart.cart
      .filter(item => item.type === "service")
      .reduce((total, item) => {
        if (item.type === "service") {
          return total + (item.service.duration_minutes || 60);
        }
        return total;
      }, 0);

    // Parse start time and add duration
    const [hours, minutes] = selectedTime.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0, 0);

    const endDate = new Date(startDate.getTime() + totalDuration * 60000);
    const endHours = endDate.getHours().toString().padStart(2, '0');
    const endMinutes = endDate.getMinutes().toString().padStart(2, '0');

    return `${endHours}:${endMinutes}`;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Prepare booking data
      const bookingData = {
        merchant_id: merchantId,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        booking_date: hasServices ? selectedDate : null,
        start_time: hasServices ? selectedTime : null,
        end_time: hasServices ? calculateEndTime() : null,
        status: "pending" as const,
        notes: notes || null,
        total_price: calculateTotal(),
        cart_items: cart.cart,
      };

      console.log('Booking data being sent:', bookingData);

      // Call API to create booking
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        throw new Error('Failed to create booking');
      }

      // Success - show success step
      setCurrentStep("success");

      // Don't auto-close - let user manually close
      // Clear cart data but keep the success message visible
      cart.clearCart();

      // Reset form data
      setSelectedDate("");
      setSelectedTime("");
      setCustomerName("");
      setCustomerPhone("");
      setCustomerEmail("");
      setNotes("");

    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceedFromDateTime = () => {
    return selectedDate && selectedTime;
  };

  const canProceedFromInfo = () => {
    return customerName.trim() && customerPhone.trim();
  };

  // Helper functions to determine step status
  const getStepStatus = (step: Step) => {
    const stepOrder: Step[] = ["datetime", "info", "confirm", "success"];
    const currentIndex = stepOrder.indexOf(currentStep);
    const stepIndex = stepOrder.indexOf(step);

    if (currentIndex === stepIndex) return "active";
    if (currentIndex > stepIndex) return "completed";
    return "inactive";
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className="px-6 py-5 border-b border-gray-200 flex items-center justify-between"
            style={{ backgroundColor: `${accentColor}05` }}
          >
            <div>
              <h2 className="text-2xl font-black text-gray-900">
                {currentStep === "datetime" && "Chọn ngày & giờ"}
                {currentStep === "info" && "Thông tin của bạn"}
                {currentStep === "confirm" && "Xác nhận đặt hàng"}
                {currentStep === "success" && "Đặt hàng thành công!"}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {merchantName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Progress Steps */}
          {currentStep !== "success" && (
            <div className="px-6 py-4 bg-gray-50">
              <div className="flex items-center justify-center gap-2">
                {hasServices && (
                  <>
                    <div
                      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                        getStepStatus("datetime") === "active" ? "shadow-lg" : ""
                      }`}
                      style={{
                        backgroundColor:
                          getStepStatus("datetime") === "active"
                            ? secondaryColor
                            : accentColor,
                        border:
                          getStepStatus("datetime") === "completed"
                            ? `2px solid ${primaryColor}`
                            : getStepStatus("datetime") === "inactive"
                            ? `2px solid ${textColor}`
                            : "none",
                        boxShadow:
                          getStepStatus("datetime") === "active"
                            ? `0 0 5px ${secondaryColor}60`
                            : undefined,
                      }}
                    >
                      <Calendar
                        className="w-4 h-4"
                        style={{
                          color:
                            getStepStatus("datetime") === "active"
                              ? primaryColor
                              : getStepStatus("datetime") === "completed"
                              ? primaryColor
                              : textColor,
                        }}
                      />
                      <span
                        className="text-sm font-semibold"
                        style={{
                          color:
                            getStepStatus("datetime") === "active"
                              ? primaryColor
                              : getStepStatus("datetime") === "completed"
                              ? primaryColor
                              : textColor,
                        }}
                      >
                        Ngày & Giờ
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </>
                )}
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                    getStepStatus("info") === "active" ? "shadow-lg" : ""
                  }`}
                  style={{
                    backgroundColor:
                      getStepStatus("info") === "active"
                        ? secondaryColor
                        : accentColor,
                    border:
                      getStepStatus("info") === "completed"
                        ? `2px solid ${primaryColor}`
                        : getStepStatus("info") === "inactive"
                        ? `2px solid ${textColor}`
                        : "none",
                    boxShadow:
                      getStepStatus("info") === "active"
                        ? `0 0 5px ${secondaryColor}60`
                        : undefined,
                  }}
                >
                  <User
                    className="w-4 h-4"
                    style={{
                      color:
                        getStepStatus("info") === "active"
                          ? primaryColor
                          : getStepStatus("info") === "completed"
                          ? primaryColor
                          : textColor,
                    }}
                  />
                  <span
                    className="text-sm font-semibold"
                    style={{
                      color:
                        getStepStatus("info") === "active"
                          ? primaryColor
                          : getStepStatus("info") === "completed"
                          ? primaryColor
                          : textColor,
                    }}
                  >
                    Thông tin
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                    getStepStatus("confirm") === "active" ? "shadow-lg" : ""
                  }`}
                  style={{
                    backgroundColor:
                      getStepStatus("confirm") === "active"
                        ? secondaryColor
                        : accentColor,
                    border:
                      getStepStatus("confirm") === "completed"
                        ? `2px solid ${primaryColor}`
                        : getStepStatus("confirm") === "inactive"
                        ? `2px solid ${textColor}`
                        : "none",
                    boxShadow:
                      getStepStatus("confirm") === "active"
                        ? `0 0 5px ${secondaryColor}60`
                        : undefined,
                  }}
                >
                  <CheckCircle
                    className="w-4 h-4"
                    style={{
                      color:
                        getStepStatus("confirm") === "active"
                          ? primaryColor
                          : getStepStatus("confirm") === "completed"
                          ? primaryColor
                          : textColor,
                    }}
                  />
                  <span
                    className="text-sm font-semibold"
                    style={{
                      color:
                        getStepStatus("confirm") === "active"
                          ? primaryColor
                          : getStepStatus("confirm") === "completed"
                          ? primaryColor
                          : textColor,
                    }}
                  >
                    Xác nhận
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="px-6 py-6 overflow-y-auto max-h-[60vh]">
            {/* Step 1: Date & Time Selection (only for services) */}
            {currentStep === "datetime" && (
              <div className="space-y-6">
                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <Calendar className="w-5 h-5" style={{ color: accentColor }} />
                    Chọn ngày
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {availableDates.slice(0, 12).map((date) => (
                      <button
                        key={date}
                        onClick={() => setSelectedDate(date)}
                        className={`p-3 rounded-xl border-2 transition-all ${
                          selectedDate === date
                            ? "shadow-lg scale-105"
                            : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                        }`}
                        style={{
                          borderColor: selectedDate === date ? primaryColor : undefined,
                          backgroundColor: selectedDate === date ? `${secondaryColor}33` : undefined,
                        }}
                      >
                        <div className="text-center">
                          <div className="text-xs" style={{ color: selectedDate === date ? primaryColor : "#6B7280" }}>
                            {new Date(date).toLocaleDateString('vi-VN', { weekday: 'short' })}
                          </div>
                          <div className="text-lg font-bold" style={{ color: selectedDate === date ? primaryColor : "#374151" }}>
                            {new Date(date).getDate()}
                          </div>
                          <div className="text-xs" style={{ color: selectedDate === date ? primaryColor : "#6B7280" }}>
                            Tháng {new Date(date).getMonth() + 1}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Selection */}
                {selectedDate && (
                  <div ref={timeSelectionRef}>
                    <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                      <Clock className="w-5 h-5" style={{ color: accentColor }} />
                      Chọn giờ
                    </label>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`p-2 rounded-lg border-2 transition-all text-sm font-semibold ${
                            selectedTime === time
                              ? "shadow-lg scale-105"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          style={{
                            borderColor: selectedTime === time ? secondaryColor : undefined,
                            backgroundColor: selectedTime === time ? secondaryColor : undefined,
                            color: selectedTime === time ? primaryColor : "#374151",
                          }}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Customer Information */}
            {currentStep === "info" && (
              <div className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <User className="w-4 h-4" style={{ color: accentColor }} />
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                    placeholder="Nhập họ và tên của bạn"
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4" style={{ color: accentColor }} />
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                    placeholder="0123 456 789"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4" style={{ color: accentColor }} />
                    Email
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                    placeholder="email@example.com"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" style={{ color: accentColor }} />
                    Ghi chú
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none resize-none"
                    placeholder="Thêm ghi chú cho đơn hàng của bạn..."
                  />
                </div>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {currentStep === "confirm" && (
              <div className="space-y-6">
                {/* Date & Time Info (if services) */}
                {hasServices && (
                  <div
                    className="rounded-2xl p-5 border-3"
                    style={{
                      backgroundColor: `${accentColor}`,
                      borderColor: secondaryColor,
                      boxShadow: `0 4px 12px ${secondaryColor}30`,
                    }}
                  >
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Calendar className="w-5 h-5" style={{ color: primaryColor }} />
                      Thời gian đặt lịch
                    </h3>
                    <div className="space-y-2">
                      <p className="text-gray-800 font-semibold">
                        <span className="font-bold">Ngày:</span> {formatDate(selectedDate)}
                      </p>
                      <p className="text-gray-800 font-semibold">
                        <span className="font-bold">Giờ:</span> {selectedTime}
                      </p>
                    </div>
                  </div>
                )}

                {/* Customer Info */}
                <div
                  className="rounded-2xl p-5 border-3"
                  style={{
                    backgroundColor: `${accentColor}`,
                    borderColor: secondaryColor,
                    boxShadow: `0 4px 12px ${secondaryColor}30`,
                  }}
                >
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <User className="w-5 h-5" style={{ color: primaryColor }} />
                    Thông tin khách hàng
                  </h3>
                  <div className="space-y-2">
                    <p className="text-gray-800 font-semibold">
                      <span className="font-bold">Họ tên:</span> {customerName}
                    </p>
                    <p className="text-gray-800 font-semibold">
                      <span className="font-bold">SĐT:</span> {customerPhone}
                    </p>
                    {customerEmail && (
                      <p className="text-gray-800 font-semibold">
                        <span className="font-bold">Email:</span> {customerEmail}
                      </p>
                    )}
                    {notes && (
                      <p className="text-gray-800 font-semibold">
                        <span className="font-bold">Ghi chú:</span> {notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Cart Items */}
                <div
                  className="rounded-2xl p-5 border-3"
                  style={{
                    backgroundColor: `${accentColor}`,
                    borderColor: secondaryColor,
                    boxShadow: `0 4px 12px ${secondaryColor}30`,
                  }}
                >
                  <h3 className="font-bold text-gray-900 mb-3">Chi tiết đơn hàng</h3>
                  <div className="space-y-3">
                    {cart.cart.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {item.type === "service" ? item.service.name : item.product.name}
                          </p>
                          {item.type === "product" && (
                            <p className="text-sm text-gray-600">Số lượng: {item.quantity}</p>
                          )}
                        </div>
                        <p
                          className="font-black text-lg"
                          style={{
                            color: secondaryColor,
                            textShadow: `1px 1px 0 ${textColor}, -1px -1px 0 ${textColor}, 1px -1px 0 ${textColor}, -1px 1px 0 ${textColor}`,
                          }}
                        >
                          {formatPrice(
                            item.type === "service"
                              ? item.service.price
                              : item.product.price * item.quantity
                          )}
                        </p>
                      </div>
                    ))}
                    <div
                      className="pt-3 border-t-3 flex justify-between items-center"
                      style={{
                        borderColor: secondaryColor,
                      }}
                    >
                      <span className="text-lg font-bold text-gray-900">Tổng cộng:</span>
                      <span
                        className="text-3xl font-black"
                        style={{
                          color: primaryColor,
                          WebkitTextStroke: `1px ${textColor}`,
                          paintOrder: 'stroke fill',
                          textShadow: `0 2px 4px ${textColor}40`,
                        }}
                      >
                        {formatPrice(calculateTotal())}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Success */}
            {currentStep === "success" && (
              <div className="text-center py-12">
                <div
                  className="w-28 h-28 rounded-full mx-auto mb-6 flex items-center justify-center relative"
                  style={{
                    background: `linear-gradient(135deg, ${secondaryColor}, ${accentColor})`,
                    border: `4px solid ${primaryColor}`,
                    boxShadow: `0 10px 40px ${secondaryColor}60, 0 0 0 8px ${secondaryColor}20`,
                  }}
                >
                  {/* Glow effect */}
                  <div
                    className="absolute inset-0 rounded-full blur-xl opacity-60"
                    style={{
                      background: `linear-gradient(135deg, ${secondaryColor}, ${accentColor})`,
                    }}
                  />
                  <CheckCircle
                    className="w-16 h-16 relative z-10"
                    style={{
                      color: primaryColor,
                      filter: 'drop-shadow(0 2px 8px rgba(255,255,255,0.5))',
                      strokeWidth: 3,
                    }}
                  />
                </div>
                <h3 className="text-3xl font-black mb-3" style={{ color: primaryColor }}>
                  Đặt hàng thành công!
                </h3>
                <p className="text-gray-700 mb-2 text-lg font-semibold">
                  Cảm ơn bạn đã đặt hàng tại {merchantName}
                </p>
                <p className="text-base text-gray-600">
                  Chúng tôi sẽ liên hệ với bạn sớm nhất có thể.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          {currentStep === "success" ? (
            <div className="px-6 py-5 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  onClose();
                  setCurrentStep(initialStep);
                }}
                className="w-full py-4 rounded-xl font-black transition-all hover:scale-105 flex items-center justify-center gap-2"
                style={{
                  background: `linear-gradient(135deg, ${secondaryColor}, ${accentColor})`,
                  color: primaryColor,
                  border: `3px solid ${primaryColor}`,
                  boxShadow: `0 4px 20px ${secondaryColor}60`,
                  textShadow: '0 1px 2px rgba(255,255,255,0.3)',
                }}
              >
                Đóng
              </button>
            </div>
          ) : (
            <div className="px-6 py-5 border-t border-gray-200 bg-gray-50 flex gap-3">
              {/* Back Button */}
              {((currentStep === "info" && hasServices) || currentStep === "confirm") && (
                <button
                  onClick={() => {
                    if (currentStep === "info") {
                      setCurrentStep("datetime");
                    } else if (currentStep === "confirm") {
                      setCurrentStep("info");
                    }
                  }}
                  className="px-6 py-3 rounded-xl font-bold text-gray-700 hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Quay lại
                </button>
              )}

              {/* Next/Submit Button */}
              <button
                onClick={() => {
                  if (currentStep === "datetime") {
                    setCurrentStep("info");
                  } else if (currentStep === "info") {
                    setCurrentStep("confirm");
                  } else if (currentStep === "confirm") {
                    handleSubmit();
                  }
                }}
                disabled={
                  (currentStep === "datetime" && !canProceedFromDateTime()) ||
                  (currentStep === "info" && !canProceedFromInfo()) ||
                  isSubmitting
                }
                className="flex-1 py-3 rounded-xl font-black transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                style={{
                  backgroundColor: secondaryColor,
                  color: primaryColor,
                  boxShadow: `0 0 10px ${secondaryColor}60`,
                }}
              >
                {isSubmitting ? (
                  "Đang xử lý..."
                ) : currentStep === "confirm" ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Xác nhận đặt hàng
                  </>
                ) : (
                  <>
                    Tiếp tục
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
