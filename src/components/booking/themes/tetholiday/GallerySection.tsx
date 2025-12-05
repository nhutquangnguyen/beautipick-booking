"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { GallerySectionProps } from "../types";

export function TetHolidayGallerySection({ gallery, colors, onFullGalleryChange }: GallerySectionProps) {
  const t = useTranslations("common");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [showAllGallery, setShowAllGallery] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);

  // Sample gallery images from Unsplash (high-quality beauty/spa images)
  const sampleGallery = [
    {
      id: "sample-1",
      image_url: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80",
      caption: "Luxury Spa Treatment",
    },
    {
      id: "sample-2",
      image_url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80",
      caption: "Beauty Salon Interior",
    },
    {
      id: "sample-3",
      image_url: "https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=800&q=80",
      caption: "Nail Art Design",
    },
    {
      id: "sample-4",
      image_url: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800&q=80",
      caption: "Makeup Artist",
    },
    {
      id: "sample-5",
      image_url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80",
      caption: "Hair Styling",
    },
    {
      id: "sample-6",
      image_url: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800&q=80",
      caption: "Spa Relaxation",
    },
    {
      id: "sample-7",
      image_url: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80",
      caption: "Professional Makeup",
    },
    {
      id: "sample-8",
      image_url: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&q=80",
      caption: "Beauty Treatment",
    },
  ];

  // Use provided gallery or sample gallery
  const displayGallery = gallery && gallery.length > 0 ? gallery : sampleGallery;
  const MAX_VISIBLE_IMAGES = 6;
  const hasMoreImages = displayGallery.length > MAX_VISIBLE_IMAGES;
  const visibleGallery = displayGallery.slice(0, MAX_VISIBLE_IMAGES);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  // Navigation functions
  const goToNextImage = () => {
    const nextIndex = (selectedImageIndex + 1) % displayGallery.length;
    setSelectedImageIndex(nextIndex);
    setSelectedImage(displayGallery[nextIndex].image_url);
  };

  const goToPreviousImage = () => {
    const prevIndex = selectedImageIndex === 0 ? displayGallery.length - 1 : selectedImageIndex - 1;
    setSelectedImageIndex(prevIndex);
    setSelectedImage(displayGallery[prevIndex].image_url);
  };

  // Touch handlers for swipe
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNextImage();
    } else if (isRightSwipe) {
      goToPreviousImage();
    }
  };

  // Keyboard navigation with global event listener
  useEffect(() => {
    if (!selectedImage) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === '<' || e.key === ',') {
        goToPreviousImage();
      } else if (e.key === 'ArrowRight' || e.key === '>' || e.key === '.') {
        goToNextImage();
      } else if (e.key === 'Escape') {
        setSelectedImage(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, selectedImageIndex, displayGallery]);

  if (displayGallery.length === 0) return null;

  return (
    <section
      className="py-20 px-6 relative overflow-hidden"
      style={{ backgroundColor: colors.backgroundColor }}
    >
      {/* Decorative blossom pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 40%, ${colors.secondaryColor} 5px, transparent 5px)`,
          backgroundSize: '160px 160px',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Tết header */}
        <div className="text-center mb-16 animate-gallery-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-4xl animate-pulse" style={{ animationDuration: '2s' }}>🌸</span>
            <h2
              className="text-4xl sm:text-5xl font-bold"
              style={{
                fontFamily: colors.fontFamily,
                color: colors.primaryColor,
              }}
            >
              {t("gallery")}
            </h2>
            <span className="text-4xl animate-pulse" style={{ animationDuration: '2s', animationDelay: '0.5s' }}>✿</span>
          </div>
          <p
            className="text-lg font-serif italic"
            style={{ color: colors.textColor }}
          >
            {t("tetGallerySubtitle") || "Khoảnh Khắc Đáng Nhớ"}
          </p>
        </div>

        {/* Gallery grid with Golden Spotlight effect */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleGallery.map((image, index) => (
            <div
              key={image.id}
              className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:rotate-1"
              style={{
                border: `3px solid ${colors.accentColor}`,
                boxShadow: `0 4px 15px ${colors.primaryColor}26`,
              }}
              onClick={() => {
                setSelectedImageIndex(index);
                setSelectedImage(image.image_url);
              }}
            >
              {/* Golden border on hover */}
              <div
                className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
                style={{
                  background: `linear-gradient(135deg, ${colors.secondaryColor}, ${colors.accentColor})`,
                  boxShadow: `0 8px 30px ${colors.secondaryColor}99`,
                }}
              />

              {/* Image */}
              <img
                src={image.image_url}
                alt={image.caption || `Gallery image ${index + 1}`}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />

              {/* Golden spotlight overlay on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at center, ${colors.secondaryColor}, transparent 70%)`,
                }}
              />

              {/* Lucky icon corner decoration - appears on hover */}
              <div
                className="absolute top-3 right-3 text-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:rotate-12 group-hover:scale-110"
                style={{
                  filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.5))',
                }}
              >
                🏮
              </div>

              {/* Bottom golden accent bar on hover */}
              <div
                className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(90deg, ${colors.primaryColor}, ${colors.secondaryColor}, ${colors.primaryColor})`,
                }}
              />

              {/* Hover overlay with blossom */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-6">
                <span className="text-white text-5xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  ✿
                </span>
              </div>

              {/* Shimmer effect on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, transparent 0%, transparent 40%, rgba(255,255,255,0.8) 50%, transparent 60%, transparent 100%)',
                  backgroundSize: '200% 200%',
                  animation: 'gallery-shimmer 2s ease-in-out infinite',
                }}
              />

              {/* Index number badge */}
              <div
                className="absolute top-3 left-3 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 group-hover:scale-110"
                style={{
                  background: `linear-gradient(135deg, ${colors.primaryColor}, ${colors.primaryColor}DD)`,
                  color: colors.secondaryColor,
                  border: `2px solid ${colors.secondaryColor}`,
                  boxShadow: `0 2px 10px ${colors.primaryColor}80`,
                }}
              >
                {index + 1}
              </div>
            </div>
          ))}
        </div>

        {/* View All Button - Show if there are more than 6 images */}
        {hasMoreImages && (
          <div className="flex justify-center mt-12">
            <button
              onClick={() => {
                setShowAllGallery(true);
                onFullGalleryChange?.(true);
              }}
              className="group relative px-12 py-4 text-lg font-black transition-all duration-500 hover:scale-105 overflow-hidden rounded-2xl"
              style={{
                background: `linear-gradient(135deg, ${colors.secondaryColor}, ${colors.accentColor})`,
                color: colors.primaryColor,
                border: `4px solid ${colors.primaryColor}`,
                boxShadow: `0 10px 30px ${colors.secondaryColor}60`,
                textShadow: '0 1px 2px rgba(255,255,255,0.3)',
              }}
            >
              {/* Shimmer effect */}
              <span
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{
                  background: 'linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.9) 50%, transparent 100%)',
                  backgroundSize: '200% 100%',
                  animation: 'tet-shimmer 2s ease-in-out infinite',
                }}
              />

              <span className="relative z-10 flex items-center gap-3">
                🖼️ {t("viewAllPhotos")} ({displayGallery.length} {t("photos")}) 🌸
              </span>
            </button>
          </div>
        )}

        {/* Decorative flourish */}
        <div className="flex items-center justify-center gap-3 mt-16">
          <span className="text-2xl">🌸</span>
          <div
            className="h-1 w-24 rounded-full"
            style={{
              background: `linear-gradient(90deg, ${colors.primaryColor}, ${colors.secondaryColor})`,
            }}
          />
          <span className="text-3xl">🏮</span>
          <div
            className="h-1 w-24 rounded-full"
            style={{
              background: `linear-gradient(90deg, ${colors.secondaryColor}, ${colors.primaryColor})`,
            }}
          />
          <span className="text-2xl">✿</span>
        </div>
      </div>

      {/* Lightbox Modal - Single Image View with Swipe Navigation */}
      {selectedImage && (
        <div
          ref={lightboxRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          {/* Image container - maximized with safe areas for controls */}
          <div
            className="relative w-full h-full flex items-center justify-center px-4 pt-20 pb-24 pointer-events-none"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Golden glow around lightbox image */}
            <div
              className="absolute -inset-4 rounded-3xl opacity-60 blur-2xl pointer-events-none"
              style={{
                background: `linear-gradient(135deg, ${colors.secondaryColor}, ${colors.accentColor}, ${colors.secondaryColor})`,
              }}
            />

            {/* Main lightbox image - maximized */}
            <img
              src={selectedImage}
              alt={`Gallery image ${selectedImageIndex + 1} of ${displayGallery.length}`}
              className="relative max-w-full max-h-full w-auto h-auto object-contain rounded-2xl pointer-events-auto"
              style={{
                border: `6px solid ${colors.secondaryColor}`,
                boxShadow: `0 0 80px ${colors.secondaryColor}99`,
              }}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Image counter - fixed position */}
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[52]">
            <div
              className="px-4 py-2 rounded-full font-bold text-sm"
              style={{
                background: `linear-gradient(135deg, ${colors.primaryColor}, ${colors.primaryColor}DD)`,
                color: colors.secondaryColor,
                border: `2px solid ${colors.secondaryColor}`,
                boxShadow: `0 2px 10px ${colors.primaryColor}80`,
              }}
            >
              {selectedImageIndex + 1} / {displayGallery.length}
            </div>
          </div>

          {/* Close button - fixed position */}
          <div className="fixed top-4 right-4 z-[52]">
            {/* Close button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
              className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-3xl transition-all duration-300 hover:scale-110 hover:rotate-90"
              style={{
                background: `linear-gradient(135deg, ${colors.primaryColor}, ${colors.primaryColor}DD)`,
                border: `3px solid ${colors.secondaryColor}`,
                boxShadow: `0 4px 20px ${colors.primaryColor}99`,
              }}
              aria-label="Close"
            >
              ×
            </button>
          </div>

          {/* Decorative corner icons - fixed positions */}
          <div className="fixed top-2 left-2 text-4xl animate-pulse pointer-events-none z-[51]" style={{ animationDuration: '2s' }}>
            🏮
          </div>
          <div className="fixed bottom-2 right-2 text-4xl animate-pulse pointer-events-none z-[51]" style={{ animationDuration: '2.5s' }}>
            🌸
          </div>
        </div>
      )}

      {/* Full Gallery Modal - All Images Grid */}
      {showAllGallery && (
        <div
          className="fixed inset-0 z-[9999] overflow-y-auto bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => {
            setShowAllGallery(false);
            onFullGalleryChange?.(false);
          }}
        >
          {/* Floating Close button */}
          <div className="fixed top-4 right-4 z-[10000]">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowAllGallery(false);
                onFullGalleryChange?.(false);
              }}
              className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-3xl transition-all duration-300 hover:scale-110 hover:rotate-90"
              style={{
                background: `linear-gradient(135deg, ${colors.primaryColor}, ${colors.primaryColor}DD)`,
                color: colors.secondaryColor,
                border: `3px solid ${colors.secondaryColor}`,
                boxShadow: `0 4px 20px ${colors.primaryColor}99`,
              }}
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <div className="min-h-screen py-8 px-4">
            <div className="max-w-7xl mx-auto">
              {/* All Images Grid */}
              <div
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 relative z-10"
                onClick={(e) => e.stopPropagation()}
              >
                {displayGallery.map((image, index) => (
                  <div
                    key={image.id}
                    className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1"
                    style={{
                      border: `2px solid ${colors.accentColor}`,
                      boxShadow: `0 2px 10px ${colors.primaryColor}20`,
                    }}
                    onClick={() => {
                      setShowAllGallery(false);
                      onFullGalleryChange?.(false);
                      setSelectedImageIndex(index);
                      setSelectedImage(image.image_url);
                    }}
                  >
                    {/* Image */}
                    <img
                      src={image.image_url}
                      alt={image.caption || `Gallery image ${index + 1}`}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-2 right-2 text-2xl">
                        ✿
                      </div>
                    </div>

                    {/* Index number badge */}
                    <div
                      className="absolute top-2 left-2 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 group-hover:scale-110"
                      style={{
                        background: `linear-gradient(135deg, ${colors.primaryColor}, ${colors.primaryColor}DD)`,
                        color: colors.secondaryColor,
                        border: `2px solid ${colors.secondaryColor}`,
                        boxShadow: `0 2px 8px ${colors.primaryColor}60`,
                      }}
                    >
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom decoration */}
              <div className="flex items-center justify-center gap-3 mt-12 mb-6">
                <span className="text-2xl">🌸</span>
                <div
                  className="h-1 w-24 rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${colors.primaryColor}, ${colors.secondaryColor})`,
                  }}
                />
                <span className="text-3xl">🏮</span>
                <div
                  className="h-1 w-24 rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${colors.secondaryColor}, ${colors.primaryColor})`,
                  }}
                />
                <span className="text-2xl">✿</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Animation styles */}
      <style jsx>{`
        @keyframes gallery-shimmer {
          0% {
            background-position: -200% -200%;
          }
          100% {
            background-position: 200% 200%;
          }
        }
        @keyframes gallery-fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-gallery-fade-in {
          animation: gallery-fade-in 0.8s ease-out;
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </section>
  );
}
