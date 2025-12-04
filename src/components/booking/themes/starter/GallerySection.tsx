"use client";

import { useState } from "react";
import { GallerySectionProps } from "../types";
import { X, ChevronLeft, ChevronRight, Images } from "lucide-react";

export function StarterGallerySection({ gallery, colors }: GallerySectionProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(false);

  if (gallery.length === 0) return null;

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % gallery.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  return (
    <div className="w-full">
      {/* Section Title */}
      <div className="mb-4">
        <h2 className="text-2xl font-semibold text-center" style={{ color: colors.primaryColor }}>
          Gallery
        </h2>
      </div>

      {/* Gallery Preview Grid */}
      {gallery.length <= 3 ? (
        // Simple card button for few images
        <button
          onClick={() => openLightbox(0)}
          onMouseEnter={() => setHoveredCard(true)}
          onMouseLeave={() => setHoveredCard(false)}
          className="w-full bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-6 flex items-center justify-between cursor-pointer border border-gray-200"
          style={{
            transform: hoveredCard ? 'scale(1.02)' : 'scale(1)',
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.primaryColor + '15' }}>
              <Images className="w-5 h-5" style={{ color: colors.primaryColor }} />
            </div>
            <div className="text-left">
              <div className="font-semibold text-gray-900">View Gallery</div>
              <div className="text-sm text-gray-600">{gallery.length} {gallery.length === 1 ? 'photo' : 'photos'}</div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5" style={{ color: hoveredCard ? colors.primaryColor : '#9CA3AF' }} />
        </button>
      ) : (
        // Grid preview for more images
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {gallery.slice(0, 6).map((image, index) => (
            <button
              key={image.id}
              onClick={() => openLightbox(index)}
              className="aspect-square rounded-lg overflow-hidden relative group cursor-pointer shadow-sm hover:shadow-md transition-all duration-200"
              style={{
                transform: 'scale(1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <img
                src={image.image_url}
                alt={image.caption || `Gallery image ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {index === 5 && gallery.length > 6 && (
                <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                  <span className="text-white text-2xl font-semibold">+{gallery.length - 6}</span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center p-4">
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Navigation Buttons */}
          {gallery.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 z-10 p-3 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 z-10 p-3 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </>
          )}

          {/* Current Image */}
          <div className="max-w-4xl max-h-[90vh] flex flex-col items-center">
            <img
              src={gallery[currentImageIndex].image_url}
              alt={gallery[currentImageIndex].caption || `Gallery image ${currentImageIndex + 1}`}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
            {gallery[currentImageIndex].caption && (
              <p className="text-white text-center mt-4 text-lg">{gallery[currentImageIndex].caption}</p>
            )}
            <p className="text-white text-sm mt-2 opacity-60">
              {currentImageIndex + 1} / {gallery.length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
