"use client";

import { useState } from "react";
import { GallerySectionProps } from "../types";
import { X } from "lucide-react";

export function ClassicGallerySection({ gallery, colors }: GallerySectionProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (gallery.length === 0) return null;

  return (
    <>
      <section id="section-gallery" className="py-16 px-6 bg-gray-50 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl sm:text-4xl font-serif font-bold mb-4"
              style={{ fontFamily: colors.fontFamily, color: colors.textColor }}
            >
              Gallery
            </h2>
            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-12" style={{ backgroundColor: colors.primaryColor }} />
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.primaryColor }} />
              <div className="h-px w-12" style={{ backgroundColor: colors.primaryColor }} />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {gallery.map((image) => (
              <button
                key={image.id}
                onClick={() => setSelectedImage(image.image_url)}
                className="classic-gallery-item group relative aspect-square overflow-hidden rounded shadow hover:shadow-lg transition-shadow"
              >
                <img
                  src={image.image_url}
                  alt={image.caption || "Gallery image"}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                {image.caption && (
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    {image.caption}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="h-6 w-6 text-white" />
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
