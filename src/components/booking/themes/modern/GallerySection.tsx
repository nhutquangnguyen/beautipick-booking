"use client";

import { useState } from "react";
import { GallerySectionProps } from "../types";

export function ModernGallerySection({ gallery, colors }: GallerySectionProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (gallery.length === 0) return null;

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    setLightboxIndex((prev) => (prev + 1) % gallery.length);
  };

  const prevImage = () => {
    setLightboxIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  return (
    <section
      id="section-gallery"
      className="modern-section py-20 px-6"
      style={{ backgroundColor: `${colors.backgroundColor}f5` }}
    >
      <div className="max-w-7xl mx-auto">
        <h2
          className="text-4xl sm:text-5xl font-bold text-center mb-16"
          style={{
            fontFamily: colors.fontFamily,
            background: `linear-gradient(135deg, ${colors.primaryColor}, ${colors.secondaryColor})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Gallery
        </h2>

        {/* Masonry grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {gallery.map((image, index) => (
            <div
              key={image.id}
              className="group relative cursor-pointer rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-300"
              style={{
                aspectRatio: index % 5 === 0 ? '1/1.3' : '1/1',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              }}
              onClick={() => openLightbox(index)}
            >
              <img
                src={image.image_url}
                alt={image.caption || `Gallery image ${index + 1}`}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              {/* Gradient overlay on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(135deg, ${colors.primaryColor}aa, ${colors.secondaryColor}aa)`,
                }}
              />
              {/* Caption */}
              {image.caption && (
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-sm font-medium">{image.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 text-white text-4xl hover:scale-110 transition-transform"
            onClick={closeLightbox}
          >
            ×
          </button>

          {/* Previous button */}
          <button
            className="absolute left-4 text-white text-4xl hover:scale-110 transition-transform"
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
          >
            ‹
          </button>

          {/* Image */}
          <img
            src={gallery[lightboxIndex].image_url}
            alt={gallery[lightboxIndex].caption || `Gallery image ${lightboxIndex + 1}`}
            className="max-w-full max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Next button */}
          <button
            className="absolute right-4 text-white text-4xl hover:scale-110 transition-transform"
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
          >
            ›
          </button>

          {/* Caption */}
          {gallery[lightboxIndex].caption && (
            <div className="absolute bottom-8 left-0 right-0 text-center">
              <p className="text-white text-lg">{gallery[lightboxIndex].caption}</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
