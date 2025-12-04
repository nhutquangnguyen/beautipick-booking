"use client";

import { useState } from "react";
import { GallerySectionProps } from "../types";

export function GridGallerySection({ gallery, colors }: GallerySectionProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!gallery || gallery.length === 0) return null;

  return (
    <section
      id="section-gallery"
      className="py-20 px-6 relative"
      style={{
        backgroundColor: `${colors.backgroundColor}f5`,
      }}
    >
      <div className="max-w-7xl mx-auto">
        <h2
          className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 text-center"
          style={{
            fontFamily: colors.fontFamily,
            color: colors.accentColor,
          }}
        >
          Gallery
        </h2>
        <p
          className="text-lg text-center mb-12 opacity-80 max-w-2xl mx-auto"
          style={{
            fontFamily: colors.fontFamily,
            color: colors.textColor,
          }}
        >
          Explore our work through images
        </p>

        {/* Masonry Grid Gallery */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {gallery.map((image, idx) => (
            <div
              key={image.id}
              className="break-inside-avoid group cursor-pointer overflow-hidden transition-all duration-500 hover:scale-105"
              style={{
                borderRadius: colors.borderRadius === "full" ? "24px" : colors.borderRadius === "none" ? "0" : "12px",
                boxShadow: `0 4px 20px ${colors.accentColor}20`,
              }}
              onClick={() => setSelectedImage(image.image_url)}
            >
              <div className="relative overflow-hidden">
                <img
                  src={image.image_url}
                  alt={image.title || `Gallery image ${idx + 1}`}
                  className="w-full h-auto transition-transform duration-500 group-hover:scale-110"
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                  style={{
                    background: `linear-gradient(to bottom, ${colors.accentColor}aa, ${colors.primaryColor}aa)`,
                  }}
                >
                  <span className="text-white text-lg font-semibold">View</span>
                </div>
              </div>
              {image.title && (
                <div
                  className="p-3"
                  style={{
                    backgroundColor: colors.backgroundColor,
                    fontFamily: colors.fontFamily,
                    color: colors.textColor,
                  }}
                >
                  {image.title}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-90"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white text-4xl font-bold hover:scale-110 transition-transform"
            onClick={() => setSelectedImage(null)}
          >
            ×
          </button>
          <img
            src={selectedImage}
            alt="Gallery preview"
            className="max-w-full max-h-full object-contain"
            style={{
              borderRadius: colors.borderRadius === "full" ? "24px" : colors.borderRadius === "none" ? "0" : "16px",
            }}
          />
        </div>
      )}
    </section>
  );
}
