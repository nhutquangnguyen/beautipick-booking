"use client";

import { useState, useEffect, useMemo } from "react";
import { X, Clock, Tag, ShoppingCart, Plus, Minus, ImageIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Service } from "@/types/database";
import { Product } from "./themes/types";
import { formatCurrency, formatDuration } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";

type ItemDetailModalProps = {
  item: Service | Product | null;
  type: "service" | "product";
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: () => void;
  isInCart: boolean;
  quantity?: number;
  onUpdateQuantity?: (quantity: number) => void;
  currencyCode?: string;
};

export function ItemDetailModal({
  item,
  type,
  isOpen,
  onClose,
  onAddToCart,
  isInCart,
  quantity = 0,
  onUpdateQuantity,
  currencyCode = "USD",
}: ItemDetailModalProps) {
  const t = useTranslations("booking");
  const tCommon = useTranslations("common");
  const [imageError, setImageError] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const isService = type === "service";
  const service = isService ? (item as Service) : null;
  const product = !isService ? (item as Product) : null;

  // Get the raw images array or fallback to single image_url - memoized to prevent infinite loops
  const rawImages = useMemo(() => {
    if (isService) {
      return service?.images && service.images.length > 0
        ? service.images
        : (service?.image_url ? [service.image_url] : []);
    } else {
      return product?.images && product.images.length > 0
        ? product.images
        : (product?.image_url ? [product.image_url] : []);
    }
  }, [isService, service?.images, service?.image_url, product?.images, product?.image_url]);

  // Load the proper image URLs
  useEffect(() => {
    if (!rawImages || rawImages.length === 0 || !isOpen) {
      setImageUrls([]);
      setCurrentImageIndex(0);
      return;
    }

    // Reset error state when opening a new item
    setImageError(false);
    setCurrentImageIndex(0);

    // Convert all images to public URLs
    const supabase = createClient();
    const urls = rawImages.map(imageKey => {
      if (!imageKey) return "";

      // If it's already a full URL (legacy format), use it directly
      if (imageKey.startsWith('http://') || imageKey.startsWith('https://')) {
        return imageKey;
      }

      // Otherwise, get the public URL from Supabase Storage
      const { data } = supabase.storage.from('images').getPublicUrl(imageKey);
      return data.publicUrl;
    });

    setImageUrls(urls.filter(url => url !== ""));
  }, [rawImages, isOpen]);

  if (!isOpen || !item) return null;

  const hasImages = imageUrls.length > 0 && !imageError;
  const hasMultipleImages = imageUrls.length > 1;

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? imageUrls.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === imageUrls.length - 1 ? 0 : prev + 1));
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleImageClick = () => {
    if (hasImages) {
      setIsFullscreen(true);
    }
  };

  const handleFullscreenClose = () => {
    setIsFullscreen(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-slideUp my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="sticky top-4 right-4 z-10 ml-auto mr-4 mt-4 p-2 rounded-full bg-white/90 hover:bg-white text-gray-600 hover:text-gray-900 transition-all shadow-md"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Image Gallery Section */}
        {hasImages ? (
          <div className="relative w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 group">
            {/* Main Image - Clickable */}
            <img
              src={imageUrls[currentImageIndex]}
              alt={`${item.name} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover cursor-zoom-in"
              onClick={handleImageClick}
              onError={() => {
                console.error("Image failed to load:", imageUrls[currentImageIndex]);
                setImageError(true);
              }}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

            {/* Navigation Arrows - Only show if multiple images */}
            {hasMultipleImages && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-800" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-5 w-5 text-gray-800" />
                </button>
              </>
            )}

            {/* Image Counter */}
            {hasMultipleImages && (
              <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/70 text-white text-sm rounded-full">
                {currentImageIndex + 1} / {imageUrls.length}
              </div>
            )}

            {/* Dot Indicators */}
            {hasMultipleImages && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {imageUrls.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex
                        ? "bg-white w-6"
                        : "bg-white/50 hover:bg-white/75"
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : rawImages.length > 0 ? (
          <div className="relative w-full h-64 bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center">
            <div className="text-center">
              <ImageIcon className="h-16 w-16 text-purple-300 mx-auto mb-2" />
              <p className="text-sm text-purple-400">Image unavailable</p>
            </div>
          </div>
        ) : null}

        {/* Content Section - Scrollable */}
        <div className="p-6 md:p-8 max-h-[calc(100vh-12rem)] overflow-y-auto">
          {/* Category Badge */}
          {isService && service?.category && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium mb-4">
              <Tag className="h-3.5 w-3.5" />
              {service.category}
            </div>
          )}

          {/* Title */}
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            {item.name}
          </h2>

          {/* Service Details */}
          {isService && service && (
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="h-5 w-5" />
                <span className="text-lg font-medium">
                  {formatDuration(service.duration_minutes)}
                </span>
              </div>
              <div className="h-6 w-px bg-gray-300" />
              <div className="text-2xl font-bold text-purple-600">
                {formatCurrency(service.price, currencyCode)}
              </div>
            </div>
          )}

          {/* Product Details */}
          {product && (
            <div className="text-2xl font-bold text-purple-600 mb-4">
              {formatCurrency(product.price, currencyCode)}
            </div>
          )}

          {/* Description */}
          {item.description && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
                {tCommon("about")}
              </h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line break-words">
                {item.description}
              </p>
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-gray-200 my-6" />
        </div>

        {/* Action Buttons - Sticky Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 md:p-8 pt-4">
          <div className="flex gap-3">
            {/* Service - Simple Add/Remove */}
            {isService && (
              <>
                {isInCart ? (
                  <button
                    onClick={onClose}
                    className="flex-1 py-4 px-6 bg-green-50 text-green-700 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 border-2 border-green-200"
                  >
                    <span className="text-xl">✓</span>
                    {t("added")}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onAddToCart();
                      setTimeout(onClose, 300);
                    }}
                    className="flex-1 py-4 px-6 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold text-lg transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {t("addToCart")}
                  </button>
                )}
              </>
            )}

            {/* Product - Quantity Controls */}
            {product && (
              <>
                {isInCart && quantity > 0 ? (
                  <div className="flex-1 flex items-center gap-4">
                    <button
                      onClick={() => onUpdateQuantity?.(Math.max(0, quantity - 1))}
                      className="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-5 w-5 text-gray-700" />
                    </button>
                    <div className="flex-1 text-center">
                      <div className="text-sm text-gray-600 font-medium">
                        {t("quantity")}
                      </div>
                      <div className="text-3xl font-bold text-gray-900">
                        {quantity}
                      </div>
                    </div>
                    <button
                      onClick={() => onUpdateQuantity?.(quantity + 1)}
                      className="p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      onAddToCart();
                      // Don't close immediately so user can add more quantity
                    }}
                    className="flex-1 py-4 px-6 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold text-lg transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {t("addToCart")}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>

      {/* Fullscreen Image Viewer */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm animate-fadeIn"
          onClick={handleFullscreenClose}
        >
          {/* Close Button */}
          <button
            onClick={handleFullscreenClose}
            className="absolute top-4 right-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
            aria-label="Close fullscreen"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Image Counter */}
          {hasMultipleImages && (
            <div className="absolute top-4 left-4 z-10 px-4 py-2 bg-black/50 text-white text-sm rounded-full">
              {currentImageIndex + 1} / {imageUrls.length}
            </div>
          )}

          {/* Main Image - Centered */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <img
              src={imageUrls[currentImageIndex]}
              alt={`${item.name} - Image ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Navigation Arrows - Only show if multiple images */}
          {hasMultipleImages && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevImage();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all z-10"
                aria-label="Next image"
              >
                <ChevronRight className="h-8 w-8" />
              </button>
            </>
          )}

          {/* Dot Indicators */}
          {hasMultipleImages && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {imageUrls.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className={`h-2 rounded-full transition-all ${
                    index === currentImageIndex
                      ? "bg-white w-8"
                      : "bg-white/50 hover:bg-white/75 w-2"
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
