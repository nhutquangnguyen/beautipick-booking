"use client";

import { useState } from "react";
import { GallerySectionProps } from "../types";
import { Star, X } from "lucide-react";
import { getBorderRadius } from "../utils";

export function LuxuryGallerySection({ gallery, colors }: GallerySectionProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (gallery.length === 0) return null;

  const cardRadius = getBorderRadius(colors.borderRadius);

  return (
    <>
      <section id="section-gallery" className="luxury-section py-16 sm:py-24 px-6 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <div
            className="rounded-3xl p-12 sm:p-10 backdrop-blur-[30px]"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
              border: `1px solid ${colors.primaryColor}15`,
              boxShadow: '0 4px 24px rgba(0,0,0,0.06), 0 16px 56px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)',
            }}
          >
            {/* Section Title */}
            <div className="flex items-center gap-3 mb-12">
              <div
                className="p-3 rounded-xl"
                style={{ backgroundColor: `${colors.primaryColor}15` }}
              >
                <Star className="h-6 w-6" style={{ color: colors.primaryColor }} />
              </div>
              <h2
                className="text-2xl sm:text-3xl font-light uppercase tracking-widest"
                style={{ fontFamily: colors.fontFamily, color: colors.textColor }}
              >
                Our Gallery
              </h2>
            </div>

            {/* Gallery Grid - Magazine-style masonry */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {gallery.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(image.image_url)}
                  className={`group relative aspect-square overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:scale-[1.02] hover:z-10 ${
                    index === 0 ? "lg:col-span-2 lg:row-span-2" : ""
                  }`}
                  style={{
                    borderRadius: cardRadius,
                    boxShadow: `0 4px 20px ${colors.primaryColor}10`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `0 12px 40px ${colors.primaryColor}25`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = `0 4px 20px ${colors.primaryColor}10`;
                  }}
                >
                  {/* Loading placeholder */}
                  <div
                    className="absolute inset-0 animate-pulse"
                    style={{ backgroundColor: `${colors.primaryColor}10` }}
                  />

                  {/* Image */}
                  <img
                    src={image.image_url}
                    alt={image.caption || "Gallery image"}
                    className="relative w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Caption */}
                  {image.caption && (
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                      {image.caption}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Close"
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
