"use client";

import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { GallerySectionProps } from "../types";

export function BlossomGallerySection({ gallery, colors }: GallerySectionProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (gallery.length === 0) return null;

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="blossom-section py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2
          className="text-4xl sm:text-5xl font-bold mb-12 text-center"
          style={{
            fontFamily: "'Dancing Script', cursive",
            color: colors.textColor,
          }}
        >
          Gallery
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {gallery.map((image, index) => (
            <div
              key={image.id}
              className="overflow-hidden cursor-pointer transition-all duration-300 hover:opacity-80 hover:scale-[1.02]"
              style={{
                borderRadius: "16px",
                boxShadow: `0 4px 12px ${colors.primaryColor}20`,
              }}
              onClick={() => openLightbox(index)}
            >
              <img
                src={image.image_url}
                alt={image.caption || `Gallery image ${index + 1}`}
                className="w-full h-64 object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            backgroundColor: "rgba(232, 180, 184, 0.95)",
          }}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
            style={{
              backgroundColor: colors.accentColor,
              color: "#fff",
            }}
          >
            <X size={24} />
          </button>

          {/* Previous button */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
            style={{
              backgroundColor: colors.accentColor,
              color: "#fff",
            }}
          >
            <ChevronLeft size={24} />
          </button>

          {/* Image */}
          <div className="max-w-5xl max-h-[90vh]">
            <img
              src={gallery[currentImageIndex].image_url}
              alt={gallery[currentImageIndex].caption || `Gallery image ${currentImageIndex + 1}`}
              className="max-w-full max-h-[90vh] object-contain"
              style={{ borderRadius: "16px" }}
            />
            {gallery[currentImageIndex].caption && (
              <p
                className="text-center mt-4 text-lg"
                style={{
                  fontFamily: "'Lato', sans-serif",
                  color: colors.textColor,
                }}
              >
                {gallery[currentImageIndex].caption}
              </p>
            )}
          </div>

          {/* Next button */}
          <button
            onClick={goToNext}
            className="absolute right-4 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
            style={{
              backgroundColor: colors.accentColor,
              color: "#fff",
            }}
          >
            <ChevronRight size={24} />
          </button>

          {/* Image counter */}
          <div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full"
            style={{
              backgroundColor: colors.accentColor,
              fontFamily: "'Lato', sans-serif",
              color: "#fff",
            }}
          >
            {currentImageIndex + 1} / {gallery.length}
          </div>
        </div>
      )}
    </section>
  );
}
