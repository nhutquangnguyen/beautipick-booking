"use client";

import { useState } from "react";
import { GallerySectionProps } from "../types";

export function ChristmasGallerySection({ gallery, colors }: GallerySectionProps) {
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
      className="py-20 px-6"
      style={{ backgroundColor: `${colors.backgroundColor}f8` }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Festive header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-3xl">📸</span>
            <h2
              className="text-4xl sm:text-5xl font-bold"
              style={{
                fontFamily: colors.fontFamily,
                color: colors.primaryColor,
              }}
            >
              Our Gallery
            </h2>
            <span className="text-3xl">📸</span>
          </div>
          <p
            className="text-lg"
            style={{ color: colors.secondaryColor }}
          >
            Capturing magical moments!
          </p>
        </div>

        {/* Gallery grid with festive styling */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {gallery.map((image, index) => (
            <div
              key={image.id}
              className="group relative cursor-pointer rounded-2xl overflow-hidden hover:-translate-y-2 transition-all duration-300"
              style={{
                aspectRatio: index % 5 === 0 ? '1/1.3' : '1/1',
                boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                border: `3px solid ${colors.accentColor}`,
              }}
              onClick={() => openLightbox(index)}
            >
              <img
                src={image.image_url}
                alt={image.caption || `Gallery image ${index + 1}`}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />

              {/* Festive gradient overlay on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${colors.primaryColor}dd, ${colors.secondaryColor}dd)`,
                }}
              >
                <span className="text-white text-5xl">❄️</span>
              </div>

              {/* Caption */}
              {image.caption && (
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/70 to-transparent">
                  <p className="text-sm font-semibold text-center">{image.caption}</p>
                </div>
              )}

              {/* Corner decoration */}
              <div className="absolute top-2 right-2 text-xl opacity-80 group-hover:scale-125 transition-transform duration-300">
                ⭐
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Festive Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: `linear-gradient(135deg, ${colors.primaryColor}f0, ${colors.secondaryColor}f0)`,
          }}
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            className="absolute top-6 right-6 w-12 h-12 rounded-full flex items-center justify-center text-white text-3xl font-bold transition-all hover:scale-110 shadow-lg"
            style={{
              backgroundColor: colors.primaryColor,
              border: `3px solid ${colors.accentColor}`,
            }}
            onClick={closeLightbox}
          >
            ×
          </button>

          {/* Previous button */}
          <button
            className="absolute left-6 w-12 h-12 rounded-full flex items-center justify-center text-white text-3xl font-bold transition-all hover:scale-110 shadow-lg"
            style={{
              backgroundColor: colors.secondaryColor,
              border: `3px solid ${colors.accentColor}`,
            }}
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
          >
            ‹
          </button>

          {/* Image container with festive border */}
          <div
            className="relative max-w-5xl max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl"
            style={{
              border: `4px solid ${colors.accentColor}`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={gallery[lightboxIndex].image_url}
              alt={gallery[lightboxIndex].caption || `Gallery image ${lightboxIndex + 1}`}
              className="max-w-full max-h-[85vh] object-contain"
            />

            {/* Snowflake decorations */}
            <div className="absolute top-4 left-4 text-3xl opacity-80">
              ❄️
            </div>
            <div className="absolute top-4 right-4 text-3xl opacity-80">
              ❄️
            </div>
          </div>

          {/* Next button */}
          <button
            className="absolute right-6 w-12 h-12 rounded-full flex items-center justify-center text-white text-3xl font-bold transition-all hover:scale-110 shadow-lg"
            style={{
              backgroundColor: colors.secondaryColor,
              border: `3px solid ${colors.accentColor}`,
            }}
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
          >
            ›
          </button>

          {/* Caption with festive styling */}
          {gallery[lightboxIndex].caption && (
            <div
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 px-8 py-4 rounded-2xl shadow-lg"
              style={{
                backgroundColor: "#fff",
                border: `2px solid ${colors.accentColor}`,
              }}
            >
              <p
                className="text-lg font-semibold text-center"
                style={{ color: colors.primaryColor }}
              >
                {gallery[lightboxIndex].caption}
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
