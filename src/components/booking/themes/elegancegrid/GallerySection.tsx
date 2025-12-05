"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { GallerySectionProps } from "../types";

export function EleganceGridGallerySection({ gallery, colors }: GallerySectionProps) {
  const t = useTranslations("common");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!gallery || gallery.length === 0) return null;

  return (
    <section
      id="section-gallery"
      className="py-20 px-6"
      style={{ backgroundColor: colors.backgroundColor }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2
            className="text-4xl sm:text-5xl font-bold mb-4"
            style={{
              fontFamily: colors.fontFamily,
              color: colors.primaryColor,
            }}
          >
            {t("gallery")}
          </h2>
          <div
            className="w-20 h-1 mx-auto mb-6"
            style={{ backgroundColor: colors.accentColor }}
          />
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{
              fontFamily: colors.fontFamily,
              color: colors.textColor,
              opacity: 0.8,
            }}
          >
            {t("gallerySubtitle")}
          </p>
        </div>

        {/* Asymmetrical Grid Gallery */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {gallery.map((image, idx) => {
            // Create dynamic grid pattern - some images span 2 columns/rows
            const isLarge = idx === 0 || idx === 4 || idx === 8;
            const isTall = idx === 2 || idx === 6;

            return (
              <div
                key={image.id}
                className={`
                  group relative overflow-hidden rounded-lg cursor-pointer
                  transition-all duration-500 hover:scale-105 hover:z-10
                  ${isLarge ? 'col-span-2 row-span-2' : ''}
                  ${isTall && !isLarge ? 'row-span-2' : ''}
                `}
                style={{
                  boxShadow: `0 4px 20px ${colors.accentColor}20`,
                }}
                onClick={() => setSelectedImage(image.image_url)}
              >
                {/* Image */}
                <div className={`relative w-full ${isLarge ? 'h-96' : isTall ? 'h-80' : 'h-48'}`}>
                  <img
                    src={image.image_url}
                    alt={image.caption || `Gallery image ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Overlay on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                    style={{
                      background: `linear-gradient(to bottom, ${colors.primaryColor}dd, ${colors.accentColor}dd)`,
                    }}
                  >
                    <div className="text-center text-white p-4">
                      <svg
                        className="w-12 h-12 mx-auto mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                        />
                      </svg>
                      {image.caption && (
                        <p className="text-lg font-semibold">{image.caption}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-90 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-8 right-8 text-white text-5xl font-light hover:scale-110 transition-transform"
            onClick={() => setSelectedImage(null)}
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
          >
            ×
          </button>
          <img
            src={selectedImage}
            alt="Gallery preview"
            className="max-w-full max-h-full object-contain rounded-lg"
            style={{ boxShadow: `0 20px 60px ${colors.accentColor}40` }}
          />
        </div>
      )}
    </section>
  );
}
