"use client";

import { Heart, MapPin, Phone, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Merchant {
  id: string;
  business_name: string;
  slug: string;
  logo_url: string | null;
  address: string | null;
  phone: string | null;
  description: string | null;
}

interface FavoritesListProps {
  merchants: Merchant[];
}

export function FavoritesList({ merchants: initialMerchants }: FavoritesListProps) {
  const [merchants, setMerchants] = useState(initialMerchants);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const router = useRouter();

  const handleRemoveFavorite = async (merchantId: string) => {
    setRemovingId(merchantId);

    try {
      const response = await fetch(`/api/favorites?merchant_id=${merchantId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove from local state
        setMerchants((prev) => prev.filter((m) => m.id !== merchantId));
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
    } finally {
      setRemovingId(null);
    }
  };
  if (merchants.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có salon yêu thích</h3>
        <p className="text-gray-600 mb-6">Hãy đặt lịch với salon để xem lại dễ dàng hơn</p>
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {merchants.map((merchant) => (
        <div
          key={merchant.id}
          className="relative border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all group"
        >
          {/* Remove Favorite Button */}
          <button
            onClick={() => handleRemoveFavorite(merchant.id)}
            disabled={removingId === merchant.id}
            className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all disabled:opacity-50"
            aria-label="Bỏ yêu thích"
          >
            <Heart className="w-5 h-5 fill-red-500 text-red-500" />
          </button>

          {/* Header */}
          <div className="flex items-start gap-4 mb-4">
            {merchant.logo_url ? (
              <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-gray-100">
                <Image
                  src={merchant.logo_url}
                  alt={merchant.business_name}
                  width={64}
                  height={64}
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
            )}
            <div className="flex-1 pr-8">
              <h3 className="font-bold text-lg text-gray-900 mb-1">
                {merchant.business_name}
              </h3>
              {merchant.address && (
                <div className="flex items-start gap-1 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="line-clamp-2">{merchant.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {merchant.description && (
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {merchant.description}
            </p>
          )}

          {/* Contact Info */}
          {merchant.phone && (
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
              <Phone className="w-4 h-4" />
              <span>{merchant.phone}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <Link
              href={`/m/${merchant.slug}`}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              Xem trang salon
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
