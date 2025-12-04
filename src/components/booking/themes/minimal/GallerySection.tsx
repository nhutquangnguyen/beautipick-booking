"use client";

import { useState } from "react";
import { GallerySectionProps } from "../types";
import { X } from "lucide-react";

export function MinimalGallerySection({ gallery, colors }: GallerySectionProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (gallery.length === 0) return null;

  return (
    <>
      <section
        id="section-gallery"
        className="py-32 px-6"
        style={{ backgroundColor: colors.backgroundColor }}
      >
        <div className="max-w-6xl mx-auto">
          {/* Section title */}
          <h2
            className="text-3xl sm:text-4xl font-extralight tracking-wide text-center mb-24"
            style={{
              fontFamily: colors.fontFamily,
              color: colors.textColor,
            }}
          >
            Gallery
          </h2>

          {/* Gallery grid with asymmetric masonry effect */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {gallery.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setSelectedImage(image.image_url)}
                className="group relative overflow-hidden transition-all duration-700 hover:opacity-80"
                style={{
                  aspectRatio: index % 5 === 0 ? "1/1.2" : "1/1",
                  gridColumn: index % 7 === 0 ? "span 2" : "span 1",
                }}
              >
                <img
                  src={image.image_url}
                  alt={image.caption || "Gallery image"}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  style={{
                    borderRadius: colors.borderRadius === "full" ? "12px" : colors.borderRadius === "none" ? "0" : "6px",
                  }}
                />
                {image.caption && (
                  <div
                    className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)",
                    }}
                  >
                    <p className="text-white text-sm font-light">
                      {image.caption}
                    </p>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Image modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-white/95 backdrop-blur-md"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 p-2 transition-opacity duration-300 hover:opacity-70"
            style={{ color: colors.textColor }}
          >
            <X className="h-6 w-6" />
          </button>
          <img
            src={selectedImage}
            alt="Gallery image"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
