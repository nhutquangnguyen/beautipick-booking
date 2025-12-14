"use client";

import { useState, useEffect } from "react";
import { Heart, Share2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface HeroActionsProps {
  merchantId: string;
  merchantName: string;
}

export function HeroActions({ merchantId, merchantName }: HeroActionsProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
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

  const handleToggleFavorite = async () => {
    setIsTogglingFavorite(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      if (isFavorited) {
        const response = await fetch(`/api/favorites?merchant_id=${merchantId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setIsFavorited(false);
        }
      } else {
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
      setIsTogglingFavorite(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: merchantName,
          text: `Xem ${merchantName} trên BeautiPick`,
          url: url,
        });
      } catch (error) {
        // User cancelled or share failed
        console.log("Share cancelled");
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        alert("Đã sao chép link!");
      } catch (error) {
        console.error("Error copying to clipboard:", error);
      }
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* Favorite Button */}
      <button
        onClick={handleToggleFavorite}
        disabled={isTogglingFavorite}
        className="p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-lg disabled:opacity-50"
        aria-label={isFavorited ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
      >
        <Heart
          className={`h-6 w-6 ${
            isFavorited ? "fill-red-500 text-red-500" : "text-gray-700"
          }`}
        />
      </button>

      {/* Share Button */}
      <button
        onClick={handleShare}
        className="p-3 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-lg"
        aria-label="Chia sẻ"
      >
        <Share2 className="h-6 w-6 text-gray-700" />
      </button>
    </div>
  );
}
