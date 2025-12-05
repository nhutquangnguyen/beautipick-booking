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
}

type Step = "datetime" | "info" | "confirm" | "success";

export function CheckoutFlow({
  isOpen,
  onClose,
  cart,
  merchantId,
  merchantName,
  currency,
  accentColor = "#3B82F6"
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

      // Clear cart after 2 seconds and close
      setTimeout(() => {
        cart.clearCart();
        onClose();
        // Reset form
        setCurrentStep(initialStep);
        setSelectedDate("");
        setSelectedTime("");
        setCustomerName("");
        setCustomerPhone("");
        setCustomerEmail("");
        setNotes("");
      }, 3000);

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
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${currentStep === "datetime" ? "bg-white shadow-md" : "bg-gray-200"}`}>
                      <Calendar className="w-4 h-4" style={{ color: currentStep === "datetime" ? accentColor : "#9CA3AF" }} />
                      <span className={`text-sm font-semibold ${currentStep === "datetime" ? "text-gray-900" : "text-gray-500"}`}>
                        Ngày & Giờ
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </>
                )}
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${currentStep === "info" ? "bg-white shadow-md" : "bg-gray-200"}`}>
                  <User className="w-4 h-4" style={{ color: currentStep === "info" ? accentColor : "#9CA3AF" }} />
                  <span className={`text-sm font-semibold ${currentStep === "info" ? "text-gray-900" : "text-gray-500"}`}>
                    Thông tin
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${currentStep === "confirm" ? "bg-white shadow-md" : "bg-gray-200"}`}>
                  <CheckCircle className="w-4 h-4" style={{ color: currentStep === "confirm" ? accentColor : "#9CA3AF" }} />
                  <span className={`text-sm font-semibold ${currentStep === "confirm" ? "text-gray-900" : "text-gray-500"}`}>
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
                          borderColor: selectedDate === date ? accentColor : undefined,
                          backgroundColor: selectedDate === date ? `${accentColor}10` : undefined,
                        }}
                      >
                        <div className="text-center">
                          <div className="text-xs text-gray-500">
                            {new Date(date).toLocaleDateString('vi-VN', { weekday: 'short' })}
                          </div>
                          <div className="text-lg font-bold" style={{ color: selectedDate === date ? accentColor : "#374151" }}>
                            {new Date(date).getDate()}
                          </div>
                          <div className="text-xs text-gray-500">
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
                            borderColor: selectedTime === time ? accentColor : undefined,
                            backgroundColor: selectedTime === time ? `${accentColor}10` : undefined,
                            color: selectedTime === time ? accentColor : "#374151",
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
                  <div className="bg-gray-50 rounded-2xl p-5">
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Calendar className="w-5 h-5" style={{ color: accentColor }} />
                      Thời gian đặt lịch
                    </h3>
                    <div className="space-y-2">
                      <p className="text-gray-700">
                        <span className="font-semibold">Ngày:</span> {formatDate(selectedDate)}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold">Giờ:</span> {selectedTime}
                      </p>
                    </div>
                  </div>
                )}

                {/* Customer Info */}
                <div className="bg-gray-50 rounded-2xl p-5">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <User className="w-5 h-5" style={{ color: accentColor }} />
                    Thông tin khách hàng
                  </h3>
                  <div className="space-y-2">
                    <p className="text-gray-700">
                      <span className="font-semibold">Họ tên:</span> {customerName}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold">SĐT:</span> {customerPhone}
                    </p>
                    {customerEmail && (
                      <p className="text-gray-700">
                        <span className="font-semibold">Email:</span> {customerEmail}
                      </p>
                    )}
                    {notes && (
                      <p className="text-gray-700">
                        <span className="font-semibold">Ghi chú:</span> {notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Cart Items */}
                <div className="bg-gray-50 rounded-2xl p-5">
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
                        <p className="font-bold" style={{ color: accentColor }}>
                          {formatPrice(
                            item.type === "service"
                              ? item.service.price
                              : item.product.price * item.quantity
                          )}
                        </p>
                      </div>
                    ))}
                    <div className="pt-3 border-t-2 border-gray-200 flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">Tổng cộng:</span>
                      <span className="text-2xl font-black" style={{ color: accentColor }}>
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
                  className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center"
                  style={{ backgroundColor: `${accentColor}20` }}
                >
                  <CheckCircle className="w-16 h-16" style={{ color: accentColor }} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-3">
                  Đặt hàng thành công!
                </h3>
                <p className="text-gray-600 mb-2">
                  Cảm ơn bạn đã đặt hàng tại {merchantName}
                </p>
                <p className="text-sm text-gray-500">
                  Chúng tôi sẽ liên hệ với bạn sớm nhất có thể.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          {currentStep !== "success" && (
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
                className="flex-1 py-3 rounded-xl font-black text-white transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                style={{
                  backgroundColor: accentColor,
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
