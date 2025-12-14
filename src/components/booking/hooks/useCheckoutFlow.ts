import { useState, useEffect, useRef } from "react";
import { CartItem } from "../themes/types";
import { ThemeCartHandlers } from "../themes/types";
import { createClient } from "@/lib/supabase/client";

export type CheckoutStep = "datetime" | "choose" | "info" | "confirm" | "success";

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
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasCustomerInfo, setHasCustomerInfo] = useState(false);
  const [skippedAuth, setSkippedAuth] = useState(false); // Track if user skipped auth step
  const timeSelectionRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  // Form data
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [notes, setNotes] = useState("");

  // Get current user on mount and pre-fill form
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      console.log('[CheckoutFlow] Auth user:', user?.id, user?.email);

      // If user is logged in, get their customer account info and pre-fill
      if (user) {
        const { data: customerAccount, error: customerError } = await supabase
          .from("customer_accounts")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (customerError) {
          console.error('[CheckoutFlow] Error fetching customer account:', customerError);
        }

        console.log('[CheckoutFlow] Customer account:', customerAccount ? 'exists' : 'DOES NOT EXIST');

        if (customerAccount) {
          // User has a customer account - they're logged in as customer
          setCurrentUserId(user.id);
          setIsLoggedIn(true);

          // Pre-fill form with logged-in user's info
          if (customerAccount.name) setCustomerName(customerAccount.name);
          if (customerAccount.email) setCustomerEmail(customerAccount.email);
          if (customerAccount.phone) setCustomerPhone(customerAccount.phone);

          // Check if we have all required info (name and phone are required, email is optional)
          const hasPhone = !!customerAccount.phone;
          const hasName = !!customerAccount.name;

          setHasCustomerInfo(hasPhone && hasName);
        } else {
          // User is authenticated but doesn't have a customer account (probably a merchant)
          console.log('[CheckoutFlow] User authenticated but NO customer account - treating as guest');
          setCurrentUserId(null); // IMPORTANT: Don't set customer_id for users without customer accounts
          setIsLoggedIn(false);

          // Pre-fill email from auth if available
          if (user.email) {
            setCustomerEmail(user.email);
          }
          setHasCustomerInfo(false);
        }
      } else {
        console.log('[CheckoutFlow] No authenticated user - guest checkout');
        setCurrentUserId(null);
        setIsLoggedIn(false);
        setHasCustomerInfo(false);
      }
    };
    getCurrentUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Reset step when modal opens (but not if we're showing success)
  useEffect(() => {
    if (isOpen && currentStep !== "success") {
      // Determine the correct initial step based on login status
      if (shouldSkipInfoStep()) {
        // If logged in with all info, skip directly to confirm
        setCurrentStep("confirm");
      } else {
        setCurrentStep(initialStep);
      }
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
        customer_id: isLoggedIn ? currentUserId : null, // Only include customer_id if logged in as customer
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

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('Booking API error:', errorData);
        console.error('Response status:', response.status);
        console.error('Response statusText:', response.statusText);
        throw new Error(errorData.error || `Failed to create booking (${response.status})`);
      }

      const result = await response.json();

      // If user is not logged in as customer, store booking ID for later linking after sign-up
      if (!isLoggedIn && result.booking?.id) {
        console.log('[CheckoutFlow] Saving pending_booking_id for later linking:', result.booking.id);
        localStorage.setItem('pending_booking_id', result.booking.id);
        // Also set as cookie for auth callback
        document.cookie = `pending_booking_id=${result.booking.id}; path=/; max-age=3600`; // 1 hour
        console.log('[CheckoutFlow] Saved to localStorage and cookie');
      } else {
        console.log('[CheckoutFlow] User is logged in, booking already linked to customer_id:', currentUserId);
      }

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
    // If logged in, only phone is required (name is pre-filled, email is optional)
    if (isLoggedIn) {
      return customerPhone.trim() !== '';
    }
    // If not logged in, require name and phone (email is optional)
    return customerName.trim() && customerPhone.trim();
  };

  // Check if we should skip the info step (logged in with all info)
  const shouldSkipInfoStep = () => {
    return isLoggedIn && hasCustomerInfo;
  };

  const getStepStatus = (step: CheckoutStep) => {
    const stepOrder: CheckoutStep[] = ["datetime", "choose", "info", "confirm", "success"];
    const currentIndex = stepOrder.indexOf(currentStep);
    const stepIndex = stepOrder.indexOf(step);

    if (currentIndex === stepIndex) return "active";
    if (currentIndex > stepIndex) return "completed";
    return "inactive";
  };

  const goToNextStep = () => {
    if (currentStep === "datetime") {
      // After selecting datetime, go directly to info (skip choose step)
      setCurrentStep("info");
    } else if (currentStep === "info") {
      setCurrentStep("confirm");
    } else if (currentStep === "confirm") {
      handleSubmit();
    }
  };

  const goToPreviousStep = () => {
    if (currentStep === "info") {
      if (hasServices) {
        setCurrentStep("datetime");
      }
    } else if (currentStep === "confirm") {
      setCurrentStep("info");
    }
  };

  const resetToInitialStep = () => {
    setCurrentStep(initialStep);
    // Clear form data when resetting (but keep user info if logged in)
    setSelectedDate("");
    setSelectedTime("");
    setNotes("");
    setSkippedAuth(false);

    // Only clear customer info if not logged in
    if (!isLoggedIn) {
      setCustomerName("");
      setCustomerPhone("");
      setCustomerEmail("");
      setCustomerAddress("");
    }
  };

  return {
    // State
    currentStep,
    isSubmitting,
    hasServices,
    isLoggedIn,
    hasCustomerInfo,
    skippedAuth,
    setSkippedAuth,
    shouldSkipInfoStep: shouldSkipInfoStep(),
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
    customerAddress,
    setCustomerAddress,
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
