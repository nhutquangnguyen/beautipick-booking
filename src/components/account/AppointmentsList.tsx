"use client";

import { Calendar, Clock, CheckCircle, XCircle, Package, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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

interface AppointmentsListProps {
  bookings: Booking[];
}

export function AppointmentsList({ bookings }: AppointmentsListProps) {
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
        return "Đã xác nhận";
      case "pending":
        return "Chờ xác nhận";
      case "completed":
        return "Hoàn thành";
      case "cancelled":
        return "Đã hủy";
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
    return date.toLocaleDateString("vi-VN", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có cuộc hẹn nào</h3>
        <p className="text-gray-600 mb-6">Bạn chưa có cuộc hẹn nào. Hãy đặt lịch ngay!</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:from-purple-700 hover:to-pink-700"
        >
          Tìm salon ngay
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div
          key={booking.id}
          className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
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
                  <p className="text-xs text-gray-600">Ngày hẹn</p>
                  <p className="font-semibold text-gray-900">{formatDate(booking.booking_date)}</p>
                </div>
              </div>
            )}
            {booking.start_time && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Clock className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-xs text-gray-600">Giờ hẹn</p>
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
              <h4 className="font-semibold text-sm text-gray-700 mb-2">Dịch vụ/Sản phẩm</h4>
              <div className="space-y-2">
                {Array.isArray(booking.cart_items) &&
                  booking.cart_items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="text-gray-900">
                        {item.type === "service" ? item.service?.name || "Service" : item.product?.name || "Product"}
                        {item.type === "product" && item.quantity && ` × ${item.quantity}`}
                      </span>
                      <span className="font-semibold text-gray-900">
                        {formatPrice(
                          item.type === "service"
                            ? item.service?.price || 0
                            : (item.product?.price || 0) * (item.quantity || 1),
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
              <p className="text-xs text-gray-600 mb-1">Ghi chú</p>
              <p className="text-sm text-gray-900 italic">"{booking.notes}"</p>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="text-sm text-gray-600">
              Đặt lúc {new Date(booking.created_at).toLocaleDateString("vi-VN")}
            </div>
            <div className="text-xl font-bold text-gray-900">
              {formatPrice(booking.total_price, booking.merchants.currency)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
