import { useState, useEffect, useRef } from "react";
import { CartItem } from "../themes/types";
import { ThemeCartHandlers } from "../themes/types";

export type CheckoutStep = "datetime" | "info" | "confirm" | "success";

interface UseCheckoutFlowProps {
  isOpen: boolean;
  cart: ThemeCartHandlers;
  merchantId: string;
  merchantName: string;
  currency: string;
  locale?: string;
}

export function useCheckoutFlow({
  isOpen,
  cart,
  merchantId,
  merchantName,
  currency,
  locale = 'vi',
}: UseCheckoutFlowProps) {
  const hasServices = cart.cart.some(item => item.type === "service");
  const initialStep: CheckoutStep = hasServices ? "datetime" : "info";

  const [currentStep, setCurrentStep] = useState<CheckoutStep>(initialStep);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const timeSelectionRef = useRef<HTMLDivElement>(null);

  // Form data
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [notes, setNotes] = useState("");

  // Reset step when modal opens (but not if we're showing success)
  useEffect(() => {
    if (isOpen && currentStep !== "success") {
      setCurrentStep(initialStep);
    }
  }, [isOpen]); // Removed initialStep from dependencies to prevent reset during checkout

  // Auto-scroll to time selection when date is selected
  useEffect(() => {
    if (selectedDate && timeSelectionRef.current) {
      setTimeout(() => {
        timeSelectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  }, [selectedDate]);

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
    const localeCode = locale === 'vi' ? 'vi-VN' : 'en-US';
    return new Intl.DateTimeFormat(localeCode, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const calculateEndTime = () => {
    if (!hasServices || !selectedTime) return null;

    const totalDuration = cart.cart
      .filter(item => item.type === "service")
      .reduce((total, item) => {
        if (item.type === "service") {
          return total + (item.service.duration_minutes || 60);
        }
        return total;
      }, 0);

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

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Booking API error:', errorData);
        throw new Error(errorData.error || 'Failed to create booking');
      }

      const result = await response.json();
      console.log('Booking created successfully:', result);

      // Success - show success step
      setCurrentStep("success");

      // Clear cart (but keep customer info for account creation modal)
      cart.clearCart();

    } catch (error: any) {
      console.error('Error creating booking:', error);
      const errorMessage = error?.message || 'Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!';
      alert(errorMessage);
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

  const getStepStatus = (step: CheckoutStep) => {
    const stepOrder: CheckoutStep[] = ["datetime", "info", "confirm", "success"];
    const currentIndex = stepOrder.indexOf(currentStep);
    const stepIndex = stepOrder.indexOf(step);

    if (currentIndex === stepIndex) return "active";
    if (currentIndex > stepIndex) return "completed";
    return "inactive";
  };

  const goToNextStep = () => {
    if (currentStep === "datetime") {
      setCurrentStep("info");
    } else if (currentStep === "info") {
      setCurrentStep("confirm");
    } else if (currentStep === "confirm") {
      handleSubmit();
    }
  };

  const goToPreviousStep = () => {
    if (currentStep === "info" && hasServices) {
      setCurrentStep("datetime");
    } else if (currentStep === "confirm") {
      setCurrentStep("info");
    }
  };

  const resetToInitialStep = () => {
    setCurrentStep(initialStep);
    // Clear form data when resetting
    setSelectedDate("");
    setSelectedTime("");
    setCustomerName("");
    setCustomerPhone("");
    setCustomerEmail("");
    setNotes("");
  };

  return {
    // State
    currentStep,
    isSubmitting,
    hasServices,
    timeSelectionRef,

    // Form data
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    customerName,
    setCustomerName,
    customerPhone,
    setCustomerPhone,
    customerEmail,
    setCustomerEmail,
    notes,
    setNotes,

    // Computed data
    timeSlots,
    availableDates,

    // Helper functions
    calculateTotal,
    formatPrice,
    formatDate,
    calculateEndTime,
    canProceedFromDateTime,
    canProceedFromInfo,
    getStepStatus,

    // Actions
    goToNextStep,
    goToPreviousStep,
    resetToInitialStep,
    handleSubmit,
  };
}
