"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Star, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface MerchantCardProps {
  merchantId: string;
  slug: string;
  businessName: string;
  logoUrl: string | null;
  city: string | null;
  district: string | null;
  description?: string;
  tags?: string[];
  isFeatured?: boolean;
  totalFavorites?: number;
}

export function MerchantCard({
  merchantId,
  slug,
  businessName,
  logoUrl,
  city,
  district,
  description,
  tags = [],
  isFeatured = false,
  totalFavorites = 0,
}: MerchantCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  // Check if merchant is favorited on mount
  useEffect(() => {
    const checkFavorite = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      try {
        const response = await fetch(`/api/favorites?merchant_id=${merchantId}`);
        if (response.ok) {
          const data = await response.json();
          setIsFavorited(data.isFavorited);
        }
      } catch (error) {
        console.error("Error checking favorite:", error);
      }
    };

    checkFavorite();
  }, [merchantId, supabase]);

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check if user is logged in
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      if (isFavorited) {
        // Remove favorite
        const response = await fetch(`/api/favorites?merchant_id=${merchantId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setIsFavorited(false);
        }
      } else {
        // Add favorite
        const response = await fetch("/api/favorites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ merchant_id: merchantId }),
        });

        if (response.ok) {
          setIsFavorited(true);
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Link
      href={`/m/${slug}`}
      className="group relative block bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 hover:border-purple-200"
    >
      {/* Featured Badge */}
      {isFeatured && (
        <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
          ⭐ Nổi bật
        </div>
      )}

      {/* Favorite Button */}
      <button
        onClick={handleFavorite}
        disabled={isLoading}
        className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-all disabled:opacity-50"
      >
        <Heart
          className={`h-5 w-5 ${
            isFavorited ? "fill-red-500 text-red-500" : "text-gray-600"
          }`}
        />
      </button>

      {/* Image */}
      <div className="relative h-48 w-full bg-gradient-to-br from-purple-100 to-pink-100">
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt={businessName}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-6xl font-bold text-purple-600/20">
              {businessName.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1 group-hover:text-purple-600 transition-colors">
          {businessName}
        </h3>

        {/* Location */}
        {(city || district) && (
          <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">
              {[district, city].filter(Boolean).join(", ")}
            </span>
          </div>
        )}

        {/* Description */}
        {description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {description}
          </p>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            {totalFavorites > 0 && (
              <span className="flex items-center gap-1">
                <Heart className="h-3 w-3" />
                {totalFavorites}
              </span>
            )}
          </div>
          <span className="text-xs font-medium text-purple-600 group-hover:text-purple-700">
            Xem chi tiết →
          </span>
        </div>
      </div>
    </Link>
  );
}
