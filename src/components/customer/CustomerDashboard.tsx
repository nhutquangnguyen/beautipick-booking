"use client";

import { useState } from "react";
import { Calendar, Package, MapPin, Phone, Mail, User, LogOut, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Merchant {
  business_name: string;
  slug: string;
  logo_url: string | null;
  currency: string;
  phone: string | null;
  address: string | null;
}

interface Booking {
  id: string;
  created_at: string;
  merchant_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  booking_date: string | null;
  start_time: string | null;
  end_time: string | null;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  notes: string | null;
  total_price: number;
  cart_items: any;
  merchants: Merchant;
}

interface CustomerAccount {
  id: string;
  email: string;
  name: string;
  phone: string | null;
}

interface CustomerDashboardProps {
  customer: CustomerAccount;
  bookings: Booking[];
}

export function CustomerDashboard({ customer, bookings }: CustomerDashboardProps) {
  const t = useTranslations("customerDashboard");
  const router = useRouter();
  const supabase = createClient();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await supabase.auth.signOut();
    router.push("/");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "completed":
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return t("statusConfirmed");
      case "pending":
        return t("statusPending");
      case "completed":
        return t("statusCompleted");
      case "cancelled":
        return t("statusCancelled");
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-50 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "completed":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const formatPrice = (price: number, currency: string) => {
    if (currency === "VND") {
      return `${price.toLocaleString("vi-VN")}đ`;
    }
    return `$${price.toFixed(2)}`;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t("myBookings")}</h1>
              <p className="text-gray-600 mt-1">{t("welcomeBack", { name: customer.name })}</p>
            </div>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {isLoggingOut ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <LogOut className="w-5 h-5" />
              )}
              <span>{t("logout")}</span>
            </button>
          </div>

          {/* Customer Info */}
          <div className="mt-6 flex items-center gap-6 p-4 bg-gray-50 rounded-xl">
            <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
              <User className="w-8 h-8 text-purple-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{customer.email}</span>
                </div>
                {customer.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{customer.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("noBookings")}</h3>
            <p className="text-gray-600">{t("noBookingsDesc")}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
              >
                {/* Merchant Info */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    {booking.merchants.logo_url ? (
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-100">
                        <Image
                          src={booking.merchants.logo_url}
                          alt={booking.merchants.business_name}
                          width={48}
                          height={48}
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                        <Package className="w-6 h-6 text-purple-600" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">
                        {booking.merchants.business_name}
                      </h3>
                      {booking.merchants.address && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin className="w-3 h-3" />
                          <span>{booking.merchants.address}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${getStatusColor(booking.status)}`}>
                    {getStatusIcon(booking.status)}
                    <span className="font-semibold text-sm">{getStatusText(booking.status)}</span>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {booking.booking_date && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <Calendar className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="text-xs text-gray-600">{t("date")}</p>
                        <p className="font-semibold text-gray-900">{formatDate(booking.booking_date)}</p>
                      </div>
                    </div>
                  )}
                  {booking.start_time && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <Clock className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="text-xs text-gray-600">{t("time")}</p>
                        <p className="font-semibold text-gray-900">
                          {booking.start_time}
                          {booking.end_time && ` - ${booking.end_time}`}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Cart Items */}
                {booking.cart_items && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-sm text-gray-700 mb-2">{t("items")}</h4>
                    <div className="space-y-2">
                      {Array.isArray(booking.cart_items) &&
                        booking.cart_items.map((item: any, index: number) => (
                          <div key={index} className="flex justify-between items-center text-sm">
                            <span className="text-gray-900">
                              {item.type === "service" ? item.service.name : item.product.name}
                              {item.type === "product" && ` × ${item.quantity}`}
                            </span>
                            <span className="font-semibold text-gray-900">
                              {formatPrice(
                                item.type === "service"
                                  ? item.service.price
                                  : item.product.price * item.quantity,
                                booking.merchants.currency
                              )}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {booking.notes && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-xl">
                    <p className="text-xs text-gray-600 mb-1">{t("notes")}</p>
                    <p className="text-sm text-gray-900 italic">"{booking.notes}"</p>
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="text-sm text-gray-600">
                    {t("bookedOn")} {new Date(booking.created_at).toLocaleDateString()}
                  </div>
                  <div className="text-xl font-bold text-gray-900">
                    {formatPrice(booking.total_price, booking.merchants.currency)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
