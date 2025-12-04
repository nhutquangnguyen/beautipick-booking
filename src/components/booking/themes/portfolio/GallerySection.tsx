"use client";

import { useState } from "react";
import { GallerySectionProps } from "../types";
import { X } from "lucide-react";

export function PortfolioGallerySection({ gallery, colors }: GallerySectionProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (gallery.length === 0) return null;

  return (
    <>
      <section
        id="section-gallery"
        className="py-24 px-6"
        style={{ backgroundColor: `${colors.backgroundColor}f5` }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Section title */}
          <div className="mb-16">
            <div
              className="w-20 h-2 mb-6"
              style={{
                background: `linear-gradient(90deg, ${colors.primaryColor}, ${colors.secondaryColor})`,
              }}
            />
            <h2
              className="text-5xl sm:text-6xl font-black uppercase"
              style={{
                fontFamily: colors.fontFamily,
                color: colors.textColor,
              }}
            >
              Gallery
            </h2>
          </div>

          {/* Gallery grid - Bold masonry style */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {gallery.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setSelectedImage(image.image_url)}
                className="group relative overflow-hidden transition-all duration-300 hover:scale-105 hover:z-10"
                style={{
                  aspectRatio: index % 5 === 0 ? "1/1.3" : index % 3 === 0 ? "1/0.7" : "1/1",
                  gridColumn: index % 7 === 0 ? "span 2" : "span 1",
                  borderRadius: colors.borderRadius === "full" ? "20px" : colors.borderRadius === "none" ? "0" : "12px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                }}
              >
                <img
                  src={image.image_url}
                  alt={image.caption || "Gallery image"}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Bold overlay */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primaryColor}cc, ${colors.secondaryColor}cc)`,
                  }}
                />
                {image.caption && (
                  <div className="absolute inset-0 flex items-center justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-lg font-black uppercase text-center">
                      {image.caption}
                    </p>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Image modal - Bold style */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-md"
          style={{
            backgroundColor: `${colors.backgroundColor}f0`,
          }}
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 p-3 transition-all duration-300 hover:scale-110"
            style={{
              backgroundColor: colors.primaryColor,
              color: "#fff",
              borderRadius: colors.borderRadius === "full" ? "9999px" : "8px",
            }}
          >
            <X className="h-6 w-6" />
          </button>
          <img
            src={selectedImage}
            alt="Gallery image"
            className="max-w-full max-h-full object-contain"
            style={{
              borderRadius: colors.borderRadius === "full" ? "20px" : colors.borderRadius === "none" ? "0" : "12px",
              boxShadow: `0 20px 60px ${colors.primaryColor}60`,
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
