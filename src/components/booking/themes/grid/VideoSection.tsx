"use client";

import { VideoSectionProps } from "../types";

export function GridVideoSection({ videoUrl, colors }: VideoSectionProps) {
  if (!videoUrl) return null;

  return (
    <section
      className="py-20 px-6 relative"
      style={{ backgroundColor: colors.backgroundColor }}
    >
      <div className="max-w-6xl mx-auto">
        <h2
          className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-12 text-center"
          style={{
            fontFamily: colors.fontFamily,
            color: colors.accentColor,
          }}
        >
          Watch Our Story
        </h2>

        {/* Video container with grid border */}
        <div className="relative">
          {/* Decorative grid corners */}
          <div
            className="absolute -top-4 -left-4 w-24 h-24 opacity-30"
            style={{
              borderTop: `4px solid ${colors.accentColor}`,
              borderLeft: `4px solid ${colors.accentColor}`,
              borderRadius: colors.borderRadius === "none" ? "0" : "12px 0 0 0",
            }}
          />
          <div
            className="absolute -top-4 -right-4 w-24 h-24 opacity-30"
            style={{
              borderTop: `4px solid ${colors.primaryColor}`,
              borderRight: `4px solid ${colors.primaryColor}`,
              borderRadius: colors.borderRadius === "none" ? "0" : "0 12px 0 0",
            }}
          />
          <div
            className="absolute -bottom-4 -left-4 w-24 h-24 opacity-30"
            style={{
              borderBottom: `4px solid ${colors.secondaryColor}`,
              borderLeft: `4px solid ${colors.secondaryColor}`,
              borderRadius: colors.borderRadius === "none" ? "0" : "0 0 0 12px",
            }}
          />
          <div
            className="absolute -bottom-4 -right-4 w-24 h-24 opacity-30"
            style={{
              borderBottom: `4px solid ${colors.accentColor}`,
              borderRight: `4px solid ${colors.accentColor}`,
              borderRadius: colors.borderRadius === "none" ? "0" : "0 0 12px 0",
            }}
          />

          {/* Video iframe */}
          <div
            className="relative overflow-hidden aspect-video shadow-2xl"
            style={{
              borderRadius: colors.borderRadius === "full" ? "24px" : colors.borderRadius === "none" ? "0" : "16px",
              border: `4px solid ${colors.accentColor}20`,
            }}
          >
            <iframe
              src={videoUrl}
              title="Video"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        {/* Grid pattern decoration */}
        <div className="mt-12 grid grid-cols-8 gap-2 max-w-md mx-auto opacity-20">
          {[...Array(8)].map((_, idx) => (
            <div
              key={idx}
              className="h-2 transition-all duration-500 hover:scale-y-[3]"
              style={{
                backgroundColor: idx % 3 === 0 ? colors.primaryColor : idx % 3 === 1 ? colors.secondaryColor : colors.accentColor,
                borderRadius: colors.borderRadius === "full" ? "9999px" : colors.borderRadius === "none" ? "0" : "4px",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
